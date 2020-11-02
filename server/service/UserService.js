const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection
const autoAddId = require('../mongodb/ids')
let UserSchema = new mongoose.Schema({
    cid: Number, 
    uid: Number,
    name: String,
    auth: String,
    password: String,
    avatar: String
})
autoAddId(UserSchema, 'user')
let UserModel = connection.model('Users', UserSchema)

module.exports = {
    getUserByName(data) {   
        return UserModel.find({
            name: data.name
        })
    },
    verify(data) {
        const condition = {}
        if(data.id) {
            condition._id = mongoose.mongo.ObjectId(data.id)
        } 
        if(data.name) {
            condition.name = data.name
        }
        if(condition._id || condition.name) {
            return UserModel.findOne({
                ...condition,
                password: data.password
            }).then(doc => {
                if(!doc) {
                    return false
                }
                return doc
            })
        } else {
            return Promise.reject('error')
        }
    },
    update(condition, query) {
        return UserModel.updateOne({
            _id: mongoose.mongo.ObjectId(condition.id)
        },query)
    },
    updatePwd(condition, query) {
        return UserModel.updateOne({
            _id:  mongoose.mongo.ObjectId(condition.id)
        }, {
            password: query.password
        })
    }
}
