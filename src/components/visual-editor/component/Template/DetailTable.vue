<template>
  <div ref="Container"
       class="visual-detailtable-container">
    <SpreadSheet ref="Sheet"
                 @init="inited"
                 @select="onSelect">
    </SpreadSheet>
  </div>
</template>

<script>
import SpreadSheet from '../SpreadSheet'

export default {
  name: 'DetailTable',
  components: { SpreadSheet },
  props: {
    instance: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      xsSheet: null,
      selector: {}
    }
  },
  methods: {
    inited (xsSheet) {
      this.xsSheet = xsSheet
    },
    onSelect (data) {
      this.selector = {
        ri: data.ri,
        ci: data.ci
      }

      this.instance.$event.emit('onTableSelect', {
        selector: this.selector,
        key: this.data.key
      })
    },
    onResize () {
      try {
        if (this.xsSheet) {
          this.xsSheet.sheet.reload()
        }
      } catch (error) {

      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-detailtable-container{
    height: 100%;
    width: 100%;
    background: #fff;
  }
</style>
