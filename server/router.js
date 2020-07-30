const controller = require('./controller')
const router = require('koa-router')()

router.get('/getGameData', controller.getGameData)

module.exports = router