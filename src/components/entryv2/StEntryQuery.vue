<template>
  <div>
    <input type="text" class="w-75 mb-2" placeholder="個股代號"
           ref="symbVal" @keyup.enter="getEntryBySymbBtn(this.$refs.symbVal.value,0)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getEntryBySymbBtn(this.$refs.symbVal.value,0)">Search
    </button>
    <input type="text" class="w-75 mb-2" placeholder="企業名稱"
           ref="nameVal" @keyup.enter="getEntryByNmBtn(this.$refs.nameVal.value,0)"/>
    <button class="btn-outline-secondary w-25" type="button"
            @click="getEntryByNmBtn(this.$refs.nameVal.value,0)">Search
    </button>
  </div>
</template>

<script>
import StEntryService from '@/services/stentry-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'StEntryQuery',
  emits: ['entryTotalPage',
    'entryInfo',
  ],
  data () {
    return {
      entryTotalPage: {},
    }
  },
  props: ['setTotalPageInfo', 'totalPageInfo',
    'queryCurrEntry', 'currEntryInfo',
    'getEntryData', 'entryPage',
  ],
  watch: {
    setTotalPageInfo (totalPageInfo) {
      let queryParam = totalPageInfo.queryParam
      let queryBy = totalPageInfo.queryBy
      let page = totalPageInfo.page
      if ('init' === queryBy) {
        this.getTotalEntry(totalPageInfo)
      } else if ('symb' === queryBy) {
        this.getEntryBySymbBtn(queryParam, page)
      } else if ('nm' === queryBy) {
        this.getEntryByNmBtn(queryParam, page)
      }
    },
    queryCurrEntry (currEntryInfo) {
      this.getOneEntry(currEntryInfo)
    },
    getEntryData (entryPage) {
      this.getOneEntry(entryPage)
    },
  },
  methods: {
    getTotalEntry (pageInfo) {
      StEntryService.getTotalEntryPage(pageInfo.page)
      .then((res) => {
        this.entryTotalPage = res.data
        this.entryTotalPage.queryBy = pageInfo.queryBy
        this.entryTotalPage.queryParam = pageInfo.queryParam

        this.$emit('entryTotalPage', this.entryTotalPage)
      }, (error) => {
        this.handleErr(error)
      })
    },
    getOneEntry (currEntryInfo) {
      StEntryService.getOneEntryPage(currEntryInfo.symb, currEntryInfo.page)
      .then((res) => {
        let data = res.data
        this.$emit('entryInfo', data)
      }, (error) => {
        this.handleErr(error)
      })
    },
    getEntryBySymbBtn (val, page) {
      StEntryService.getTotalEntryBySymbSlice(val, page)
      .then((res) => {
        this.entryTotalPage = res.data
        this.entryTotalPage.queryBy = 'symb'
        this.entryTotalPage.queryParam = val

        this.$emit('entryTotalPage', this.entryTotalPage)
      }, (error) => {
        this.handleErr(error)
      })
      // 新增後直接查詢並替換 input value
      this.$refs.symbVal.value = val
      this.$refs.nameVal.value = ''
    },
    getEntryByNmBtn (val, page) {
      StEntryService.getTotalEntryByComNmSlice(val, page)
      .then((res) => {
        this.entryTotalPage = res.data
        this.entryTotalPage.queryBy = 'nm'
        this.entryTotalPage.queryParam = val

        this.$emit('entryTotalPage', this.entryTotalPage)
      }, (error) => {
        this.handleErr(error)
      })
      this.$refs.symbVal.value = ''
    },
    handleErr (error) {
      if (403 === error.response.status) {
        EventBus.dispatch('logout')
      } else {
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
    },
    init () {
      this.getTotalEntry({ 'queryBy': 'init', 'queryParam': '', 'page': 0 })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>