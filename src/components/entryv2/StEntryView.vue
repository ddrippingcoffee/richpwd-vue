<template>
  <div :hidden="isViewEmpty" class="text-right">
    <button class="btn btn-outline-danger btn-sm" :disabled="currData.delDtm"
            @click="deleteEntry(currData.symb,currData.c8tDtm)">
      刪除
    </button>
  </div>
  <div class="list-group mt-2" :hidden="isViewEmpty">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{ currData.symb }} : {{ currData.comNm }}</h5>
      <small>
        <div>建立時間 : {{ currData.c8tDtm }}</div>
        <div v-if="currData.delDtm">刪除時間 : {{ currData.delDtm }}</div>
        <div v-else>//</div>
      </small>
    </div>
    <div v-for="(dtl,dtlIndex) in currData.stDtlList" :key="dtlIndex">
      <!-- 日期資訊 -->
      <!-- 日期資訊 -->
      <!-- 日期資訊 -->
      <div v-if="'date' === dtl.dtlTy">
        <p class="mb-1">{{ dtl.dtlBrf }} : <strong>{{ dtl.dtlInfo }}</strong></p>
        <small v-if="dtl.dtlDes">
          Des :
          <textarea class="form-control"
                    v-model="dtl.dtlDes"
                    :style="{height:dtl.customHeight}"
                    disabled
          ></textarea>
        </small>
      </div>
      <!-- 筆記資訊 -->
      <!-- 筆記資訊 -->
      <!-- 筆記資訊 -->
      <div v-if="'note' === dtl.dtlTy">
        <p class="mb-1">Brief : <strong>{{ dtl.dtlBrf }}</strong></p>
        <p class="mb-1" v-if="dtl.dtlInfo">Info : {{ dtl.dtlInfo }}</p>
        <small v-if="dtl.dtlDes">
          Des :
          <textarea class="form-control"
                    v-model="dtl.dtlDes"
                    :style="{height:dtl.customHeight}"
                    disabled
          ></textarea>
        </small>
      </div>
      <!-- 連結資訊 -->
      <!-- 連結資訊 -->
      <!-- 連結資訊 -->
      <div v-if="'link' === dtl.dtlTy">
        <p class="mb-1"><a :href="dtl.dtlInfo" target="_blank">{{ dtl.dtlBrf }}</a></p>
        <small v-if="dtl.dtlDes">
          Des :
          <textarea class="form-control"
                    v-model="dtl.dtlDes"
                    :style="{height:dtl.customHeight}"
                    disabled
          ></textarea>
        </small>
      </div>
      <hr class="w-50 align-content-center"/>
    </div>
    <div class="mt-2" v-if="undefined !== currData.entryFileInfo">
      <!-- FD 資料 -->
      <!-- FD 資料 -->
      <!-- FD 資料 -->
      <div v-for="(fileFdInfo, fileFdInfoIndex) in currData.entryFileInfo.fileFdInfoList"
           :key="fileFdInfoIndex" class="d-inline-block">
        <!-- FOLDER IMG -->
        <!-- FOLDER IMG -->
        <!-- FOLDER IMG -->
        <img v-if="fileFdInfo.base64ImgStr"
             :alt="fileFdInfo.fdFileNm"
             :src="fileFdInfo.base64ImgStr"
             :title="fileFdInfo.fdFileNm" width="150"
             @mousemove="zoomIn" @mouseout="zoomOut"/>
        <!-- PDF -->
        <!-- PDF -->
        <!-- PDF -->
        <span v-else-if="fileFdInfo.base64PdfStr"
              class="btn btn-outline-info"
              @click="openPdfWin(fileFdInfo.base64PdfStr)">
          開啟 {{ fileFdInfo.fdFileNm }}
        </span>
        <!-- 其他資料 -->
        <!-- 其他資料 -->
        <!-- 其他資料 -->
        <span v-else class="btn btn-outline-info mt-2" @click="downloadFileFd(fileFdInfo)">
          下載 {{ fileFdInfo.fdFileNm }}
        </span>
      </div>
      <!-- DB 資料 -->
      <!-- DB 資料 -->
      <!-- DB 資料 -->
      <div v-for="(fileDbInfo, fileDbInfoIndex) in currData.entryFileInfo.fileDbInfoList"
           :key="fileDbInfoIndex">
        <!-- DB IMG -->
        <!-- DB IMG -->
        <!-- DB IMG -->
        <figure class="figure">
          <img class="figure-img img-fluid rounded"
               :alt="fileDbInfo.dbFileNm" :src="fileDbInfo.base64ImgStr">
          <figcaption class="figure-caption">{{ fileDbInfo.dbFileNm }}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import StEntryService from '@/services/stentry-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'StEntryView',
  emits: ['imgEvent',],
  data () {
    return {
      currData: {},
      isViewEmpty: true,
    }
  },
  props: ['setViewHidden', 'viewHidden', 'setEntryData', 'entryData',],
  watch: {
    setViewHidden (viewHidden) {
      this.isViewEmpty = viewHidden
    },
    setEntryData (entryData) {
      this.displayData(entryData)
    }
  },
  methods: {
    displayData (entry) {
      StEntryService.getEntryFileList(entry.symb, entry.c8tDtm)
      .then((res) => {
        entry.entryFileInfo = res.data
        this.buildValue(entry)
        this.currData = entry
      }, (error) => {
        this.handleErr(error)
      })
      .then(() => {
        entry.entryFileInfo.fileDbInfoList.forEach(dbInfo => {
          if ('image' === dbInfo.dbFileTy.substring(0, 5))
            this.displayDbImg(dbInfo.uid)
            .then((res) => {
              dbInfo.base64ImgStr = res
            })
        })
      })
      .then(() => {
        entry.entryFileInfo.fileFdInfoList.forEach(fdInfo => {
          fdInfo['fdFileNm'] = fdInfo['fdFileNm'].substring(15)
          if ('image' === fdInfo.fdFileTy.substring(0, 5)) {
            this.displayFdImg(fdInfo.uid)
            .then((res) => {
              fdInfo.base64ImgStr = res
            })
          } else if ('application' === fdInfo.fdFileTy.substring(0, 11)) {
            this.displayFdImg(fdInfo.uid)
            .then((res) => {
              fdInfo.base64PdfStr = res
            })
          }
        })
      })
      .then(() => {
        // 檢查用
        // console.log(entry.entryFileInfo.fileFdInfoList)
        // console.log(entry.entryFileInfo.fileDbInfoList)
      })
    },
    displayDbImg (uid) {
      return StEntryService.getFileDbImg64(uid)
      .then((res) => {
        return res.data
      }, (error) => {
        this.handleErr(error)
      })
    },
    displayFdImg (uid) {
      return StEntryService.getFileFdImg64(uid)
      .then((res) => {
        return res.data
      }, (error) => {
        this.handleErr(error)
      })
    },
    downloadFileFd (fileFdInfo) {
      StEntryService.downloadFileFd(fileFdInfo.uid)
      .then((res) => {
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileFdInfo.fdFileNm
        link.click()
        URL.revokeObjectURL(link.href)
      }, (error) => {
        this.handleErr(error)
      })
    },
    deleteEntry (symb, c8tDtm) {
      if (confirm('確定刪除??')) {
        StEntryService.deleteActiveEntry(symb, c8tDtm)
        .then((res) => {
          if (1 === res.data) {
            this.currData.delDtm = '已刪除請重新查詢'
          }
        }, (error) => {
          this.handleErr(error)
        })
      } else {
        alert('不刪除')
      }
    },
    buildValue (entry) {
      entry.stDtlList.forEach(dtl => {
        this.setTextareaHeight(dtl)
      })
    },
    setTextareaHeight (dtl) {
      if (dtl.dtlDes) {
        let newHeight = ''
        let numOfLine = dtl.dtlDes.split(/\r\n|\r|\n/).length
        if (1 === numOfLine) {
          // 處理未斷行文字
          let newLen = ((dtl.dtlDes.length / 60) + 1) * 30
          newHeight = (newLen >= 40) ? newLen : 40
        } else {
          newHeight = (numOfLine * 32) + 1
        }
        dtl.customHeight = newHeight + 'px'
      }
    },
    zoomIn (event) {
      this.$emit('imgEvent', event)
    },
    zoomOut () {
      this.$emit('imgEvent', {})
    },
    handleErr (error) {
      if (403 === error.response.status) {
        EventBus.dispatch('logout')
      } else {
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
        alert('錯誤 : ' + errMsg)
      }
    },
    openPdfWin (baseStr) {
      let win = window.open('')
      win.document.body.style.margin = '0px'
      win.document.body.innerHTML =
          '<iframe src="' + baseStr + '" style="border-width: 0; width:100%; height:100%;" allowfullscreen></iframe>'
    },
  },
}
</script>

<style scoped>

</style>