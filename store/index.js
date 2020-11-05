
const cookieParser = process.server ? require('cookieparser') : undefined
const fs = process.server ? require('fs') : undefined
const jwt = process.server ? require('jsonwebtoken') : undefined
import { TokenKey } from '~/utils/auth'
export const state = () => ({
  
})
export const mutations = {

}
export const actions = {
    nuxtServerInit({ commit }, { req }) {
        let token = null
        let themeId = 0
        if (req.headers && req.headers.cookie) {
            const parsed = cookieParser && cookieParser.parse(req.headers.cookie)
            try {
                token = parsed[TokenKey]
                themeId = parsed['theme_id']
                commit('app/TOGGLE_THEME', themeId)              
                if(!token) return
                let public_key = fs.readFileSync('server/key/public_key.pem', 'utf8')
                jwt.verify(token, public_key)
                //此处的commit，作用于服务端环境下的state，被middleware捕获
                commit('user/SET_TOKEN', token)

                if(req.headers['user-agent'].toLocaleLowerCase().indexOf('mobile') > -1) {
                    commit('app/SET_MOBILE', true)
                } else {
                    commit('app/SET_MOBILE', false)
                }
            } catch (err) {
                // No valid cookie found
                // console.log('err: ', err)
                // commit('user/REMOVE_TOKEN')
            }
        } 
    }
}
