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
  </form>
</template>

<script>
export default {
  name: 'StEntryAdd',
  emits: ['newEntryData'],
  data () {
    return {
      symb: '',
      stDtlList: [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }]
    }
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
  }
}
</script>