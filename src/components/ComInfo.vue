<template>
  <!--  Cognitive Query  -->
  <!--  <br/>-->
  <!--  <div class="cogQy">-->
  <!--    <input id="symb" type="text" class="col-auto" placeholder="代號" v-on:input="cogSymb($event.target.value)"/>-->
  <!--    <input id="nm" type="text" class="col-auto" placeholder="簡稱" v-on:input="cogNm($event.target.value)"/>-->
  <!--    <input id="type" type="text" class="col-auto" placeholder="市場別" v-on:input="cogType($event.target.value)"/>-->
  <!--    <br/>-->
  <!--    <input id="indus" type="text" class="col-auto" placeholder="產業別" v-on:input="cogIndus($event.target.value)"/>-->
  <!--    <input id="main" type="text" class="col-auto" placeholder="主要業務" v-on:input="cogMain($event.target.value)"/>-->
  <!--    <input id="coted" type="text" class="col-auto" placeholder="相關產業" v-on:input="cogCoted($event.target.value)"/>-->
  <!--    <input id="cep" type="text" class="col-auto" placeholder="相關概念" v-on:input="cogCep($event.target.value)"/>-->
  <!--  </div>-->
  <br/>
  <div class="row">
    <div class="col-md-2">
      <ul class="list-group" v-if="!toAdd && !toEdit">
        <li class="list-group-item"
            :class="{active:index === currIndex}"
            v-for="(com,index) in comList"
            :key="index"
            @click="setActiveCom(com, index)">
          {{ com.symb }} : {{ com.comNm }} <!-- {{ com.comIndus }} -->
        </li>
      </ul>
    </div>
    <div class="col-md-8">
      <button class="btn btn-outline-primary"
              v-if="!toAdd && !toEdit && this.roleArr.includes('ROLE_ADMIN')"
              @click="toAddPage">新增
      </button>
      <div v-if="isShow">
        <div v-if="currCom">
          <button class="btn btn-outline-secondary"
                  v-if="this.roleArr.includes('ROLE_ADMIN')"
                  @click="toEditPage">編輯
          </button>
          <br/><br/>
          <div><label><strong>Symbol:</strong></label> {{ currCom.symb }}</div>
          <br/>
          <div><label><strong>簡稱 :</strong></label> {{ currCom.comNm }}</div>
          <br/>
          <div><label><strong>市場別 :</strong></label> {{ currCom.comType }}</div>
          <br/>
          <div><label><strong>產業別 :</strong></label> {{ currCom.comIndus }}</div>
          <br/>
          <div><label><strong>主要業務 :</strong></label> {{ currCom.comMain }}</div>
          <br/>
          <div><label><strong>相關產業 :</strong></label> {{ currCom.comCoted }}</div>
          <br/>
          <div><label><strong>相關概念 :</strong></label> {{ currCom.comCep }}</div>
          <br/>
          <div><label><strong>官方網站 :</strong></label>
            <div v-if="currCom.comOfcl">
              <a :href="currCom.comOfcl" target="_blank">{{ currCom.comOfcl }}</a>
            </div>
          </div>
          <br/><br/>
          <button class="btn btn-outline-danger"
                  v-if="this.roleArr.includes('ROLE_ADMIN')"
                  @click="deleteCom(currCom.symb)">刪除
          </button>
        </div>
        <div v-else>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          未選取
        </div>
      </div>
      <div v-if="toAdd">
        <strong>Create</strong>
        <div class="form-group">
          <br/>
          <div class="col-sm-4">
            Symbol :
            <input id="symb" name="symb" type="text"
                   class="form-control" required
                   v-model="newCom.symb"/>
          </div>
          <div class="col-sm-4">
            簡稱 :
            <input id="comNm" name="comNm" type="text"
                   class="form-control"
                   v-model="newCom.comNm"/>
          </div>
          <div class="col-sm-4">
            市場別 :
            <input id="comType" name="comType" type="text"
                   class="form-control"
                   v-model="newCom.comType"/>
          </div>
          <div class="col-sm-4">
            產業別 :
            <input id="comIndus" name="comIndus" type="text"
                   class="form-control"
                   v-model="newCom.comIndus"/>
          </div>
          <div class="col-sm-4">
            主要業務 :
            <input id="comMain" name="comMain" type="text"
                   class="form-control"
                   v-model="newCom.comMain"/>
          </div>
          <div class="col-sm-4">
            相關產業 :
            <input id="comCoted" name="comCoted" type="text"
                   class="form-control"
                   v-model="newCom.comCoted"/>
          </div>
          <div class="col-sm-4">
            相關概念 :
            <input id="comCep" name="comCep" type="text"
                   class="form-control"
                   v-model="newCom.comCep"/>
          </div>
          <div class="col-sm-4">
            官方網站 :
            <input id="comOfcl" name="comOfcl" type="text"
                   class="form-control"
                   v-model="newCom.comOfcl"/>
          </div>
        </div>
        <br/><br/>
        <button class="btn btn-outline-info" @click="toShowPage">取消</button>
        <button class="btn btn-success" @click="saveCom">儲存</button>
      </div>
      <div v-if="toEdit">
        <strong>Update</strong>
        <div class="form-group">
          <br/>
          <div class="col-auto">
            <label><strong>Symbol:</strong></label> {{ currCom.symb }}
          </div>
          <br/>
          <div class="col-auto">
            簡稱 :
            <input id="comNm" name="comNm" type="text"
                   class="form-control"
                   v-model="currCom.comNm"/>
          </div>
          <div class="col-auto">
            市場別 :
            <input id="comType" name="comType" type="text"
                   class="form-control"
                   v-model="currCom.comType"/>
          </div>
          <div class="col-auto">
            產業別 :
            <input id="comIndus" name="comIndus" type="text"
                   class="form-control"
                   v-model="currCom.comIndus"/>
          </div>
          <div class="col-auto">
            主要業務 :
            <input id="comMain" name="comMain" type="text"
                   class="form-control"
                   v-model="currCom.comMain"/>
          </div>
          <div class="col-auto">
            相關產業 :
            <input id="comCoted" name="comCoted" type="text"
                   class="form-control"
                   v-model="currCom.comCoted"/>
          </div>
          <div class="col-auto">
            相關概念 :
            <input id="comCep" name="comCep" type="text"
                   class="form-control"
                   v-model="currCom.comCep"/>
          </div>
          <div class="col-auto">
            官方網站 :
            <input id="comOfcl" name="comOfcl" type="text"
                   class="form-control"
                   v-model="currCom.comOfcl"/>
          </div>
        </div>
        <button class="btn btn-outline-info" @click="toShowPage">取消</button>
        <button class="btn btn-success" @click="updateCom">更新</button>
      </div>
    </div>
  </div>
</template>

<script>
import ComInfoService from '../services/cominfo-service'
import EventBus from '../common/EventBus'

export default {
  name: 'ComInfo',
  data () {
    return {
      comList: [],
      currCom: null,
      currIndex: -1,
      isShow: false, // 顯示
      toAdd: false,  // 新增
      toEdit: false, // 編輯
      toDel: false,  // 刪除
      newCom: this.initComInfo(),
      roleArr: this.$store.state.auth.user.roles
    }
  },
  methods: {
    setActiveCom (com, index) {
      this.currCom = com
      this.currIndex = index
      this.toDel = true
      this.toShowPage()
    },
    toAddPage () {
      this.isShow = false
      this.toAdd = true
      this.toEdit = false
    },
    saveCom () {
      let com = {
        symb: this.newCom.symb,
        comNm: this.newCom.comNm,
        comType: this.newCom.comType,
        comIndus: this.newCom.comIndus,
        comMain: this.newCom.comMain,
        comCoted: this.newCom.comCoted,
        comCep: this.newCom.comCep,
        comOfcl: this.newCom.comOfcl
      }
      ComInfoService.save(com).then((res) => {
            if (201 === res.status) {
              this.comList.push(com)
              this.currIndex = this.comList.length - 1
              this.currCom = com
              this.newCom = this.initComInfo()
              this.toShowPage()
            } else {
              alert('新增失敗')
            }
          }, (error) => {
            if (409 === error.status) {
              alert('Symbol : ' + com.symb + ' 重複\n請檢查')
            } else {
              alert('錯誤請檢查:' + error)
            }
          }
      )
    },
    toEditPage () {
      this.isShow = false
      this.toAdd = false
      this.toEdit = true
    },
    updateCom () {
      let comSymb = this.currCom.symb
      let com = {
        comNm: this.currCom.comNm,
        comType: this.currCom.comType,
        comIndus: this.currCom.comIndus,
        comMain: this.currCom.comMain,
        comCoted: this.currCom.comCoted,
        comCep: this.currCom.comCep,
        comOfcl: this.currCom.comOfcl
      }
      ComInfoService.updateCom(comSymb, com).then((res) => {
            if (200 === res.status) {
              this.comList.splice(this.comList.indexOf(this.comList[this.currIndex]), 1)
              com.symb = comSymb
              this.comList.push(com)
              this.currIndex = this.comList.length - 1
              this.currCom = com
              this.toShowPage()
            } else {
              alert('更新失敗')
            }
          }, (error) => {
            alert('錯誤請檢查:' + error)
          }
      )
    },
    toShowPage () {
      this.isShow = true
      this.toAdd = false
      this.toEdit = false
    },
    deleteCom (currSymb) {
      ComInfoService.deleteCom(currSymb).then((res) => {
        if (1 === res.data) {
          this.comList.splice(this.comList.indexOf(this.comList[this.currIndex]), 1)
          this.currCom = null
          this.currIndex = -1
          this.toAdd = false
          this.toEdit = false
          this.toDel = false
        } else {
          alert('刪除失敗')
        }
      }, (error) => {
        alert('錯誤請檢查:' + error)
      })
    },
    initComInfo () {
      return {
        symb: '', comNm: '', comType: '', comIndus: '',
        comMain: '', comCoted: '', comCep: '', comOfcl: ''
      }
    },
    sortComInfo () {
      return this.comList.sort((a, b) => a.symb - b.symb)
    },
    // cogSymb (val) {
    //   console.log('call cogSymb' + val)
    // },
    // cogNm (val) {
    //   console.log('call cogNm' + val)
    // },
    // cogType (val) {
    //   console.log('call cogType' + val)
    // },
    // cogIndus (val) {
    //   console.log('call cogIndus' + val)
    // },
    // cogMain (val) {
    //   console.log('call cogMain' + val)
    // },
    // cogCoted (val) {
    //   console.log('call cogCoted' + val)
    // },
    // cogCep (val) {
    //   console.log('call cogCep' + val)
    // },
  },
  mounted () {
    ComInfoService.getAll()
    .then((res) => {
      this.comList = res.data
      this.sortComInfo()
    }, (error) => {
      if (403 === error.response.status) {
        EventBus.dispatch('logout')
      } else {
        alert('取得資料失敗:' + error)
      }
    })
  }
}
</script>