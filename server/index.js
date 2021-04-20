const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const http = require('http')
const spdy = require('spdy')
const fs = require('fs')
const log4js = require('./log')
const compression = require('compression')
const app = express()
require('./schedule')
app.use(compression())
app.use(log4js.connectLogger(log4js.getLogger('default'), {
  format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
}))
app.use(bodyParser.json())

require('./routes')(app)
app.use("/docs", express.static('docs'))
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port, port2 } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  // let server = https.createServer({
  //   key: fs.readFileSync('server/https/4713990_www.jaylang.cn.key'),
  //   cert: fs.readFileSync('server/https/4713990_www.jaylang.cn.pem')
  // }, app).listen(port, host)
  http.createServer(function (req, res) {
    if (config.dev) {
      res.writeHead(301, { 'Location': 'https://127.0.0.1:' + port + req.url });
    } else {
      res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
    }
    res.end()
  }).listen(port2, host)
  let server = spdy.createServer({
    key: fs.readFileSync('server/https/www.jaylang.cn.key'),
    cert: fs.readFileSync('server/https/www.jaylang.cn.pem')
  }, app).listen(port, host)
  require('./socket')(server)
  consola.ready({
    message: `Server listening on https://${host}:${port}`,
    badge: true
  })
}
start()
