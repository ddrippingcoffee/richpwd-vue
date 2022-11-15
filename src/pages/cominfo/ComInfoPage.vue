<template>
  <div class="list row">
    <div class="col-lg-4">
      <ComInfoQuery
          @queryRslt="getQueryRslt($event)"
          :getComByIndusPageInfo="pageInfo"
          :getEditingCondition="isEditing"
          :getAddCondition="isAdding"
          @currComInfo="retrieveCurrComInfo($event)"
      />
      <ComInfoList
          :retrieveQueryRslt="queryRslt"
          @pageInfo="retrieveByPageInfo($event)"
          @currComInfo="retrieveCurrComInfo($event)"
          :getEditingCondition="isEditing"
          :getAddCondition="isAdding"
      />
    </div>
    <div class="col-lg-8">
      <ComInfoAdd
          :getEditingCondition="isEditing"
          @isAdding="retrieveIsAdding($event)"
      />
      <ComInfoEdit
          :getCurrComInfoToEdit="currComInfo"
          @isEditing="retrieveIsEditing($event)"
          :getAddCondition="isAdding"
      />
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
      queryRslt: {},
      pageInfo: {},
      currComInfo: {},
      isEditing: false,
      isAdding: false
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
    },
    retrieveCurrComInfo (data) {
      this.currComInfo = data
    },
    retrieveIsEditing (data) {
      this.isEditing = data
    },
    retrieveIsAdding (data) {
      this.isAdding = data
    }
  }
}
</script>

<style scoped>

</style>