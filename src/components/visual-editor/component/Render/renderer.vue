<template>
  <div class="visual-renderer-container">
    <div class="visual-renderer-wrapper"
         :style="{
          opacity: loading ? 0 : 1
         }">
      <!-- 图表容器 -->
      <div v-if="data.componentType === 'chart'"
           ref="Component"
           class="chart-render-container">
      </div>

      <!-- 组件容器 -->
      <div v-else
           class="component-render-container">
        <component ref="Component"
                   :is="data.component"
                   :data="data"
                   :instance="instance">
        </component>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <transition name="animate__animated animate_bounce"
                enter-active-class="animate__fadeIn"
                leave-active-class="animate__fadeOut"
                appear>
      <div v-if="active"
           class="visual-renderer-toolbar-container">
        <ToolBar :editor="instance"
                 :data="data"
                 :lockedCells="lockedCells">
        </ToolBar>
      </div>
    </transition>

    <!-- loading -->
    <div class="visual-renderer-loading-container"
         v-if="loading">
      <dv-loading class="loading">Loading...</dv-loading>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import ToolBar from './toolbar.vue'

import ChartResource from '../../resource/Cell/Chart/Chart'
import BorderResource from '../../resource/Cell/Border/Border'
import DecorationResource from '../../resource/Cell/Decoration/Decoration'
import TextResource from '../../resource/Cell/Text/Text'
import TableResource from '../../resource/Cell/Table/Table'
import MediaResource from '../../resource/Cell/Media/Media'
import CustomResource from '../../resource/Cell/Custom/Custom'

import Border from '../Template/Border.vue'
import Multiline from '../Template/Multiline.vue'
import Decoration from '../Template/Decoration.vue'
import DetailTable from '../Template/DetailTable.vue'
import DigitalFlop from '../Template/DigitalFlop.vue'
import ScrollBoard from '../Template/ScrollBoard.vue'
import ScrollRankingBoard from '../Template/ScrollRankingBoard.vue'
import MediaImage from '../Template/MediaImage.vue'
import CustomEntry from '../Template/CustomEntry.vue'

export default {
  props: {
    instance: {
      type: Object,
      required: false
    },
    data: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    lockedCells: {
      type: Array,
      required: false,
      default: () => []
    },
    type: {
      type: String,
      default: 'config'
    }
  },
  components: {
    ToolBar,
    Border,
    Multiline,
    Decoration,
    DetailTable,
    DigitalFlop,
    ScrollBoard,
    ScrollRankingBoard,
    MediaImage,
    CustomEntry
  },
  data () {
    return {
      cell: null,
      loading: this.type === 'view'
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      let templateCell = null
      
      if (this.data.props && this.data.props.template) {
        templateCell = _.cloneDeep(this.data.props.template)
        delete this.data.props.template
      }
      
      await this.$nextTick()
      await this['init' + _.capitalize(this.data.componentType)](templateCell)
      let paper = this.instance.getCurrentPaper()
      paper.setCell({ key: this.data.key, cell: this.cell })
    },
    resize () {
      if (this.cell.resize) {
        this.cell.resize()
      }
    },

    // 组件初始化
    initChart (template) {
      let componentName = this.data.props.componentName || this.data.name

      this.cell = new ChartResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        option: template ? _.cloneDeep(template.option) : null,
        theme: template ? template.theme : null,
        axisFlip: template ? template.axisFlip : null,
        configData: template ? template.configData : null
      })
    },
    initBorder (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new BorderResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    },
    initDecoration (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new DecorationResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    },
    initText (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new TextResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    },
    initTable (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new TableResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    },
    initImage (template) {
      this.initMedia(template)
    },
    initMedia (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new MediaResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    },
    initCustom (template) {
      let componentName = this.data.props.componentName || this.data.name
      this.cell = new CustomResource({
        name: componentName,
        key: this.data.key,
        type: this.data.type,
        vm: this,
        configData: template ? template.configData : null
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-renderer-container{
    position: relative;
    height: 100%;
    width: 100%;
    .visual-renderer-wrapper,
    .chart-render-container,
    .component-render-container{
      height: 100%;
      width: 100%;
    }
    .visual-renderer-toolbar-container{
      position: absolute;
      top: -30px;
      height: 30px;
      width: 100%;
    }
    .visual-renderer-loading-container{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
