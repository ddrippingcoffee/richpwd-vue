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
      <div class="row">
        <div class="col-12">
          <!-- 日期資訊 -->
          <!-- 日期資訊 -->
          <!-- 日期資訊 -->
          <div class="col-12" v-if="'date' === dtl.dtlTy"
               style="background-color: #ffcccc">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ dtl.dtlBrf }} : {{ dtl.dtlInfo }}</h5>
                <pre v-if="dtl.dtlDes" class="card-text"
                     style="white-space: pre-wrap;background-color: #e9ecef;">{{ dtl.dtlDes }}
                </pre>
              </div>
            </div>
          </div>
          <!-- 筆記資訊 -->
          <!-- 筆記資訊 -->
          <!-- 筆記資訊 -->
          <div class="col-12" v-if="'note' === dtl.dtlTy"
               style="background-color: #fde6ff">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ dtl.dtlBrf }}</h5>
                <h6 class="card-title">{{ dtl.dtlInfo }}</h6>
                <pre v-if="dtl.dtlDes" class="card-text"
                     style="white-space: pre-wrap;background-color: #e9ecef;">{{ dtl.dtlDes }}
                </pre>
              </div>
            </div>
          </div>
          <!-- 連結資訊 -->
          <!-- 連結資訊 -->
          <!-- 連結資訊 -->
          <div class="col-12" v-if="'link' === dtl.dtlTy"
               style="background-color: #e3f7ff">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <a :href="dtl.dtlInfo" target="_blank">{{ dtl.dtlBrf }}</a>
                </h5>
                <pre v-if="dtl.dtlDes" class="card-text"
                     style="white-space: pre-wrap;background-color: #e9ecef;">{{ dtl.dtlDes }}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <!-- FOLDER PDF -->
        <!-- FOLDER PDF -->
        <!-- FOLDER PDF -->
        <div v-else-if="fileFdInfo.base64PdfStr">
          <span class="btn btn-outline-info"
                @click="openPdfWin(fileFdInfo.base64PdfStr)">
            檢視 PDF {{ fileFdInfo.fdFileNm }}
          </span>
          <span class="btn btn-outline-info mt-2" @click="downloadFileFd(fileFdInfo)">
            下載 PDF {{ fileFdInfo.fdFileNm }}
          </span>
        </div>
        <!-- 其他資料 -->
        <!-- 其他資料 -->
        <!-- 其他資料 -->
        <span v-else class="btn btn-outline-info mt-2" @click="downloadFileFd(fileFdInfo)">
          下載 {{ fileFdInfo.fdFileNm }}
        </span>
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
        this.currData = entry
      }, (error) => {
        this.handleErr(error)
      })
      .then(() => {
        entry.entryFileInfo.fileFdInfoList.forEach(fdInfo => {
          fdInfo['fdFileNm'] = fdInfo['fdFileNm'].substring(15)
          if ('image' === fdInfo.fdFileTy.substring(0, 5)) {
            this.displayFd(fdInfo.uid)
            .then((res) => {
              fdInfo.base64ImgStr = res
            })
          } else if ('application' === fdInfo.fdFileTy.substring(0, 11)) {
            this.displayFd(fdInfo.uid)
            .then((res) => {
              fdInfo.base64PdfStr = res
            })
          }
        })
      })
      .then(() => {
        // 檢查用
        // console.log(entry.entryFileInfo.fileFdInfoList)
      })
    },
    displayFd (uid) {
      return StEntryService.getFileFd64(uid)
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