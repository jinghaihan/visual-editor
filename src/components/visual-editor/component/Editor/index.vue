<template>
  <div ref="Container"
       id="visual-editor-container"
       class="visual-editor-container">
    <!-- 导航栏 -->
    <NavBar :editor="editor"></NavBar>

    <!-- 编辑区域 -->
    <div class="visual-editor-viewport-container">
      <!-- 组件面板 -->
      <SideBar ref="SideBar"
               :editor="editor">
      </SideBar>

      <template v-for="key in papers">
        <!-- 画布 -->
        <Paper :ref="'Paper-' + key"
               :editor="editor"
               :key="`${key}_${getTimeStamp()}`"
               :style="{ opacity: loading ? 0 : 1 }"
              v-show="editor.currentPaper === key">
        </Paper>
      </template>
      
      <!-- 配置面板 -->
      <ConfigPanel ref="ConfigPanel"
                   :editor="editor"
                   @trigger="onTrigger">
      </ConfigPanel>
    </div>

    <!-- loading样式 -->
    <div v-if="loading"
         class="visual-editor-loading-container">
      <dv-loading class="loading">Loading...</dv-loading>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import $ from 'jquery'
import moment from 'moment'
import Editor from '../../resource/Editor'
import NavBar from './Navbar/navbar'
import SideBar from './Sidebar/sidebar'
import Paper from './Paper/paper'
import ConfigPanel from './ConfigPanel/configPanel'

export default {
  name: 'VisualEditor',
  props: {
    plugin: {
      type: Object,
      required: true
    },
    hack: {
      type: Object,
      required: true
    },
    resource: {
      type: Object,
      required: true
    }
  },
  components: {
    NavBar,
    SideBar,
    Paper,
    ConfigPanel
  },
  data () {
    return {
      loading: true,
      editor: {},
      papers: [],
      triggerExpand: {
        configPanel: true
      }
    }
  },
  created () {
    this.editor = new Editor({
      vm: this,
      plugin: this.plugin,
      hack: this.hack,
      resource: this.resource
    })
    this.editor.created()
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    onInited () {
      this.loading = false
    },
    onTrigger (type, expand) {
      let _this = this
      let paperEl = _this.$refs['Paper-' + _this.editor.currentPaper][0].$el
      let configPanelEl = _this.$refs.ConfigPanel.$el

      this.triggerExpand[type] = expand

      let timer = null
      requestAnimationFrame(animate)
      function animate () {
        _this.initPaper()
        timer = requestAnimationFrame(animate)
      }

      let pixel = 40

      if (this.triggerExpand.configPanel) {
        $(configPanelEl).css({
          transition: 'all .3s',
          width: '260px'
        })
        pixel += 260
      } else {
        $(configPanelEl).css({
          transition: 'all .3s',
          width: 0
        })
        pixel += 0
      }

      $(paperEl).css({
        transition: 'all .3s',
        width: `calc(100% - ${pixel}px)`
      })

      setTimeout(() => { cancelAnimationFrame(timer) }, 500)
    },
    initPaper () {
      this.$refs['Paper-' + this.editor.currentPaper][0].initStyle()
    },
    getTimeStamp () {
      return moment().format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
  #visual-editor-container{
    --basic-color: #141414;
    --deputy-color: #1d1e1f;
    --primary-color: #24282e;
    --panel-color: #24282e;
    --font-color: #ddd;
    --active-color: #1890ff;
    --help-color: #52c41a;
    --danger-color: #f5222d;
    --warning-color: #faad14;
  }

  .visual-editor-container{
    position: relative;
    height: 100%;
    width: 100%;
    background: var(--basic-color);
    overflow: hidden;
  }

  .visual-editor-viewport-container{
    display: flex;
    height: calc(~"100% - 40px");
  }

  .visual-editor-loading-container{
    z-index: 9999;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .loading{
      transform: scale(2);
      /deep/.loading-tip{
        color: var(--active-color);
      }
    }
  }

  // antd样式
  /deep/.ant-card-small{
    background: var(--deputy-color);
    border: none;
    max-height: 200px;
    .ant-card-head{
      height: 20px;
      min-height: 0;
      padding: 0;
      color: var(--font-color);
      background: var(--basic-color);
      border: none;
      .ant-card-head-wrapper{
        .ant-card-head-title{
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>

<style lang="less">
  // 组件拖拽
  .component-draggable-active{
    cursor: grabbing;
  }
  .component-draggable-flutter{
    position: absolute;
    z-index: 9999;
    pointer-events: none;
  }
  .component-draggable-return{
    transition: all .3s;
  }

  // 滚动条样式
  ::-webkit-scrollbar{
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb{
    border-radius: 1em;
    background-color: rgba(50,50,50,.3);
  }
  ::-webkit-scrollbar-track{
    border-radius: 1em;
    background-color: rgba(50,50,50,.1);
  }
</style>
