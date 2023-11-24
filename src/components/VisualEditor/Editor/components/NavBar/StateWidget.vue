<template>
  <div class="visual-editor-StateWidget">
    <Action title="撤销" @click="changeState(ActionHandlerEnum.UNDO)">
      <Icon type="svg-undo" />
    </Action>
    <Action title="回退" @click="changeState(ActionHandlerEnum.REDO)">
      <Icon type="svg-redo" />
    </Action>
  </div>
</template>

<script lang="ts" setup name="VisualNavStateWidget">
  import { VisualEditor } from '../../lib/Editor/index'
  import { ActionHandler, ActionHandlerEnum } from '../../lib/Editor/ActionHandler'

  const props = defineProps({
    editor: {
      type: VisualEditor,
      required: true,
    },
  })

  const changeState = (event: string) => {
    ActionHandler(props.editor, event)
  }
</script>

<style lang="less" scoped>
  .visual-editor-StateWidget {
    height: 100%;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.action) {
      font-size: 20px;
    }
  }
</style>
