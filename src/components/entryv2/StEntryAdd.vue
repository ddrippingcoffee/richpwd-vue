<template>
  <div class="float-left">
    <button class="btn btn-outline-primary btn-sm"
            v-if="this.roleArr.includes('ROLE_USER')"
            @click="setAddingPage" :hidden="isEntryAdding">新增
    </button>
    <button class="btn btn-success float-right btn-sm"
            @click="saveEntry" :hidden="!isEntryAdding">儲存
    </button>
    <button class="btn btn-outline-info btn-sm"
            @click="cancelAddEntry" :hidden="!isEntryAdding">取消
    </button>
  </div>
  <div :hidden="!isEntryAdding">
    <form>
      <div class="input-group mt-md-2">
        <span class="btn btn-outline-secondary"
              @click="addDtl" style="cursor: pointer;">New Stock Detail</span>
        <span class="input-group-text w-25 justify-content-lg-center text-danger"
              id="basic-addon1">股市代號</span>
        <input type="text" class="form-control" v-model="symb">
      </div>
      <div v-for="(detail, counter) in stDtlList"
           v-bind:key="counter">
        <div class="w-100 mt-3 md-2" :class="`dtl_${counter + 1}`">
          <strong class="mr-3">
            <!-- 筆數 -->
            {{ counter + 1 }}.
          </strong>
          <span class="btn-sm btn-outline-danger float-right" @click="deleteDtl(counter)">Delete</span>
          <!-- 日期 -->
          <div class="form-check form-check-inline">
            <input type="radio" value="date" class="form-check-input"
                   :id="`date_${counter + 1}`" v-model="detail.dtlTy"
                   @change="chgDtlType((counter + 1),'date')">
            <label class="form-check-label mr-3" :for="`date_${counter + 1}`"> Date </label>
          </div>
          <!-- 記事 -->
          <div class="form-check form-check-inline">
            <input type="radio" value="note" class="form-check-input"
                   :id="`note_${counter +1}`" v-model="detail.dtlTy"
                   @change="chgDtlType((counter + 1),'note')">
            <label class="form-check-label mr-3" :for="`note_${counter +1}`"> Note </label>
          </div>
          <!-- 連結 -->
          <div class="form-check form-check-inline">
            <input type="radio" value="link" class="form-check-input"
                   :id="`link_${counter + 1}`" v-model="detail.dtlTy"
                   @change="chgDtlType((counter + 1),'link')">
            <label class="form-check-label mr-3" :for="`link_${counter + 1}`"> Link </label>
          </div>
        </div>
        <!-- 簡述 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                :class="`dtl_${counter + 1}`"
                id="basic-addon1">簡述</span>
          <input class="form-control" type="text" placeholder="For Brief or Date Title or Url Title"
                 v-model.lazy="detail.dtlBrf">
        </div>
        <!-- 資料 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                :class="`dtl_${counter + 1}`"
                id="basic-addon1">資料</span>
          <input class="form-control" type="text" placeholder="For Information or Date Time or Url Link"
                 v-model.lazy="detail.dtlInfo">
        </div>
        <!-- 敘述 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                :class="`dtl_${counter + 1}`"
                id="basic-addon1">敘述</span>
          <textarea class="form-control" type="text" placeholder="For Detail Description"
                    style="overflow-y:hidden;height:36px"
                    :class="'text_' + (counter + 1)"
                    @input="resize($event,(counter + 1))"
                    v-model.lazy="detail.dtlDes"></textarea>
        </div>
      </div>
      <!-- 圖檔 -->
      <div class="mt-2 input-group">
        <div class="input-group col-6">
          <div class="input-group col-8 pl-0">
            <span class="input-group-text"><font-awesome-icon icon="images"/></span>
            <input class="form-control" @paste="pasteImg" accept="image/*" placeholder="貼上"/>
          </div>
          <div class="col-4 m-auto">
            <h6>總 {{ pasteDetail.length }}</h6>
          </div>
        </div>
        <div class="input-group col-6">
          <div class="input-group col-6">
            <label for="fileXlsx" class="btn btn-info mb-0">檔案</label>
            <input id="fileXlsx" type="file" multiple @click="cleanVal" @change="selectFile"
                   style="display:none;"/>
            <!-- accept=".xlsx" -->
          </div>
          <div class="col-6 m-auto">
            <h6>總 {{ fileFdDetail.length }}</h6>
          </div>
        </div>
      </div>
      <div class="mt-2 input-group">
        <div class="col-6">
          <div v-if="0 !== pasteDetail.length">
            <div class="mt-2" v-for="(img, counter) in pasteDetail" :key="counter">
              <small>{{ img.fileName }}</small>
              <img :alt="img.fileName" :src="img.fileUrl" :title="img.fileName" width="150"
                   @mousemove="zoomIn" @mouseout="zoomOut"/>
              <span class="btn-sm btn-outline-danger" @click="deletePaste(counter)">Delete</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <!-- FD 資料 -->
          <!-- FD 資料 -->
          <!-- FD 資料 -->
          <div v-if="0 !== fileFdDetail.length">
            <div class="mt-2" v-for="(fileFd, counter) in fileFdDetail" :key="counter">
              <!-- FOLDER IMG -->
              <!-- FOLDER IMG -->
              <!-- FOLDER IMG -->
              <img v-if="fileFd.imgUrl"
                   :alt="fileFd.fileName"
                   :src="fileFd.imgUrl"
                   :title="fileFd.fileName"
                   width="150"
                   @mousemove="zoomIn" @mouseout="zoomOut"/>
              <!-- FOLDER PDF -->
              <!-- FOLDER PDF -->
              <!-- FOLDER PDF -->
              <span v-else-if="fileFd.pdfUrl"
                    class="btn btn-outline-info"
                    @click="openPdfWin(fileFd.pdfUrl)">
                開啟 {{ fileFd.fileName }}
              </span>
              <!-- 其他資料 -->
              <!-- 其他資料 -->
              <!-- 其他資料 -->
              <small v-else>{{ fileFd.fileName }}</small>
              <div class="float-right">
                <span class="btn-sm btn-outline-danger" @click="deleteFd(counter)">Delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { toRaw } from 'vue'
import StEntryService from '@/services/stentry-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'StEntryAdd',
  emits: ['isEntryAdding', 'pageInfo', 'imgEvent',],
  data () {
    return {
      roleArr: this.$store.state.auth.user.roles,
      isEntryAdding: false,
      symb: '',
      stDtlList: [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }],
      fileFdDetail: [],
      pasteDetail: [],
      dateColor: '#ffe8e8',
      noteColor: '#fde6ff',
      linkColor: '#e3f7ff',
    }
  },
  created () {
    // 註冊新增頁 Shift + Q 鍵取消新增
    window.addEventListener('keyup', (e) => {
      if (this.isEntryAdding && e.shiftKey && 'Q' === e.key) {
        this.cancelAddEntry()
      }
    })
    // 註冊新增頁 Alt + Insert 鍵 New Stock Detail
    window.addEventListener('keyup', (e) => {
      if (this.isEntryAdding && e.altKey && 'Insert' === e.key) {
        this.addDtl()
      }
    })
  },
  methods: {
    setAddingPage () {
      this.resetEntry()
      this.isEntryAdding = true
      this.$emit('isEntryAdding', this.isEntryAdding)
    },
    saveEntry () {
      if (!confirm('確定儲存?')) {
        return
      }
      const formData = new FormData()
      let newEntry = {
        'symb': this.symb,
        'stDtlList': toRaw(this.stDtlList),
      }
      const json = JSON.stringify(newEntry)
      const blob = new Blob([json], { type: 'application/json' })
      formData.append('entryJsonStr', blob)
      // 資料
      let tempFdFiles = toRaw(this.fileFdDetail)
      for (let i = 0; i < tempFdFiles.length; i++) {
        formData.append('fileFds', tempFdFiles[i]['fileObj'])
      }
      // Paste Img
      let tempFdPaste = toRaw(this.pasteDetail)
      for (let i = 0; i < tempFdPaste.length; i++) {
        formData.append('fileFds', tempFdPaste[i]['fileObj'])
      }
      StEntryService.save(formData)
      .then((res) => {
        if (201 === res.status) {
          this.isEntryAdding = false
          this.$emit('isEntryAdding', this.isEntryAdding)
          this.$emit('pageInfo', { 'queryBy': 'symb', 'queryParam': this.symb, 'page': 0 })
        } else {
          alert('執行新增失敗')
        }
      }, (error) => {
        this.handleErr(error)
      })
    },
    cancelAddEntry () {
      let isDtlNotEmpty = false
      this.stDtlList.forEach(dtl => {
        if ('' !== dtl.dtlBrf || '' !== dtl.dtlInfo || '' !== dtl.dtlDes) {
          isDtlNotEmpty = true
        }
      })
      if ('' !== this.symb || isDtlNotEmpty ||
          0 !== this.fileFdDetail.length ||
          0 !== this.pasteDetail.length) {
        if (confirm('確定取消?')) {
          this.isEntryAdding = false
          this.$emit('isEntryAdding', this.isEntryAdding)
        }
      } else {
        this.isEntryAdding = false
        this.$emit('isEntryAdding', this.isEntryAdding)
      }
    },
    addDtl () {
      this.stDtlList.push({ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' })
    },
    deleteDtl (counter) {
      this.stDtlList.splice(counter, 1)
    },
    deletePaste (counter) {
      this.pasteDetail.splice(counter, 1)
    },
    deleteFd (counter) {
      this.fileFdDetail.splice(counter, 1)
    },
    cleanVal (event) {
      let inputId = event.srcElement.__vnode.props['id']
      let ele = document.getElementById(inputId)
      ele.value = null
    },
    pasteImg (event) {
      let items = event.clipboardData.items
      if (items[0].type.indexOf('image') !== -1) {
        let blob = items[0].getAsFile()
        this.pasteDetail.push({
          fileName: 'paste_' + this.getTimeStamp(new Date()),
          fileUrl: URL.createObjectURL(blob),
          fileObj: blob
        })
      } else {
        alert('非圖片')
      }
    },
    selectFile (event) {
      let newFileList = Array.from(event.target.files)
      this.fileFdDetail.splice(0, this.fileFdDetail.length)
      for (let i = 0; i < newFileList.length; i++) {
        if ('image' === newFileList[i].type.substring(0, 5)) {
          this.fileFdDetail.push({
            fileName: newFileList[i].name,
            fileObj: newFileList[i],
            imgUrl: URL.createObjectURL(newFileList[i]),
          })
        } else if ('application/pdf' === newFileList[i].type) {
          this.fileFdDetail.push({
            fileName: newFileList[i].name,
            fileObj: newFileList[i],
            pdfUrl: URL.createObjectURL(newFileList[i]),
          })
        } else {
          this.fileFdDetail.push({
            fileName: newFileList[i].name,
            fileObj: newFileList[i]
          })
        }
      }
    },
    getTimeStamp (dt) {
      const offset = dt.getTimezoneOffset()
      dt = new Date(dt.getTime() - (offset * 60 * 1000))
      return dt.toISOString().split('.')[0]
      .replaceAll(':', '').replaceAll('-', '')
    },
    zoomIn (event) {
      this.$emit('imgEvent', event)
    },
    zoomOut () {
      this.$emit('imgEvent', {})
    },
    openPdfWin (baseStr) {
      let win = window.open('')
      win.document.body.style.margin = '0px'
      win.document.body.innerHTML =
          '<iframe src="' + baseStr + '" style="border-width: 0; width:100%; height:100%;" allowfullscreen></iframe>'
    },
    chgDtlType (counter, val) {
      let dtlColor = ('date' === val) ? this.dateColor : ('note' === val) ? this.noteColor : this.linkColor
      let eleArr = document.getElementsByClassName('dtl_' + counter)
      for (let i = 0; i < eleArr.length; i++) {
        eleArr[i].style.backgroundColor = dtlColor
      }
    },
    resize (event, tagNum) {
      let ele = document.getElementsByClassName('text_' + tagNum)[0]
      ele.style.height = 'auto'
      ele.style.height = event.target.scrollHeight + 'px'
    },
    resetEntry () {
      this.symb = ''
      this.stDtlList = [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }]
      this.fileFdDetail = []
      this.pasteDetail = []
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
  }
}
</script>

<style scoped>

</style>