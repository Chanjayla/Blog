const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection

let RssSchema = new mongoose.Schema({
    name: String,
    image: String,
    url: String,
    belong: Array
})

let RssModel = connection.model('rss', RssSchema)

module.exports = {
    add(data) {
        let rssDoc = new RssModel({
            name: data.name,
            image: data.image,
            url: data.url,
            belong: data.belong
        })
        return rssDoc.save()
    },
    getByCid(condition) {
        return RssModel.find({
            belong: {
                $in: [condition.cid]
            }
        }).sort({_id: -1}).exec()
    }
}