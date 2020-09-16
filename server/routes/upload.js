const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer({
    dest: 'static/uploads/images/'
})

router.post('/image', upload.single('preview'), (req, res, next) => {
    let path = req.file.path
    path = '/' + path.match(/(?<=static\/).*/)[0]
    res.json({
        code: 0,
        path: path
    })
})
module.exports = router