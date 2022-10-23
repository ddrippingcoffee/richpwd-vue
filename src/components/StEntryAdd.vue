<template>
  <form>
    <strong>Symbol :</strong>
    <input id="symbol" name="symbol" type="text"
           class="form-control" v-model="symbol"/><br/>
    <span class="btn btn-sm btn-outline-dark"
          @click="addDtl" style="cursor: pointer;">
      Create New Stock Detail</span>
    <span class="btn btn-sm btn-outline-dark"
          @click="showAllData" style="cursor: pointer;">
      console All Data showAllData</span>
    <div class="border-0"
         v-for="(detail, counter) in details"
         v-bind:key="counter"><br/>
      <div>
        <span class="btn-sm btn-outline-danger float-right" @click="deleteDtl(counter)">Delete</span>
        <strong>{{ counter + 1 }}. &nbsp;&nbsp;</strong>
        <input type="radio" id="date" value="Date" v-model="detail.dtlTy">
        <label for="note"> Date &nbsp;&nbsp;</label>
        <input type="radio" id="note" value="Note" v-model="detail.dtlTy">
        <label for="note"> Note &nbsp;&nbsp;</label>
        <input type="radio" id="link" value="Link" v-model="detail.dtlTy">
        <label for="note"> Link </label>
        <input class="form-control" type="text" placeholder="Detail Brief"
               v-model.lazy="detail.dtlBrf"><br/>
        <input class="form-control" type="text" placeholder="Detail Information"
               v-model.lazy="detail.dtlInfo"><br/>
        <input class="form-control" type="text" placeholder="Detail Description"
               v-model.lazy="detail.dtlDes">
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'StEntryAdd',
  data () {
    return {
      symbol: '',
      details: [{ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' }]
    }
  },
  methods: {
    addDtl () {
      this.details.push({ dtlTy: '', dtlBrf: '', dtlInfo: '', dtlDes: '' })
    },
    deleteDtl (counter) {
      this.details.splice(counter, 1)
    },
    showAllData () {
      // TODO
      console.log(this.$data)
    },
  }
}
</script>