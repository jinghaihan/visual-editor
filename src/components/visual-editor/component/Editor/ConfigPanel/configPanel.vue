<template>
  <div class="visual-editor-configpanel-container">
    <!-- 展开/收缩 -->
    <div class="trigger" @click="onTrigger">
      <TooltipIcon class="trigger-icon"
                   :type="triggetIcon"
                   :title="triggetTitle"
                   placement="left">
      </TooltipIcon>
    </div>

    <!-- 配置区域 -->
    <div class="visual-editor-configpanel-wrapper">
      <!-- 配置表单区域 -->
      <div class="config-area">
          <!-- 画布配置 -->
          <transition name="animate__animated animate_bounce"
                      enter-active-class="animate__fadeIn"
                      leave-active-class="animate__fadeOut"
                      appear>
            <PaperPanel key="paper"
                        ref="PaperPanel"
                        v-show="active === 'paper'"
                        :editor="editor">
            </PaperPanel>
          </transition>

          <!-- 辅助功能 -->
          <transition name="animate__animated animate_bounce"
                      enter-active-class="animate__fadeIn"
                      leave-active-class="animate__fadeOut"
                      appear>
            <AuxiliaryPanel key="auxiliary"
                            ref="AuxiliaryPanel"
                            v-show="active === 'auxiliary'"
                            :editor="editor">
            </AuxiliaryPanel>
          </transition>

          <!-- 数据来源 -->
          <transition name="animate__animated animate_bounce"
                      enter-active-class="animate__fadeIn"
                      leave-active-class="animate__fadeOut"
                      appear>
            <DatasourcePanel key="datasource"
                            ref="DatasourcePanel"
                            v-show="active === 'datasource'"
                            :editor="editor">
            </DatasourcePanel>
          </transition>

          <!-- 组件配置 -->
          <transition name="animate__animated animate_bounce"
                      enter-active-class="animate__fadeIn"
                      leave-active-class="animate__fadeOut"
                      appear>
            <ComponentPanel key="component"
                            ref="ComponentPanel"
                            v-show="active === 'component'"
                            :editor="editor"
                            :activeCell="activeCell">
            </ComponentPanel>
          </transition>
      </div>

      <!-- 配置切换区域 -->
      <div class="switch-area">
        <div v-for="action in editor.config.operation.configUnit"
             :key="action.key"
             :class="action.key === active ? 'switch-unit switch-unit-active' : 'switch-unit'"
             @click="onChange(action)">
          <a-icon class="icon" :type="action.icon"></a-icon>
          <p class="name">{{action.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TooltipIcon from '../../TooltipIcon/tooltipIcon.vue'
import PaperPanel from './paperPanel'
import AuxiliaryPanel from './auxiliaryPanel.vue'
import DatasourcePanel from './datasourcePanel.vue'
import ComponentPanel from './componentPanel.vue'
import { generateUUID } from '../../../utils'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipIcon,
    PaperPanel,
    AuxiliaryPanel,
    DatasourcePanel,
    ComponentPanel
  },
  data () {
    return {
      isExpand: true,
      active: this.editor.config.operation.configUnit[0].key,
      activeCell: '',
      eventToken: generateUUID()
    }
  },
  computed: {
    triggetIcon () {
      return this.isExpand ? 'double-right' : 'double-left'
    },
    triggetTitle () {
      return this.isExpand ? '收缩' : '展开'
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    this.offEvent()
  },
  methods: {
    init () {
      this.editor.setInstance({ key: 'configPanel', vm: this })
      this.initEvent()
    },
    initEvent () {
      let _this = this
      this.editor.$event.on('onCellActivated', this.eventToken, (key) => {
        _this.onCellActivated(key)
      })
      this.editor.$event.on('onCellDeactivated', this.eventToken, (key) => {
        _this.onCellDeactivated(key)
      })
    },
    offEvent () {
      this.editor.$event.off('onCellActivated', this.eventToken)
      this.editor.$event.off('onCellDeactivated', this.eventToken)
    },
    onCellActivated (key) {
      this.activeCell = key
      this.active = 'component'

      // 面板展开
      this.editor.expandConfigPanel()
    },
    onCellDeactivated () {
      this.activeCell = ''
      if (this.active === 'component') {
        this.active = this.editor.config.operation.configUnit[0].key
      }
    },
    onTrigger () {
      this.isExpand = !this.isExpand
      this.$emit('trigger', 'configPanel', this.isExpand)
    },
    onChange (action) {
      this.active = action.key
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-configpanel-container{
    position: relative;
    width: 260px;
    background: var(--panel-color);
    z-index: 999;
    .trigger{
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 80px;
      background: var(--panel-color);
      box-shadow: -2px 0 4px 0 rgba(0,0,0,.1);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .trigger-icon{
        color: var(--font-color);
        font-size: 18px;
      }
    }
  }

  .visual-editor-configpanel-wrapper{
    height: 100%;
    display: flex;
    .switch-area,
    .config-area{
      height: 100%;
    }
    .config-area{
      width: calc(~"100% - 24px");
    }
    .switch-area{
      background: var(--deputy-color);
      width: 24px;
      .switch-unit{
        color: var(--font-color);
        width: 100%;
        height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        .name{
          writing-mode: vertical-rl;
          letter-spacing: 3px;
        }
      }
      .switch-unit-active{
        background: var(--panel-color);
        color: var(--active-color);
      }
    }
  }
</style>
