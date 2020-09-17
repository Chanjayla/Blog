const mongoose = require('mongoose')
const conn = mongoose.createConnection(
    'mongodb://admin:Cjl123456@47.101.61.8:27017/blog',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
)
conn.on('open', () => {
    console.log('打开 mongodb 连接')
})
conn.on('err', (err) => {
    console.log('err:' + err)
})

module.exports = conn