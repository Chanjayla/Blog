const auth = require('../middleware/auth')
const articleService = require('../service/ArticleService')
const express = require('express')
const router = express.Router()
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
// router.post('/tag', (req, res, next) => {
//     const params = req.body
//     const tags = params.tags
//     const page = params.page || 1
//     const pageSize = params.pageSize || 10
//     if (tags && tags.length > 0) {
//         articleService.getByPage({
//             tags: tags,
//             page: page,
//             pageSize: pageSize
//         }).then(docs => {
//             res.json({
//                 code: 0,
//                 data: docs,
//                 msg: 'ok'
//             })
//         }).catch(e =>{
//             res.json({
//                 code: 500,
//                 msg: e
//             })
//         })
//     } else {
//         articleService.getByPage({
//             page: page,
//             pageSize: pageSize
//         }).then(docs => {
//             res.json({
//                 code: 0,
//                 data: docs,
//                 msg: 'ok'
//             })
//         }).catch(e =>{
//             res.json({
//                 code: 500,
//                 msg: e
//             })
//         })
//     }

// })
router.post('/getById', (req, res, next) => {
    const id = req.body.id
    const cid = req.body.cid
    try {
        if(typeof id != 'undefined') {
            articleService.getById(id).then(doc => {
                res.json({
                    code: 0,
                    data: doc[0],
                    msg: 'ok'
                })
            })
        } else if(typeof cid != 'undefined') {
            articleService.getByCid(cid).then(doc => {
                res.json({
                    code: 0,
                    data: doc[0],
                    msg: 'ok'
                })
            })
        } else {
            res.json({
                code: -1,
                msg: 'no id'
            })
        }
    } catch(e) {
        res.json({
            code: 500,
            msg: e
        })
    }
    
})

router.post('/add', auth, (req, res, next) => {
    const data = req.body
    console.log(data)
    !data.publish_time && (data.publish_time = Date.now())
    if(!data.title) {
        res.json({
            code: -1,
            msg: 'params error'
        })
        return
    }
    try {
        if(data.id) {
            articleService.update(data).then(docs => {
                res.json({
                    code: 0,
                    msg: docs.nModified ? 'Update successfully!' : 'No modified'
                })
            })
        } else {
            articleService.add(data).then(doc => {
                res.json({
                    code: 0,
                    msg: 'ok'
                })
            })
        }
        // data.tags && data.tags.length > 0 && data.tags.forEach(tag => {
        //     if(!!tag.cid)
        // })  
    } catch(e) {
        res.json({
            code: 500,
            msg: e
        })
    }
    

})

router.post('/delete', auth, (req, res, next) => {
    const data = req.body
    try {
        if(data.id) {
            articleService.deleteOne(data).then((doc) => {
                console.log(doc)
                res.json({
                    code: 0,
                    msg: 'ok'
                })
            })
        }
        if(data.ids && data.ids.length > 0) {
            articleService.deleteMulti(data).then((doc) => {
                console.log(doc)
                res.json({
                    code: 0,
                    msg: 'ok'
                })
            })
        }
    } catch(e) {
        res.json({
            code: 500,
            msg: e
        })
    }

})
module.exports = router
