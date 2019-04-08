const RESOURCE = '/comments';

export default {
    all(articleId) {
        return window.$repository.get(`${RESOURCE}/${articleId}`);
    },
    create(articleId, data) {
        return window.$repository.post(`${RESOURCE}/${articleId}`, data);
    },
    update(data) {
        return window.$repository.put(`${RESOURCE}`, data);
    },
    setStatus(id, data) {
        return window.$repository.post(`${RESOURCE}/status/${id}`, data);
    }
};