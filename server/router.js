const controller = require('./controller')
const router = require('koa-router')()

router.get('/getBattleList', controller.getBattleList)
router.post('/getGameData', controller.getGameData)
router.post('/addMap', controller.addMap)
router.post('/removeMap', controller.removeMap)

module.exports = router