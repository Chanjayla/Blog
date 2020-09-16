import * as Article from '~/api/article'
export const state = () => ({
  sidebar: {
    isOpen: true
  },
  navbar: {
    fixed: false
  }
})
export const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.isOpen = !state.sidebar.isOpen
  },
  SET_NAVBAR_FIXED: (state, value) => {
    state.navbar.fixed = value
  }
}
export const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  setNavBarFixed({ commit }, value) {
    commit('SET_NAVBAR_FIXED', value)
  }
}

