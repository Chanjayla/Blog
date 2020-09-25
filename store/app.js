export const state = () => ({
    themeId: 0,
    themeName: 'theme0',
    clientWidth: 0,
    clientHeight: 0
})
export const mutations = {
    TOGGLE_THEME: (state) => {
        state.themeId = 1 - state.themeId
        state.themeName = 'theme' + state.themeId
    },
    SET_CLIENT_WIDTH: (state, width) => {
        state.clientWidth = width
    },
    SET_CLIENT_HEIGHT: (state, height) => {
        state.clientHeight = height
    }
}
export const actions = {
    toggleTheme({ commit }) {
        commit('TOGGLE_THEME')
    }
}
