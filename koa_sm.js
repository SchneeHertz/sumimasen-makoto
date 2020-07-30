const config = require('./config')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaBodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const path = require('path')
const serve = require('koa-static')

const routerFile = require('./server/router')

const app = new Koa()
const router = KoaRouter()

app.use(logger())
app.use(cors())
app.use(koaBodyparser({
  jsonLimit: '32mb'
}))

app.use(serve(path.join(__dirname,  './dist')))

// router.use('/data', jwt({secret: config.jwt_seed}), data.routes())
router.use('/data', routerFile.routes())
app.use(router.routes())

app.listen(config.port)

module.exports = app