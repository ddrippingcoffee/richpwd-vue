<template>
  <div :hidden="isEntryAdding">
    <ul class="list-group">
      <li class="list-group-item fa-1x font-weight-bold"
          v-for="(entry, index) in currEntryPage" :key="index">
        {{ entry.c8tDtm }} : {{ entry.symb }} : {{ entry.comNm }}
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
      if (undefined !== activeEntryPage.content) {
        this.currEntryPage = activeEntryPage.content
        if (undefined !== activeEntryPage.totalPages) {
          this.pageSize = activeEntryPage.totalPages
        }
      }
    },
    getAddCondition (isAdding) {
      this.isEntryAdding = isAdding
    },
  },
  methods: {
    getRequestParams () {
      return {
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