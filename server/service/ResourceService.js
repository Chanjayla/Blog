const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection

let ResourceSchema = new mongoose.Schema({
    album: String,
    artist: String,
    band: String,
    title: String,
    lrc: String,
    year: String,
    custom: String,
    path: String,
    image: String,
    duration: String,
})

let ResourceModel = connection.model('Resources', ResourceSchema)

module.exports = {
    getAllAudio() {
        return ResourceModel.find({}).select('album artist band title lrc year duration path').exec()
    },
    getAudio(data) {
        ResourceModel.findOne({
            _id: mongoose.mongo.ObjectId(id)
        }).select('album artist band title lrc year path').exec()
    },
    addAudio(data) {
        let audioDoc = new ResourceModel({
            album: data.album || '',
            artist: data.artist || '',
            band: data.band || '',
            title: data.title || '',
            lrc: data.lrc || '',
            year: data.year || '',
            custom: data.custom || '',
            path: data.path || '',
            image: data.image,
            duration: data.duration
        })
        return audioDoc.save()
    },
    getByPage(data) {
        const page = data.page || 1
        const pageSize = data.pageSize || 10
        const skipNum = ( page - 1 ) * pageSize
        return ResourceModel.find({}).skip(skipNum).limit(pageSize).select('album artist band title lrc year path image').exec()
    },
    getCount() {
        return ResourceModel.find().count()
    },
    deleteAudio(data) {
        const condition = {
            _id: {
                $in: data.ids
            }
        }
        return ResourceModel.deleteMany(condition)
    },
    getPlayerMsg(data) {
        const id = data.id
        return ResourceModel.findOne({
            _id: mongoose.mongo.ObjectId(id)
        }).select('lrc path').exec()
    },
    getAudioPath(data) {
        const condition = {
            _id: {
                $in: data.ids
            }
        }
        return ResourceModel.find(condition).select('path').exec()
    }
}