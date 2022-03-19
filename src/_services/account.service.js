import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history, storageHandler } from '@/_helpers';
import { Role } from '../_helpers/role';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${process.env.REACT_APP_API_URL}/user`;

export const accountService = {
    login,
    logout,
    refreshToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value }
};

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}/login`, { email, password })
        .then(user => {

            //TODO: need to remove this code once we assign role to one user
            if (user.data.roles.length === 0) {
                user.data.role = Role.Admin.toLowerCase();;
            } else {
                user.data.role = user.data.roles[0].name.toLowerCase();
            }

            userSubject.next(user);
            storageHandler.setToken(userSubject.value.access_token);
            storageHandler.setUserID(userSubject.value.data.id);
            storageHandler.setUserRole(userSubject.value.data.role);
            storageHandler.setEmail(userSubject.value.data.email);
            startRefreshTokenTimer();
            return user;
        });
}

function logout() {
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    fetchWrapper.post(`${baseUrl}/logout`, {});
    stopRefreshTokenTimer();
    storageHandler.deleteToken();
    userSubject.next(null);
    history.push('/account/login');
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(user => {
            //TODO: need to remove this code once we assign role to one user
            if (user.data.roles.length === 0) {
                user.data.role = Role.Admin.toLowerCase();;
            } else {
                user.data.role = user.data.roles[0].name.toLowerCase();;
            }

            // publish user to subscribers and start timer to refresh token
            userSubject.next(user);
            storageHandler.setToken(userSubject.value.access_token);
            storageHandler.setUserID(userSubject.value.data.id);
            storageHandler.setUserRole(userSubject.value.data.role);
            storageHandler.setEmail(userSubject.value.data.email);
            startRefreshTokenTimer();
            return user;
        });
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({ token, password, confirmPassword }) {
    return fetchWrapper.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(user => {
            // update stored user if the logged in user updated their own record
            if (user.id === userSubject.value.id) {
                // publish updated user to subscribers
                user = { ...userSubject.value, ...user };
                userSubject.next(user);
            }
            return user;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in user deleted their own record
            if (id === userSubject.value.id) {
                logout();
            }
            return x;
        });
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // set a timeout to refresh the token a minute before it expires
    refreshTokenTimeout = setTimeout(refreshToken, userSubject.value.expires_in * 1000);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}
