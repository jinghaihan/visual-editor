<template>
  <div class="visual-editor-SideBar-ComponentPanel">
    <!-- search -->
    <div class="search-container">
      <a-input-search placeholder="组件名称" @search="(value) => (query = value)" />
    </div>

    <!-- component list -->
    <div class="list-container">
      <div v-for="componentType in componentSetting" :key="componentType.type">
        <a-divider>
          <Icon :type="componentType.icon" />
          {{ componentType.name }}
        </a-divider>

        <div class="content">
          <a-row :gutter="[8, 8]">
            <a-col
              :span="12"
              v-for="component in componentType.components"
              :key="component.type"
              v-show="isComponentVisible(component)"
              class="draggable-el"
              @mousedown="(e) => onMouseDown(e, component)"
            >
              <a-card
                size="small"
                :title="component.name"
                :headStyle="{
                  fontSize: '12px',
                  padding: '0 8px',
                  minHeight: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }"
                hoverable
              >
                <template #cover>
                  <SvgIcon class="draggable-ghost" :type="`svg-${component.type}`" />
                </template>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ComponentPanel">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useDraggable } from './useDraggable'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })

  const componentSetting = ref(props.editor.setting.componentSetting)
  const query = ref('')

  const isComponentVisible = (component) => {
    return !query.value ? true : component.name.includes(query.value)
  }

  // drag & drop
  const getEditorContainer = () => {
    return props.editor.$instance.getProxy('Editor').$el || document.body
  }
  const getCanvasContainer = () => {
    const paper = props.editor.getCurrentPaper()
    return paper.$instance.getRefs('Paper').CanvasRef
  }
  const getPaperScale = () => {
    const paper = props.editor.getCurrentPaper()
    if (!paper) {
      return 1
    }
    return paper.configData.variable.scale
  }
  const done = (cell) => {
    const paper = props.editor.getCurrentPaper()
    const inside = paper.configData.variable.mousePos?.inside

    if (inside) {
      const rect = getCanvasContainer().getBoundingClientRect()

      if (
        cell.x < 0 ||
        cell.y < 0 ||
        cell.x + cell.w > rect.width / getPaperScale() ||
        cell.y + cell.h > rect.height / getPaperScale()
      ) {
        return
      }

      paper.addCell(cell)
      paper.triggerCellActive(cell.key)
    }
  }

  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onBlur } = useDraggable({
    getContainer: getEditorContainer,
    getCanvas: getCanvasContainer,
    getScale: getPaperScale,
    done,
  })

  onMounted(() => {
    props.editor.addEventListener('mousemove', onMouseMove)
    props.editor.addEventListener('mouseup', onMouseUp)
    props.editor.addEventListener('mouseleave', onMouseLeave)
    window.onblur = onBlur
  })

  onBeforeUnmount(() => {
    props.editor.removeEventListner('mousemove')
    props.editor.removeEventListner('mouseup')
    props.editor.removeEventListner('mouseleave')
  })
</script>

<style lang="less" scoped>
  .visual-editor-SideBar-ComponentPanel {
    height: 100%;
    width: 100%;

    .search-container {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
    }

    .list-container {
      height: calc(~'100% - 48px');
      overflow-x: hidden;
      overflow-y: auto;

      .hide {
        opacity: 0;
      }

      :deep(.@{ant-prefix}-divider) {
        margin: 12px 0;
        &-inner-text {
          font-size: 14px;
        }

        &-with-text {
          border-color: @selection-color;
        }
      }

      :deep(.@{ant-prefix}-card) {
        cursor: grab;

        &-head {
          background: @background-color;
        }
      }

      :deep(.svg-icon) {
        width: 80px;
        height: 80px;
      }
    }
  }
</style>
