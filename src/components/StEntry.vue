<template>
  <br/>
  <div class="row">
    <div class="col" v-if="!toAdd">
      <ul class="list-group">
        <li class="list-group-item border-top-0 border-right-0 border-left-0"
            style="border-width:5px"
            v-for="(entry,entryIndex) in activeEntryList"
            :key="entryIndex">
          <strong>{{ entry.symb }}</strong>
          {{ entry.c8tDtm }}
          <button class="btn btn-outline-danger btn-sm float-right"
                  @click="deleteEntry(entry.symb,entry.c8tDtm)">
            刪除
          </button>
          <ul class="list-group">
            <li class="list-group-item border-top-0 border-right-0 border-left-0"
                v-for="(dtl,dtlIndex) in entry.stDtlList"
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
                <a :href="dtl.dtlInfo">{{ dtl.dtlBrf }}</a>
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
        <button class="btn btn-success" @click="saveEntry">儲存</button>
        <br/><br/>
        <StEntryAdd/>
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

export default {
  name: 'StEntry',
  data () {
    return {
      activeEntryList: [],
      toAdd: false,  // 新增
      stEntryAddData: {}
    }
  },
  components: {
    StEntryAdd
  },
  methods: {
    getAllActiveEntry () {
      StEntryService.getAllActiveEntry()
      .then((res) => {
        this.activeEntryList = res.data
        this.sortStEntry()
      }, (error) => {
        alert('取得資料失敗:' + error)
      })
    },
    sortStEntry () {
      return this.activeEntryList.sort((a, b) => a.c8tDtm - b.c8tDtm)
    },
    toggleAddPage () {
      this.toAdd = !this.toAdd
    },
    deleteEntry (symb, c8tDtm) {
      if (confirm('確定刪除??')) {
        console.log(symb)
        console.log(c8tDtm)
      } else {
        alert('不刪除')
      }
    },
    saveEntry () {
      console.log(StEntryAdd.data())
    }
  },
  mounted () {
    this.getAllActiveEntry()
  }
}
</script>

<style scoped>

</style>