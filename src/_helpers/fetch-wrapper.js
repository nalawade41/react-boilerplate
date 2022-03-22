import { accountService } from '@/_services';
import { storageHandler } from './storage';
import { http } from './http-common';

export const fetchWrapper = {
    get,
    post,
    put,
    postFile,
    delete: _delete
}

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function postFile(url, formData, onUploadProgress) {
    return http.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json', ...authHeader(url) },
        credentials: 'include',
        onUploadProgress,
    }).then(handleAxiosResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions
function authHeader(url) {
    const user = accountService.userValue;
    const isLoggedIn = user && user.access_token;
    const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.access_token}` };
    } else {
        // if not logged in get previous token and check if session is still active
        const token = storageHandler.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            if ([401, 403].includes(response.status) && accountService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                accountService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function handleAxiosResponse(response) {
    if (response.status !== 200) {
        if ([401, 403].includes(response.status) && accountService.userValue) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            accountService.logout();
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}