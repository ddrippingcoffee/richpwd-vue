<template>
  <div :hidden="isPageEmpty">
    <ul class="list-group">
      <li class="list-group-item fa-1x font-weight-bold"
          v-for="(entry, index) in currEntryInfo" :key="index"
          :class="{ active: index === currIndex }"
          :style="[index !== currIndex && entry.delDtm === null ? {'background': '#f5f6fa','color': '#000000'} : {'':''}]"
          @click="setActiveEntry(entry, index)">
        {{ entry.c8tDtm }} <small class="float-right" v-if="entry.delDtm">舊</small>
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
      this.currEntryInfo = entryInfo.content
      this.pageSize = entryInfo.totalPages
      // 更新目前頁數
      this.page = (entryInfo.pageable.pageNumber + 1)
      this.currSymb = this.currEntryInfo[0].symb

      this.currIndex = -1
    }
  },
  methods: {
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