const Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const _ = require('lodash')

const db = Lowdb(new FileSync(path.resolve(__dirname,'./data.json')))

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
  let findExist = db.get('gameData')
  .find({id: battleId})
  .get('bossMap')
  .find({id: map.id})
  .value()

  if (findExist) {
    db.get('gameData')
    .find({id: battleId})
    .get('bossMap')
    .find({id: map.id})
    .assign(map)
    .write()
  } else {
    db.get('gameData')
    .find({id: battleId})
    .get('bossMap')
    .push(map)
    .write()
  }
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