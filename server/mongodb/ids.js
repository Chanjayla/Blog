const mongoose = require('mongoose')
let connection = require('./connection').connection

const CounterSchema = new mongoose.Schema({
    name: {
        type: String
    },
    seq: {
        type: Number,
        default: 0
    }
})

const CounterModel = connection.model('Counters', CounterSchema)

function autoAddId(schema, name) {
    schema.pre('save', function (next) {
        let doc = this
        console.log(name)
        CounterModel.findOneAndUpdate({
            name: name
        }, {
            $inc: { seq: 1 }
        }, {
            new: true
        }, (error, counter) => {
            console.log(counter)
            if (error) return next(error)
            doc.cid = counter.seq
            next()
        })
    })
}

module.exports = autoAddId