<template>
  <div class="input-group-lg" :hidden="isComEditing || isComAdding">
    <!-- 產業別 -->
    <!-- 產業別 -->
    <!-- 產業別 -->
    <select class="w-100 h5" v-model="selectedIndus"
            @change="getComByIndusSelected($event.target.value)">
      <option value="-" disabled>選擇產業</option>
      <option v-for="indusOption in comIndusOptionList"
              :key="indusOption.comIndus" :value="indusOption.comIndus">
        {{ indusOption.comIndus }}
      </option>
    </select>
    <!-- 個股代號 -->
    <!-- 個股代號 -->
    <!-- 個股代號 -->
    <input type="text" class="w-75 mb-2" placeholder="個股代號"
           ref="symbVal" @keyup.enter="getComBySymbBtn(this.$refs.symbVal.value)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getComBySymbBtn(this.$refs.symbVal.value)">Search
    </button>
    <!-- 公司名稱 -->
    <!-- 公司名稱 -->
    <!-- 公司名稱 -->
    <input type="text" class="w-75 mb-2" placeholder="企業名稱"
           ref="nameVal" @keyup.enter="getComByNmBtn(this.$refs.nameVal.value)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getComByNmBtn(this.$refs.nameVal.value)">Search
    </button>
    <!-- 主要業務 -->
    <!-- 主要業務 -->
    <!-- 主要業務 -->
    <input type="text" class="w-75 mb-2" placeholder="Main Business 主要業務"
           ref="mainVal" @keyup.enter="getComByMainBtn(this.$refs.mainVal.value)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getComByMainBtn(this.$refs.mainVal.value)">Search
    </button>
    <!-- 相關產業 -->
    <!-- 相關產業 -->
    <!-- 相關產業 -->
    <input type="text" class="w-75 mb-2" placeholder="Correlated Industry 相關產業"
           ref="cotedVal" @keyup.enter="getComByCotedBtn(this.$refs.cotedVal.value)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getComByCotedBtn(this.$refs.cotedVal.value)">Search
    </button>
    <!-- 相關概念 -->
    <!-- 相關概念 -->
    <!-- 相關概念 -->
    <input type="text" class="w-75 mb-2" placeholder="Correlated Concept 相關概念"
           ref="cepVal" @keyup.enter="getComByCepBtn(this.$refs.cepVal.value)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getComByCepBtn(this.$refs.cepVal.value)">Search
    </button>
  </div>
</template>

<script>
import ComInfoService from '../../services/cominfo-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'ComInfoQuery',
  emits: ['queryRslt', 'currComInfo', 'comIndusOptionList'],
  data () {
    return {
      comIndusOptionList: [],
      queryRslt: {},
      currComInfo: {},
      selectedIndus: '-',
      isComEditing: false,
      isComAdding: false
    }
  },
  props: ['getComByIndusPageInfo', 'pageInfo',
    'getEditingCondition', 'isEditing',
    'getAddCondition', 'isAdding'],
  watch: {
    getEditingCondition (isEditing) {
      this.isComEditing = isEditing
    },
    getAddCondition (isAdding) {
      this.isComAdding = isAdding
    },
    getComByIndusPageInfo (pageInfo) {
      let queryParam = pageInfo.queryParam
      let queryBy = pageInfo.queryBy
      let page = pageInfo.page

      if ('indus' === queryBy) {
        ComInfoService.getByComIndusPage(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy

          this.$refs.nameVal.value = ''
          this.$refs.mainVal.value = ''
          this.$refs.cotedVal.value = ''
          this.$refs.cepVal.value = ''

          this.$emit('queryRslt', res.data)
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      } else if ('symb' === queryBy) {
        ComInfoService.getBySymbPage(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy
          this.$emit('queryRslt', res.data)

          // 新增的 comInfo symb
          this.$refs.symbVal.value = queryParam

          // this.$refs.symbVal.value = ''
          this.$refs.nameVal.value = ''
          this.$refs.mainVal.value = ''
          this.$refs.cotedVal.value = ''
          this.$refs.cepVal.value = ''
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      } else if ('nm' === queryBy) {
        ComInfoService.getByComNmSlice(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy
          this.$emit('queryRslt', res.data)

          this.$refs.symbVal.value = ''
          // this.$refs.nameVal.value=''
          this.$refs.mainVal.value = ''
          this.$refs.cotedVal.value = ''
          this.$refs.cepVal.value = ''
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      } else if ('main' === queryBy) {
        ComInfoService.getByComMainPage(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy
          this.$emit('queryRslt', res.data)

          this.$refs.symbVal.value = ''
          this.$refs.nameVal.value = ''
          // this.$refs.mainVal.value=''
          this.$refs.cotedVal.value = ''
          this.$refs.cepVal.value = ''
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      } else if ('coted' === queryBy) {
        ComInfoService.getByComCotedPage(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy
          this.$emit('queryRslt', res.data)

          this.$refs.symbVal.value = ''
          this.$refs.nameVal.value = ''
          this.$refs.mainVal.value = ''
          // this.$refs.cotedVal.value=''
          this.$refs.cepVal.value = ''
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      } else if ('cep' === queryBy) {
        ComInfoService.getByComCepPage(queryParam, page)
        .then((res) => {
          res.data.queryParam = queryParam
          res.data.queryBy = queryBy
          this.$emit('queryRslt', res.data)

          this.$refs.symbVal.value = ''
          this.$refs.nameVal.value = ''
          this.$refs.mainVal.value = ''
          this.$refs.cotedVal.value = ''
          // this.$refs.cepVal.value=''
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          alert('錯誤 : ' + errMsg)
        })
      }
    }
  },
  methods: {
    getComByIndusSelected (val) {
      ComInfoService.getByComIndusPage(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'indus'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        // this.selectedIndus = '-'
        this.$refs.symbVal.value = ''
        this.$refs.nameVal.value = ''
        this.$refs.mainVal.value = ''
        this.$refs.cotedVal.value = ''
        this.$refs.cepVal.value = ''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComBySymbBtn (val) {
      ComInfoService.getBySymbPage(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'symb'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        this.selectedIndus = '-'
        // this.$refs.symbVal.value=''
        this.$refs.nameVal.value = ''
        this.$refs.mainVal.value = ''
        this.$refs.cotedVal.value = ''
        this.$refs.cepVal.value = ''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComByNmBtn (val) {
      ComInfoService.getByComNmSlice(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'nm'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        this.selectedIndus = '-'
        this.$refs.symbVal.value = ''
        // this.$refs.nameVal.value=''
        this.$refs.mainVal.value = ''
        this.$refs.cotedVal.value = ''
        this.$refs.cepVal.value = ''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComByMainBtn (val) {
      ComInfoService.getByComMainPage(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'main'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        this.selectedIndus = '-'
        this.$refs.symbVal.value = ''
        this.$refs.nameVal.value = ''
        // this.$refs.mainVal.value=''
        this.$refs.cotedVal.value = ''
        this.$refs.cepVal.value = ''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComByCotedBtn (val) {
      ComInfoService.getByComCotedPage(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'coted'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        this.selectedIndus = '-'
        this.$refs.symbVal.value = ''
        this.$refs.nameVal.value = ''
        this.$refs.mainVal.value = ''
        // this.$refs.cotedVal.value=''
        this.$refs.cepVal.value = ''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComByCepBtn (val) {
      ComInfoService.getByComCepPage(val, 0)
      .then((res) => {
        res.data.queryParam = val
        res.data.queryBy = 'cep'
        this.$emit('queryRslt', res.data)
        this.$emit('currComInfo', {})

        this.selectedIndus = '-'
        this.$refs.symbVal.value = ''
        this.$refs.nameVal.value = ''
        this.$refs.mainVal.value = ''
        this.$refs.cotedVal.value = ''
        // this.$refs.cepVal.value=''
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        }
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
  },
  mounted () {
    ComInfoService.getComIndusList()
    .then((res) => {
      this.comIndusOptionList = res.data
      this.$emit('comIndusOptionList', this.comIndusOptionList)
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