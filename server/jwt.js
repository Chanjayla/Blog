const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
module.exports = {
    createToken(payload) {
        try {
            let private_key = fs.readFileSync(path.join(__dirname, './key/private_key.pem'))
            return jwt.sign({
                ...payload,
                iat: Math.floor(Date.now() / 1000) - 30
            }, private_key, { algorithm: 'RS256', expiresIn: 60 * 60 * 24})
        } catch(e) {
            console.log('createToken error:', e)
        }
    },
    verify(token) {
        try {
            if(!token) {
                return {
                    code: -2,
                    msg: 'no-token'
                }
            }
            let public_key = fs.readFileSync(path.join(__dirname, './key/public_key.pem'))
            let {exp = 0} = jwt.verify(token, public_key), current = Math.floor(Date.now() / 1000)
            if(exp < current) {
                return {
                    code: -1,
                    msg: 'expires'
                }
            } else {
                return {
                    code: 0,
                    msg: 'ok'
                }
            }
        } catch(e) {
            return {
                code: -2,
                msg: e
            }
        }
        
    }
}