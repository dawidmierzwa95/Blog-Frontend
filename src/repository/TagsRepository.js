const RESOURCE = '/tags';

export default {
    all() {
        return window.$repository.get(`${RESOURCE}/all`);
    },
};