const RESOURCE = '/articles';

export default {
    all(tag = "") {
        return window.$repository.get(`${RESOURCE}/all` + (tag ? '/' + tag : ''));
    },
    get(slug) {
        return window.$repository.get(`${RESOURCE}/${slug}`);
    },
    create(data) {
        return window.$repository.post(`${RESOURCE}`, data);
    },
    upload(data, articleId = 0) {
        return window.$repository.post(
            `${RESOURCE}/image` + (articleId ? '/' + articleId : ''),
            data,
            {headers: { 'Content-Type': 'multipart/form-data' }}
        );
    },
    update(data) {
        return window.$repository.put(`${RESOURCE}`, data);
    },
    delete(slug) {
        return window.$repository.delete(`${RESOURCE}/${slug}`);
    }
};