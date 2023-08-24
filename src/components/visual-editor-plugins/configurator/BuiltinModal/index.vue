<template>
  <a-modal
    :visible="true"
    @cancel="closeModal()"
    @ok="onSubmit"
    :maskClosable="false"
    :keyboard="false"
    :width="1000"
    title="默认数据限制器"
    :getContainer="getContainer()"
    wrapClassName="visual-editor-modal"
  >
    <a-button type="primary"
              size="small"
              icon="plus-circle"
              @click="onAdd()">
      添加
    </a-button>

    <div class="filter-modal-container">
      <VirtualForm ref="form"
                   v-if="visible"
                   :header="header"
                   :config="config">
      </VirtualForm> 
    </div>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import VirtualForm from './VirtualForm'
import { header, config } from './config'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    modalData: {
      type: Object,
      required: false
    }
  },
  components: { VirtualForm },
  data () {
    return {
      visible: false,
      header,
      config: [],
      fieldOptions: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      let _this = this
      let configData = _.cloneDeep(config)
      
      let treeOptions = await this.initTreeOptions()

      configData[0].options = treeOptions
      configData[0].relations.assign['format'] = function (value, formData) {
        return _this.fieldOptions.find(opt => opt.value === formData.field).format
      }
      configData[2].relations.config = _this.handleRelationConfig
      _this.config = configData

      _this.visible = true

      _this.initFormData()
    },
    onSubmit () {
      this.$refs.form.validateFields().then(result => {
        if (result.error) return
        this.$emit('submit', result.value)
        this.closeModal()
      })
    },
    onAdd () {
      this.$refs.form.onAdd(1)
    },
    async initFormData () {
      await this.$nextTick()

      let builtinConditions = this.modalData.builtinConditions

      if (!builtinConditions || !builtinConditions.length) {
        // 新增一行
        this.onAdd()
      } else {
        // 回显数据
        let formData = builtinConditions.map(item => {
          return {
            ...item,
            format: this.fieldOptions.find(opt => opt.value === item.field).format
          }
        })
        this.$refs.form.onUpdate(formData)
      }
    },
    async initTreeOptions () {
      let modelData = await this.editor.getModelData(this.modalData.modelId)
      let treeOptions = await this.editor.getModelOptions(modelData, true)

      this.fieldOptions = this.editor.getModelOptions(modelData)

      return treeOptions
    },
    handleRelationConfig (value, formData) {
      // 更新config配置
      let config = {
        column: 8,
        center: true,
        rules: [
          {
            validator: function (value, form) {
              let option = form.option
              if (option === 'IS NULL' || option === 'IS NOT NULL') {
                return true
              }
              return !!value
            },
            message: '请输入限制条件值'
          }
        ]
      }
      if (value === 'IS NULL' || value === 'IS NOT NULL') {
        // 为空/非空
        config = {
          ...config,
          type: 'text',
          key: 'values'
        }
      } else if (value === 'BETWEEN') {
        // 介于
        config = {
          ...config,
          type: 'input-between',
          key: 'values',
          placeholder: ['最小值', '最大值']
        }
      } else {
        config = {
          ...config,
          type: 'input',
          key: 'values',
          placeholder: '请输入限制条件值'
        }
      }

      // 判断限制值是否清空
      let limit = formData.values.value
      if (limit) {
        if (value === 'IS NULL' || value === 'IS NOT NULL') {
          formData.values.value = undefined
        } else if (value === 'BETWEEN') {
          try {
            if (!(JSON.parse(limit) instanceof Array)) {
              formData.values.value = undefined
            }
          } catch (error) { }
        } else {
          try {
            if (JSON.parse(limit) instanceof Array) {
              formData.values.value = undefined
            }
          } catch (error) { }
        }
      }

      return { key: 'values', config }
    },
    closeModal (data) {
      this.$emit('close', data)
    },
    getContainer () {
      return () => document.getElementById('visual-editor-container') || document.body
    }
  }
}
</script>

<style lang="less" scoped>
  .filter-modal-container{
    margin-top: 20px;
    height: 300px;
    /deep/.form-header-container{
      background: var(--basic-color);
    }
  }
</style>
