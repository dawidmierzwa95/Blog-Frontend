import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';

Vue.config.productionTip = true

store.commit('setUser', JSON.parse(localStorage.getItem('userData')));

router.beforeEach(
    (to, from, next) =>
    {
        if(to.meta.admin && !store.getters.hasPermission("ADMIN|COPYWRITER"))
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
