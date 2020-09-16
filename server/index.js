const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
// const session = require('express-session')
const app = express()
app.use(bodyParser.json())
// app.use(session({
//   secret: 'changerous',
//   saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
//   resave: false, // 是否每次都重新保存会话，建议false
//   cookie: {
//     maxAge: 60 * 60 * 1000 // 有效期，单位是毫秒
//   }
// }))

require('./routes')(app)
app.use("/docs", express.static('docs'))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
