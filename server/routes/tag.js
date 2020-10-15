const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const tagService = require('../service/TagService')
const log4js = require('log4js')
const handleLogger = log4js.getLogger('handle')
const errLogger = log4js.getLogger('err')
router.get('/all', (req, res, next) => {
    tagService.getAll().then((docs) => {
        res.json({
            code: 0,
            data: docs,
            msg: 'ok'
        })
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
    })
})

router.get('/page', (req, res, next) => {
    const data = req.body
    tagService.getByPage({
        page: data.page,
        pageSize: data.pageSize
    }).then((docs) => {
        res.json({
            code: 0,
            data: docs,
            msg: 'ok'
        })
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
    })
})

router.post('/add', auth, (req, res, next) => {
    const data = req.body
    if(data.name) {
        tagService.add({
            name: data.name
        }).then(doc => {
            res.json({
                code: 0,
                msg: 'ok'
            })
            handleLogger.debug(`add tag id:${data.id}-name:${data.name}-success`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`add tag id:${data.id}-name:${data.name}-error:${e}`)
        })
    }
})

router.post('/del', auth, (req, res, next) => {
    const data = req.body
    let query = null
    if(data.name) {
        query = tagService.deleteOne({
            name: data.name
        })
    } else if(data.cid) {
        query = tagService.deleteOne({
            cid: data.cid
        })
    }
    query.then(doc => {
        res.json({
            code: 0,
            msg: 'ok'
        })
        handleLogger.debug(`delete tag cid:${data.cid}-name:${data.name}-success`)
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
        errLogger.error(`delete tag cid:${data.cid}-name:${data.name}-error:${e}`)
    })
})

router.post('/modify', auth, (req, res, next) => {
    const data = req.body
    if(data.cid || data.name) {
        tagService.update({
            cid: data.cid,
            name: data.name,
            previewImage: data.previewImage || ''
        }).then(doc => {
            res.json({
                code: 0,
                msg: 'ok'
            })
            handleLogger.debug(`update tag cid:${data.cid}-name:${data.name}-success`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`delete tag cid:${data.cid}-name:${data.name}-error:${e}`)
        })
    } else {
        res.json({
            code: 400,
            msg: '缺少参数'
        })
        errLogger.error(`delete tag cid:${data.cid}-name:${data.name}-error:缺少参数`)
    }
    
})
module.exports = router