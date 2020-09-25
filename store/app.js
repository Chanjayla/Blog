
export const state = () => ({
    themeId:  0,
    themeName: 'theme0',
    clientWidth: 0,
    clientHeight: 0
})
export const mutations = {
    TOGGLE_THEME: (state, themeId) => {
        state.themeId = themeId || 0
        state.themeName = 'theme' + state.themeId
        sessionStorage.setItem('theme_id', state.themeId)
    },
    SET_CLIENT_WIDTH: (state, width) => {
        state.clientWidth = width
    },
    SET_CLIENT_HEIGHT: (state, height) => {
        state.clientHeight = height
    }
}
export const actions = {
    toggleTheme({ commit }, themeId) {
        commit('TOGGLE_THEME', themeId)
    }
}
