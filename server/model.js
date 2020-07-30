const Lowdb = require('lowdb')
const LodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const _ = require('lodash')

const db = Lowdb(new FileSync(path.resolve(__dirname,'./data.json')))

db._.mixin(LodashId)
_.mixin(LodashId)

db.defaults({
  gameData: {}
}).write()

const getGameData = ()=>{
  return db.get('gameData').value()
}

module.exports = {
  getGameData
}