const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const auth = require('../middleware/auth')
const log4js = require('log4js')
const handleLogger = log4js.getLogger('handle')
const http = require('http')
const errLogger = log4js.getLogger('err')
const resourceService = require('../service/ResourceService')
const id3parser = require('id3-parser')
const ResourceService = require('../service/ResourceService')
const { json } = require('body-parser')
const MENU_PATH = path.resolve(__dirname, '../../upload/menu.json')
const DELETE_LIST_PATH = path.resolve(__dirname, '../../upload/delete_list.json')
const RESOURCE_DIR = path.resolve(__dirname, '../../static/')
let menuJson = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'))
let deleteList = JSON.parse(fs.readFileSync(DELETE_LIST_PATH, 'utf8'))

const picDest = multer({
    dest: 'static/uploads/images/'
})
const audioDest = multer({
    // dest: 'resources/audio/'
    dest: 'static/audio/'
})
router.post('/image', auth, picDest.single('preview'), (req, res, next) => {
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

    fs.writeFile(MENU_PATH, JSON.stringify(menuJson), function (err) {
        if (err) {
            errLogger.error(`upload image path but write menu error ${err}`)
        }
        // handleLogger.debug(`upload image path:${filepath}-success`)
    })
})
router.post('/upload/pic', auth, picDest.single('resource'), (req, res, next) => {
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

    fs.writeFile(MENU_PATH, JSON.stringify(menuJson), function (err) {
        if (err) {
            errLogger.error(`upload resource path but write menu error ${err}`)
        }
        // handleLogger.debug(`upload resource path:${filepath}-success`)
    })
})

router.post('/upload/audio', auth, audioDest.single('resource'), (req, res, next) => {
    let filename = req.file.filename
    let remotePath = '/audio/' + req.file.filename
    let duration = req.body.duration || 0
    fs.readFile(RESOURCE_DIR + '/audio/' + filename, function (err, data) {
        const tags = id3parser.parse(data)
        const buffer = tags.image ? Buffer.from(tags.image.data) : null
        if(buffer) {
            fs.writeFile(RESOURCE_DIR + '/audio/' + filename + '.jpg', buffer, function(err) {
                if(err) {console.log(err)}
            });
        }
        const d = {
            album: tags.album,
            artist: tags.artist,
            band: tags.band,
            title: tags.title,
            lrc: '',
            year: tags.year,
            custom: '',
            path: remotePath,
            image: tags.image ? ('data:' + tags.image.mime + ';base64,' + buffer.toString('base64')) : '',
            duration: duration
        }
        ResourceService.addAudio(d).then(doc => {
            res.json({
                code: 0,
                msg: d
            })
        }).catch(e => {
            res.json({
                code: 500,
                msg: 'error'
            })
        })


    })
})

router.get('/page', auth, (req, res, next) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const type = req.query.type || ''
    if (type == 'audio') {
        resourceService.getByPage({}).then(async docs => {
            const total = await resourceService.getCount()
            res.json({
                code: 0,
                data: docs,
                total: total,
                msg: 'ok'
            })
        }).catch(err => {
            res.json({
                code: 500,
                msg: err
            })
        })
        return
    }
    const data = type ? menuJson.filter(item => item.type.indexOf(type) > -1) : menuJson
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
    fs.writeFile(MENU_PATH, JSON.stringify(menuJson), function (err) {
        if (err) {
            errLogger.error(`update image but write menu error ${err}`)
        }
        // handleLogger.debug(`upload image path:${filepath}-success`)
    })
})
router.post('/delete', auth, (req, res, next) => {
    const type = req.body.type
    const arr = req.body.arr
    if (!type || type == 'pic') {
        arr.forEach && arr.forEach(idx => {
            deleteList.push(menuJson[idx].path)
        })
        menuJson = menuJson.filter((item, idx) => arr.indexOf(idx) === -1)
        fs.writeFileSync(DELETE_LIST_PATH, JSON.stringify(deleteList))
        fs.writeFile(MENU_PATH, JSON.stringify(menuJson), function (err) {
            if (err) {
                errLogger.error(`delete resources but write menu error ${err}`)
                res.json({
                    code: 500,
                    msg: 'error'
                })
            } else {
                res.json({
                    code: 0,
                    msg: 'ok'
                })
            }
            // handleLogger.debug(`upload image path:${filepath}-success`)
        })
    } else if (type == 'audio') {
        const ids = arr.map(val => {
            return {
                _id: val
            }
        })
        ResourceService.getAudioPath({
            ids: ids
        }).then(docs => {
            docs.forEach(p => {
                fs.unlinkSync(RESOURCE_DIR + p.path)
                fs.access(RESOURCE_DIR + p.path + '.jpg', (e) => {
                    if(!e) {
                        fs.unlinkSync(RESOURCE_DIR + p.path + '.jpg')
                    }
                })
                
            })
        }).then(() => {
            return ResourceService.deleteAudio({
                ids: ids
            })
        }).then(() => {
            res.json({
                code: 0,
                msg: 'ok'
            })
        }).catch(e => {
            res.json({
                code: 500,
                msg: e
            })
            errLogger.error(`delete audio ids:${arr}-error:${e}`)
        })
    }
})

router.post('/list/audio', function (req, res) {
    ResourceService.getAllAudio().then(docs => {
        res.json({
            code: 0,
            data: docs
        })
    }).catch(e => {
        res.json({
            code: 500,
            msg: e
        })
    })
})

// router.get('/audio/:id', function (req, res) {
//     const id = req.params.id
//     ResourceService.getPlayerMsg({
//         id: id
//     }).then(doc => {
//         if (doc && doc.path) {
//             const filepath = path.resolve(__dirname, '../..' + doc.path)
//             const range = req.headers.range
//             if(range) {
//                 const stat = fs.statSync(filepath)
//                 const fileSize = stat.size
//                 const rangeList = range.replace('bytes=', '').split('-')
//                 const bufferSize = 1024 * 1024 * 2
//                 let startPos = parseInt(rangeList[0], 10)
//                 let endPos = startPos + bufferSize
//                 if(endPos >= fileSize) {
//                     endPos = fileSize - 1
//                 }
//                 const contentLength = endPos - startPos + 1
//                 res.setHeader('Accept-Ranges', 'bytes')
//                 res.setHeader('Content-Range', 'bytes' + startPos + '-' + endPos + '/' + fileSize)
//                 res.setHeader('Content-Length', contentLength)
//                 res.setHeader('Cache-Controll', 'public, max-age=0')
//                 if (endPos == fileSize - 1) {
//                     res.setHeader('Content-Type', 'audio/mpeg')
//                     res.writeHead(206)
//                 } else {
//                     res.setHeader('Content-Type', 'audio/mpeg')
//                     res.writeHead(206)
//                 }
//                 let fReadStream = fs.createReadStream(filepath, {
//                     encoding: 'binary',
//                     bufferSize:bufferSize,
//                     start:startPos,
//                     end:endPos
//                 });
//                 fReadStream.on('data', function (chunk) {
//                     res.write(chunk, 'binary');
//                 });
//                 fReadStream.on('end', function () {
//                     res.end();
//                 });
//             }
//         } else {
//             throw 'not found'
//         }

//     }).catch(e => {
//         res.end()
//     })

// })

// router.post('/sprite', auth, (req, res, next) => {
//     const source = req.body.source
//     http.get('http://127.0.0.1:3002', resp => {
//         let data = []
//         let dataLen = 0
//         resp.on('data', (chunk) => { 
//             data.push(chunk)
//             dataLen += chunk.length
//         });
//         resp.on('end', () => {
//             const resData = Buffer.concat(data, dataLen)
//             res.json({
//                 code: 200,
//                 data: resData.toString('base64')
//             })
//         })
//     }).on('error', (e) => {
//         res.json({
//             code: 500,
//             msg: e
//         })
//     })
// })


module.exports = router