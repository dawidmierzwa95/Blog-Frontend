import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,
    state: {
        lastArticle: {
            title: "",
            content: ""
        }
    },
    mutations: {
        updateLastArticle (state, payload)
        {
            state.lastArticle = payload;

            if(null === payload)
            {
                localStorage.removeItem('lastArticle');
            }else{
                localStorage.setItem('lastArticle', JSON.stringify({payload}));
            }
        }
    },
    actions: {},
    getters: {
        getLastSavedArticle: () =>
        {
            return JSON.parse(localStorage.getItem('lastArticle'));
        },
    }
}
