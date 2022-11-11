<template>
  <br/>
  <div class="row">
    <div class="col" v-if="!toAdd">
      <ul class="list-group" v-if="0 !== activeComEntryVoList.length">
        <li class="list-group-item border-top-0 border-right-0 border-left-0"
            style="border-width:5px"
            v-for="(comEntry,entryIndex) in activeComEntryVoList"
            :key="entryIndex">
          <strong>{{ comEntry.stEntry.symb }} : {{ comEntry.comType }} {{ comEntry.comNm }}</strong><br/>
          建立時間 : {{ comEntry.stEntry.c8tDtm }} <br/>
          {{ comEntry.comIndus }}
          <!-- DB 資料 -->
          <div v-for="(fileDbInfo, fileDbInfoIndex) in comEntry.fileDbInfoList" :key="fileDbInfoIndex">
            {{ fileDbInfo.dbFileTy }} : {{ fileDbInfo.dbFileNm }}
            <a v-if="fileDbInfo.base64ImgStr"
               :href="fileDbInfo.base64ImgStr" :download="fileDbInfo.dbFileNm">
              <img :alt="fileDbInfo.dbFileNm" :src="fileDbInfo.base64ImgStr"
                   width="100"/>
            </a>
          </div>
          <!-- FD 資料 -->
          <div v-for="(fileFdInfo, fileFdInfoIndex) in comEntry.fileFdInfoList" :key="fileFdInfoIndex">
            {{ fileFdInfo.fdFileTy }} : {{ fileFdInfo.fdFileNm }}
            <a v-if="fileFdInfo.base64ImgStr"
               :href="fileFdInfo.base64ImgStr" :download="fileFdInfo.fdFileNm">
              <img :alt="fileFdInfo.fdFileNm" :src="fileFdInfo.base64ImgStr"
                   width="100"/>
            </a>
            <span v-else class="btn btn-outline-info" @click="downloadFileFd(fileFdInfo)">
              {{ fileFdInfo.fdFileNm }}
            </span>
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
      <ul class="list-group" v-else> 無資料</ul>
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
      newFilesFdArr: []
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
                this.activeComEntryVoList
                .splice(this.activeComEntryVoList.indexOf(this.activeComEntryVoList[entryIndex]), 1)
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
      for (const dbVo of allAddData.fileDbInfoList) {
        formData.append('fileDbs', dbVo)
      }
      // 資料放 Folder
      for (const fdVo of allAddData.fileFdInfoList) {
        formData.append('fileFds', fdVo)
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

            newComEntryVo['fileDbInfoList'] = []
            newComEntryVo['fileFdInfoList'] = []
            if (0 !== allAddData.fileDbInfoList.length) {
              for (let i = 0; i < allAddData.fileDbInfoList.length; i++) {
                newComEntryVo['fileDbInfoList'][i] = {}
              }
              this.setNewFilesDb(allAddData.fileDbInfoList)
            }
            if (0 !== allAddData.fileFdInfoList.length) {
              for (let i = 0; i < allAddData.fileFdInfoList.length; i++) {
                newComEntryVo['fileFdInfoList'][i] = {}
              }
              this.setNewFilesFd(allAddData.fileFdInfoList)
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
    setNewFilesDb (fileDbInfoList) {
      for (let i = 0; i < fileDbInfoList.length; i++) {
        let dbVo = fileDbInfoList[i]
        if ('image' === dbVo.type.substring(0, 5)) {
          Promise.all(([i, dbVo, this.imgToBase64(dbVo)])).then(value => {
            this.activeComEntryVoList[0]['fileDbInfoList'][value[0]]['dbFileNm'] = value[1].name
            this.activeComEntryVoList[0]['fileDbInfoList'][value[0]]['dbFileTy'] = value[1].type
            this.activeComEntryVoList[0]['fileDbInfoList'][value[0]]['base64ImgStr'] = value[2]
            this.activeComEntryVoList[0]['fileDbInfoList'][value[0]]['size'] = value[1].size
          })
        } else {
          // 目前 DB 只處理 Image
          // this.activeComEntryVoList[0]['fileDbInfoList'][i]['dbFileNm'] = dbVo.name
          // this.activeComEntryVoList[0]['fileDbInfoList'][i]['dbFileTy'] = dbVo.type
          // this.activeComEntryVoList[0]['fileDbInfoList'][i]['size'] = dbVo.size
        }
      }
    },
    setNewFilesFd (fileFdInfoList) {
      for (let i = 0; i < fileFdInfoList.length; i++) {
        let fdVo = fileFdInfoList[i]
        if ('image' === fdVo.type.substring(0, 5)) {
          Promise.all(([i, fdVo, this.imgToBase64(fdVo)])).then(value => {
            this.activeComEntryVoList[0]['fileFdInfoList'][value[0]]['fdFileNm'] = value[1].name
            this.activeComEntryVoList[0]['fileFdInfoList'][value[0]]['fdFileTy'] = value[1].type
            this.activeComEntryVoList[0]['fileFdInfoList'][value[0]]['base64ImgStr'] = value[2]
            this.activeComEntryVoList[0]['fileFdInfoList'][value[0]]['size'] = value[1].size
          })
        } else {
          this.activeComEntryVoList[0]['fileFdInfoList'][i]['fdFileNm'] = fdVo.name
          this.activeComEntryVoList[0]['fileFdInfoList'][i]['fdFileTy'] = fdVo.type
          this.activeComEntryVoList[0]['fileFdInfoList'][i]['size'] = fdVo.size
          let fdDownloadNm = Date.now() + '@@' + fdVo.name
          this.activeComEntryVoList[0]['fileFdInfoList'][i]['fdDownloadNm'] = fdDownloadNm
          this.newFilesFdArr.push({ [fdDownloadNm]: fdVo })
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
      // 新增的檔案
      if (undefined === file.uid) {
        let newFile = this.newFilesFdArr.find(newFdFile => {
          return null !== newFdFile[file.fdDownloadNm]
        })
        let fdFile = newFile[file.fdDownloadNm]
        const blob = new Blob([fdFile], { type: fdFile.type })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fdFile.name
        link.click()
        URL.revokeObjectURL(link.href)
      } else {
        StEntryService.downloadFileFd(file.uid).then(res => {
          const blob = new Blob([res.data], { type: res.headers['content-type'] })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = file.fdFileNm
          link.click()
          URL.revokeObjectURL(link.href)
        })
      }
    },
    displayDbImg (uid) {
      return StEntryService.getFileDbImg64(uid).then(
          (res) => {
            return res.data
          }, (error) => {
            console.log(error)
          }
      )
    },
    displayFdImg (uid) {
      return StEntryService.getFileFdImg64(uid).then(
          (res) => {
            return res.data
          }, (error) => {
            console.log(error)
          }
      )
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
    }).then(() => {
      this.activeComEntryVoList.forEach(entry => {
        entry['fileDbInfoList'].forEach(dbInfo => {
          this.displayDbImg(dbInfo['uid']).then((res) => {dbInfo['base64ImgStr'] = res})
        })
      })
    }).then(() => {
      this.activeComEntryVoList.forEach(entry => {
        entry['fileFdInfoList'].forEach(fdInfo => {
          if ('image' === fdInfo['fdFileTy'].substring(0, 5)) {
            this.displayFdImg(fdInfo['uid']).then((res) => {fdInfo['base64ImgStr'] = res})
          }
          fdInfo['fdFileNm'] = fdInfo['fdFileNm'].substring(15)
        })
      })
    })
  }
}
</script>

<style scoped>

</style>