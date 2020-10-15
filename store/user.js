import { userLogin } from '~/api/user'
import { getToken, setToken, removeToken } from '~/utils/auth'

export const state = () => ({
    token: ''
})

export const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
        setToken(token)
    },
    REMOVE_TOKEN(state) {
        state.token = null
        removeToken()
    }
}

export const actions = {
    login({ commit }, userInfo) {
        return userLogin({
            password: userInfo.password,
            username: userInfo.username
        }).then(res => {
            if (res.data.code === 0) {
                commit('SET_TOKEN', res.data.token)
                return Promise.resolve()
            } else {
                return Promise.reject(res.data.msg)
            }
        })
    }
}