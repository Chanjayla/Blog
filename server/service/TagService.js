const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection
const autoAddId = require('../mongodb/ids')
let TagSchema = new mongoose.Schema({
    cid: Number,
    name: String,
    defaultPreview: String
})
autoAddId(TagSchema, 'tag')
let TagModel = connection.model('Tags', TagSchema)

module.exports = {
    add(data) {
        let tagDoc = new TagModel({
            name: data.name
        })
        return tagDoc.save()
    },
    update(data) {
        const whereQuery = data.cid ? {cid: data.cid} : {name: data.name}
        let updateQuery = {
            name: data.name
        }
        if(data.previewImage) {
            updateQuery.defaultPreview = data.previewImage
        }
        return TagModel.updateOne(whereQuery, updateQuery)
    },
    deleteOne(data) {
        let condition = null
        if(data.cid) {
            condition = {
                cid: data.cid
            }
        } else if(data.name) {
            condition = {
                name: data.name
            }
        }
        if(condition) {
            return TagModel.deleteOne(condition)
        } else {
            return Promise.reject('no params')
        }
       
    },
    getByPage(data) {
        const page = data.page || 1
        const pageSize = data.pageSize || 10
        const skipNum = ( page - 1 ) * pageSize
        const sort = {
            cid: -1
        }
        return TagModel.find({}).skip(skipNum).limit(pageSize).sort(sort).exec()
    },
    getAll() {
        return TagModel.find({}).exec()
    },
    find(condition) {
        return TagModel.find(condition).exec()
    }
}