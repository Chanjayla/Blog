
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
                commit('user/SET_TOKEN', token)
            } catch (err) {
                // No valid cookie found
                // console.log('err: ', err)
                // commit('user/REMOVE_TOKEN')
            }
        } 
    }
}
