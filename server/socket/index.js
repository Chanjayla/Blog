const os = require('os')
const spawn = require('child_process').spawn
const WebSocketServer = require('ws').Server

module.exports = (server) => {
    const wss = new WebSocketServer({ server })
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            //打印客户端监听的消息
            console.log(message);
        });
        ws.send(os.platform())
        if (os.platform() == 'linux') {
            let prc = spawn('free', [])
            prc.stdout.setEncoding('utf8');
            prc.stdout.on('data', function (data) {
                let str = data.toString()
                let lines = str.split(/\n/g);
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].split(/\s+/);
                }
                ws.send(JSON.stringify({
                    data,
                    lines
                }))
                setTimeout(function() {
                    prc = spawn('free', [])
                }, 2000)
            });
            wss.on('close', function () {
                prc.on('close', function (code) {
                    console.log('process exit code ' + code);
                });
            })
        }

    });
}


