import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,
    state: {
        header: {
            title: "",
            image: "",
            description: "",
            meta: ""
        }
    },
    mutations: {
        setHeader (state, payload)
        {
            state.header = payload;
        }
    },
    actions: {},
    getters: {
        getHeader: state => {
            return state.header;
        }
    }
}
