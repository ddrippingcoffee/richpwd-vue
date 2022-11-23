<template>
  <button class="btn btn-outline-primary"
          v-if="this.roleArr.includes('ROLE_ADMIN')"
          @click="addCom" :disabled="isAdding" :hidden="isComEditing">新增
  </button>
  <button class="btn btn-success float-right"
          @click="saveCom" :hidden="!isAdding">儲存資料
  </button>
  <button class="btn btn-outline-info"
          @click="cancelAddCom" :hidden="!isAdding">取消新增
  </button>
  <div :hidden="!isAdding || isComEditing">
    <!-- 股市代號 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center text-danger"
          id="basic-addon1">股市代號</span>
      <input type="text" class="form-control" v-model="newCom.symb">
    </div>
    <!-- 企業名稱 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">企業名稱</span>
      <input type="text" class="form-control"
             v-model="newCom.comNm">
    </div>
    <!-- 市場別 -->
    <div class="input-group mt-md-4">
      <span class="input-group-text w-25 justify-content-lg-center text-danger"
            id="basic-addon1">市場別</span>
      <select class="form-control" v-model="newCom.comType">
        <option value="-" disabled>選擇市場</option>
        <option value="市">市</option>
        <option value="櫃">櫃</option>
        <option value="ETF">ETF</option>
      </select>
    </div>
    <!-- 產業別 -->
    <div class="input-group mt-md-4">
      <span class="input-group-text w-25 justify-content-lg-center text-danger"
            id="basic-addon1">產業別</span>
      <select class="form-control" v-model="newCom.comIndus">
        <option value="-" disabled>選擇產業</option>
        <option v-for="indusOption in selectedIndusOption"
                :key="indusOption.comIndus" :value="indusOption.comIndus">
          {{ indusOption.comIndus }}
        </option>
      </select>
    </div>
    <!-- 相關產業 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關產業</span>
      <input type="text" class="form-control"
             v-model="newCom.comCoted">
    </div>
    <!-- 官方網站 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">官方網站</span>
      <input type="text" class="form-control"
             v-model="newCom.comOfcl">
    </div>
    <!-- 主要業務 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">主要業務</span>
      <textarea type="text" class="form-control" maxlength="250" rows="5"
                v-model="newCom.comMain"></textarea>
    </div>
    <!-- 相關概念 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關概念</span>
      <textarea type="text" class="form-control" maxlength="250" rows="5"
                v-model="newCom.comCep"></textarea>
    </div>
  </div>
</template>

<script>
import ComInfoService from '@/services/cominfo-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'ComInfoAdd',
  emits: ['isAdding', 'pageInfo'],
  data () {
    return {
      roleArr: this.$store.state.auth.user.roles,
      isAdding: false,
      isComEditing: false,
      newCom: this.initComInfo(),
      selectedIndusOption: []
    }
  },
  props: ['getEditingCondition', 'isEditing', 'getComIndusOptionList', 'comIndusOptionList'],
  watch: {
    getEditingCondition (isEditing) {
      this.isComEditing = isEditing
    },
    getComIndusOptionList (comIndusOptionList) {
      this.selectedIndusOption = comIndusOptionList
    }
  },
  methods: {
    initComInfo () {
      return {
        symb: '', comNm: '', comType: '-', comIndus: '-',
        comMain: '', comCoted: '', comCep: '', comOfcl: ''
      }
    },
    addCom () {
      this.isAdding = true
      this.$emit('isAdding', this.isAdding)
    },
    cancelAddCom () {
      this.newCom = {}
      this.isAdding = false
      this.$emit('isAdding', this.isAdding)
    },
    saveCom () {
      if (confirm('確定新增')) {
        ComInfoService.save(this.newCom).then((res) => {
              if (201 === res.status) {
                let param = {
                  'queryParam': this.newCom.symb,
                  'queryBy': 'symb', 'page': 0,
                }
                this.newCom = {}
                this.isAdding = false
                this.$emit('isAdding', this.isAdding)
                this.$emit('pageInfo', param)
              } else {
                alert('新增失敗')
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
            }
        )
      } else {
        alert('不新增')
      }
    }
  }
}
</script>

<style scoped>

</style>