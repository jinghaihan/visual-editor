<template>
  <div class="visual-viewport-container"
       ref="PaperContent">
    <ScaleBox ref="Draw"
              class="visual-editor-paper-content"
              :width="config.global.style.paper.paperSizeWidth"
              :height="config.global.style.paper.paperSizeHeight"
              :vmRef="$refs">
      <VueDraggableResizable
        class="visual-viewport-paper-item"
        v-for="cell in cells"
        :key="cell.key"
        ref="cell"
        :parent="true"
        :resizable="false"
        :draggable="false"
        :active="false"
        :prevent-deactivation="true"
        :x="parseInt(cell.x)"
        :y="parseInt(cell.y)"
        :w="parseInt(cell.w)"
        :h="parseInt(cell.h)"
        :style="{ zIndex: cell.zIndex }">
        <Renderer :ref="'Renderer-' + cell.key"
                  :instance="{
                    getCurrentPaper
                  }"
                  :data="cell"
                  :active="false"
                  type="view">
        </Renderer>
      </VueDraggableResizable>
    </ScaleBox>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import ScaleBox from '../ScaleBox/scalebox.vue'
import Renderer from '../Render/renderer'
import Paper from '../../resource/Paper'

import Setting from '../../config/setting'

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  components: {
    VueDraggableResizable,
    ScaleBox,
    Renderer
  },
  data () {
    return {
      paper: new Paper({
        vm: this,
        key: this.config.id,
        editor: this
      }),
      cells: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.paper.setInstance({ key: 'paper', vm: this })

      await this.paper.setConfig(this.config)

      this.handleBackground()

      Object.values(this.paper.cells).forEach(cell => {
        if (Setting.staticComponents.includes(cell.componentType)) {
          cell.vm.loading = false
        }
      })

      this.$emit('init', this.paper.cells)
    },
    handleBackground () {
      let image = this.config.global.style.paper.backgroundImage
      let color = this.config.global.style.paper.backgroundColor

      this.paper.onPaperBackgroundChange({
        type: image ? 'image' : 'color',
        image,
        color
      })
    },
    getCurrentPaper () {
      return this.paper
    },
    getCells () {
      return this.paper.cells
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-viewport-container{
    height: 100%;
    width: 100%;
    .visual-editor-paper-content{
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .vdr{
      border: none;
    }
  }
</style>
