import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/:tag?',
            name: 'home',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/post/:slug',
            name: 'post',
            component: () => import('./views/Post.vue')
        },
        {
            path: '/admin',
            name: 'adminHome',
            component: () => import('./views/admin/PostsList.vue')
        },
        {
            path: '/admin/post/:slug?',
            name: 'adminAddOrEditPost',
            component: () => import('./views/admin/AddOrEditPost.vue')
        },
    ]
})
