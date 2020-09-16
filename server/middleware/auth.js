const Jwt = require('../jwt')

module.exports = function(req, res, next) {
    const params = req.body
    const token = params.token
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