const express = require('express')
const http = require('http')
const FeedParser = require('feedparser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookieparser')
const router = express.Router()
const auth = require('../middleware/auth')
const RssService = require('../service/RssService')

const accessKey = 'GenosRss'
router.get('/custom', auth, (req, res, next) => {
    const url = decodeURIComponent(req.query.url)
    if (url) {
        http.get('http://www.jaylang.cn:1200' + url + (url.indexOf('?') > -1 ? '&' : '?') + 'key=' + accessKey, resp => {
            let data = []
            const feedparser = new FeedParser()
            feedparser.on('error', (e) => {
                res.json({
                    code: 500,
                    msg: e
                })
            })
            feedparser.on('end', () => {
                res.json({
                    code: 0,
                    data: data
                })
            })
            feedparser.on('readable', function () {
                let post;
                while (post = this.read()) {
                    data.push(post)
                }
            })
            resp.pipe(feedparser)
        }).on('error', (e) => {
            res.json({
                code: 500,
                msg: e
            })
        })
    }
})

router.get('/my', auth, (req, res, next) => { 
    const parsed = cookieParser.parse(req.headers.cookie)
    const token = parsed.accessToken
    const payload = jwt.decode(token)
    RssService.getByCid({
        cid: payload.cid
    }).then(docs => {
        if(docs) {
            res.json({
                code: 0,
                data: docs,
                msg: 'ok'
            })
        } else {
            res.json({
                code: 0,
                data: [],
                msg: 'ok'
            })
        }
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
    })
})

router.post('/add', auth, (req, res, next) => {
    const parsed = cookieParser.parse(req.headers.cookie)
    const token = parsed.accessToken
    const payload = jwt.decode(token) 
    const name = req.body.name
    const image = req.body.image
    const url = req.body.url
    RssService.add({
        name: name,
        image: image,
        url: url,
        belong: [payload.cid]
    }).then(doc => {
        res.json({
            code: 0,
            msg: 'ok'
        })
    })
})
module.exports = router