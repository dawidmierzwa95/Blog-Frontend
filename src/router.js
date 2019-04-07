import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/admin',
            name: 'adminHome',
            component: () => import('./views/admin/ArticlesList.vue'),
            meta: {admin: true}
        },
        {
            path: '/admin/article/:slug?',
            name: 'adminAddOrEditArticle',
            component: () => import('./views/admin/AddOrEditArticle.vue'),
            meta: {admin: true}
        },
        {
            path: '/:tag?',
            name: 'home',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/article/:slug',
            name: 'article',
            component: () => import('./views/Article.vue')
        },
    ]
})
