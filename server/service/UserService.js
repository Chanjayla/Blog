const mongoose = require('mongoose')
let connection = require('../mongodb/connection').connection
const autoAddId = require('../mongodb/ids')
let UserSchema = new mongoose.Schema({
    cid: Number, 
    uid: Number,
    name: String,
    auth: String,
    password: String
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
        return UserModel.findOne({
            name: data.name
        }).then(doc => {
            if(!doc) {
                return false
            }
            return doc.password === data.password
        })
        
    }
}
