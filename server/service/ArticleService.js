const mongoose = require('mongoose')
let connection = require('../db/connection')
const autoAddId = require('../db/ids')
let ArticleSchema = new mongoose.Schema({
    cid: Number, 
    title: String,
    content: String,
    description: String,
    author: String,
    tags: Array,
    publish_time: Date,
    preview_image: String
})
autoAddId(ArticleSchema, 'article')
let ArticleModel = connection.model('Article', ArticleSchema)

module.exports = {
    add(data) {
        let articleDoc = new ArticleModel({
            title: data.title,
            content: data.content,
            description: data.desc,
            tags: data.tags,
            publish_time: data.publish_time,
            author: data.author,
            preview_image: data.preview_image
        })
        return articleDoc.save()
    },
    update(data) {
        const whereQuery = {_id: data.id}
        const updateQuery = {
            title: data.title,
            content: data.content,
            description: data.desc,
            tags: data.tags,
            publish_time: data.publish_time,
            author: data.author,
            preview_image: data.preview_image
        }
        return ArticleModel.updateOne(whereQuery, updateQuery)
    },
    deleteOne(data) {
        const condition = {
            _id: data.id
        }
        return ArticleModel.deleteOne(condition)
    },
    deleteMulti(data) {
        const condition = {
            _id: {
                $in: data.ids
            }
        }
        return ArticleModel.deleteMany(condition)
    },
    getByPage(data) {
        const page = data.page || 1
        const pageSize = data.pageSize || 10
        const skipNum = ( page - 1 ) * pageSize
        const sort = {
            publish_time: -1
        }
        if(data.tags && data.tags.length > 0) {
            return ArticleModel.find({
                tags: {
                    $in: data.tags
                }
            }).skip(skipNum).limit(pageSize).sort(sort).exec()
        }
        return ArticleModel.find({}).skip(skipNum).limit(pageSize).sort(sort).exec()
    },
    getBySort(num, sort) {
        return ArticleModel.find({}).limit(num).sort(sort).exec()
    },
    getById(id) {
        return ArticleModel.find({
            _id: id
        })
    },
    getByCid(cid) {
        return ArticleModel.find({
            cid: cid
        })
    } 
}