const spawn = require('child_process').spawnSync
const WebSocketServer = require('ws').Server

module.exports = (server) => {
    const wss = new WebSocketServer({ server })
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            //打印客户端监听的消息
            console.log(message);
        });
        if (process.platform == 'linux') {
            let timer = setInterval(() => {
                let prc = spawn('free', [])
                let data = prc.stdout
                let str = data.toString()
                let lines = str.split(/\n/g);
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].split(/\s+/);
                }
                ws.send(JSON.stringify({
                    lines
                }))
            }, 2000)
            wss.on('close', function () {
                clearInterval(timer)
            })
        }

    });
}


