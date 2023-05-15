<template>
  <div class="visual-editor-componentpanel-container">
    <a-tabs v-model="activeKey"
            size="small"
            v-show="activeCell">
      <a-tab-pane v-for="tab in tabs"
                  :key="cell ? tab.key + '-' + cell.key : tab.key"
                  :tab="tab.name">
        <!-- 样式配置 -->
        <template v-if="tab.key === 'style'">
          <!-- 基础表单 -->
          <div class="componentpanel-form-container"
               v-if="formModelConfig.form">
            <FormGenerator ref="Form"
                           v-for="conf in formModelConfig.form"
                           :key="conf.key"
                           :configKey="conf.key"
                           :config="conf.config || []"
                           @change="onStyleConfigChange"
                           @notify-event="onNotify">
            </FormGenerator>
          </div>

          <!-- 折叠表单 -->
          <div class="componentpanel-collapseForm-container"
               v-if="formModelConfig.collapseForm">
            <a-collapse :activeKey="collapseKeys"
                        :bordered="false">
              <a-collapse-panel v-for="conf in formModelConfig.collapseForm"
                                :key="conf.key"
                                :header="conf.name"
                                :disabled="conf.switch ? !collapseSwitchKeys.includes(conf.key) : false"
                                :forceRender="!conf.switch">
                <div slot="extra"
                     v-if="conf.switch"
                     @click="e => e.stopPropagation()">
                  <a-switch :checked="collapseSwitchKeys.includes(conf.key)"
                            @change="onSwitch($event, conf)"
                            size="small">
                  </a-switch>
                </div>
                <FormGenerator ref="CollapseForm"
                              :config="conf.config || []"
                              :configKey="conf.key"
                              @change="onStyleConfigChange"
                              @notify-event="onNotify">
                </FormGenerator>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>

        <!-- 其余配置 -->
        <template v-else>
          <component :is="getComponentName(tab)"
                     :configKey="tab.key"
                     :editor="editor"
                     :cell="cell"
                     :selector="tableSelector"
                     @change="onComponentConfigChange">
          </component>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- 无数据样式 -->
    <div class="empty-container"
         v-show="!activeCell">
      <a-empty description="请先在画布中选择组件"></a-empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { generateUUID } from '../../../utils'
import FormGenerator from '../../FormGenerator/formModel.vue'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    activeCell: {
      type: String,
      required: true
    }
  },
  components: {
    FormGenerator
  },
  data () {
    return {
      timer: null,
      cell: null,
      tabs: [
        { name: '样式', key: 'style' },
        { name: '数据', key: 'datasource' }
        // { name: '动画', key: 'animate' },
        // { name: '交互', key: 'interaction' }
      ],
      activeKey: null,
      collapseKeys: [],
      collapseSwitchKeys: [],
      formModelConfig: {},
      eventToken: generateUUID(),
      tableSelector: { ri: 0, ci: 0 }
    }
  },
  watch: {
    activeCell: {
      immediate: true,
      handler: function (value) {
        this.initConfig()
      }
    }
  },
  created () {
    this.initEvent()
  },
  beforeDestroy () {
    this.offEvent()
  },
  methods: {
    // 事件监听
    initEvent () {
      let _this = this
      this.editor.$event.on('onCellDragging', this.eventToken, (data) => {
        _this.updateLayoutConfigData(data)
      })
      this.editor.$event.on('onCellResizing', this.eventToken, (data) => {
        _this.updateLayoutConfigData(data)
      })
      this.editor.$event.on('onTableSelect', this.eventToken, (data) => {
        _this.updateTableSelectData(data)
      })
    },
    offEvent () {
      this.editor.$event.off('onCellDragging', this.eventToken)
      this.editor.$event.off('onCellResizing', this.eventToken)
      this.editor.$event.off('onTableSelect', this.eventToken)
    },

    // 初始化配置
    initConfig () {
      setTimeout(() => {
        this.tableSelector = { ri: 0, ci: 0 }
        let paper = this.editor.getCurrentPaper()
        this.cell = paper.cells[this.activeCell]

        if (this.cell) {
          this.inited = true
          this.handleConfig()
        }
      }, 0)
    },
    handleConfig () {
      this.activeKey = this.tabs[0].key + '-' + this.cell.key
      this.formModelConfig = this.initFormModelConfig()
    },
    initFormModelConfig () {
      let config = {}

      if (this.cell) {
        let paper = this.editor.getCurrentPaper()
        let layoutConfig = paper.getCellLayoutConfig(this.cell.key)

        config = _.cloneDeep(this.cell.formModelConfig)

        let styleConfig = _.cloneDeep(this.cell.configData.styleConfig)
        styleConfig = {
          ...styleConfig.formData,
          cellX: layoutConfig.x,
          cellY: layoutConfig.y,
          cellWidth: layoutConfig.w,
          cellHeight: layoutConfig.h
        }

        this.collapseKeys = _.cloneDeep(styleConfig.collapseKeys || [])
        this.collapseSwitchKeys = _.cloneDeep(styleConfig.collapseSwitchKeys || [])

        let configKeys = Object.keys(styleConfig)

        Object.keys(config).forEach(formType => {
          config[formType].forEach(item => {
            item.config.forEach(conf => {
              if (configKeys.includes(conf.key)) {
                conf.defaultValue = styleConfig[conf.key]
              }
            })
          })
        })
      }

      return config
    },

    // 事件回调
    onStyleConfigChange () {
      let formData = this.getCompleteForm()
      this.onUpdate('style', formData)
    },
    onNotify (message) {
      let paper = this.editor.getCurrentPaper()
      paper[message.key](message.data, this.cell.key)
    },
    async onSwitch (checked, collapse) {
      if (checked) {
        this.collapseSwitchKeys.push(collapse.key)
        this.collapseKeys.push(collapse.key)
      } else {
        this.collapseSwitchKeys = this.collapseSwitchKeys.filter(key => key !== collapse.key)
        this.collapseKeys = this.collapseKeys.filter(key => key !== collapse.key)
      }
      await this.$nextTick()
      this.onStyleConfigChange()
    },
    onComponentConfigChange (data) {
      this.onUpdate(data.key, data.formData)
    },
    onUpdate (key, formData) {
      let _this = this
      if (_this.cell) {
        _this.cell.onConfigDataChange(key + 'Config', {
          formData,
          collapseKeys: key === 'style' ? _.cloneDeep(_this.collapseKeys) : undefined,
          collapseSwitchKeys: key === 'style' ? _.cloneDeep(_this.collapseSwitchKeys) : undefined
        })
        const factory = {
          style: () => {
            if (_this.cell.update) {
              _this.cell.update()
            }
          },
          datasource: () => {

          },
          animate: () => {

          },
          interaction: () => {

          }
        }
        factory[key]()
      }
    },

    // 方法实现
    getCompleteForm () {
      let formData = {}

      let Form = this.$refs.Form
      let CollapseForm = this.$refs.CollapseForm

      if (Form) {
        Form.forEach(item => {
          formData = { ...formData, ...item.form }
        })
      }

      if (CollapseForm) {
        CollapseForm.forEach(item => {
          formData = { ...formData, ...item.form }
        })
      }

      return formData
    },
    updateLayoutConfigData (data) {
      const Form = this.$refs.Form

      const factory = {
        globalGeneral: (vm, data) => {
          vm.form.cellX = data.left
          vm.form.cellY = data.top
          if (data.width) {
            vm.form.cellWidth = data.width
          }
          if (data.height) {
            vm.form.cellHeight = data.height
          }
        }
      }

      if (Form && Form.length) {
        Form.forEach(item => {
          if (Object.keys(factory).includes(item.configKey)) {
            factory[item.configKey](item, data)
          }
        })
      }
      
      this.onStyleConfigChange()
    },
    updateTableSelectData (data) {
      this.activeKey = 'datasource-' + data.key
      this.tableSelector = data.selector
    },
    getComponentName (tab) {
      return _.capitalize(tab.key) + 'FormPanel'
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-componentpanel-container{
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    color: var(--font-color);
    .form-generator-container{
      padding-top: 0;
      padding-bottom: 0;
    }
    .empty-container{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/.ant-collapse-content-box{
      padding: 0px;
    }
    /deep/.ant-tabs-bar{
      margin-bottom: 16px;
    }
  }
</style>
