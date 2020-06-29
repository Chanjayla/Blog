const express = require('express')
const router = express.Router()
const axios = require('axios')
const { qqMusicDataHandle } = require('../util/dataHandle')
const {
    SEARCH_URL
} = require('../api/qqmusic')
router.get('/search', async (req, res) => {
    const result = await axios.get(
        SEARCH_URL,
        {
            headers: {
                Referer: 'https://y.qq.com'
            }
        }
    )
    res.json(qqMusicDataHandle(result.data))
})

router.get('/')

module.exports = router