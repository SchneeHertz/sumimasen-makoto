const db = require('./model')
const config = require('../config')

const getBattleList = async (ctx) => {
  ctx.body = {
    success: true,
    result: db.getBattleList()
  }
}

const getGameData = async (ctx) => {
  const id = ctx.request.body.id
  let result = db.getGameData(id)
  if (result) {
    ctx.body = {
      success: true,
      result: result
    }
  } else {
    ctx.body ={
      success: false,
      result: 'unknown id'
    }
  }
}

const addMap = async (ctx) =>{
  const balttleId = ctx.request.body.battleId
  const verify = ctx.request.body.verify
  const map = ctx.request.body.map
  if (verify == config.verifyKey ) {
    db.addMap(balttleId, map)
    ctx.body ={
      success: true,
      result: '保存成功'
    }
  } else {
    ctx.body = {
      success: false,
      result: '验证码错误'
    }
  }
}

const removeMap = async (ctx) =>{
  const balttleId = ctx.request.body.battleId
  const verify = ctx.request.body.verify
  const mapId = ctx.request.body.mapId
  if (verify == config.verifyKey ) {
    db.removeMap(balttleId, mapId)
    ctx.body ={
      success: true,
      result: '删除成功'
    }
  } else {
    ctx.body = {
      success: false,
      result: '验证码错误'
    }
  }
}

module.exports = {
  getBattleList,
  getGameData,
  addMap,
  removeMap
}