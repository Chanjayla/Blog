const express = require('express')
const router = express.Router()
const Jwt = require('../jwt')
const userService = require('../service/UserService')

router.post('/login', async (req, res, next) => {
    const params = {
        username: req.body.username,
        password: req.body.password
    }
    const token = req.body.token
    
    if(!params.username || !params.password) {
        res.json({
            code: -1,
            msg: '账号或密码错误'
        })
        return 
    }
    const pwdVerRes = await userService.verify({
        name: params.username,
        password: params.password
    })
    if(pwdVerRes) {
        if(token) {
            const tokenVerRes = Jwt.verify(token)
            if(tokenVerRes.code === 0) {
                res.json({
                    code: 0,
                    msg: '登录成功',
                    token: token
                })
                return
            }
        }
        res.json({
            code: 0,
            msg: '登录成功',
            token: Jwt.createToken(params)
        })
    } else {
        res.json({
            code: -1,
            msg: '账号或密码错误'
        })
    }
})

module.exports = router