<template>
  <div class="float-left">
    <button class="btn btn-outline-primary btn-sm"
            v-if="this.roleArr.includes('ROLE_ADMIN')"
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
        <span class="btn btn-outline-secondary" w-25
              @click="addDtl" style="cursor: pointer;">New Stock Detail</span>
        <span class="input-group-text w-25 justify-content-lg-center text-danger"
              id="basic-addon1">股市代號</span>
        <input type="text" class="form-control" v-model="symb">
      </div>
      <div v-for="(detail, counter) in stDtlList"
           v-bind:key="counter">
        <div class="w-100 mt-3 md-2">
          <strong class="mr-3">
            <!-- 筆數 -->
            {{ counter + 1 }}.
          </strong>
          <span class="btn-sm btn-outline-danger float-right" @click="deleteDtl(counter)">Delete</span>
          <!-- 日期 -->
          <input type="radio" :id="`date_${counter + 1}`" value="date" v-model="detail.dtlTy">
          <label class="mr-3" :for="`date_${counter + 1}`"> Date </label>
          <!-- 記事 -->
          <input type="radio" :id="`note_${counter +1}`" value="note" v-model="detail.dtlTy">
          <label class="mr-3" :for="`note_${counter +1}`"> Note </label>
          <!-- 連結 -->
          <input type="radio" :id="`link_${counter + 1}`" value="link" v-model="detail.dtlTy">
          <label class="mr-3" :for="`link_${counter + 1}`"> Link </label>
        </div>
        <!-- 簡述 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                id="basic-addon1">簡述</span>
          <input class="form-control" type="text" placeholder="For Brief or Date Title or Url Title"
                 v-model.lazy="detail.dtlBrf">
        </div>
        <!-- 資料 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                id="basic-addon1">資料</span>
          <input class="form-control" type="text" placeholder="For Information or Date Time or Url Link"
                 v-model.lazy="detail.dtlInfo">
        </div>
        <!-- 敘述 -->
        <div class="input-group mt-md-1">
          <span class="input-group-text justify-content-lg-center"
                id="basic-addon1">敘述</span>
          <textarea class="form-control" type="text"
                    placeholder="For Detail Description" rows="5"
                    v-model.lazy="detail.dtlDes"></textarea>
        </div>
      </div>
      <!-- 圖檔 -->
      <div class="mt-2 input-group">
        <div class="input-group col-4">
          <div class="input-group col-8 pl-0">
            <span class="input-group-text"><font-awesome-icon icon="images"/></span>
            <input class="form-control" @paste="pasteImg" accept="image/*" placeholder="貼上"/>
          </div>
          <div class="col-4 m-auto">
            <h6>總 {{ pasteDbDetail.length }}</h6>
          </div>
        </div>
        <div class="input-group col-4">
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
        <div class="input-group col-4">
          <div class="input-group col-6">
            <label for="fileImg" class="btn btn-info mb-0">圖檔</label>
            <input id="fileImg" type="file" multiple @click="cleanVal" @change="selectImg" style="display:none;"
                   accept="image/*"/>
          </div>
          <div class="col-6 m-auto">
            <h6>總 {{ fileDbDetail.length }}</h6>
          </div>
        </div>
      </div>
      <div class="mt-2 input-group">
        <div class="col-4">
          <div v-if="0 !== pasteDbDetail.length">
            <div class="mt-2" v-for="(img, counter) in pasteDbDetail" :key="counter">
              <small>{{ img.fileName }}</small>
              <img :alt="img.fileName" :src="img.fileUrl" :title="img.fileName" width="150"
                   @mousemove="zoomIn" @mouseout="zoomOut"/>
              <span class="btn-sm btn-outline-danger" @click="deleteDbPasteImg(counter)">Delete</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div v-if="0 !== fileFdDetail.length">
            <div class="mt-2" v-for="(img, counter) in fileFdDetail" :key="counter">
              <small>{{ img.fileName }}</small>
              <div class="float-right">
                <span class="btn-sm btn-outline-danger" @click="deleteFdBtnImg(counter)">Delete</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div v-if="0 !== fileDbDetail.length">
            <div class="mt-2" v-for="(img, counter) in fileDbDetail" :key="counter">
              <small>{{ img.fileName }}</small>
              <img :alt="img.fileName" :src="img.fileUrl" :title="img.fileName" width="150"
                   @mousemove="zoomIn" @mouseout="zoomOut"/>
              <div class="float-right">
                <span class="btn-sm btn-outline-danger" @click="deleteDbBtnImg(counter)">Delete</span>
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
      fileDbDetail: [],
      fileFdDetail: [],
      pasteDbDetail: [],
    }
  },
  methods: {
    setAddingPage () {
      this.resetEntry()
      this.isEntryAdding = true
      this.$emit('isEntryAdding', this.isEntryAdding)
    },
    saveEntry () {
      const formData = new FormData()
      let newEntry = {
        'symb': this.symb,
        'stDtlList': toRaw(this.stDtlList),
      }
      const json = JSON.stringify(newEntry)
      const blob = new Blob([json], { type: 'application/json' })
      formData.append('entryJsonStr', blob)
      // 圖片資料存 DB
      let tempDbFiles = toRaw(this.fileDbDetail)
      for (let i = 0; i < tempDbFiles.length; i++) {
        formData.append('fileDbs', tempDbFiles[i]['fileObj'])
      }
      // 資料放 Folder
      let tempFdFiles = toRaw(this.fileFdDetail)
      for (let i = 0; i < tempFdFiles.length; i++) {
        formData.append('fileFds', tempFdFiles[i]['fileObj'])
      }
      // Paste 放 Folder
      let tempFdPaste = toRaw(this.pasteDbDetail)
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
        alert('錯誤 : ' + errMsg)
      })
    },
    cancelAddEntry () {
      this.isEntryAdding = false
      this.$emit('isEntryAdding', this.isEntryAdding)
    },
    addDtl () {
      this.stDtlList.push({ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' })
    },
    deleteDtl (counter) {
      this.stDtlList.splice(counter, 1)
    },
    deleteDbPasteImg (counter) {
      this.pasteDbDetail.splice(counter, 1)
    },
    deleteDbBtnImg (counter) {
      this.fileDbDetail.splice(counter, 1)
    },
    deleteFdBtnImg (counter) {
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
        this.pasteDbDetail.push({
          fileName: 'paste_' + this.getTimeStamp(new Date()),
          fileUrl: URL.createObjectURL(blob),
          fileObj: blob
        })
      } else {
        alert('非圖片')
      }
    },
    selectImg (event) {
      let newFileList = Array.from(event.target.files)
      this.fileDbDetail.splice(0, this.fileDbDetail.length)
      for (let i = 0; i < newFileList.length; i++) {
        this.fileDbDetail.push({
          fileName: newFileList[i].name,
          fileUrl: URL.createObjectURL(newFileList[i]),
          fileObj: newFileList[i]
        })
      }
    },
    selectFile (event) {
      let newFileList = Array.from(event.target.files)
      this.fileFdDetail.splice(0, this.fileFdDetail.length)
      for (let i = 0; i < newFileList.length; i++) {
        this.fileFdDetail.push({
          fileName: newFileList[i].name,
          fileObj: newFileList[i]
        })
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
    resetEntry () {
      this.symb = ''
      this.stDtlList = [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }]
      this.fileDbDetail = []
      this.fileFdDetail = []
      this.pasteDbDetail = []
    }
  }
}
</script>

<style scoped>

</style>