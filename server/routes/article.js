const express = require('express')
const router = express.Router()

const { allArticle, getArticlePage, getArticleByTag } = require('../mock/article')
const latestData = allArticle.slice(0,10)
router.get('/latest', (req, res, next) => {
    res.json(latestData);
})
router.post('/page', (req, res, next) => {
    const params = req.body
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    res.json({
        data: getArticlePage(page, pageSize),
        total: allArticle.length
    })
})
router.post('/tag', (req, res, next) => {
    const params = req.body
    const tag = params.tag
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    console.log(tag)
    if(tag) {
        res.json(getArticleByTag(tag, page, pageSize))
    } else {
        res.json({
            total: 0,
            data: []
        })
    }

})
router.post('/', (req, res, next) => {
    const id = req.body.id
    res.json(allArticle[id])
})

module.exports = router
