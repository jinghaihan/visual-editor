<template>
  <div ref="PaperContainer"
       id="visual-editor-paper-container"
       class="visual-editor-paper-container">
    <VueRulerTool ref="Ruler"
                  :parent="true"
                  :is-hot-key="false"
                  :is-scale-revise="true"
                  v-model="rulerLines">
      <div ref="PaperContent"
           class="visual-editor-paper-wrapper"
           @mousedown="handleDeactivated">
        <ScaleBox ref="ScaleBox"
                  :width="paper.configData.paper.paperSizeWidth || 1920"
                  :height="paper.configData.paper.paperSizeHeight || 1080"
                  :padding="40"
                  :vmRef="$refs"
                  @scale="onScale">
          <VueDraggableResizable ref="Draw"
                                 class="visual-editor-paper-content"
                                 :scaleRatio.sync="scale"
                                 :resizable="false"
                                 :draggable="!activeCells.length"
                                 :x="0"
                                 :y="0"
                                 :w="paper.configData.paper.paperSizeWidth || 1920"
                                 :h="paper.configData.paper.paperSizeHeight || 1080">
            <VueDraggableResizable
              class="visual-editor-paper-item"
              v-for="cell in cells"
              :key="cell.key"
              :scaleRatio.sync="scale"
              ref="cell"
              :parent="true"
              :snap="true"
              :snapTolerance="setting.paperSnapTolerance"
              :isConflictCheck="setting.paperConflictCheck"
              :grid="[setting.paperMoveGridLevel, setting.paperMoveGridVertical]"
              :resizable="judgeCanActive(cell.key)"
              :draggable="judgeCanActive(cell.key)"
              :active.sync="cell.active"
              :prevent-deactivation="true"
              :x="parseInt(cell.x)"
              :y="parseInt(cell.y)"
              :w="parseInt(cell.w)"
              :h="parseInt(cell.h)"
              :lockAspectRatio="cell.lockAspectRatio"
              @refLineParams="getRefLineParams"
              @resizing="(...args) => handleResizing(...args, cell)"
              @dragging="(...args) => handleDragging(...args, cell)"
              @activated="handleActivated(cell)"
              @resizestop="(...args) => handleResizeStop(...args, cell)"
              @dragstop="(...args) => handleDragStop(...args, cell)"
              :style="{ zIndex: cell.zIndex }">
              <Renderer :ref="'Renderer-' + cell.key"
                        :instance="editor"
                        :data="cell"
                        :active="cell.active"
                        :lockedCells="lockedCells">
              </Renderer>
            </VueDraggableResizable>

            <!-- 辅助线 -->
            <span class="ref-line v-line"
                  v-for="item in vLine"
                  :key="'v-line-' + item.key"
                  v-show="item.display"
                  :style="{ left: item.position, top: item.origin, height: item.lineLength}"
            />
            <span class="ref-line h-line"
                  v-for="item in hLine"
                  :key="'h-line-' + item.key"
                  v-show="item.display"
                  :style="{ top: item.position, left: item.origin, width: item.lineLength}"
            />

            <!-- 网格线 -->
            <div class="visual-editor-paper-grid" :style="gridStyle"></div>
          </VueDraggableResizable>
        </ScaleBox>
      </div>
    </VueRulerTool>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import VueRulerTool from 'vue-ruler-tool'
import VueDraggableResizable from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import ScaleBox from '../../ScaleBox/scalebox.vue'
import Renderer from '../../Render/renderer'
import { generateUUID } from '../../../utils'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    VueRulerTool,
    VueDraggableResizable,
    ScaleBox,
    Renderer
  },
  data () {
    return {
      paper: null,
      // 辅助线
      rulerLines: [],
      vLine: [],
      hLine: [],
      // 组件信息
      cells: [],
      activeCells: [],
      lockedCells: [],
      // 缩放比例
      scale: 1,
      // 画布配置
      setting: {
        paperGridColor: {
          'rgba': {
            r: 0,
            g: 0,
            b: 0,
            a: 0.1
          }
        },
        paperGridSizeLevel: 20,
        paperGridSizeVertical: 20,
        paperRefLineColor: {
          'hex': '#1890ff'
        },
        paperSnap: true,
        paperSnapTolerance: 5,
        paperConflictCheck: false,
        paperMoveGridLevel: 1,
        paperMoveGridVertical: 1
      },
      // 网格样式
      gridStyle: {
        display: 'block'
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.bindEvent()
  },
  beforeDestroy () {
    this.removeEvent()
  },
  methods: {
    async init () {
      this.paper = this.editor.getCurrentPaper()
      this.paper.setInstance({ key: 'paper', vm: this })

      await this.$nextTick()
      this.initScale()
      this.initGrid()
    },
    initStyle () {
      this.$refs.Ruler.init()
      this.initScale()
    },
    // 画布尺寸
    initScale () {
      this.$refs.ScaleBox.setScale()
    },
    // 网格线
    initGrid () {
      try {
        const color = this.setting.paperGridColor.rgba
        let rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        this.$set(this.gridStyle, 'backgroundImage', `linear-gradient(-90deg, ${rgba} 1px, transparent 1px), linear-gradient(${rgba} 1px, transparent 1px)`)

        const gridSize = { x: this.setting.paperGridSizeLevel, y: this.setting.paperGridSizeVertical }
        this.$set(this.gridStyle, 'backgroundSize', `${gridSize.x}px ${gridSize.y}px,${gridSize.x}px ${gridSize.y}px`)
      } catch (error) {}
    },
    // 对齐吸附/冲突检测
    setCellAttribute () {
      let cells = this.$refs.cell
      cells.forEach(cell => {
        let el = cell.$el
        el.setAttribute('data-is-check', `${this.setting.paperConflictCheck}`)
        el.setAttribute('data-is-snap', `${this.setting.paperSnap}`)
      })
    },
    // 画布尺寸改变回调
    onScale (scale) {
      this.scale = scale
      this.editor.scale = scale
    },
    // 判断是否可拖动/改变大小
    judgeCanActive (key) {
      return !this.lockedCells.includes(key)
    },
    getRefLineParams (params) {
      let { vLine, hLine } = params
      vLine = vLine.map((item) => {
        return {
          ...item,
          key: generateUUID()
        }
      })
      hLine = hLine.map((item) => {
        return {
          ...item,
          key: generateUUID()
        }
      })
      this.vLine = vLine
      this.hLine = hLine
    },
    handleActivated (cell) {
      if (cell.key) {
        this.activeCells = [cell.key]
        this.cells.forEach(item => {
          if (item.key !== cell.key) {
            item.active = false
          } else {
            item.active = true
          }
        })
        this.editor.$event.emit('onCellActivated', cell.key)
      }
    },
    handleDeactivated (e) {
      let parentNode = $(e.target).parents('.visual-editor-paper-item')
      if (!parentNode.length) {
        this.activeCells = []
        this.cells.forEach(item => {
          item.active = false
        })
        this.editor.$event.emit('onCellDeactivated')
      }
    },
    handleResizing (left, top, width, height, cell) {
      let ref = this.$refs['Renderer-' + cell.key][0]
      if (ref) {
        ref.resize()
      }
      this.editor.$event.emit('onCellResizing', {
        left, top, width: parseInt(width), height: parseInt(height), key: cell.key
      })
    },
    handleDragging (left, top, cell) {
      this.editor.$event.emit('onCellDragging', {
        left, top, key: cell.key
      })
    },
    handleResizeStop (left, top, width, height, cell) {
      let item = this.cells.find(i => i.key === cell.key)
      item.x = left
      item.y = top
      item.w = width
      item.h = height
    },
    handleDragStop (left, top, cell) {
      let item = this.cells.find(i => i.key === cell.key)
      item.x = left
      item.y = top
    },
    bindEvent () {
      let paperEl = this.$refs.Draw.$el
      paperEl.addEventListener('mousemove', this.onMouseMove)
      paperEl.addEventListener('mouseleave', this.onMouseLeave)
    },
    removeEvent () {
      let paperEl = this.$refs.Draw.$el
      paperEl.removeEventListener('mousemove', this.onMouseMove)
      paperEl.removeEventListener('mouseleave', this.onMouseLeave)
    },
    onMouseMove (e) {
      let { x, y, clientX, clientY, offsetX, offsetY } = e
      this.editor.getCurrentPaper().setMousePos({
        x, y, clientX, clientY, offsetX, offsetY, status: 'inside'
      })
    },
    onMouseLeave (e) {
      let { x, y, clientX, clientY, offsetX, offsetY } = e
      this.editor.getCurrentPaper().setMousePos({
        x, y, clientX, clientY, offsetX, offsetY, status: 'outside'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #visual-editor-paper-container{
    --refline-color: #1890ff;
  }
  .visual-editor-paper-container{
    width: calc(~"100% - 40px - 260px");
    .visual-editor-paper-wrapper{
      position: relative;
      height: 100%;
      width: 100%;
      padding-right: 25px;
      .visual-editor-paper-content{
        position: relative;
        height: 100%;
        background: #fff;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .visual-editor-paper-grid{
          pointer-events: none;
          position: absolute;
          height: 100%;
          width: 100%;
        }
      }
    }
    /deep/.vue-ruler-wrapper{
      .vue-ruler-content{
        height: 100%;
        width: 100%;
      }
      .vue-ruler-h .n, .vue-ruler-v .n{
        color: var(--font-color);
      }
      .vue-ruler-h, .vue-ruler-v{
        opacity: 1;
      }
      .vue-ruler-h{
        background: url('../../../assets/ruler/ruler-h.png');
        left: 0;
      }
      .vue-ruler-v{
        background: url('../../../assets/ruler/ruler-v.png');
        top: 0;
      }
      .vue-ruler-ref-line-h{
        background: url('../../../assets/ruler/ruler-h-line.png') repeat-x 0;
      }
      .vue-ruler-ref-line-v{
        background: url('../../../assets/ruler/ruler-v-line.png') repeat-y top;
      }
    }
    /deep/.vdr{
      .ref-line{
        background: var(--refline-color);
      }
    }
  }
</style>
