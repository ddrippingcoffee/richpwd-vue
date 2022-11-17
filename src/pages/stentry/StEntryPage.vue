<template>
  <div class="list row">
    <div class="col-lg-4">
      <StEntryQuery
          @activeEntryPage="retrieveActiveEntryPage($event)"
          @activeEntryContent="retrieveActiveEntryContent($event)"
          :getPageInfo="pageInfo"
      />
      <StEntryList
          :getActiveEntryPage="activeEntryPage"
          @pageInfo="retrieveByPageInfo($event)"
      />
    </div>
    <div class="col-lg-8">
      <StEntryAdd/>
      <StEntryView
          :getActiveEntryContent="activeEntryContent"
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
    }
  }
}
</script>

<style scoped>

</style>