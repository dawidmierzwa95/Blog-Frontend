import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = true

store.commit('auth/setUser', JSON.parse(localStorage.getItem('userData')));

window.$repository = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {'Authorization': store.getters['auth/getToken']}
});

router.beforeEach(
    (to, from, next) =>
    {
        if(to.meta.admin && !store.getters['auth/hasPermission']("ADMIN|COPYWRITER"))
        {
            next({ name: 'home' });
        }

        next();
    }
);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
