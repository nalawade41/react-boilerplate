import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history, storageHandler } from '@/_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/contentlib`;

export const contentService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

function getAll(options) {
    let filterString = "";
    if (options.filter) {
        filterString = options.filter;
    }
    if (options.page !== undefined) {
        filterString = getAllPaging(options, filterString)
    }
    const url = filterString.length > 0 ? `${baseUrl}?${filterString}` : `${baseUrl}`;
    return fetchWrapper.get(url);
}

function getAllFilters(options, filterString) {
    if (Object.keys(options.filter).length > 0) {
        filterString = `filter[${options.filter.property}]=${options.filter.value}`
    }
    if (Object.keys(options.sort).length > 0) {
        filterString += filterString.length > 0 ? `&` : '';
        filterString += `sort = ${options.sort.value}${options.sort.property}`;
    }
}

function getAllPaging(options, filterString) {
    filterString += filterString.length > 0 ? `&` : '';
    filterString += `page[number]=${options.page}`;
    if (options.pageSize) {
        filterString += filterString.length > 0 ? `&` : '';
        filterString += `page[size]=${options.pageSize}`;
    }
    return filterString
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}