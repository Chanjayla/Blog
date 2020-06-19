const express = require('express')
const router = express.Router()
const { allTag } = require('../mock/tag')
router.get('/all', (req, res, next) => {
    res.json(allTag)
})

module.exports = router