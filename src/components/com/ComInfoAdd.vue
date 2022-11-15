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
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">股市代號</span>
      <input type="text" class="form-control" v-model="newCom.symb">
    </div>
    <!-- 企業名稱 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">企業名稱</span>
      <input type="text" class="form-control" placeholder="企業名稱"
             v-model="newCom.comNm">
    </div>
    <!-- 市場別 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">市場別</span>
      <input type="text" class="form-control" placeholder="市場別"
             v-model="newCom.comType">
    </div>
    <!-- 產業別 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">產業別</span>
      <input type="text" class="form-control" placeholder="產業別"
             v-model="newCom.comIndus">
    </div>
    <!-- 主要業務 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">主要業務</span>
      <input type="text" class="form-control" placeholder="主要業務"
             v-model="newCom.comMain">
    </div>
    <!-- 相關產業 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關產業</span>
      <input type="text" class="form-control" placeholder="相關產業"
             v-model="newCom.comCoted">
    </div>
    <!-- 相關概念 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">相關概念</span>
      <input type="text" class="form-control" placeholder="相關概念"
             v-model="newCom.comCep">
    </div>
    <!-- 官方網站 -->
    <div class="input-group mt-md-4">
    <span class="input-group-text w-25 justify-content-lg-center"
          id="basic-addon1">官方網站</span>
      <input type="text" class="form-control" placeholder="官方網站"
             v-model="newCom.comOfcl">
    </div>
  </div>
</template>

<script>
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
        symb: '', comNm: '', comType: '', comIndus: '',
        comMain: '', comCoted: '', comCep: '', comOfcl: ''
      }
    },
    addCom () {
      this.isAdding = true
      this.$emit('isAdding', this.isAdding)
    },
    cancelAddCom () {
      this.isAdding = false
      this.$emit('isAdding', this.isAdding)
    },
    saveCom () {

    }
  }
}
</script>

<style scoped>

</style>