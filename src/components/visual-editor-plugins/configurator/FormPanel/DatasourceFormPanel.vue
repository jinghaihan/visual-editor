<template>
  <div v-if="cell"
       class="visual-editor-dataformpanel-container">
    <!-- 多数据来源配置模式 -->
    <ModelPanel v-if="editor.datasourceType === 'multiple'"
                :editor="editor"
                :form.sync="form"
                @model-change="onModelChange"
                @inited="onInited">
    </ModelPanel>

    <!-- 配置面板 -->
    <transition name="animate__animated animate_bounce"
                      enter-active-class="animate__fadeIn"
                      leave-active-class="animate__fadeOut"
                      appear>
      <component v-if="modelInited"
                ref="Form"
                :is="getComponentName()"
                :editor="editor"
                :cell="cell"
                :form.sync="form"
                :modelData.sync="modelData"
                :selector="selector"
                @change="onChange">
      </component>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    cell: {
      required: true
    },
    configKey: {
      type: String,
      required: true
    },
    selector: {
      required: false
    }
  },
  components: {
    ModelPanel: () => import('./DataConfig/ModelPanel.vue'),
    ChartPanel: () => import('./DataConfig/ChartPanel.vue'),
    TablePanel: () => import('./DataConfig/TablePanel.vue')
  },
  data () {
    return {
      form: {
        isGroupBy: true,
        dimensions: [],
        measures: []
      },
      modelData: {},
      modelInited: false
    }
  },
  watch: {
    form: {
      deep: true,
      handler: function (value) {
        this.onChange()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.cell && this.cell.configData.datasourceConfig) {
        this.form = _.cloneDeep(this.cell.configData.datasourceConfig.formData)
      }

      // TODO
      if (this.editor.datasourceType === 'single') {
        this.onInited()
      }
    },
    onInited () {
      this.modelInited = true
    },
    onChange (formData) {
      this.$emit('change', { key: this.configKey, formData: formData || _.cloneDeep(this.form) })
    },
    onModelChange (modelData) {
      this.modelData = { ...modelData }

      if (this.modelInited) {
        this.form.dimensions = []
        this.form.measures = []
        this.form.orderField = undefined
        this.form.orderType = undefined

        this.onChange()
      }
    },
    getComponentName () {
      if (this.cell) {
        return _.capitalize(this.cell.componentType) + 'Panel'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-dataformpanel-container{
    padding: 12px;
  }
</style>
