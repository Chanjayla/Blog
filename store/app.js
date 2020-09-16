export const state = () => ({
    theme: {
        headerColor: ''
    },
    clientWidth: 0,
    clientHeight: 0
})
export const mutations = {
    TOGGLE_HEADER_COLOR: (state, color) => {
        state.theme.headerColor = color
    },
    SET_CLIENT_WIDTH: (state, width) => {
        state.clientWidth = width
    },
    SET_CLIENT_HEIGHT: (state, height) => {
        state.clientHeight = height
    }
}
export const actions = {
    toggleHeaderColor({ commit }, color) {
        commit('TOGGLE_HEADER_COLOR', color)
    }
}
