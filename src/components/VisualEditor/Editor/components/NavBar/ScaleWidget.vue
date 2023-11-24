<template>
  <div class="visual-editor-ScaleWidget">
    <Action title="重置画布尺寸" @click="handleScale(ActionHandlerEnum.SCALE_RESET)">
      <Icon type="sync-outlined" />
    </Action>

    <Action title="放大画布" @click="handleScale(ActionHandlerEnum.SCALE_UP)">
      <Icon type="plus-outlined" />
    </Action>

    <div class="visual-editor-ScaleWidget-Slider">
      <a-slider
        :min="props.editor.setting.scaleSetting.min * 100"
        :max="props.editor.setting.scaleSetting.max * 100"
        :value="scale"
        @change="onSliderChange"
      />
    </div>

    <Action title="缩小画布" @click="handleScale(ActionHandlerEnum.SCALE_DOWN)">
      <Icon type="minus-outlined" />
    </Action>
  </div>
</template>

<script lang="ts" setup name="VisualNavScaleWidget">
  import { ref, onMounted, onBeforeMount } from 'vue'
  import { VisualEditor } from '../../lib/Editor/index'
  import { ActionHandler, ActionHandlerEnum } from '../../lib/Editor/ActionHandler'

  const props = defineProps({
    editor: {
      type: VisualEditor,
      required: true,
    },
  })

  const scale = ref(1 * 100)

  function onSliderChange(value) {
    const scale = Number((value / 100).toFixed(2))
    ActionHandler(props.editor, ActionHandlerEnum.SCALE_CHANGE, { scale })
  }

  function handleScale(event: string) {
    ActionHandler(props.editor, event)
  }

  onMounted(() => {
    props.editor.addBroadcastListener('notifyScaleChange', (message) => {
      scale.value = Number((message.scale * 100).toFixed(0))
    })
  })

  onBeforeMount(() => {
    props.editor.removeBroadcastListener('notifyScaleChange')
  })
</script>

<style lang="less" scoped>
  .visual-editor-ScaleWidget {
    height: 100%;
    width: 240px;
    display: flex;
    align-items: center;
    justify-content: center;

    .visual-editor-ScaleWidget-Slider {
      width: 80%;

      :deep(.@{ant-prefix}-slider-track) {
        background-color: @comment-color;
      }

      :deep(.@{ant-prefix}-slider-handle::after) {
        background-color: @comment-color;
        box-shadow: 0 0 0 2px @comment-color;
      }
    }
  }
</style>
