<template>
  <div class="list row">
    <div class="col-lg-4">
      <StEntryQuery
          @activeEntryPage="retrieveActiveEntryPage($event)"
          @activeEntryContent="retrieveActiveEntryContent($event)"
          :getPageInfo="pageInfo"
          :getAddCondition="isAdding"
      />
      <StEntryList
          :getActiveEntryPage="activeEntryPage"
          @pageInfo="retrieveByPageInfo($event)"
          :getAddCondition="isAdding"
      />
    </div>
    <div class="col-lg-8">
      <StEntryAdd
          @isAdding="retrieveIsAdding($event)"
          @pageInfo="retrieveByPageInfo($event)"
      />
      <StEntryView
          :getActiveEntryContent="activeEntryContent"
          :getAddCondition="isAdding"
      />
    </div>
  </div>
</template>

<script>
import StEntryQuery from '@/components/entry/StEntryQuery'
import StEntryList from '@/components/entry/StEntryList'
import StEntryAdd from '@/components/entry/StEntryAdd'
import StEntryView from '@/components/entry/StEntryView'

export default {
  name: 'StEntryPage',
  components: { StEntryQuery, StEntryList, StEntryAdd, StEntryView },
  data () {
    return {
      activeEntryPage: {},
      activeEntryContent: {},
      pageInfo: {},
      isAdding: false
    }
  },
  methods: {
    retrieveActiveEntryPage (data) {
      this.activeEntryPage = data
    },
    retrieveActiveEntryContent (data) {
      this.activeEntryContent = data
    },
    retrieveByPageInfo (data) {
      this.pageInfo = data
    },
    retrieveIsAdding (data) {
      this.isAdding = data
    }
  }
}
</script>

<style scoped>

</style>