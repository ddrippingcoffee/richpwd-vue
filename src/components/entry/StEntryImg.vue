<template>
  <div :hidden="0 === Object.keys(currEvent).length"
       :style="{
          'float':'right','background-repeat':'no-repeat',
          'width': windowWidthPx,'height': windowHeightPx,
       }"
       class="overlay">
    <!-- > border: 1px solid black; <-->
  </div>

</template>

<script>
export default {
  name: 'StEntryImg',
  data () {
    return {
      currEvent: {},
      windowWidth: window.screen.width / 2.4,
      windowHeight: window.screen.height / 1.4,
      windowWidthPx: '',
      windowHeightPx: '',
    }
  },
  props: ['getImgEvent', 'imgEvent',],
  watch: {
    getImgEvent (imgEvent) {
      this.currEvent = imgEvent
      this.zoomIn()
    }
  },
  methods: {
    zoomIn () {
      if (0 !== Object.keys(this.currEvent).length) {
        let target = this.currEvent.target
        let srcElement = this.currEvent.srcElement
        let naturalWidth = srcElement.naturalWidth
        let naturalHeight = srcElement.naturalHeight

        /* 取的 div 並設定背景圖 */
        let ele = document.getElementsByClassName('overlay')[0]
        ele.style.backgroundImage = 'url(' + this.currEvent.srcElement.currentSrc + ')'
        /* 設定原圖顯示位置 */
        let x = this.currEvent.offsetX / target.offsetWidth * 100
        let y = this.currEvent.offsetY / target.offsetHeight * 100
        ele.style.backgroundPosition = x + '% ' + y + '%'

        /* 設定 div width */
        if (naturalWidth > this.windowWidth) {
          this.windowWidthPx = this.windowWidth + 'px'
        } else {
          this.windowWidthPx = naturalWidth + 'px'
        }
        /* 設定 div height */
        if (naturalHeight > this.windowHeight) {
          this.windowHeightPx = this.windowHeight + 'px'
        } else {
          this.windowHeightPx = naturalHeight + 'px'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>