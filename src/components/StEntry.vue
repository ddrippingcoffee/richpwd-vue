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
          <div v-for="(dbVos, dbVoIndex) in comEntry.fileDbVos" :key="dbVoIndex">
            {{ dbVos.type }} : {{ dbVos.name }}
            <img v-if="dbVos.base64ImgStr"
                 :alt="dbVos.name" :src="dbVos.base64ImgStr"
                 width="100"/>
          </div>
          <div v-for="(fdVos, fdVoIndex) in comEntry.fileFdVos" :key="fdVoIndex">
            {{ fdVos.type }} : {{ fdVos.name }}
            <img v-if="fdVos.base64ImgStr"
                 :alt="fdVos.name" :src="fdVos.base64ImgStr"
                 width="100"/>
            <span v-else class="btn btn-outline-info" @click="downloadFileFd(fdVos)">{{ fdVos.name }}</span>
          </div>
          <button class="btn btn-outline-danger btn-sm float-right"
                  @click="deleteEntry(entryIndex,comEntry.stEntry.symb,comEntry.stEntry.c8tDtm)">
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
        <StEntryAdd @newEntryData="saveEntry($event)"
                    :limitPerFile="limitPerFile"
                    :limitPerReq="limitPerReq"/>
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
import { toRaw } from 'vue'

export default {
  name: 'StEntry',
  data () {
    return {
      activeComEntryVoList: [],
      toAdd: false,
      limitPerFile: '',
      limitPerReq: '',
    }
  },
  components: {
    StEntryAdd
  },
  methods: {
    toggleAddPage () {
      this.toAdd = !this.toAdd
    },
    deleteEntry (entryIndex, symb, c8tDtm) {
      if (confirm('確定刪除??')) {
        StEntryService.deleteActiveEntry(symb, c8tDtm).then(
            (res) => {
              if (1 === res.data) {
                this.activeComEntryVoList.splice(this.activeComEntryVoList.indexOf(this.activeComEntryVoList[entryIndex]), 1)
              }
            }, (error) => {
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
    saveEntry (allAddData) {
      const formData = new FormData()
      // 輸入資料
      let entryObj = {}
      entryObj.symb = allAddData.symb
      entryObj.stDtlList = toRaw(allAddData.stDtlList)

      const json = JSON.stringify(entryObj)
      const blob = new Blob([json], { type: 'application/json' })
      formData.append('entryJsonStr', blob)
      // 圖片資料存 DB
      for (const fileDbVo of allAddData.fileDbVos) {
        formData.append('fileDbs', fileDbVo)
      }
      // 資料放 Folder
      for (const fileFdVo of allAddData.fileFdVos) {
        formData.append('fileFds', fileFdVo)
      }
      StEntryService.save(formData).then(
          (res) => {
            let newStEntry = {}
            newStEntry['symb'] = allAddData['symb']
            newStEntry['stDtlList'] = toRaw(allAddData['stDtlList'])
            newStEntry['c8tDtm'] = res.data.substring(0, 19)
            let newComEntryVo = {}
            newComEntryVo['comNm'] = 'New'
            newComEntryVo['comType'] = 'New'
            newComEntryVo['comIndus'] = 'New'
            newComEntryVo['stEntry'] = newStEntry
            this.activeComEntryVoList.unshift(newComEntryVo)
            this.toggleAddPage()

            newComEntryVo['fileDbVos'] = []
            newComEntryVo['fileFdVos'] = []
            if (0 !== allAddData.fileDbVos.length) {
              for (let i = 0; i < allAddData.fileDbVos.length; i++) {
                newComEntryVo['fileDbVos'][i] = {}
              }
              this.setNewFilesDb(allAddData.fileDbVos)
            }
            if (0 !== allAddData.fileFdVos.length) {
              for (let i = 0; i < allAddData.fileFdVos.length; i++) {
                newComEntryVo['fileFdVos'][i] = {}
              }
              this.setNewFilesFd(allAddData.fileFdVos)
            }
          }, (error) => {
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
    },
    setNewFilesDb (fileDbVos) {
      for (let i = 0; i < fileDbVos.length; i++) {
        let fileDbVo = fileDbVos[i]
        if ('image' === fileDbVo.type.substring(0, 5)) {
          Promise.all(([i, fileDbVo, this.imgToBase64(fileDbVo)])).then(value => {
            this.activeComEntryVoList[0]['fileDbVos'][value[0]]['name'] = value[1].name
            this.activeComEntryVoList[0]['fileDbVos'][value[0]]['type'] = value[1].type
            this.activeComEntryVoList[0]['fileDbVos'][value[0]]['size'] = value[1].size
            this.activeComEntryVoList[0]['fileDbVos'][value[0]]['base64ImgStr'] = value[2]
          })
        } else {
          // 目前 DB 只處理 Image
          // this.activeComEntryVoList[0]['fileDbVos'][i]['name'] = fileDbVo.name
          // this.activeComEntryVoList[0]['fileDbVos'][i]['type'] = fileDbVo.type
          // this.activeComEntryVoList[0]['fileDbVos'][i]['size'] = fileDbVo.size
        }
      }
    },
    setNewFilesFd (fileFdVos) {
      for (let i = 0; i < fileFdVos.length; i++) {
        let fileFdVo = fileFdVos[i]
        if ('image' === fileFdVo.type.substring(0, 5)) {
          Promise.all(([i, fileFdVo, this.imgToBase64(fileFdVo)])).then(value => {
            this.activeComEntryVoList[0]['fileFdVos'][value[0]]['name'] = value[1].name
            this.activeComEntryVoList[0]['fileFdVos'][value[0]]['type'] = value[1].type
            this.activeComEntryVoList[0]['fileFdVos'][value[0]]['size'] = value[1].size
            this.activeComEntryVoList[0]['fileFdVos'][value[0]]['base64ImgStr'] = value[2]
          })
        } else {
          this.activeComEntryVoList[0]['fileFdVos'][i]['name'] = fileFdVo.name
          this.activeComEntryVoList[0]['fileFdVos'][i]['type'] = fileFdVo.type
          this.activeComEntryVoList[0]['fileFdVos'][i]['size'] = fileFdVo.size
        }
      }
    },
    imgToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    downloadFileFd (file) {
      StEntryService.downloadFileFd(file.fileUid).then(res => {
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = file.name
        link.click()
        URL.revokeObjectURL(link.href)
      })
    }
  },
  mounted () {
    StEntryService.getAllActiveEntry()
    .then((res) => {
      this.activeComEntryVoList = res.data.stEntryList
      this.limitPerFile = res.data.limitPerFile
      this.limitPerReq = res.data.limitPerReq
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