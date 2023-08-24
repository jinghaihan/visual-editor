<template>
  <div class="visual-editor-navbar-toolbox-container">

    <a-divider class="divider" type="vertical"></a-divider>
    <StateWidget :editor="editor"></StateWidget>
    
    <a-divider class="divider" type="vertical"></a-divider>
    <ScaleWidget :editor="editor"></ScaleWidget>

    <a-divider class="divider" type="vertical"></a-divider>
    <TooltipIcon v-for="action in editor.config.operation.toolbox"
                 :key="action.key"
                 :class="'action ' + action.key + '-action'"
                 :title="action.name"
                 :type="action.icon"
                 @click="onAction(action)">
    </TooltipIcon>

    <a-divider class="divider" type="vertical"></a-divider>
    <HotkeyWidget></HotkeyWidget>

  </div>
</template>

<script>
import TooltipIcon from '../../TooltipIcon/tooltipIcon.vue'
import StateWidget from './stateWidget.vue'
import ScaleWidget from './scaleWidget.vue'
import HotkeyWidget from './hotkeyWidget.vue'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipIcon,
    StateWidget,
    ScaleWidget,
    HotkeyWidget
  },
  methods: {
    onAction (action) {
      let _this = this
      const factory = {
        'clear': () => {
          _this.editor.onClear()
        }
      }
      factory[action.key]()
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-navbar-toolbox-container{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--font-color);
    /deep/.ant-divider-vertical{
      height: 1.3em;
      color: var(--font-color);
      filter: brightness(120%);
    }
    .action{
      font-size: 18px;
      margin: 0 8px;
      opacity: .8;
    }
    .clear-action{
      color: var(--danger-color);
    }
  }
</style>
