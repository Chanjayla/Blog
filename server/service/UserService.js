const mongoose = require('mongoose')
let connection = require('../db/connection')
const autoAddId = require('../db/ids')
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
        return UserModel.find({
            name: data.name
        }).then(doc => {
            if(doc.length == 0) {
                return false
            }
            return doc[0].password === data.password
        })
        
    }
}
