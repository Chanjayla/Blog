const express = require('express')
const router = express.Router()
const releaseService = require('../service/ReleaseService')
router.get('/getAll', (req, res) => {
    releaseService.getAll({}).then(docs => {
        res.json({
            code: 0,
            data: docs
        })
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
    })
})
router.post('/add', (req, res) => {
    const title = req.body.title
    const image = req.body.image
    const url = req.body.url
    const desc = req.body.desc
    if(title && url) {
        releaseService.add({
            title,
            image,
            url,
            desc
        }).then(docs => {
            res.json({
                code: 0,
                data: docs
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
            msg: 'must have title and url'
        })
    }
})

router.post('/delete', (req, res) => {
    const id = req.body.id
    if(id) {
        releaseService.del(id).then(() => {
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
            msg: 'id error'
        })
    }
})
module.exports = router