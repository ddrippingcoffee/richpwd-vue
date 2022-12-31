<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item fa-1x font-weight-bold"
          v-for="(entry, index) in currEntryPage" :key="index"
          :class="{ active: index === currIndex }"
          :style="[index !== currIndex && entry.actSum > 0 ? {'background': '#f5f6fa','color': '#000000'} : {'':''}]"
          @click="setActiveEntry(entry, index)">
        {{ entry.symb }} : Act {{ entry.actSum }} : Old {{ entry.oldSum }} : All {{ entry.entrySum }} :
        {{ entry.comNm }}
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
  name: 'StEntryTotal',
  emits: ['pageInfo', 'currEntryInfo'],
  data () {
    return {
      currEntryPage: {},
      currIndex: -1,
      queryParam: '',
      queryBy: '',
      page: 1,
      pageSize: 0,
    }
  },
  components: {
    Paginate: Paginate,
  },
  props: ['setEntryTotalPage', 'entryTotalPage',],
  watch: {
    setEntryTotalPage (entryTotalPage) {
      this.queryParam = entryTotalPage.queryParam
      this.queryBy = entryTotalPage.queryBy
      if (undefined !== entryTotalPage.content) {
        this.currEntryPage = entryTotalPage.content
        if (undefined !== entryTotalPage.totalPages) {
          // 查詢結果包含總頁數
          this.pageSize = entryTotalPage.totalPages
        } else {
          // 查詢結果未包含總頁數
          let offset = entryTotalPage.pageable.offset
          if (0 === offset) {
            // 第一頁
            this.pageSize = (entryTotalPage.last) ? 1 : 2
          } else {
            if (!entryTotalPage.last) {
              this.pageSize = (offset / 3) + 2
            }
          }
        }
        // 更新目前頁數
        this.page = (entryTotalPage.pageable.pageNumber + 1)
        this.currIndex = -1
      }
    }
  },
  methods: {
    getReqParams () {
      return {
        'queryParam': this.queryParam,
        'queryBy': this.queryBy,
        'page': this.page - 1,
      }
    },
    handlePageChange (value) {
      this.page = value
      this.$emit('pageInfo', this.getReqParams())
      this.currIndex = -1
    },
    setActiveEntry (currEntry, index) {
      this.currIndex = index
      currEntry.page = 0
      this.$emit('currEntryInfo', currEntry)
    }
  }
}
</script>

<style scoped>

</style>