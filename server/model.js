const Lowdb = require('lowdb')
const LodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const _ = require('lodash')

const db = Lowdb(new FileSync(path.resolve(__dirname,'./data.json')))

db._.mixin(LodashId)
_.mixin(LodashId)

db.defaults({
  gameData: []
}).write()

const getBattleList = () => {
  return db.get('gameData').map(e=>_.pick(e, ['id', 'name'])).value()
}

const getGameData = (id) => {
  return db.get('gameData').find({id: id}).value()
}

const addMap = (battleId, map) => {
  db.get('gameData')
  .find({id: battleId})
  .get('bossMap')
  .push(map)
  .write()
}

const removeMap = (battleId, mapId) => {
  db.get('gameData')
  .find({id: battleId})
  .get('bossMap')
  .remove({id: mapId})
  .write()
}

module.exports = {
  getBattleList,
  getGameData,
  addMap,
  removeMap
}