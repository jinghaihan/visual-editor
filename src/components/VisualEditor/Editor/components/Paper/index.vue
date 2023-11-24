<template>
  <div class="visual-paper" @mousedown="handleDeactivated">
    <SketchRule :adapterConfig="adapterConfig">
      <ScreenAdapter
        :paper="paper"
        :paperRef="instance"
        :adapterConfig="adapterConfig"
        :draggable="!activeCells.length"
        :resizable="!activeCells.length"
        :padding="48"
        @drag="updatePaperPos"
      >
        <div
          ref="CanvasRef"
          :id="`visual-paper-${paper.key}`"
          class="visual-paper-canvas"
          :style="canvasStyle"
          @mousemove="(e) => updateMousePos(e, true)"
          @mouseleave="(e) => updateMousePos(e, false)"
        >
          <template v-for="cell in cells" :key="cell.key">
            <Moveable
              :ref="'Moveable-' + cell.key"
              :className="getCellClassName(cell.key)"
              :target="`#cell-${cell.key}`"
              v-bind="moveableConfig"
              :origin="false"
              :keepRatio="cell.keepRatio"
              @drag="(e) => handleMoveable(e, cell)"
              @resize="(e) => handleResize(e, cell)"
              @rotate="(e) => handleMoveable(e, cell)"
            />

            <div
              :id="`cell-${cell.key}`"
              class="visual-paper-cell"
              :style="calculateCellStyle(cell)"
            >
              <Renderer
                :paper="paper"
                :config="cell"
                @mousedown="(e) => handleActivated(cell, e)"
                @click="(e) => handleActivated(cell, e)"
              />
            </div>
          </template>

          <!-- grid-line -->
          <div class="grid-line" :style="gridLineConfig"></div>
        </div>
      </ScreenAdapter>
    </SketchRule>
  </div>
</template>

<script lang="ts" setup name="VisualPaper">
  import { debounce, isEqual } from 'lodash-es'
  import { ref, computed, getCurrentInstance, ComponentInternalInstance } from 'vue'
  import Moveable from 'vue3-moveable'
  import SketchRule from './SketchRule.vue'
  import ScreenAdapter from './ScreenAdapter.vue'
  import Renderer from '../../../Renderer/index.vue'
  import { useMoveable } from './useMoveable'
  import { parents } from '@/utils/dom'

  const props = defineProps({
    paper: {
      type: Object,
      required: true,
    },
    paperKey: {
      type: String,
      required: true,
    },
  })

  const instance = getCurrentInstance() as ComponentInternalInstance

  // paper config
  const adapterConfig = ref(getAdapterConfig())
  const gridLineConfig = ref(getGridLineConfig())
  const canvasStyle = computed(() => {
    const { width, height, x, y, backgroundColor } = adapterConfig.value
    return {
      width: width + 'px',
      height: height + 'px',
      left: x + 'px',
      top: y + 'px',
      backgroundColor: backgroundColor,
    }
  })

  const {
    cells,
    activeCells,
    lockedCells,
    invisibleCells,
    moveableConfig,
    handleMoveable,
    getCellClassName,
    calculateCellStyle,
  } = useMoveable({
    paper: props.paper,
    adapterConfig,
  })

  props.paper.$instance.set('Paper', {
    instance,

    // attribute
    cells,
    activeCells,
    lockedCells,
    invisibleCells,

    // style config
    adapterConfig,
    gridLineConfig,

    // methods
    updatePaperStyle,
    handleActivated,
    handleDeactivated,
  })

  // Method
  /**
   * update adapter & gridline style
   */
  function updatePaperStyle() {
    adapterConfig.value = getAdapterConfig()
    gridLineConfig.value = getGridLineConfig()
  }

  /**
   * get adapter config
   */
  function getAdapterConfig() {
    const { width, height, backgroundColor, backgroundImage } = props.paper.configData.paper
    const { scale, paperPos } = props.paper.configData.variable

    return {
      width,
      height,
      backgroundColor: backgroundColor?.hex8 || '#fff',
      backgroundImage,
      x: paperPos?.x || 0,
      y: paperPos?.y || 0,
      scale: scale || 1,
    }
  }
  /**
   * get gridline config
   */
  function getGridLineConfig() {
    const { color, sizeX, sizeY } = props.paper.configData.paper.grid

    return {
      display: 'block',
      backgroundImage: `linear-gradient(-90deg, ${color.hex8} 1px, transparent 1px), linear-gradient(${color.hex8} 1px, transparent 1px)`,
      backgroundSize: `${sizeX}px ${sizeY}px,${sizeX}px ${sizeY}px`,
    }
  }

  /**
   * update paper position status
   */
  function updatePaperPos(pos) {
    const { startX, startY, diffX, diffY } = pos

    props.paper.setPaperPos({
      x: startX + diffX,
      y: startY + diffY,
    })
    adapterConfig.value = getAdapterConfig()
  }

  /**
   * update mouse position
   */
  function updateMousePos(e, inside) {
    const { x, y, clientX, clientY, offsetX, offsetY } = e

    props.paper.setMousePos({
      x,
      y,
      clientX,
      clientY,
      offsetX,
      offsetY,
      inside,
    })
  }

  /**
   * activate & deactivate
   */
  function handleActivated(data, e) {
    if (data.key) {
      let cells = [] as string[]
      if (data.key instanceof Array) {
        cells = data.key
      } else {
        if (e && (e.ctrlKey || e.metaKey)) {
          // Todo - multiple select
        } else {
          cells = [data.key]
        }
      }

      if (!isEqual(cells, activeCells.value)) {
        activeCells.value = cells
        props.paper.$event.emit('notifyCellActivated', {
          key: activeCells.value[0],
        })
      }
    }
  }

  function handleDeactivated(e) {
    if (e) {
      const dom = e.target as HTMLElement

      if (
        dom.classList.contains('.visual-paper-cell') ||
        parents(e.target, '.visual-paper-cell').length ||
        parents(e.target, '.moveable').length
      ) {
        return
      }
    }

    activeCells.value = []

    props.paper.$event.emit('notifyCellDeactivated')
  }

  /**
   * call cell resize event
   */
  function handleResize(e, config) {
    handleMoveable(e, config)

    const cell = props.paper.cells[config.key]
    if (cell) {
      cell.resize()
    }
  }
</script>

<style lang="less" scoped>
  .visual-paper {
    height: 100%;
    width: 100%;

    .visual-paper-canvas {
      position: relative;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: grab;
      border: 1px dashed @current-line-color;

      .visual-paper-cell {
        position: absolute;
        transition: box-shadow 0.3s;
      }
      .visual-paper-cell:hover {
        box-shadow: inset 0 0 5px @primary-color;
      }
      .visual-paper-cell.hovered {
        box-shadow: inset 0 0 5px @primary-color;
      }

      .grid-line {
        pointer-events: none;
        position: absolute;
        height: 100%;
        width: 100%;
      }

      // vue3-moveable
      :deep(.moveable) {
        --moveable-color: @primary-color;
        --bounds-color: @red-color;
      }
      :deep(.moveable-active) {
        display: block !important;
      }
      :deep(.moveable-deactive) {
        display: none !important;
      }
    }
  }
</style>
