const express = require('express')
const router = express.Router()
const Jwt = require('../jwt')
const userService = require('../service/UserService')
const log4js = require('log4js')
const { default: UserService } = require('../service/UserService')
const handleLogger = log4js.getLogger('handle')
const errLogger = log4js.getLogger('err')
const auth = require('../middleware/auth')
router.post('/login', async (req, res, next) => {
    const params = {
        username: req.body.username,
        password: req.body.password
    }
    const token = req.body.token

    if (!params.username || !params.password) {
        res.json({
            code: -1,
            msg: '账号或密码错误'
        })
        errLogger.error(`add tag username:${params.username}-pwd:${params.password}-fail`)
        return
    }
    const pwdVerRes = await userService.verify({
        name: params.username,
        password: params.password
    })
    if (pwdVerRes) {
        if (token) {
            const tokenVerRes = Jwt.verify(token)
            if (tokenVerRes.code === 0) {
                res.json({
                    code: 0,
                    msg: '登录成功',
                    token: token,
                    avatar: pwdVerRes.avatar,
                    id: pwdVerRes._id
                })
                return
            }
        }
        res.json({
            code: 0,
            msg: '登录成功',
            token: Jwt.createToken(params),
            avatar: pwdVerRes.avatar,
            id: pwdVerRes._id
        })
    } else {
        res.json({
            code: -1,
            msg: '账号或密码错误'
        })
        errLogger.error(`add tag username:${params.username}-pwd:${params.password}-fail`)
    }
})

router.post('/modify', auth, (req, res) => {
    const data = req.body
    const query = {}
    if (data.avatar) {
        query.avatar = data.avatar
    }
    if (data.name) {
        query.name = data.name
    }
    if (data.id) {
        userService.update({
            id: data.id
        }, query).then(doc => {
            res.json({
                code: 0,
                msg: 'ok'
            })

        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
        })
    } else {
        res.json({
            code: 400,
            msg: 'no id'
        })
    }
})

router.post('/modifyPwd', auth, (req, res) => {
    const id = req.body.id
    const oldPwd = req.body.oldPwd
    const newPwd = req.body.newPwd
    if(id && oldPwd && newPwd) {
        userService.verify({
            id: id,
            password: oldPwd
        }).then(doc => {
            if(doc) {
                return true
            } else {
                return Promise.reject('no user')
            }
        }).then( () => {
            return userService.updatePwd({
                id: id
            }, {
                password: newPwd
            })
        }).then( (doc) => {
            if(doc) {
                res.json({
                    code: 200,
                    msg: 'ok'
                })
            }
        }).catch(e => {
            res.json({
                code: 404,
                msg: e
            })
        })
    } else {
        res.json({
            code: 400,
            msg: 'params error'
        })
    }

})
module.exports = router