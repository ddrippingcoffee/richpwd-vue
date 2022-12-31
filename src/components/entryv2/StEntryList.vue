<template>
  <div :hidden="isPageEmpty">
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitch1" @change="hideOldEntry">
      <label class="custom-control-label" for="customSwitch1">僅顯示 Active</label>
    </div>
    <ul class="list-group mt-2">
      <li class="list-group-item fa-1x font-weight-bold"
          v-for="(entry, index) in currEntryInfo" :key="index"
          :class="{ active: index === currIndex }"
          :style="[index !== currIndex && entry.delDtm === null ? {'background': '#f5f6fa','color': '#000000'} : {'':''}]"
          @click="setActiveEntry(entry, index)" :hidden="isOldHidden && entry.delDtm">
        {{ entry.dtmMsg }} <small class="float-right" v-if="entry.delDtm">舊</small>
      </li>
    </ul>
    <paginate
        v-model="page"
        :page-count="pageSize"
        :page-range="3"
        :click-handler="handlePageChange"
        :prev-text="'<'"
        :next-text="'>'"
        :container-class="'pagination pagination-md'"
        :first-last-button="true"
        :first-button-text="'<<'"
        :last-button-text="'>>'"
        :hidden="isPageEmpty"
    >
    </paginate>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next'
import Moment from 'moment'

export default {
  name: 'StEntryList',
  emits: ['currEntryPage', 'currEntryData',],
  data () {
    return {
      currEntryInfo: {},
      currIndex: -1,
      currSymb: '',
      page: 1,
      pageSize: 0,
      isPageEmpty: true,
      isOldHidden: false,
    }
  },
  components: {
    Paginate: Paginate,
  },
  props: ['setListHidden', 'listHidden', 'setEntryPage', 'entryInfo',],
  watch: {
    setListHidden (listHidden) {
      this.isPageEmpty = listHidden
    },
    setEntryPage (entryInfo) {
      this.buildValue(entryInfo.content)
      this.currEntryInfo = entryInfo.content
      this.pageSize = entryInfo.totalPages
      // 更新目前頁數
      this.page = (entryInfo.pageable.pageNumber + 1)
      this.currSymb = this.currEntryInfo[0].symb

      this.currIndex = -1
    }
  },
  methods: {
    buildValue (content) {
      content.forEach(e => {
        let dtmMsg = ''
        dtmMsg = Moment(e.c8tDtm).format('YYMMDD-hh:mm')
        dtmMsg += this.setFutureDateMark(e.stDtlList)
        dtmMsg += this.setDtlStat(e.stDtlList)
        e.dtmMsg = dtmMsg
      })
    },
    setFutureDateMark (dtlList) {
      for (let i = 0; i < dtlList.length; i++) {
        if ('date' === dtlList[i].dtlTy) {
          if (/^\d\d\d\d\d\d$/.test(dtlList[i].dtlInfo)) {
            if (Moment(dtlList[i].dtlInfo, 'YYMMDD').isSameOrAfter()) {
              return ' ＊ '
            }
          } else if (/^\d\d\d\d\/\d\d\/\d\d$/.test(dtlList[i].dtlInfo)) {
            if (Moment(new Date(dtlList[i].dtlInfo)).isSameOrAfter()) {
              return ' ＊ '
            }
          }
        }
      }
      return ''
    },
    setDtlStat (dtlList) {
      let note = 0
      let date = 0
      let link = 0
      for (let i = 0; i < dtlList.length; i++) {
        if ('note' === dtlList[i].dtlTy) {
          note++
        } else if ('date' === dtlList[i].dtlTy) {
          date++
        } else if ('link' === dtlList[i].dtlTy) {
          link++
        }
      }
      let msg = '  '
      if (note !== 0) {
        msg += note + ' note '
      }
      if (date !== 0) {
        msg += date + ' date '
      }
      if (link !== 0) {
        msg += link + ' link'
      }
      return msg
    },
    hideOldEntry () {
      this.isOldHidden = !this.isOldHidden
    },
    handlePageChange (value) {
      this.page = value
      this.$emit('currEntryPage', { 'symb': this.currSymb, 'page': (this.page - 1) })
      this.currIndex = -1
    },
    setActiveEntry (entry, index) {
      this.currIndex = index
      this.$emit('currEntryData', entry)
    }
  }
}
</script>

<style scoped>

</style>