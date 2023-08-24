<template>
  <div class="visual-editor-sidebar-container">
    <div class="component-switch-bar">
      <!-- 退出 -->
      <div class="close action"
           @click="onClose">
        <TooltipIcon class="close-icon"
                     type="rollback"
                     title="退出">
        </TooltipIcon>
      </div>
      <!-- 组件类型 -->
      <div class="action-container">
        <div v-for="component in editor.config.component"
             :key="component.type"
             :class="active === component.type ? 'action action-active' : 'action'"
             @click="onComponentTypeChange(component)">
          <a-popover :title="component.name"
                     trigger="click"
                     placement="rightBottom"
                     transitionName=""
                     @visibleChange="onVisibleChange"
                     :getPopupContainer="triggerNode => {
                        return triggerNode.parentNode || document.body;
                     }">
            <template slot="content">
              <DragPanel :ref="component.type + 'DragPanel'"
                          :editor="editor"
                          :type="component.type"
                          :components="getComponents(component)"
                          :pagination="pagination[component.type] || null"
                          @done="handleDragDone"
                          @end="handleDragEnd"
                          @pagination="handlePagination">
              </DragPanel>
            </template>
            <div class="popover-trigger-container">
              <TooltipIcon :ref="component.type + 'Icon'"
                           class="trigger-icon"
                           :type="component.icon"
                           :title="component.name"
                           placement="right">
              </TooltipIcon>
            </div>
          </a-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import TooltipIcon from '../../TooltipIcon/tooltipIcon.vue'
import DragPanel from '../DragPanel/dragPanel.vue'

const factory = {
  general: (vm, type) => {
    let list = []
    let typeConfig = vm.editor.config.component.find(item => item.type === type)
    if (typeConfig && typeConfig.components) {
      list = [...typeConfig.components]
    }
    return list
  },
  clipBoard: (vm, type) => {
    let list = Object.keys(vm.editor.clipBoard).reverse().map(key => vm.editor.clipBoard[key])
    return list
  }
}

const mediaFactory = {
  image: async () => {
    return {
      data: []
    }
  },
  video: async () => {
    return []
  },
  audio: async () => {
    return []
  }
}

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipIcon,
    DragPanel
  },
  data () {
    return {
      active: null,
      components: [],
      pagination: {}
    }
  },
  created () {
    this.editor.setInstance({ key: 'sideBar', vm: this })

    this.initPagination()
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    getComponents (component) {
      let _this = this
      let components = []

      if (!factory[component.type]) {
        components = factory['general'](_this, component.type)
      } else {
        components = factory[component.type](_this, component.type)
      }
      
      return components
    },
    onComponentTypeChange (component) {
      this.active = component.type

      if (mediaFactory[component.type]) {
        this.updateDragPanelComponentList()
      }
    },
    handleDragDone (key) {
      if (key) {
        let paper = this.editor.getCurrentPaper()
        paper.triggerCellActive(key)
      }
    },
    handleDragEnd () {

    },
    handlePagination (page, pageSize) {
      this.pagination[this.active].current = page
      this.updateDragPanelComponentList()
    },
    onVisibleChange (visible) {
      if (!visible) {
        this.active = null
      }
    },
    async updateDragPanelComponentList () {
      let _this = this
      let key = _this.active + 'DragPanel'

      let refs = _this.$refs[key]

      if (refs && refs.length) {
        let ref = refs[0]

        let components = []
        if (!factory[_this.active]) {
          components = factory['general'](_this, _this.active)
        } else {
          components = factory[_this.active](_this, _this.active)
        }
        
        if (mediaFactory[_this.active]) {
          let params = {
            pageSize: 20,
            ..._this.pagination[_this.active]
          }
          let res = await mediaFactory[_this.active](_this.editor.service, params)
          _this.pagination[_this.active].total = res.total
          components = res.data
        }

        ref.componentsList = components
      }
    },
    triggetActive () {
      let key = this.active + 'Icon'
      let el = this.$refs[key][0].$el

      $(el).trigger('click')
    },
    initPagination () {
      // 初始化分页组件
      this.editor.config.component.forEach(comp => {
        if (comp.pagination) {
          this.pagination[comp.type] = {
            current: 1,
            total: 0
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-sidebar-container{
    height: 100%;
    width: 40px;
    display: flex;
    .component-switch-bar{
      position: relative;
      height: 100%;
      width: 40px;
      background: var(--deputy-color);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .action{
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--font-color);
        font-size: 18px;
        cursor: pointer;
      }
      .action-active{
        background: var(--panel-color);
        color: var(--active-color);
      }
      .close{
        position: absolute;
        top: -40px;
        background: var(--basic-color);
      }
      .popover-trigger-container{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
