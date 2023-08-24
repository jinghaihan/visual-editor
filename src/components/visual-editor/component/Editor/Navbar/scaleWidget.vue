<template>
  <div class="scale-widget-container">
    <TooltipIcon class="icon scale-icon"
                 title="重置画布尺寸"
                 type="sync"
                 @click="onScaleReset()">
    </TooltipIcon>
    <TooltipIcon class="icon"
                 title="放大"
                 type="plus"
                 @click="onScale('up')">
    </TooltipIcon>
    <span class="scale">{{(editor.scale * 100).toFixed(0)}}%</span>
    <TooltipIcon class="icon"
                 title="缩小"
                 type="minus"
                 @click="onScale('down')">
    </TooltipIcon>
  </div>
</template>

<script>
import TooltipIcon from '../../TooltipIcon/tooltipIcon.vue'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: { TooltipIcon },
  methods: {
    onScale (direction) {
      this.editor.changeScale(direction)
    },
    onScaleReset () {
      this.editor.resetScale()
    }
  }
}
</script>

<style lang="less" scoped>
  .scale-widget-container{
    display: flex;
    align-items: center;
    .scale{
      font-weight: bold;
      font-size: 15px;
      user-select: none;
    }
    .icon{
      margin: 0 8px;
      font-size: 14px;
    }
    .scale-icon{
      font-size: 13px;
    }
  }
</style>
