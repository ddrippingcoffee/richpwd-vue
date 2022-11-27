<template>
  <div :hidden="isEntryAdding">
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
  emits: ['activeEntryPage', 'activeEntryContent'],
  data () {
    return {
      activeEntryPage: {},
      activeEntryContent: {},
      isEntryAdding: false
    }
  },
  props: ['getPageInfo', 'pageInfo',
    'getAddCondition', 'isAdding'],
  watch: {
    getPageInfo (pageInfo) {
      let queryParam = pageInfo.queryParam
      let queryBy = pageInfo.queryBy
      let page = pageInfo.page
      if ('init' === queryBy) {
        this.getEntryData(pageInfo)
      } else if ('symb' === queryBy) {
        this.getEntryBySymbBtn(queryParam, page)
      } else if ('nm' === queryBy) {
        this.getEntryByNmBtn(queryParam, page)
      }
    },
    getAddCondition (isAdding) {
      this.isEntryAdding = isAdding
    },
  },
  methods: {
    displayDbImg (uid) {
      return StEntryService.getFileDbImg64(uid)
      .then((res) => {
            return res.data
          }, (error) => {
            console.log(error)
          }
      )
    },
    displayFdImg (uid) {
      return StEntryService.getFileFdImg64(uid)
      .then((res) => {
            return res.data
          }, (error) => {
            console.log(error)
          }
      )
    },
    getEntryData (pageInfo) {
      StEntryService.getActiveEntryPage(pageInfo.page)
      .then((res) => {
        this.activeEntryPage = res.data
        this.activeEntryPage.queryBy = pageInfo.queryBy
        this.activeEntryPage.queryParam = pageInfo.queryParam
        this.activeEntryContent = this.activeEntryPage.content

        this.$emit('activeEntryPage', this.activeEntryPage)
        this.$emit('activeEntryContent', this.activeEntryContent)
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        } else {
          alert('取得資料失敗:' + error)
        }
      }).then(() => {
        this.getEntryFile()
      })
    },
    getEntryFile () {
      this.activeEntryContent.forEach(entry => {
        StEntryService.getEntryFileList(entry.symb, entry.c8tDtm)
        .then((res) => {
          entry.entryFileInfo = res.data
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          } else {
            alert('取得資料失敗:' + error)
          }
        })
        .then(() => {
          entry.entryFileInfo.fileDbInfoList.forEach(dbInfo => {
            if ('image' === dbInfo.dbFileTy.substring(0, 5))
              this.displayDbImg(dbInfo.uid)
              .then((res) => {
                dbInfo.base64ImgStr = res
              })
          })
        })
        .then(() => {
          entry.entryFileInfo.fileFdInfoList.forEach(fdInfo => {
            fdInfo['fdFileNm'] = fdInfo['fdFileNm'].substring(15)
            if ('image' === fdInfo.fdFileTy.substring(0, 5))
              this.displayFdImg(fdInfo.uid)
              .then((res) => {
                fdInfo.base64ImgStr = res
              })
          })
        })
        .then(() => {
          // 檢查用
          // console.log(entry.entryFileInfo.fileFdInfoList)
          // console.log(entry.entryFileInfo.fileDbInfoList)
        })
      })
    },
    getEntryBySymbBtn (val, page) {
      StEntryService.getAllEntryBySymbSlice(val, page)
      .then((res) => {
        this.activeEntryPage = res.data
        this.activeEntryPage.queryBy = 'symb'
        this.activeEntryPage.queryParam = val
        this.activeEntryContent = this.activeEntryPage.content
        this.$emit('activeEntryPage', this.activeEntryPage)
        this.$emit('activeEntryContent', this.activeEntryContent)
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        } else {
          alert('取得資料失敗:' + error)
        }
      }).then(() => {
        this.getEntryFile()
      })
      this.$refs.nameVal.value = ''
    },
    getEntryByNmBtn (val, page) {
      StEntryService.getAllEntryByComNmSlice(val, page)
      .then((res) => {
        this.activeEntryPage = res.data
        this.activeEntryPage.queryBy = 'nm'
        this.activeEntryPage.queryParam = val
        this.activeEntryContent = this.activeEntryPage.content
        this.$emit('activeEntryPage', this.activeEntryPage)
        this.$emit('activeEntryContent', this.activeEntryContent)
      }, (error) => {
        if (403 === error.response.status) {
          EventBus.dispatch('logout')
        } else {
          alert('取得資料失敗:' + error)
        }
      }).then(() => {
        this.getEntryFile()
      })
      this.$refs.symbVal.value = ''
    },
    init () {
      this.getEntryData({ 'queryBy': 'init', 'queryParam': '', 'page': 0 })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>