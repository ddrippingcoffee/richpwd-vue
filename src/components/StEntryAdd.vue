<template>
  <span class="btn btn-success" @click="sendNewAddEntry">儲存</span>
  <br/><br/>
  <form>
    <strong>Symbol :</strong>
    <input id="symb" name="symb" type="text"
           class="form-control" v-model="symb"/><br/>
    <span class="btn btn-sm btn-outline-dark"
          @click="addDtl" style="cursor: pointer;">
      Create New Stock Detail</span>
    &nbsp;&nbsp;&nbsp;&nbsp; 單檔上限: <strong> {{ limitPerFile }} </strong>
    &nbsp;&nbsp; 單次上傳: <strong> {{ limitPerReq }} </strong><br/>
    <div class="border-0"
         v-for="(detail, counter) in stDtlList"
         v-bind:key="counter"><br/>
      <div>
        <span class="btn-sm btn-outline-danger float-right" @click="deleteDtl(counter)">Delete</span>
        <!-- 筆數 -->
        <strong>{{ counter + 1 }}. &nbsp;&nbsp;</strong>
        <!-- 日期 -->
        <input type="radio" :id="`date_${counter + 1}`" value="date" v-model="detail.dtlTy">
        <label :for="`date_${counter + 1}`"> Date &nbsp;&nbsp;</label>
        <!-- 記事 -->
        <input type="radio" :id="`note_${counter +1}`" value="note" v-model="detail.dtlTy">
        <label :for="`note_${counter +1}`"> Note &nbsp;&nbsp;</label>
        <!-- 連結 -->
        <input type="radio" :id="`link_${counter + 1}`" value="link" v-model="detail.dtlTy">
        <label :for="`link_${counter + 1}`"> Link </label>
        <!-- 簡述 -->
        <input class="form-control" type="text" placeholder="Brief or Date Title or Url Title"
               v-model.lazy="detail.dtlBrf"><br/>
        <!-- 資料 -->
        <input class="form-control" type="text" placeholder="Information or Date Time or Url Link"
               v-model.lazy="detail.dtlInfo"><br/>
        <!-- 敘述 -->
        <input class="form-control" type="text" placeholder="Detail Description"
               v-model.lazy="detail.dtlDes">
      </div>
    </div>
    <div>
      <label for="fileImg" class="btn btn-info">選擇圖片</label>
      <input id="fileImg" type="file" multiple @change="selectImg" style="visibility:hidden;" accept="image/*"/>
      <label for="fileXlsx" class="btn btn-info">選擇檔案</label>
      <!-- accept=".xlsx" -->
      <input id="fileXlsx" type="file" multiple @change="selectFile" style="visibility:hidden;"/>
    </div>

    <div v-if="0 !== fileDbVos.length">
      選擇了 {{ fileDbVos.length }} 個 Image
      <div v-if="fileDbVosInfo">
        <div v-for="(img, counter) in fileDbVosInfo"
             :key="counter">
          {{ img.fileName }}<img :alt="img.fileName" :src="img.fileData" :title="img.fileName"/>
        </div>
      </div>
    </div>
    <div v-if="0 !== fileFdVos.length">
      選擇了 {{ fileFdVos.length }} 個檔案
      <div v-if="fileFdVosInfo">
        <div v-for="(img, counter) in fileFdVosInfo"
             :key="counter">{{ img.fileName }}
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'StEntryAdd',
  emits: ['newEntryData'],
  data () {
    return {
      symb: '',
      stDtlList: [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }],
      fileDbVos: [],
      fileDbVosInfo: [],
      fileFdVos: [],
      fileFdVosInfo: [],
    }
  },
  props: {
    limitPerFile: String,
    limitPerReq: String
  },
  methods: {
    addDtl () {
      this.stDtlList.push({ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' })
    },
    deleteDtl (counter) {
      this.stDtlList.splice(counter, 1)
    },
    sendNewAddEntry () {
      this.$emit('newEntryData', this.$data)
    },
    selectImg (event) {
      this.fileDbVos = event.target.files
      this.fileDbVosInfo.splice(0, this.fileDbVosInfo.length)
      for (let i = 0; i < this.fileDbVos.length; i++) {
        this.fileDbVosInfo.push({
          fileIdx: i,
          fileName: this.fileDbVos[i].name,
          fileData: URL.createObjectURL(this.fileDbVos[i])
        })
      }
    },
    selectFile (event) {
      this.fileFdVos = event.target.files
      this.fileFdVosInfo.splice(0, this.fileFdVosInfo.length)
      for (let i = 0; i < this.fileFdVos.length; i++) {
        this.fileFdVosInfo.push({
          fileIdx: i,
          fileName: this.fileFdVos[i].name,
        })
      }
    },
  }
}
</script>