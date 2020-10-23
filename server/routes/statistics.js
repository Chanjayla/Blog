const axios = require('axios')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const stService = require('../service/StatisticsService')
router.get('/pv', (req, res)=> {
    const ltime = req.query.ltime
    const url = req.query.url
    const agent = req.headers['user-agent']
    const referer = req.query.referer || req.headers.referer
    let ip = req.headers['x-forward-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    if(ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    stService.add({
        date: Date(ltime*1000),
        url: url,
        agent: agent,
        referer: referer,
        ip: ip
    })
    res.json({
        code: 0
    })
})

router.get('/getPv', auth, (req, res) => {
    const start = req.query.start || (new Date().getTime() - 3600 * 1000)
    const end = req.query.end || new Date().getTime()
    stService.getPv({
        start, 
        end
    }).then(docs=> {
        res.json(docs)
    })
})
module.exports = router