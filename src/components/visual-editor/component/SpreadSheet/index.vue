<template>
  <div ref="Container"
       class="visual-spreadsheet-container"></div>
</template>

<script>
import $ from 'jquery'
import Spreadsheet from 'x-data-spreadsheet'

export default {
  data () {
    return {
      xsSheet: {},
      sheetConfig: {
        mode: 'read',
        showToolbar: false,
        showBottomBar: false,
        showContextmenu: false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let _this = this

      let el = _this.$refs.Container

      let sheetConfig = {
        view: {
          width: () => $(el).innerWidth(),
          height: () => $(el).innerHeight()
        },
        ...this.sheetConfig
      }

      _this.xsSheet = new Spreadsheet(el, sheetConfig)

      _this.xsSheet.on('cell-selected', function (cell, ri, ci) {
        _this.onSelect(cell, ri, ci)
      })

      _this.$emit('init', this.xsSheet)

      await _this.$nextTick()
      _this.xsSheet.sheet.reload()
    },
    onSelect (cell, ri, ci) {
      this.$emit('select', {
        cell, ri, ci
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-spreadsheet-container{
    height: 100%;
    width: 100%;
  }
</style>
