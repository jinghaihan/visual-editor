<template>
  <div class="state-widget-container">
    <a-tooltip>
      <template slot="title">撤销</template>
      <UndoIcon class="icon" @click="onClick(true)"></UndoIcon>
    </a-tooltip>
    <a-tooltip>
      <template slot="title">回退</template>
      <RedoIcon RedoIcon class="icon" @click="onClick(false)"></RedoIcon>
    </a-tooltip>
  </div>
</template>

<script>
import { UndoIcon, RedoIcon } from '../../Icon'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    UndoIcon,
    RedoIcon
  },
  methods: {
    onClick (isUndo) {
      this.editor.changePaperState(isUndo)
    }
  }
}
</script>

<style lang="less" scoped>
  .state-widget-container{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
      cursor: pointer;
      margin: 0 8px;
      font-size: 18px;
      color: var(--font-color);
      >path{
        fill: var(--font-color);
      }
    }
  }
</style>
