const schedule = require('node-schedule');
const fs = require('fs')
const path = require('path')
function clean() {
    try {
        let list = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../upload/delete_list.json'), 'utf8'))
        list.forEach(item => {
            fs.unlinkSync(path.resolve(__dirname, '../static' + item))
        })
        fs.writeFileSync(path.resolve(__dirname, '../upload/delete_list.json'), JSON.stringify([]))
    } catch(e) {
        console.err(e)
    }

}
const  scheduleCronstyle = ()=>{
    // 每小时0分0秒清除资源
    schedule.scheduleJob('0 * * * * *',()=>{
        clean()
    }); 
}

scheduleCronstyle();