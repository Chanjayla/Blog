const auth = require('../middleware/auth')
const articleService = require('../service/ArticleService')
const express = require('express')
const router = express.Router()
const log4js = require('log4js')
const handleLogger = log4js.getLogger('handle')
const errLogger = log4js.getLogger('err')
// const { allArticle, getArticlePage, getArticleByTag } = require('../mock/article')
router.get('/latest', (req, res, next) => {
    const num = req.body.num || 10
    articleService.getBySort(num, {
        publish_time: -1
    }).then(doc => {
        res.json({
            code: 0,
            data: doc,
            msg: 'ok'
        })
    }).catch(err => {
        res.json({
            code: 500,
            msg: err
        })
    })
})
router.post('/page', (req, res, next) => {
    const params = req.body
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const tags = params.tags || []
    articleService.getByPage({
        page: page,
        pageSize: pageSize,
        tags: tags
    }).then(doc => {
        res.json({
            code: 0,
            data: doc,
            total: 10,
            msg: 'ok'
        })
    }).catch(err => {
        res.json({
            code: 500,
            msg: err
        })
    })

})

router.post('/getById', (req, res, next) => {
    const id = req.body.id
    const cid = req.body.cid
    try {
        if (typeof id != 'undefined') {
            articleService.getById(id).then(async (doc) => {
                if(doc) {
                    const prevNext =  await articleService.getArticlePrevAndNext({cid: doc.cid})
                    res.json({
                        code: 0,
                        data: doc,
                        prev: prevNext.prev,
                        next: prevNext.next,
                        msg: 'ok'
                    })
                } else {
                    res.json({
                        code: 0,
                        data: null,
                        msg: 'ok'
                    })
                }
                
            })
        } else if (typeof cid != 'undefined') {
            articleService.getByCid(cid).then(async doc => {
                if(doc) {
                    const prevNext = await articleService.getArticlePrevAndNext({cid: doc.cid})
                    doc.prev = prevNext.prev
                    doc.next = prevNext.next
                    res.json({
                        code: 0,
                        data: doc,
                        msg: 'ok'
                    })
                } else {
                    res.json({
                        code: 0,
                        data: null,
                        msg: 'ok'
                    })
                }
            })
        } else {
            res.json({
                code: -1,
                msg: 'no id'
            })
        }
    } catch (e) {
        res.json({
            code: 500,
            msg: e
        })
    }

})

router.post('/add', auth, (req, res, next) => {
    const data = req.body
    !data.publish_time && (data.publish_time = Date.now())
    if (!data.title) {
        res.json({
            code: -1,
            msg: 'params error'
        })
        return
    }
    if (data.id) {
        articleService.update(data).then(docs => {
            res.json({
                code: 0,
                msg: docs.nModified ? 'Update successfully!' : 'No modified'
            })
            handleLogger.debug(`update article id:${data.id}-title:${data.title}-doc.nModified:${docs.nModified}`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`update article id:${data.id}-title:${data.title}-error:${e}`)
        })
    } else {
        articleService.add(data).then(doc => {
            res.json({
                code: 0,
                msg: 'ok'
            })
            handleLogger.debug(`add article id:${data.id}-title:${data.title}-success`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`add article id:${data.id}-title:${data.title}-error:${e}`)
        })
    }

})

router.post('/delete', auth, (req, res, next) => {
    const data = req.body
    if (data.id) {
        articleService.deleteOne(data).then((doc) => {
            res.json({
                code: 0,
                msg: 'ok'
            })
            handleLogger.debug(`delete article id:${data.id}-title:${data.title}-success`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`delete article id:${data.id}-title:${data.title}-error:${e}`)
        })
    }
    if (data.ids && data.ids.length > 0) {
        articleService.deleteMulti(data).then((doc) => {
            res.json({
                code: 0,
                msg: 'ok'
            })
            handleLogger.debug(`delete articles id:${data.id}-title:${data.title}-success`)
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.debug(`delete article id:${data.id}-title:${data.title}-error:${e}`)
        })
    }
})
module.exports = router
