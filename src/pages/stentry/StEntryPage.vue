<template>
  <div class="list row justify-content-center mt-5">
    <div class="col-lg-5">
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
      <StEntryImg :getImgEvent="imgEvent"/>
    </div>
    <div class="col-lg-5">
      <StEntryAdd
          @isAdding="retrieveIsAdding($event)"
          @pageInfo="retrieveByPageInfo($event)"
          @imgEvent="retrieveImgEvent($event)"
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
import StEntryImg from '@/components/entry/StEntryImg.vue'

export default {
  name: 'StEntryPage',
  components: { StEntryImg, StEntryQuery, StEntryList, StEntryAdd, StEntryView },
  data () {
    return {
      activeEntryPage: {},
      activeEntryContent: {},
      pageInfo: {},
      isAdding: false,
      imgEvent: {},
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
    },
    retrieveImgEvent (data) {
      this.imgEvent = data
    }
  }
}
</script>

<style scoped>

</style>