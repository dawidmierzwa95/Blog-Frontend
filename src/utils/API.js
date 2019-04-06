import axios from 'axios';
import store from '../store';

const i = axios.create({
    baseURL: 'http://127.0.0.1:8081/api',
});

i.cancelToken = axios.cancelToken;

i.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = store.getters.getToken;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default i;