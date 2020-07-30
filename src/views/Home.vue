<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="6" class="aside">
          <NameFormItem
            prependWidth="60px"
            class="battle-select"
          >
            <template #prepend>团队战</template>
            <template #default>
              <el-select
                v-model="selectBattleId"
                @change="handleSelectBattle"
              >
                <el-option
                  v-for="battle in battleList"
                  :key="battle.id"
                  :label="battle.name"
                  :value="battle.id"
                ></el-option>
              </el-select>
            </template>
          </NameFormItem>
          <el-card class="boss-select" v-show="selectBattleId">
            <el-radio-group v-model="selectBossName">
              <el-radio
                v-for="boss in bossList"
                :key="boss.id"
                :label="boss.name"
                border
              ></el-radio>
            </el-radio-group>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="18" class="main" v-show="selectBossName">
          <el-tabs
            type="border-card"
            v-model="selectRound"
          >
            <el-tab-pane
              v-for="round in bossRound.data"
              :key="round.round"
              :name="round.round"
              :label="`${round.round}阶段`"
            >
              <el-row>
                <overlay-scrollbars
                  :options="{scrollbars: {autoHide: 'scroll'}}"
                  class="map-list"
                >
                  <el-col :xs="24" :lg="12"
                    v-for="map in bossMap"
                    :key="map.id"
                  >
                    <el-card class="map-card">
                      <template #header>
                        <span>{{map.name}}</span>
                        <el-button style="float: right; padding: 3px 0; color: red" type="text" @click="removeMap(map.id)">删除</el-button>
                      </template>
                      <div class="character-require">
                        <div
                          v-for="(character, index) in map.require"
                          :key="index"
                        >
                        <span style="display: inline-block; min-width: 3.5em">{{character.character}}</span>
                        <span>({{character.rank}})</span>
                        <el-rate style="display: inline-block" v-model="character.star" disabled></el-rate>
                        </div>
                      </div>
                      <div class="map-detail">
                          <div
                            v-for="step in map.map"
                            :key="step.time"
                            class="map-step"
                          >
                            <span style="display: inline-block; min-width: 3.5em">{{step.time}}</span>
                            <span>{{step.remark}}</span>
                          </div>
                      </div>
                    </el-card>
                  </el-col>
                    <el-col :xs="24" :lg="12">
                      <el-card class="map-card">
                        <el-button type="success" class="bigicon" icon="el-icon-plus" circle @click="showDialog"></el-button>
                      </el-card>
                    </el-col>
                </overlay-scrollbars>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-dialog
          title="添加轴"
          :visible.sync="dialogVisible"
          width="90%"
          class="edit-dialog"
        >
          <el-input
            v-model="dialogData.name"
            class="card-line"
          >
            <template #prepend>简称</template>
          </el-input>
          <el-input
            v-model="dialogData.verify"
            class="card-line"
          >
            <template #prepend>验证码</template>
          </el-input>
          <div 
            v-for="(character, index) in dialogData.require"
            :key="index"
          >
            <el-input
              v-model="character.name"
              class="card-line card-line-character"
              placeholder="角色"
            ></el-input>
            <el-input
              v-model.number="character.star"
              class="card-line card-line-star"
              placeholder="星星数"
            ></el-input>
            <el-input
              v-model.number="character.rank"
              class="card-line card-line-rank"
              placeholder="Rank"
            ></el-input>
          </div>
          <div
            v-for="(step, index) in dialogData.map"
            :key="6 + index"
          >
            <el-input
              v-model="step.time"
              class="card-line card-line-time"
              placeholder="时间点"
            ></el-input>
            <el-input
              v-model.number="step.remark"
              class="card-line card-line-remark"
              placeholder="说明"
            ></el-input>
          </div>
          <div class="card-line">
            <el-button type="primary" size="mini" @click="addStep">增加一步</el-button>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="info" @click="dialogVisible = false">取消</el-button>
            <el-button type="success" @click="confirmAdd">确定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import NameFormItem from '@/components/NameFormItem'
import {generate as _id } from 'shortid'

export default {
  name: 'Home',
  components: {
    NameFormItem
  },
  data () {
    return {
      battleList: [],
      selectBattleId: undefined,
      gameData: {},
      selectBossName:undefined,
      selectRound: "1",
      dialogVisible: false,
      dialogData: {}
    }
  },
  computed: {
    bossList () {
      return _.get(this.gameData, 'bossData', [])
    },
    bossRound () {
      return _.find(this.bossList, {name: this.selectBossName}) || {}
    },
    bossMap () {
      return _.chain(this.gameData).get('bossMap', []).filter({bossName: this.selectBossName, round: this.selectRound}).value()
    }
  },
  mounted () {
    this.loadBattleList()
  },
  methods: {
    loadBattleList () {
      this.$http.get('/data/getBattleList')
      .then(res=>{
        this.battleList = res.data.result
      })
    },
    handleSelectBattle () {
      this.$http.post('/data/getGameData', {
        id: this.selectBattleId
      })
      .then(res=>{
        this.gameData = res.data.result
      })
    },
    removeMap (id) {
      this.$prompt('请输入验证码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$http.post('/data/removeMap', {
          battleId: this.selectBattleId,
          verify: value,
          mapId: id
        })
        .then((res)=>{
          if (res.data.success) {
            this.$message({type: 'success', message: res.data.result, showClose: true})
            let findIndex = _.findIndex(this.gameData.bossMap, {id: id})
            this.gameData.bossMap.splice(findIndex, 1)
          } else {
            this.$message({type: 'warning', message: res.data.result, showClose: true})
          }
        })
      }).catch(() => {
        this.$message({type: 'info', message: '取消输入'})   
      })
    },
    showDialog () {
      this.dialogData = {
        id: _id(),
        require: [{}, {}, {}, {}, {}],
        map: [{}]
      }
      this.dialogVisible = true
    },
    addStep () {
      this.dialogData.map.push({})
    },
    confirmAdd () {
      this.$http.post('/data/addMap', {
        battleId: this.selectBattleId,
        verify: this.dialogData.verify,
        map: {
          bossName: this.selectBossName,
          round: this.selectRound,
          ..._.omit(this.dialogData, 'verify')
        } 
      })
      .then((res)=>{
        if (res.data.success) {
          this.gameData.bossMap.push({
            bossName: this.selectBossName,
            round: this.selectRound,
            ..._.omit(this.dialogData, 'verify')
          })
          this.dialogVisible = false
        } else {
          this.$message({type: 'warning', message: res.data.result, showClose: true})
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-main
  padding: 0
  .aside
    .battle-select
      margin: 1% 8%
.el-card.boss-select
  margin: 10px
  text-align: center
  .el-radio 
    margin: 0.5em 2em
    min-width: 80%
    text-align: left
.map-list
  height: 90vh
.character-require, .map-detail
  text-align: left
  border: solid 1px #DCDFE6
  border-radius: 4px
  padding: 2px 8px
  margin: 2px 0
.map-step
  margin: 2px 0
.bottom-function-btn
  position: absolute
  bottom: 1em
  right: 1.5em
  cursor: pointer
.card-line
  margin: 3px 0
.card-line-character
  width: 50%
.card-line-star
  width: 25%
.card-line-rank
  width: 25%
.card-line-time
  width: 25%
.card-line-remark
  width: 75%
</style>

<style lang="stylus">
.main
  .el-tabs__content
    padding: 8px
.map-card
  margin: 4px 8px
  vertical-align: top
  text-align: center
  .el-card__header
    padding: 8px 16px
.edit-dialog .card-line .el-input-group__prepend
  text-align: center
  min-width: 50px
  
</style>
