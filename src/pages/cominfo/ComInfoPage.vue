<template>
  <div class="list row justify-content-center">
    <div class="col-lg-5">
      <ComInfoQuery
          @queryRslt="getQueryRslt($event)"
          :getComByIndusPageInfo="pageInfo"
          :getEditingCondition="isEditing"
          :getAddCondition="isAdding"
          @currComInfo="retrieveCurrComInfo($event)"
          @comIndusOptionList="retrieveComIndusOptionList($event)"
      />
      <ComInfoList
          :retrieveQueryRslt="queryRslt"
          @pageInfo="retrieveByPageInfo($event)"
          @currComInfo="retrieveCurrComInfo($event)"
          :getEditingCondition="isEditing"
          :getAddCondition="isAdding"
      />
    </div>
    <div class="col-lg-5">
      <ComInfoAdd
          :getEditingCondition="isEditing"
          @isAdding="retrieveIsAdding($event)"
          :getComIndusOptionList="comIndusOptionList"
          @pageInfo="retrieveByPageInfo($event)"
      />
      <ComInfoEdit
          :getCurrComInfoToEdit="currComInfo"
          @isEditing="retrieveIsEditing($event)"
          :getAddCondition="isAdding"
          :getComIndusOptionList="comIndusOptionList"
          :getCurrPageInfo="currPageInfo"
          @pageInfo="retrieveByPageInfo($event)"
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
      currPageInfo: {},
      currComInfo: {},
      isEditing: false,
      isAdding: false,
      comIndusOptionList: []
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
      this.currPageInfo = { 'queryParam': this.queryRslt.queryParam, 'queryBy': this.queryRslt.queryBy }
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
    },
    retrieveComIndusOptionList (data) {
      this.comIndusOptionList = data
    }
  }
}
</script>

<style scoped>

</style>