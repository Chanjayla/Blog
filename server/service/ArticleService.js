const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection
const autoAddId = require('../mongodb/ids')

let ArticleSchema = new mongoose.Schema({
    cid: Number, 
    title: String,
    content: String,
    description: String,
    author: String,
    tags: Array,
    publish_time: Date,
    preview_image: String,
    pv: Number,
    is_top: Boolean
})
autoAddId(ArticleSchema, 'article')
let ArticleModel = connection.model('Articles', ArticleSchema)


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
        const whereQuery = {_id: mongoose.mongo.ObjectId(data.id)}
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
    setTop(data) {
        const whereQuery = {_id: mongoose.mongo.ObjectId(data.id)}
        const updateQuery = {
            is_top: data.is_top
        }
        return ArticleModel.updateOne(whereQuery, updateQuery)
    },
    deleteOne(data) {
        const condition = {
            _id: mongoose.mongo.ObjectId(data.id)
        }
        return ArticleModel.deleteOne(condition)
    },
    deleteMulti(data) {
        const condition = {
            _id: {
                $in: mongoose.mongo.ObjectId(data.ids)
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
            }).skip(skipNum).limit(pageSize).sort(sort).select('author description cid preview_image publish_time tags title is_top').exec()
        }
        return ArticleModel.find({}).skip(skipNum).limit(pageSize).sort(sort).select('author description cid preview_image publish_time tags title is_top').exec()
    },
    getBySort(num, sort, select) {
        if(select) {
            return ArticleModel.find({}).limit(num).sort(sort).select(select).exec()
        } else {
            return ArticleModel.find({}).limit(num).sort(sort).select('author description cid preview_image publish_time tags title').exec()
        }
    },
    getById(id) {
        return ArticleModel.findOne({
            _id: mongoose.mongo.ObjectId(id)
        })
    },
    getByCid(cid) {
        return ArticleModel.findOne({
            cid: cid
        })
    },
    async getArticlePrevAndNext(condition) {
        let prev = await ArticleModel.find({
            publish_time: {
                $lt: condition.publish_time
            }
        }).sort({publish_time: -1}).limit(1).select('title preview_image').exec()
        let next = await ArticleModel.find({
            publish_time: {
                $gt: condition.publish_time
            }
        }).sort({publish_time: 1}).limit(1).select('title preview_image').exec()
        prev = prev[0]
        next = next[0]
        return {
            prev: prev || null,
            next: next || null
        }
    },
    statisticsPv(id) {
        return ArticleModel.updateOne({
            _id: mongoose.mongo.ObjectId(id)
        }, {
            $inc: {
                pv: 1
            }
        })
    },
    getByPv() {
        return ArticleModel.find({
            pv: {
                $gt: 0
            }
        }).sort({
            pv: -1
        }).select('title preview_image pv').exec()
    },
    getByKeyword(data) {
        const page = data.page || 1
        const pageSize = data.pageSize || 10
        const skipNum = ( page - 1 ) * pageSize
        const keyword = data.keyword
        return ArticleModel.find({
            $or: [
                { title: { $regex: keyword }},
                { description: { $regex: keyword }}
            ]
        }).skip(skipNum).limit(pageSize).sort({
            publish_time: -1
        }).select('title description publish_time tags').exec()
    }
}