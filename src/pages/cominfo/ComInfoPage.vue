<template>
  <div class="list row">
    <div class="col-lg-4">
      <ComInfoQuery
          @queryRslt="getQueryRslt($event)"
          :getComByIndusPageInfo="pageInfo"
      />
      <ComInfoList
          :retrieveQueryRslt="queryRslt"
          @pageInfo="retrieveByPageInfo($event)"
      />
    </div>
    <div class="col-lg-8">
      <ComInfoAdd/>
      <ComInfoEdit/>
    </div>
  </div>
</template>

<script>
import ComInfoQuery from '../../components/com/ComInfoQuery'
import ComInfoList from '../../components/com/ComInfoList'
import ComInfoAdd from '../../components/com/ComInfoAdd'
import ComInfoEdit from '../../components/com/ComInfoEdit'

export default {
  name: 'ComInfoPage',
  data () {
    return {
      'queryRslt': {},
      'pageInfo': {}
    }
  },
  components: {
    ComInfoQuery,
    ComInfoList,
    ComInfoAdd,
    ComInfoEdit
  },
  methods: {
    getQueryRslt (data) {
      this.queryRslt = data
    },
    retrieveByPageInfo (data) {
      this.pageInfo = data
    }
  }
}
</script>

<style scoped>

</style>