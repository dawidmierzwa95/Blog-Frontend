const RESOURCE = '/user';

export default {
    login(data) {
        return window.$repository.post(`${RESOURCE}/login`, data);
    },
    register(data) {
        return window.$repository.post(`${RESOURCE}/register`, data);
    },
    resetPassword(data) {
        return window.$repository.post(`${RESOURCE}/reset`, data);
    },
};