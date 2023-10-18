import axios from "axios";

axios.defaults.withCredentials = true;

export const apiEndpoint = (endpoint, form) => {
    let url = `/api/${endpoint}`;
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('bearer_token'),
            'Content-Type': 'application/json'
        }
    };

    if (form) config.headers["Content-Type"] = 'multipart/form-data';

    return {
        fetch: () => axios.get(url, config),
        fetchById: id => axios.get(url + `/${id}`, config),
        post: newRecord => axios.post(url, newRecord, config),
        put: updatedRecord => axios.put(url, updatedRecord, config),
        delete: () => axios.delete(url, config),
        deleteById: id => axios.delete(url + `/${id}`, config),
    }
};

