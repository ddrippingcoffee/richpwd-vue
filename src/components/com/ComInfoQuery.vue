<template>
  <div class="input-group-sm">
    <select v-model="selectedIndus"
            @change="getComByIndusSelected">
      <option value="-" disabled>選擇產業</option>
      <option v-for="indusOption in comIndusOptionList"
              :key="indusOption.comIndus" :value="indusOption.comIndus">
        {{ indusOption.comIndus }}
      </option>
    </select><br/>
    <input type="text" class="form-control-sm" placeholder="Search by indus"
           v-model="searchIndus"/>
    <button class="btn-sm btn-outline-secondary" type="button"
            @click="getComByIndusBtn();">
      Search
    </button>
  </div>
</template>

<script>
import ComInfoService from '../../services/cominfo-service'

export default {
  name: 'ComInfoQuery',
  emits: ['queryRslt'],
  data () {
    return {
      comIndusOptionList: [],
      selectedIndus: '-',
      queryRslt: {},
      searchIndus: '',
    }
  },
  props: ['getComByIndusPageInfo', 'pageInfo'],
  watch: {
    getComByIndusPageInfo (pageInfo) {
      ComInfoService.getByComIndusPage(pageInfo.indus, pageInfo.page)
      .then((res) => {
        res.data.queryParam = pageInfo.indus
        this.$emit('queryRslt', res.data)
      })
    }
  },
  methods: {
    getComByIndusSelected () {
      ComInfoService.getByComIndusPage(this.selectedIndus, 0)
      .then((res) => {
        res.data.queryParam = this.selectedIndus
        this.$emit('queryRslt', res.data)
      }, (error) => {
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
    getComByIndusBtn () {
      ComInfoService.getByComIndusPage(this.searchIndus, 0)
      .then((res) => {
        res.data.queryParam = this.searchIndus
        this.$emit('queryRslt', res.data)
      }, (error) => {
        let errMsg = 'Oops! Something went wrong'
        if (error.response.data.message) {
          errMsg = error.response.data.message
        }
        alert('錯誤 : ' + errMsg)
      })
    },
  },
  mounted () {
    ComInfoService.getComIndusList()
    .then((res) => {
      this.comIndusOptionList = res.data
    })
  }
}
</script>