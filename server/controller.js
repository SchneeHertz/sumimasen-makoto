const db = require('./model')



const getGameData = async (ctx) => {
  ctx.body = {
    success: true,
    materialList: db.getGameData()
  }
}


module.exports = {
  getGameData
}