<template>
  <br/>
  <div class="row">
    <div class="col">
      <ul class="list-group" v-if="0 !== oldComEntryVoList.length">
        <li class="list-group-item border-top-0 border-right-0 border-left-0"
            style="border-width:5px"
            v-for="(comEntry,entryIndex) in oldComEntryVoList"
            :key="entryIndex">
          <strong>{{ comEntry.stEntry.symb }} : {{ comEntry.comType }} {{ comEntry.comNm }}</strong><br/>
          建立時間 : {{ comEntry.stEntry.c8tDtm }} &nbsp;&nbsp; 刪除時間 : {{ comEntry.stEntry.delDtm }}<br/>
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
  </div>
</template>


<script>
import StEntryService from '../services/stentry-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'StEntryOld',
  data () {
    return {
      oldComEntryVoList: [],
    }
  },
  methods: {
    imgToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    downloadFileFd (file) {
      StEntryService.downloadFileFd(file.uid).then(res => {
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = file.fdFileNm
        link.click()
        URL.revokeObjectURL(link.href)
      })
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
    StEntryService.getAllOldEntry()
    .then((res) => {
      this.oldComEntryVoList = res.data.stEntryList
    }, (error) => {
      if (403 === error.response.status) {
        EventBus.dispatch('logout')
      } else {
        alert('取得資料失敗:' + error)
      }
    }).then(() => {
      this.oldComEntryVoList.forEach(entry => {
        entry['fileDbInfoList'].forEach(dbInfo => {
          this.displayDbImg(dbInfo['uid']).then((res) => {dbInfo['base64ImgStr'] = res})
        })
      })
    }).then(() => {
      this.oldComEntryVoList.forEach(entry => {
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