<template>
  <button class="btn btn-outline-secondary"
          v-if="this.roleArr.includes('ROLE_ADMIN')"
          @click="editCom" :disabled="isEditing" :hidden="isComAdding">編輯
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
      <input type="text" class="form-control" placeholder="企業名稱"
             v-model="currCom.comNm" :disabled="!isEditing">
    </div>
    <!-- 市場別 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">市場別</span>
      <input type="text" class="form-control" placeholder="市場別"
             v-model="currCom.comType" :disabled="!isEditing">
    </div>
    <!-- 產業別 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">產業別</span>
      <input type="text" class="form-control" placeholder="產業別"
             v-model="currCom.comIndus" :disabled="!isEditing">
    </div>
    <!-- 主要業務 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">主要業務</span>
      <input type="text" class="form-control" placeholder="主要業務"
             v-model="currCom.comMain" :disabled="!isEditing">
    </div>
    <!-- 相關產業 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關產業</span>
      <input type="text" class="form-control" placeholder="相關產業"
             v-model="currCom.comCoted" :disabled="!isEditing">
    </div>
    <!-- 相關概念 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關概念</span>
      <input type="text" class="form-control" placeholder="相關概念"
             v-model="currCom.comCep" :disabled="!isEditing">
    </div>
    <!-- 官方網站 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">官方網站</span>
      <input type="text" class="form-control" placeholder="官方網站"
             v-model="currCom.comOfcl" :disabled="!isEditing">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComInfoEdit',
  emits: ['isEditing'],
  data () {
    return {
      roleArr: this.$store.state.auth.user.roles,
      currCom: {},
      isEditing: false,
      isComAdding: false
    }
  },
  props: ['getCurrComInfoToEdit', 'currComInfo', 'getAddCondition', 'isAdding'],
  watch: {
    getCurrComInfoToEdit (currComInfo) {
      this.currCom = currComInfo
    },
    getAddCondition (isAdding) {
      this.isComAdding = isAdding
    }
  },
  methods: {
    editCom () {
      this.isEditing = true
      this.$emit('isEditing', this.isEditing)
    },
    cancelEditCom () {
      this.isEditing = false
      this.$emit('isEditing', this.isEditing)
    },
    updateCom () {

    }
  }
}
</script>

<style scoped>

</style>