<template>
  <div :hidden="isEntryAdding">
    <ul class="list-group">
      <li class="list-group-item fa-1x font-weight-bold"
          v-for="(entry, index) in currEntryPage" :key="index">
        {{ entry.c8tDtm }} : {{ entry.symb }} : {{ entry.comNm }} <small v-if="entry.delDtm">舊</small>
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
    >
    </paginate>
  </div>
</template>

<script>

import Paginate from 'vuejs-paginate-next'

export default {
  name: 'StEntryList',
  emits: ['pageInfo'],
  data () {
    return {
      currEntryPage: {},
      queryParam: '',
      queryBy: '',
      page: 1,
      pageSize: 0,
      isEntryAdding: false
    }
  },
  components: {
    Paginate: Paginate,
  },
  props: ['getActiveEntryPage', 'activeEntryPage',
    'getAddCondition', 'isAdding'],
  watch: {
    getActiveEntryPage (activeEntryPage) {
      this.queryParam = activeEntryPage.queryParam
      this.queryBy = activeEntryPage.queryBy
      if (undefined !== activeEntryPage.content) {
        this.currEntryPage = activeEntryPage.content
        if (undefined !== activeEntryPage.totalPages) {
          // 查詢結果包含總頁數
          this.pageSize = activeEntryPage.totalPages
        } else {
          // 查詢結果未包含總頁數
          let offset = activeEntryPage.pageable.offset
          if (0 === offset) {
            // 第一頁
            this.pageSize = (activeEntryPage.last) ? 1 : 2
          } else {
            if (!activeEntryPage.last) {
              this.pageSize = (offset / 3) + 2
            }
          }
        }
        // 更新目前頁數
        this.page = (activeEntryPage.pageable.pageNumber + 1)
      }
    },
    getAddCondition (isAdding) {
      this.isEntryAdding = isAdding
    },
  },
  methods: {
    getRequestParams () {
      return {
        'queryParam': this.queryParam,
        'queryBy': this.queryBy,
        'page': this.page - 1,
      }
    },
    handlePageChange (value) {
      this.page = value
      this.$emit('pageInfo', this.getRequestParams())
    }
  }
}
</script>

<style scoped>

</style>