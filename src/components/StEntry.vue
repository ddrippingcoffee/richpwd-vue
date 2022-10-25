<template>
  <br/>
  <div class="row">
    <div class="col" v-if="!toAdd">
      <ul class="list-group">
        <li class="list-group-item border-top-0 border-right-0 border-left-0"
            style="border-width:5px"
            v-for="(comEntry,entryIndex) in activeComEntryVoList"
            :key="entryIndex">
          <strong>{{ comEntry.stEntry.symb }} : {{ comEntry.comType }} {{ comEntry.comNm }}</strong><br/>
          建立時間 : {{ comEntry.stEntry.c8tDtm }} <br/>
          {{ comEntry.comIndus }}
          <button class="btn btn-outline-danger btn-sm float-right"
                  @click="deleteEntry(comEntry.stEntry.symb,comEntry.stEntry.c8tDtm)">
            刪除
          </button>
          <ul class="list-group">
            <li class="list-group-item border-top-0 border-right-0 border-left-0"
                v-for="(dtl,dtlIndex) in comEntry.stEntry.stDtlList"
                :key="dtlIndex">
              <div v-if="'date' === dtl.dtlTy">
                {{ dtl.dtlBrf }} : <strong>{{ dtl.dtlInfo }}</strong>
                <div v-if="dtl.dtlDes">
                  Des : {{ dtl.dtlDes }}
                </div>
              </div>
              <div v-if="'note' === dtl.dtlTy">
                Brief : <strong>{{ dtl.dtlBrf }}</strong>
                <div v-if="dtl.dtlInfo">
                  Info : {{ dtl.dtlInfo }}
                </div>
                <div v-if="dtl.dtlDes">
                  Des : {{ dtl.dtlDes }}
                </div>
              </div>
              <div v-if="'link' === dtl.dtlTy">
                <a :href="dtl.dtlInfo" target="_blank">{{ dtl.dtlBrf }}</a>
                <div v-if="dtl.dtlDes">
                  des : {{ dtl.dtlDes }}
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="col" v-if="toAdd">
      <h3>Create Stock Entry</h3>
      <div class="form-group">
        <button class="btn btn-outline-info" @click="toggleAddPage">取消</button>
        <StEntryAdd @newEntryData="saveEntry($event)"/>
      </div>
    </div>
    <div class="col col-lg-2" v-if="!toAdd">
      <button class="btn btn-outline-primary"
              @click="toggleAddPage">
        新增
      </button>
    </div>
  </div>
</template>

<script>

import StEntryService from '../services/stentry-service'
import StEntryAdd from '../components/StEntryAdd.vue'
import EventBus from '../common/EventBus'

export default {
  name: 'StEntry',
  data () {
    return {
      activeComEntryVoList: [],
      toAdd: false,
    }
  },
  components: {
    StEntryAdd
  },
  methods: {
    toggleAddPage () {
      this.toAdd = !this.toAdd
    },
    deleteEntry (symb, c8tDtm) {
      if (confirm('確定刪除??')) {
        StEntryService.deleteActiveEntry(symb, c8tDtm)
      } else {
        alert('不刪除')
      }
    },
    saveEntry (allAddData) {
      StEntryService.save(JSON.stringify(allAddData)).then(c8tDtm => {
        allAddData['c8tDtm'] = c8tDtm.substring(0, 19)
        let newComEntryVo = {}
        newComEntryVo['comNm'] = 'New'
        newComEntryVo['comType'] = 'New'
        newComEntryVo['comIndus'] = 'New'
        newComEntryVo['stEntry'] = allAddData
        this.activeComEntryVoList.unshift(newComEntryVo)
        this.toggleAddPage()
      })
    }
  },
  mounted () {
    StEntryService.getAllActiveEntry()
    .then((res) => {
      this.activeComEntryVoList = res.data
    }, (error) => {
      if (403 === error.response.status) {
        EventBus.dispatch('logout')
      } else {
        alert('取得資料失敗:' + error)
      }
    })
  }
}
</script>

<style scoped>

</style>