<template>
  <div class="row justify-content-center mt-5">
    <div class="row justify-content-center col-lg-5"
         :hidden="0 !== Object.keys(imgEvent).length">
      <div class="col-lg-6" :hidden="isEntryAdding">
        <StEntryQuery
            @entryTotalPage="getEntryTotalPage($event)"
            :setTotalPageInfo="totalPageInfo"
            :queryCurrEntry="currEntryInfo"
            @entryInfo="getEntryInfo($event)"
            :getEntryData="entryPage"
        />
        <StEntryTotal
            :setEntryTotalPage="entryTotalPage"
            @pageInfo="getTotalPageInfo($event)"
            @currEntryInfo="getCurrEntryInfo($event)"
        />
      </div>
      <div class="col-lg-6" :hidden="isEntryAdding">
        <StEntryList
            :setListHidden="listHidden"
            :setEntryPage="entryInfo"
            @currEntryPage="getCurrEntryPage($event)"
            @currEntryData="getCurrEntryData($event)"
        />
      </div>
    </div>
    <div class="row justify-content-center col-lg-5" :hidden="0 === Object.keys(imgEvent).length">
      <StEntryImg :getImgEvent="imgEvent"/>
    </div>
    <div class="col-lg-5">
      <StEntryAdd
          @isEntryAdding="getEntryAddingCondition($event)"
          @imgEvent="getImgEvent($event)"
          @pageInfo="getTotalPageInfo($event)"
      />
      <div :hidden="isEntryAdding">
        <StEntryView
            :setViewHidden="viewHidden"
            :setEntryData="entryData"
            @imgEvent="getImgEvent($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import StEntryQuery from '@/components/entryv2/StEntryQuery'
import StEntryTotal from '@/components/entryv2/StEntryTotal.vue'
import StEntryList from '@/components/entryv2/StEntryList'
import StEntryView from '@/components/entryv2/StEntryView'
import StEntryAdd from '@/components/entryv2/StEntryAdd'
import StEntryImg from '@/components/entryv2/StEntryImg'

export default {
  name: 'StEntryPage',
  components: { StEntryQuery, StEntryTotal, StEntryList, StEntryView, StEntryAdd, StEntryImg },
  data () {
    return {
      listHidden: null,
      viewHidden: null,
      entryTotalPage: {},
      totalPageInfo: {},
      currEntryInfo: {},
      entryInfo: {},
      entryPage: {},
      entryData: {},
      isEntryAdding: false,
      imgEvent: {},
    }
  },
  methods: {
    setListHidden (isHidden) {
      this.listHidden = isHidden
    },
    setViewHidden (isHidden) {
      this.viewHidden = isHidden
    },
    getEntryTotalPage (data) {
      this.entryTotalPage = data
      this.setListHidden(true)
      this.setViewHidden(true)
    },
    getTotalPageInfo (data) {
      this.totalPageInfo = data
      this.setListHidden(true)
      this.setViewHidden(true)
    },
    getCurrEntryInfo (data) {
      this.currEntryInfo = data
      this.setListHidden(false)
      this.setViewHidden(true)
    },
    getEntryInfo (data) {
      this.entryInfo = data
    },
    getCurrEntryPage (data) {
      this.entryPage = data
      this.setViewHidden(true)
    },
    getCurrEntryData (data) {
      this.entryData = data
      this.setViewHidden(false)
    },
    getEntryAddingCondition (data) {
      this.isEntryAdding = data
    },
    getImgEvent (data) {
      this.imgEvent = data
    },
  },
}
</script>

<style scoped>

</style>