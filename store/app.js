
import Cookies from 'js-cookie'
export const state = () => ({
    themeId:  0,
    themeName: 'theme0',
    clientWidth: 0,
    clientHeight: 0,
    loading: 0
})
export const mutations = {
    TOGGLE_THEME: (state, themeId) => {
        state.themeId = themeId || 0
        state.themeName = 'theme' + state.themeId
        Cookies.set('theme_id', state.themeId)
    },
    SET_CLIENT_WIDTH: (state, width) => {
        state.clientWidth = width
    },
    SET_CLIENT_HEIGHT: (state, height) => {
        state.clientHeight = height
    },
    TOGGLE_LOADING: (state, status) => {
        state.loading = status || 0
    }
}
export const actions = {
    toggleTheme({ commit }, themeId) {
        commit('TOGGLE_THEME', themeId)
    },
    toggleLoading({ commit }, status) {
        commit('TOGGLE_LOADING', status)
        if(status == 2) {
            setTimeout(() => {
                commit('TOGGLE_LOADING', 0)
            }, 500)
        }
    }
}
