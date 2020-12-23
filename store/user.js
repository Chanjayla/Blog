import { userLogin, verifyHuman} from '~/api/user'
import { getToken, setToken, removeToken } from '~/utils/auth'

export const state = () => ({
    token: '',
    username: '',
    avatar: '',
    id: ''
})

export const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
        setToken(token)
    },
    SET_MESSAGE(state, msg) {
        state.username = msg.username || state.username
        state.avatar = msg.avatar || state.avatar
        state.id = msg.id || state.id
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
            username: userInfo.username,
            recaptchaToken: userInfo.recaptchaToken
        }).then(res => {
            if (res.data.code === 0) {
                sessionStorage.setItem('cms_username', userInfo.username)
                sessionStorage.setItem('cms_avatar', res.data.avatar)
                sessionStorage.setItem('cms_id', res.data.id)
                commit('SET_MESSAGE', {
                    username: userInfo.username,
                    avatar: res.data.avatar,
                    id: res.data.id
                })
                commit('SET_TOKEN', res.data.token)
                return Promise.resolve()
            } else {
                return Promise.reject(res.data.msg)
            }
        })
    }
}