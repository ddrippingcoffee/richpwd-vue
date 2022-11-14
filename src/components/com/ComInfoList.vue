<template>
  <ul class="list-group">
    <li class="list-group-item"
        v-for="(comInfo, index) in comList" :key="index"
        :class="{ active: index === currIndex }"
        @click="setActiveCom(comInfo, index)">
      {{ comInfo.symb }} : {{ comInfo.comType }} : {{ comInfo.comNm }} : {{ comInfo.comIndus }}
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
</template>

<script>
import Paginate from 'vuejs-paginate-next'

export default {
  name: 'ComInfoList',
  emits: ['pageInfo'],
  data () {
    return {
      comList: [],
      currIndex: -1,
      queryParam: '',
      queryBy: '',
      page: 1,
      pageSize: 0,
      pageSliceLast: 0
    }
  },
  components: {
    Paginate: Paginate,
  },
  props: ['retrieveQueryRslt', 'queryRslt'],
  watch: {
    retrieveQueryRslt (queryRslt) {
      this.queryParam = queryRslt.queryParam
      this.queryBy = queryRslt.queryBy
      if (undefined !== queryRslt.content) {
        // 查詢結果為分頁
        this.comList = queryRslt.content
        if (undefined !== queryRslt.totalPages) {
          // 查詢結果包含總頁數
          this.pageSize = queryRslt.totalPages
        } else {
          // 查詢結果未包含總頁數
          let offset = queryRslt.pageable.offset
          if (0 === offset) {
            // 第一頁
            this.pageSize = (queryRslt.last) ? 1 : 2
          } else {
            if (!queryRslt.last) {
              this.pageSize = (offset / 10) + 2
            }
          }
        }
        // 更新目前頁數
        this.page = (queryRslt.pageable.pageNumber + 1)
        this.currIndex = -1
      }
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
      this.currIndex = -1
    },
    setActiveCom (comInfo, index) {
      this.currCom = comInfo
      this.currIndex = index
    }
  }
}
</script>