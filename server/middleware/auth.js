const Jwt = require('../jwt')
const cookieParser = require('cookieparser')
module.exports = function(req, res, next) {
    const parsed = cookieParser.parse(req.headers.cookie)
    const token = parsed.adminToken
    const result = Jwt.verify(token)
    if(result.code === 0) {
        next()
    } else {
        res.json({
            code: result.code,
            msg: result.msg
        })
    }
} 