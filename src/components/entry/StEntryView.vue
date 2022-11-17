<template>
  <div class="list-group" v-if="0 !== entryContent.length">
    <li class="list-group-item list-group-item-action flex-column align-items-start"
        v-for="(entry,entryIndex) in entryContent" :key="entryIndex">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">{{ entry.symb }} : {{ entry.comNm }}</h5>
        <small>{{ entry.c8tDtm }}</small>
      </div>
      <div v-for="(dtl,dtlIndex) in entry.stDtlList" :key="dtlIndex">
        <div v-if="'date' === dtl.dtlTy">
          <p class="mb-1">{{ dtl.dtlBrf }} : <strong>{{ dtl.dtlInfo }}</strong></p>
          <small v-if="dtl.dtlDes">Des : {{ dtl.dtlDes }}</small>
        </div>
        <div v-if="'note' === dtl.dtlTy">
          <p class="mb-1">Brief : <strong>{{ dtl.dtlBrf }}</strong></p>
          <p class="mb-1" v-if="dtl.dtlInfo">Info : {{ dtl.dtlInfo }}</p>
          <small v-if="dtl.dtlDes">Des : {{ dtl.dtlDes }}</small>
        </div>
        <div v-if="'link' === dtl.dtlTy">
          <a :href="dtl.dtlInfo" target="_blank">{{ dtl.dtlBrf }}</a>
          <small v-if="dtl.dtlDes">Des : {{ dtl.dtlDes }}</small>
        </div>
      </div>
      <div v-if="undefined !== entry.entryFileInfo" class="mt-2">
        <!-- DB 資料 -->
        <!-- DB 資料 -->
        <!-- DB 資料 -->
        <div v-for="(fileDbInfo, fileDbInfoIndex) in entry.entryFileInfo.fileDbInfoList"
             :key="fileDbInfoIndex">
          <!--              {{ fileDbInfo.dbFileTy }} : {{ fileDbInfo.dbFileNm }}-->
          <a v-if="fileDbInfo.base64ImgStr"
             :href="fileDbInfo.base64ImgStr" :download="fileDbInfo.dbFileNm">
            <img :alt="fileDbInfo.dbFileNm" :src="fileDbInfo.base64ImgStr"/>
          </a>
        </div>
        <!-- FD 資料 -->
        <!-- FD 資料 -->
        <!-- FD 資料 -->
        <div v-for="(fileFdInfo, fileFdInfoIndex) in entry.entryFileInfo.fileFdInfoList"
             :key="fileFdInfoIndex">
          <!--              {{ fileFdInfo.fdFileTy }} : {{ fileFdInfo.fdFileNm }}-->
          <a v-if="fileFdInfo.base64ImgStr"
             :href="fileFdInfo.base64ImgStr"
             :download="fileFdInfo.fdFileNm">
            <img :alt="fileFdInfo.fdFileNm" :src="fileFdInfo.base64ImgStr"/>
          </a>
          <span v-else class="btn btn-outline-info mt-2" @click="downloadFileFd(fileFdInfo)">
            {{ fileFdInfo.fdFileNm }}
          </span>
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm float-right"
              @click="deleteEntry(entryIndex,entry.symb,entry.c8tDtm)">
        刪除
      </button>
    </li>
  </div>
  <div v-else>無資料</div>
</template>

<script>
import StEntryService from '@/services/stentry-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'StEntryView',
  data () {
    return {
      entryContent: {},
      entryFile: {}
    }
  },
  props: ['getActiveEntryContent', 'activeEntryContent'],
  watch: {
    getActiveEntryContent (activeEntryContent) {
      this.entryContent = activeEntryContent
    },
  }, methods: {
    downloadFileFd (fileFdInfo) {
      StEntryService.downloadFileFd(fileFdInfo.uid).then(res => {
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileFdInfo.fdFileNm
        link.click()
        URL.revokeObjectURL(link.href)
      })
    },
    deleteEntry (entryIndex, symb, c8tDtm) {
      if (confirm('確定刪除??')) {
        StEntryService.deleteActiveEntry(symb, c8tDtm)
        .then((res) => {
          if (1 === res.data) {
            this.entryContent
            .splice(this.entryContent.indexOf(this.entryContent[entryIndex]), 1)
          }
        }, (error) => {
          if (403 === error.response.status) {
            EventBus.dispatch('logout')
          }
          let errMsg = 'Oops! Something went wrong'
          if (error.response.data.message) {
            errMsg = error.response.data.message
          }
          if (error.response.data.errors) {
            error.response.data.errors.forEach(err => {
              errMsg += '\n'
              errMsg += err.defaultMessage
            })
          }
          alert(errMsg)
        })
      } else {
        alert('不刪除')
      }
    },
  }
}
</script>

<style scoped>

</style>