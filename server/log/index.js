const log4js = require('log4js')
log4js.configure({
    appenders: { 
        access: { 
            type: "dateFile", 
            filename: "logs/access/access.log",
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            maxFileSize: 10485760
        },
        err: {
            type: "file", 
            filename: "logs/error/err.log",
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            maxFileSize: 10485760
        },
        handle: {
            type: "file", 
            filename: "logs/other/handle.log",
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            maxFileSize: 10485760
        }
    },
    categories: { 
        default: { 
            appenders: ["access"], 
            level: "debug" 
        },
        err: {
            appenders: ["err","handle"],
            level: "error"
        },
        handle: {
            appenders: ["handle"],
            level: "debug"
        }
    }
})

module.exports = log4js
