<template>
  <div class="list row">
    <div class="col-md-4">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search by indus"
               v-model="searchIndus"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
                  @click="page = 1; retrieveComInfos();">
            Search
          </button>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div class="mb-3">
        Items per Page:
        <select v-model="pageDesc" @change="handlePageDescChange($event)">
          <option v-for="pageDesc in pageDescOptions" :key="pageDesc" :value="pageDesc">
            {{ pageDesc }}
          </option>
        </select>
      </div>
      <paginate
          v-model="page"
          :page-count="pageSize"
          :page-range="3"
          :margin-pages="2"
          :click-handler="handlePageChange"
          :prev-text="'<'"
          :next-text="'>'"
          :first-last-button="true"
          :first-button-text="'<<'"
          :last-button-text="'>>'"
          :container-class="'pagination'"
          :page-class="'page-item'"
      >
      </paginate>
    </div>

    <div class="col-md-6">
      <h4>Tutorials List</h4>
      <ul class="list-group" id="comIndo-list">
        <li class="list-group-item"
            :class="{ active: index === currIndex }"
            v-for="(comIndo, index) in comList" :key="index"
            @click="setActiveTutorial(comIndo, index)">
          {{ comIndo.comNm }}
        </li>
      </ul>
    </div>

    <div class="col-md-6">
      <div v-if="currCom">
        <div>
          <label><strong>symb:</strong></label> {{ currCom.symb }}
        </div>
        <div>
          <label><strong>comNm:</strong></label>
          {{ currCom.comNm }}
        </div>
        <div>
          <label><strong>comType:</strong></label>
          {{ currCom.comType }}
        </div>

        <!--        <a-->
        <!--            class="badge badge-warning"-->
        <!--            :href="'/tutorials/' + currentTutorial.id"-->
        <!--        >-->
        <!--          Edit-->
        <!--        </a>-->
        <!--      </div>-->
        <!--      <div v-else>-->
        <!--        <br/>-->
        <!--        <p>Please click on a Tutorial...</p>-->
      </div>
    </div>
  </div>
  <br/>
</template>

<script>
import ComInfoService from '../services/cominfo-service'
import Paginate from 'vuejs-paginate-next'
// import EventBus from '../common/EventBus'

export default {
  name: 'ComInfoPage',
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
      roleArr: this.$store.state.auth.user.roles,
      searchIndus: '',
      page: 1,
      pageSize: 0,
      pageDesc: 'desc',
      pageDescOptions: ['asc', 'desc']
    }
  },
  components: {
    paginate: Paginate,
  },
  methods: {
    getRequestParams () {
      return {
        'indus': this.searchIndus,
        'page': this.page - 1,
        'size': 10,
        'desc': this.pageDesc
      }
    },
    retrieveComInfos () {
      ComInfoService.getByComIndusPage(this.getRequestParams())
      .then((res) => {
        let data = res.data
        this.comList = data.content
        this.pageSize = data.totalPages
      })
    },
    handlePageChange (value) {
      this.page = value
      this.retrieveComInfos()
    },
    handlePageDescChange (event) {
      this.pageDesc = event.target.value
      this.page = 1
      this.retrieveComInfos()
    },
    setActiveTutorial (comInfo, index) {
      this.currCom = comInfo
      this.currIndex = index
    },
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
            let errMsg = 'Oops! Something went wrong'
            if (error.response.data.message) {
              errMsg = error.response.data.message
            }
            if (error.response.data.errors) {
              error.response.data.errors.forEach(err => {
                errMsg += '\n'
                errMsg += err.defaultMessage
              })
            }
            alert('錯誤 : ' + errMsg)
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
            alert('Oops! Something went wrong: \n' + error)
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
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        if (error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            errMsg += '\n'
            errMsg += err.defaultMessage
          })
        }
        alert('錯誤 : ' + errMsg)
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
  },
  mounted () {
    let typeParam = { 'type': '市', 'page': 0, 'size': 99, 'desc': 'desc' }
    ComInfoService.getByComTypePage(typeParam)
    .then((res) => {
      // let data = res.data
      // console.log(data)
      console.log(res)
    })
    console.log('=======================================================')
    let cotedParam = { 'coted': 'IC', 'page': 0, 'size': 99, 'desc': 'desc' }
    ComInfoService.getByComCotedPage(cotedParam)
    .then((res) => {
      // let data = res.data
      // console.log(data)
      console.log(res)
    })
  }
}
</script>