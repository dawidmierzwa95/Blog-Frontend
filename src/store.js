import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        header: {
            title: "",
            image: "",
            description: "",
            meta: ""
        },
        user: {},
        permissions: [],
        token: "",
        isLogged: false,
        lastPost: {
            title: "",
            content: ""
        }
    },
    mutations: {
        setHeader (state, payload) {
            state.header = payload;
        },
        updateLastPost (state, payload) {
            state.lastPost = payload;

            if(null === payload) {
                localStorage.removeItem('lastPost');
            }else{
                localStorage.setItem('lastPost', JSON.stringify({payload}));
            }
        },
        setUser (state, payload) {
            if(payload) {
                state.user = payload;
                state.token = payload.api_token;
                state.permissions = payload.permissions;
                state.isLogged = true;

                localStorage.setItem('userData', JSON.stringify(payload));
            }
        }
    },
    actions: {},
    getters: {
        getHeader: state => {
            return state.header;
        },
        hasPermission: state => type => {
            return (state.permissions.indexOf(type) > -1);
        },
        isLogged: state => {
            return state.isLogged;
        },
        getLogin: state => {
            return state.user;
        },
        getLastSavedPost: () => {
            return JSON.parse(localStorage.getItem('lastPost'));
        }
    }
})
