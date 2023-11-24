<template>
  <div class="visual-editor-ComponentConfigPanel" :key="cellKey">
    <a-tabs type="card" :tabBarGutter="0">
      <a-tab-pane key="style" tab="样式">
        <!-- general config -->
        <FormGenerator
          ref="GeneralForm"
          v-if="formConfig.general"
          :config="formConfig.general"
          :defaultValue="defaultValue.general"
          @change="onGeneralChange"
        />
        <a-divider />
        <!-- style config -->
        <FormGenerator
          v-if="formConfig.style"
          :config="formConfig.style"
          :defaultValue="defaultValue.style"
          :assetsManager="props.editor.$assetsManager"
          :eventParameters="{
            editor: props.editor,
            cellKey: props.cellKey,
          }"
          @change="onStyleChange"
        />
      </a-tab-pane>
      <a-tab-pane key="data" tab="数据"> 数据 </a-tab-pane>
      <a-tab-pane key="event" tab="交互"> 交互 </a-tab-pane>
      <a-tab-pane key="animate" tab="动画"> 动画 </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup name="VisualEditorConfigPanelComp">
  import { watch, ref, toRefs, onMounted, onBeforeUnmount } from 'vue'
  import { generalFormConfig } from './config'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
    cellKey: {
      type: String,
      required: true,
    },
  })

  const { cellKey } = toRefs(props)
  const formConfig = ref({})
  const defaultValue = ref({})

  const init = () => {
    formConfig.value = {}
    defaultValue.value = {}

    const paper = props.editor.getCurrentPaper()
    if (!paper || !props.cellKey) {
      return
    }

    const cell = getCell()
    if (cell) {
      initConfig()
    } else {
      paper.setCellCallbackQueue[props.cellKey] = () => {
        initConfig()
      }
    }
  }

  const initConfig = () => {
    const cell = getCell()
    const paper = props.editor.getCurrentPaper()
    const layoutConfig = paper.getCellLayout(cell.key)

    defaultValue.value = {
      general: {
        name: cell.configData.name,
        keepRatio: layoutConfig.keepRatio,
        rotation: layoutConfig.rotation,
        x: layoutConfig.x,
        y: layoutConfig.y,
        w: layoutConfig.w,
        h: layoutConfig.h,
      },
      style:
        Object.keys(cell.configData.style).length > 0
          ? cell.configData.style
          : cell.getStyleFormDefaultValue(),
    }

    formConfig.value = {
      general: generalFormConfig,
      style: cell.styleFormConfig,
    }
  }

  const onGeneralChange = (value) => {
    const paper = props.editor.getCurrentPaper()
    paper.updateCellLayout(value)

    const { name } = value
    const cell = getCell()
    cell.configData.name = name
  }

  const onStyleChange = (value) => {
    const cell = getCell()

    if (cell) {
      cell.update('style', value)
    }
  }

  const getCell = () => {
    const paper = props.editor.getCurrentPaper()
    if (!paper || !props.cellKey) {
      return
    }

    return paper.cells[props.cellKey]
  }

  // watch cell active status change & update component panel
  watch(
    cellKey,
    () => {
      init()
    },
    {
      immediate: true,
    },
  )

  // update cell layout config
  const GeneralForm = ref()
  onMounted(() => {
    props.editor.addBroadcastListener('notifyCellLayoutChange', (message) => {
      if (GeneralForm.value) {
        const { rotation, x, y, w, h } = message

        const instance = GeneralForm.value
        instance.formData.rotation = rotation
        instance.formData.x = x
        instance.formData.y = y
        instance.formData.w = w
        instance.formData.h = h
      }
    })
  })

  onBeforeUnmount(() => {
    props.editor.removeBroadcastListener('notifyCellLayoutChange')
  })
</script>

<style lang="less" scoped>
  :deep(.@{ant-prefix}-tabs) {
    height: 100%;

    &-nav {
      margin-bottom: 0;
    }

    &-tab {
      width: 65px;
      border-color: transparent !important;
    }

    &-content-holder {
      height: calc(~'100% - 40px');
      padding: 12px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  :deep(.@{ant-prefix}-divider) {
    margin-bottom: 12px;
  }
</style>
