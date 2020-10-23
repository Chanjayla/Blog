const schedule = require('node-schedule');

const  scheduleCronstyle = ()=>{
    // 每天0点执行
    schedule.scheduleJob('0 0 0 * * *',()=>{
       
    }); 
}

scheduleCronstyle();