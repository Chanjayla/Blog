const spawn = require('child_process').spawnSync
const os = require('os')
const Jwt = require('../jwt')
const cookieParser = require('cookieparser')
const WebSocketServer = require('ws').Server

module.exports = (server) => {
    const wss = new WebSocketServer({ noServer: true })
    server.on('upgrade', function upgrade(request, socket, head) {
        // authenticate
        const parsed = cookieParser.parse(request.headers.cookie)
        const token = parsed.adminToken
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
                authenticate(message.token, function(code) {
                    if(code === 0) {
                        const data = getServerStatus()
                        ws.send(JSON.stringify({
                            ...data
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
        return {
            mem: {
                total: Math.floor(lines[1][1]/1024),
                used: Math.floor(lines[1][2]/1024),
                free: Math.floor(lines[1][3]/1024),
                available: Math.floor(lines[1][6]/1024)
            },
            cpus: os.cpus(),
            disk: diskLine
        }
    } else if(process.platform == 'darwin') {
        return {
            mem: {
                total: Math.floor(os.totalmem()/1024),
                used: null,
                free: Math.floor(os.freemem()/1024),
                available: null
            },
            cpus: os.cpus(),
            disk: null
        }
    }

}