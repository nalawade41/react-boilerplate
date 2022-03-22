import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history, storageHandler } from '@/_helpers';


export const uploadService = {
    getFiles,
    upload,
};

function upload (file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file_name", file);
    formData.append("visibility", 'public');
    return fetchWrapper.postFile('/file/uploads', formData, onUploadProgress);
};

function getFiles () {
    return fetchWrapper.get("/files");
};

