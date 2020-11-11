const express = require('express')
const router = express.Router()
const { componentsData }= require('../mock/other')
router.get('/components', (req, res, next) => {
    res.json(componentsData)
})


module.exports = router