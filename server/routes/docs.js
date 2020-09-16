const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
let menuJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../docs/menu.json'), 'utf8'))
const cache = {}
const checkInMenu = (name) => menuJson.filter(item => item.name === name)[0]
const isInCache = (name) => !!cache[name]
let isInWriting = false
router.get('/page', (req, res, next) => {
    const page = req.body.page || 1
    const pageSize = req.body.pageSize || 10
    try {
        let result = menuJson.slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
        res.json({
            code: 0,
            data: result
        })
    } catch(e) {
        res.json({
            code: 500,
            msg: e
        })
    }
})

router.get('/get', (req, res, next) => {
    const name = req.query.name
    if(name) {
        try {
            let result = menuJson.filter(item => item.name === name)[0]
            if(isInCache(name)) {
                res.json({
                    code: 0,
                    data: cache[result.name]
                })
            } else {
                fs.readFile(path.resolve(__dirname, '../../docs/'+result.file), 'utf8', function(err, data) {
                    if(err) throw err
                    cache[result.name] = data
                    res.json({
                        code: 0,
                        data: data,
                        total: menuJson.length
                    })
                })
            }
        } catch(e) {
            res.json({
                code: 500,
                msg: e
            })
        }
    }
})

router.post('/update', (req, res, next) => {
    const name = req.body.name
    const content = req.body.content
    if(!!name && !!content) {
        try {
            let result = checkInMenu(name)
            isInWriting = true
            if(result) {
                fs.writeFile(path.resolve(__dirname, '../../docs/' + result.file), content, function(err) {
                    if(err) throw err
                    isInWriting = false
                    cache[name] = content
                    res.json({
                        code: 0,
                        msg: 'update successfully!'
                    })
                })
            } else {
                menuJson.push({
                    name: name,
                    file: `${name}.md`
                })
                fs.writeFile(path.resolve(__dirname, '../../docs/menu.json'), JSON.stringify(menuJson), function(err) {
                    if(err) throw err
                    fs.writeFile(path.resolve(__dirname, '../../docs/' + name + '.md'), content, function(err) {
                        if(err) throw err
                        isInWriting = false
                        cache[name] = content
                        res.json({
                            code: 0,
                            msg: 'create successfully!'
                        })
                    })
                })
            }
        } catch(e) {
            isInWriting = false
            res.json({
                code: 500,
                msg: e
            })
        }
       
    } else {
        res.json({
            code: -1,
            msg: 'error parameter'
        })
    }
})

router.post('/delete', (req, res, next) => {
    const names = req.body.names
    if(names) {
        try {
            const selectedItems = menuJson.filter(item => names.indexOf(item.name) > -1)
            menuJson = menuJson.filter(item => names.indexOf(item.name) == -1)
            fs.writeFile(path.resolve(__dirname, '../../docs/menu.json'), JSON.stringify(menuJson), function(err) {
                if(err) throw err
                selectedItems.forEach(item => {
                    fs.unlinkSync(path.resolve(__dirname, '../../docs/' + item.file))
                })
                res.json({
                    code: 0,
                    msg: 'delete successfully'
                })
            }) 
        } catch(e) {
            res.json({
                code: 500,
                msg: e
            })
        }

    }
})
module.exports = router