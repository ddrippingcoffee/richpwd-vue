<template>
  <div :hidden="0 === Object.keys(currEvent).length"
       style="background-repeat: no-repeat;position: fixed;margin-right: 0.5%;"
       :style="{'width': winWidthPx,'height': winHeightPx,}"
       class="overlay">
  </div>

</template>

<script>
export default {
  name: 'StEntryImg',
  data () {
    return {
      currEvent: {},
      winWidthPx: '',
      winHeightPx: '',
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
        let currWinWidth = (window.innerWidth / 2.4)
        let currWinHeight = (window.innerHeight / 1.2)

        /* 取的 div 並設定背景圖 */
        let ele = document.getElementsByClassName('overlay')[0]
        ele.style.backgroundImage = 'url(' + this.currEvent.srcElement.currentSrc + ')'
        /* 設定原圖顯示位置 */
        let x = this.currEvent.offsetX / target.offsetWidth * 100
        let y = this.currEvent.offsetY / target.offsetHeight * 100
        ele.style.backgroundPosition = x + '% ' + y + '%'

        /* 設定 div width */
        if (naturalWidth > currWinWidth) {
          this.winWidthPx = (currWinWidth - 80) + 'px'
        } else {
          this.winWidthPx = naturalWidth + 'px'
        }
        /* 設定 div height */
        if (naturalHeight > currWinHeight) {
          this.winHeightPx = currWinHeight + 'px'
        } else {
          this.winHeightPx = naturalHeight + 'px'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>