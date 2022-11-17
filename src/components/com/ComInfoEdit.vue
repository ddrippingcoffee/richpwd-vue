<template>
  <button class="btn btn-outline-secondary"
          v-if="this.roleArr.includes('ROLE_ADMIN')"
          @click="editCom" :disabled="isEditing" :hidden="isComAdding || undefined === this.currCom.symb">編輯
  </button>
  <button class="btn btn-success float-right"
          @click="updateCom" :hidden="!isEditing || isComAdding">更新資料
  </button>
  <button class="btn btn-outline-info"
          @click="cancelEditCom" :hidden="!isEditing || isComAdding">取消編輯
  </button>
  <div :hidden="isComAdding">
    <!-- 股市代號 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">股市代號</span>
      <input type="text" class="form-control" v-model="currCom.symb" disabled>
    </div>
    <!-- 企業名稱 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">企業名稱</span>
      <input type="text" class="form-control"
             v-model="currCom.comNm" :disabled="!isEditing">
    </div>
    <!-- 市場別 -->
    <div class="input-group mt-md-4" :hidden="!isEditing">
      <span class="input-group-text w-25 justify-content-lg-center text-danger"
            id="basic-addon1">市場別</span>
      <select class="form-control" v-model="currCom.comType" :disabled="!isEditing">
        <option value="市">市</option>
        <option value="櫃">櫃</option>
        <option value="ETF">ETF</option>
      </select>
    </div>
    <div class="input-group mt-md-4" :hidden="isEditing">
      <span class="input-group-text w-25 justify-content-lg-center"
            id="basic-addon1">市場別</span>
      <input type="text" class="form-control" v-model="currCom.comType" disabled>
    </div>
    <!-- 產業別 -->
    <div class="input-group mt-md-4" :hidden="!isEditing">
      <span class="input-group-text w-25 justify-content-lg-center text-danger"
            id="basic-addon1">產業別</span>
      <select class="form-control" v-model="currCom.comIndus" :disabled="!isEditing">
        <option v-for="indusOption in selectedIndusOption"
                :key="indusOption.comIndus" :value="indusOption.comIndus">
          {{ indusOption.comIndus }}
        </option>
      </select>
    </div>
    <div class="input-group mt-md-4" :hidden="isEditing">
      <span class="input-group-text w-25 justify-content-lg-center"
            id="basic-addon1">產業別</span>
      <input type="text" class="form-control" v-model="currCom.comIndus" disabled>
    </div>
    <!-- 主要業務 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">主要業務</span>
      <input type="text" class="form-control"
             v-model="currCom.comMain" :disabled="!isEditing">
    </div>
    <!-- 相關產業 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關產業</span>
      <input type="text" class="form-control"
             v-model="currCom.comCoted" :disabled="!isEditing">
    </div>
    <!-- 相關概念 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關概念</span>
      <input type="text" class="form-control"
             v-model="currCom.comCep" :disabled="!isEditing">
    </div>
    <!-- 官方網站 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">官方網站</span>
      <input type="text" class="form-control"
             v-model="currCom.comOfcl" :disabled="!isEditing">
    </div>
  </div>
</template>

<script>
import ComInfoService from '@/services/cominfo-service'
import EventBus from '@/common/EventBus'

export default {
  name: 'ComInfoEdit',
  emits: ['isEditing'],
  data () {
    return {
      roleArr: this.$store.state.auth.user.roles,
      currCom: {},
      currComBk: {},
      isEditing: false,
      isComAdding: false,
      selectedIndusOption: []
    }
  },
  props: ['getCurrComInfoToEdit', 'currComInfo',
    'getAddCondition', 'isAdding',
    'getComIndusOptionList', 'comIndusOptionList'],
  watch: {
    getCurrComInfoToEdit (currComInfo) {
      this.currCom = currComInfo
      Object.assign(this.currComBk, currComInfo)
    },
    getAddCondition (isAdding) {
      this.isComAdding = isAdding
    },
    getComIndusOptionList (comIndusOptionList) {
      this.selectedIndusOption = comIndusOptionList
    }
  },
  methods: {
    editCom () {
      this.isEditing = true
      this.$emit('isEditing', this.isEditing)
    },
    cancelEditCom () {
      Object.assign(this.currCom, this.currComBk)
      this.isEditing = false
      this.$emit('isEditing', this.isEditing)
    },
    updateCom () {
      if (confirm('確定更新?')) {
        ComInfoService.updateCom(this.currCom).then(
            (res) => {
              if (200 === res.status) {
                this.isEditing = false
                this.$emit('isEditing', this.isEditing)
              } else {
                alert('更新失敗')
                alert(res)
              }
            }, (error) => {
              if (403 === error.response.status) {
                EventBus.dispatch('logout')
              }
              let errMsg = 'Oops! Something went wrong'
              if (error.response.data.message) {
                errMsg = error.response.data.message
              }
              alert('錯誤 : ' + errMsg)
            }
        )
      } else {
        alert('不更新')
      }
    }
  }
}
</script>

<style scoped>

</style>