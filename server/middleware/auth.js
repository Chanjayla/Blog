const Jwt = require('../jwt')
const cookieParser = require('cookieparser')
module.exports = function(req, res, next) {
    if(req.headers.cookie) {
        const parsed = cookieParser.parse(req.headers.cookie)
        const token = parsed.accessToken
        const result = Jwt.verify(token)
        if(result.code === 0) {
            next()
        } else {
            res.json({
                code: result.code,
                msg: result.msg
            })
        }
    } else {
        res.json({
            code: 401,
            msg: 'Unauthorized'
        })
    }
} 