const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const auth = require('../middleware/auth')
const log4js = require('log4js')
const handleLogger = log4js.getLogger('handle')
const errLogger = log4js.getLogger('err')
let menuJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../upload/menu.json'), 'utf8'))
const upload = multer({
    dest: 'static/uploads/images/'
})
router.post('/image', auth, upload.single('preview'), (req, res, next) => {
    let filepath = req.file.path
    let belongId = req.body.id
    let mimeType = req.file.mimetype
    filepath = '/' + filepath.match(/(?<=static\/).*/)[0]
    res.json({
        code: 0,
        path: filepath,
        type: mimeType
    })
    menuJson.unshift({
        path: filepath,
        belong: [belongId],
        type: mimeType
    })

    fs.writeFile(path.resolve(__dirname, '../../upload/menu.json'), JSON.stringify(menuJson), function (err) {
        if (err) {
            errLogger.error(`upload image path but write menu error ${err}`)
        }
        handleLogger.debug(`upload image path:${filepath}-success`)
    })
})
router.post('/resource', auth, upload.single('resource'), (req, res, next) => {
    let filepath = req.file.path
    let mimeType = req.file.mimetype
    filepath = '/' + filepath.match(/(?<=static\/).*/)[0]
    res.json({
        code: 0,
        path: filepath,
        type: mimeType
    })
    menuJson.unshift({
        path: filepath,
        type: mimeType
    })

    fs.writeFile(path.resolve(__dirname, '../../upload/menu.json'), JSON.stringify(menuJson), function (err) {
        if (err) {
            errLogger.error(`upload resource path but write menu error ${err}`)
        }
        handleLogger.debug(`upload resource path:${filepath}-success`)
    })
})

router.get('/page', auth, (req, res, next) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const type = req.query.type || ''
    const data = type ? menuJson.filter(item => item.type.indexOf(type)>-1) : menuJson
    try {
        let result = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
        res.json({
            code: 0,
            data: result,
            total: data.length
        })
    } catch (e) {
        res.json({
            code: 500,
            msg: e
        })
    }
})
router.get('/update', auth, (req, res, next) => {
    const filepath = req.body.path
    const belongId = req.body.id
    let isFound = false
    for (let i = 0; i < menuJson.length; ++i) {
        if (menuJson[i].path == filepath) {
            menuJson[i].belong && menuJson[i].belong.push(belongId)
            isFound = true
            break;
        }
    }
    res.json({
        code: 0,
        msg: isFound ? 'ok' : 'Not Found'
    })
})
router.get('/delete', auth, (req, res, next) => {

})
module.exports = router