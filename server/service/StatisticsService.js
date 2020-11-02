const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection

const PvSchema = new mongoose.Schema({
    date: Date,
    url: String,
    agent: String,
    referer: String,
    ip: String
})

let PvModel = connection.model('Pv', PvSchema)
module.exports = {
    add(data) {
        let PvDoc = new PvModel({
            date: data.date,
            url: data.url,
            agent: data.agent,
            referer: data.referer,
            ip: data.ip
        })
        return PvDoc.save()
    },
    getPv(condition) {
        const start = new Date(parseInt(condition.stime))
        return PvModel.find({
            date: {
                $gt: start
            }
        }).select('_id date ip url').exec()
    }
}