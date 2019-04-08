import Vuex from 'vuex'
import article from './stores/article'
import auth from './stores/auth'
import common from './stores/common'

export default new Vuex.Store({
    modules: {
        article: article,
        auth: auth,
        common: common
    }
})
