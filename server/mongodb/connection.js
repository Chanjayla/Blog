const mongoose = require('mongoose')
const config = require('../config/db')
let conn = mongoose.createConnection(
    `mongodb://${config.admin.user}:${config.admin.password}@${config.ip}:${config.port}/${config.database}`,
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
    console.log('mongodb连接错误err:' + err)
})
conn.on('close', (err) => {
    console.log('mongodb连接断开')
})


module.exports = {
    connection: conn,
    close: () => conn.close()
}