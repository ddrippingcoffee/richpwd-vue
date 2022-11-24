<template>
  <button class="btn btn-outline-primary"
          v-if="this.roleArr.includes('ROLE_ADMIN')"
          @click="addEntry" :hidden="isAdding">新增
  </button>
  <button class="btn btn-success float-right"
          @click="saveEntry" :hidden="!isAdding">儲存
  </button>
  <button class="btn btn-outline-info"
          @click="cancelAddEntry" :hidden="!isAdding">取消
  </button>
  <div :hidden="!isAdding">
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
      <div class="mt-2">
        <label for="fileImg" class="btn btn-info">選擇圖片</label>
        <input id="fileImg" type="file" multiple @change="selectImg" style="visibility:hidden;" accept="image/*"/>
        <label for="fileXlsx" class="btn btn-info">選擇檔案</label>
        <!-- accept=".xlsx" -->
        <input id="fileXlsx" type="file" multiple @change="selectFile" style="visibility:hidden;"/>
      </div>
      <div v-if="0 !== fileDbInfoList.length">
        選擇了 {{ fileDbInfoList.length }} 個 Image
        <div v-if="fileDbDetail">
          <div v-for="(img, counter) in fileDbDetail" :key="counter">
            {{ img.fileName }}<br/>
            <img :alt="img.fileName" :src="img.fileData" :title="img.fileName"/>
          </div>
        </div>
      </div>
      <div v-if="0 !== fileFdInfoList.length">
        選擇了 {{ fileFdInfoList.length }} 個檔案
        <div v-if="fileFdDetail">
          <div v-for="(img, counter) in fileFdDetail" :key="counter">
            {{ img.fileName }}
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
  emits: ['isAdding', 'pageInfo'],
  data () {
    return {
      roleArr: this.$store.state.auth.user.roles,
      isAdding: false,
      symb: '',
      stDtlList: [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }],
      fileDbInfoList: [],
      fileDbDetail: [],
      fileFdInfoList: [],
      fileFdDetail: [],
    }
  },
  methods: {
    addEntry () {
      this.resetEntry()
      this.isAdding = true
      this.$emit('isAdding', this.isAdding)
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
      for (const dbVo of this.fileDbInfoList) {
        formData.append('fileDbs', dbVo)
      }
      // 資料放 Folder
      for (const fdVo of this.fileFdInfoList) {
        formData.append('fileFds', fdVo)
      }
      StEntryService.save(formData)
      .then((res) => {
        if (201 === res.status) {
          this.resetEntry()
          this.isAdding = false
          this.$emit('isAdding', this.isAdding)
          this.$emit('pageInfo', { 'page': 0 })
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
      this.isAdding = false
      this.$emit('isAdding', this.isAdding)
    },
    addDtl () {
      this.stDtlList.push({ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' })
    },
    deleteDtl (counter) {
      this.stDtlList.splice(counter, 1)
    },
    selectImg (event) {
      this.fileDbInfoList = event.target.files
      this.fileDbDetail.splice(0, this.fileDbDetail.length)
      for (let i = 0; i < this.fileDbInfoList.length; i++) {
        this.fileDbDetail.push({
          fileIdx: i,
          fileName: this.fileDbInfoList[i].name,
          fileData: URL.createObjectURL(this.fileDbInfoList[i])
        })
      }
    },
    selectFile (event) {
      this.fileFdInfoList = event.target.files
      this.fileFdDetail.splice(0, this.fileFdDetail.length)
      for (let i = 0; i < this.fileFdInfoList.length; i++) {
        this.fileFdDetail.push({
          fileIdx: i,
          fileName: this.fileFdInfoList[i].name,
        })
      }
    },
    resetEntry () {
      this.symb = ''
      this.stDtlList = [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }]
      this.fileDbInfoList = []
      this.fileDbDetail = []
      this.fileFdInfoList = []
      this.fileFdDetail = []
    }
  }
}
</script>

<style scoped>

</style>