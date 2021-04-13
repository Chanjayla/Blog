const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection

let ReleaseSchema = new mongoose.Schema({
    url: String,
    title: String,
    image: String,
    desc: String
})

let ReleaseModel = connection.model('Releases', ReleaseSchema)

module.exports = {
    getAll() {
        return ReleaseModel.find({}).select('url title image desc').exec() 
    },
    add(data) {
        let doc = new ReleaseModel({
            url: data.url,
            title: data.title,
            image: data.image,
            desc: data.desc
        })
        return doc.save()
    },
    del(id) {
        const condition = {
            _id: mongoose.mongo.ObjectId(id)
        }
        return ReleaseModel.deleteOne(condition)
    }
}