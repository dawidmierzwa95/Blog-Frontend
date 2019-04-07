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
        lastArticle: {
            title: "",
            content: ""
        }
    },
    mutations: {
        setHeader (state, payload)
        {
            state.header = payload;
        },
        updateLastArticle (state, payload)
        {
            state.lastArticle = payload;

            if(null === payload)
            {
                localStorage.removeItem('lastArticle');
            }else{
                localStorage.setItem('lastArticle', JSON.stringify({payload}));
            }
        },
        setUser (state, payload)
        {
            if(payload)
            {
                state.user = payload;
                state.token = payload.api_token;
                state.permissions = payload.permissions;
                state.isLogged = true;

                localStorage.setItem('userData', JSON.stringify(payload));
            }
        },
        clearSession (state)
        {
            state.user = {};
            state.token = "";
            state.permissions = [];
            state.isLogged = false;

            localStorage.removeItem('userData');
        }
    },
    actions: {},
    getters: {
        getHeader: state => {
            return state.header;
        },
        hasPermission: state => type =>
        {
            if(type.indexOf('|') > -1)
            {
                let passed = false,
                    i = 0;

                type = type.split('|');

                for(; i < type.length; i++)
                {
                    if(state.permissions.indexOf(type[i]) > -1)
                    {
                        passed = true;
                        break;
                    }
                }

                return passed;
            }

            return (state.permissions.indexOf(type) > -1);
        },
        isLogged: state =>
        {
            return state.isLogged;
        },
        getLogin: state =>
        {
            return state.user.name;
        },
        getLastSavedArticle: () =>
        {
            return JSON.parse(localStorage.getItem('lastArticle'));
        },
        getToken: state =>
        {
            return state.token;
        }
    }
})
