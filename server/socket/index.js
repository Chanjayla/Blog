const spawn = require('child_process').spawnSync
const os = require('os')
const Jwt = require('../jwt')
const cookieParser = require('cookieparser')
const osUtils = require('os-utils')
const WebSocketServer = require('ws').Server
module.exports = (server) => {
    const wss = new WebSocketServer({ noServer: true })
    server.on('upgrade', function upgrade(request, socket, head) {
        // authenticate
        const parsed = cookieParser.parse(request.headers.cookie || '')
        const token = parsed.accessToken
        authenticate(token, function(code) {
            if(code !== 0) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
                socket.destroy()
                return
            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
                wss.emit('connection', ws);
            });
        })
    });

    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            message = JSON.parse(message || '{}') 
            if(message.token) {
                authenticate(message.token, async function(code) {
                    if(code === 0) {
                        const data = getServerStatus()
                        const cpuUsage = await updateCpu()
                        ws.send(JSON.stringify({
                            ...data,
                            cpu: {
                                used: cpuUsage.toFixed(2),
                                platform: osUtils.platform()
                            }
                        }))
                    }
                })
            }
        });
    });
}

function authenticate(token, callback) {
    const result = Jwt.verify(token)
    callback(result.code)
}

function getServerStatus() {
    if(process.platform == 'linux') {
        let prc = spawn('free', [])
        let str = prc.stdout.toString()
        let lines = str.split(/\n/g)
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].split(/\s+/);
        }
        prc = spawn('df')
        let diskStr = prc.stdout.toString()
        let diskLine = diskStr.split(/\n/g)
        for (let i = 0; i < diskLine.length; i++) {
            diskLine[i] = diskLine[i].split(/\s+/);
        }
        let diskRes = diskLine.find(item => item[0].match(/\/dev\//))
        return {
            mem: {
                total: Math.floor(lines[1][1]/1024),
                used: Math.floor(lines[1][2]/1024),
                free: Math.floor(lines[1][3]/1024),
                available: Math.floor(lines[1][6]/1024)
            },
            disk: {
                used: Math.floor(diskRes[2]/1024),
                available: Math.floor(diskRes[3]/1024),
                total: Math.floor(diskRes[1]/1024)
            }
        }
    } else if(process.platform == 'darwin') {
        return {
            mem: {
                total: Math.floor(os.totalmem()/1024/1024),
                used: null,
                free: Math.floor(os.freemem()/1024/1024),
                available: null
            },
            disk: null
        }
    }
}

function updateCpu() {
    return new Promise(resolve => {
        osUtils.cpuUsage(function (value) {
            resolve(value*100)
          });
    }) 
}