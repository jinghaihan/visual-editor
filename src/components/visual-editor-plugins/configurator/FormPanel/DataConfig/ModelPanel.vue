<template>
  <div class="visual-editor-model-panel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      v-bind="layout"
    >
      <a-row>
        <!-- 模型 -->
        <a-col :span="24">
          <a-form-model-item ref="model"
                             prop="model">
            <template slot="label">
              <a-tooltip placement="topLeft">
                <template slot="title">数据筛选</template>
                模型 <a-icon class="action-icon"
                            type="filter"
                            @click="onBuiltin">
                    </a-icon>
              </a-tooltip>
            </template>
            <a-select :value="modelId"
                      placeholder="请选择模型"
                      :show-search="true"
                      :filter-option="filterOptions"
                      :options="options.model"
                      @change="onModelChange" >
            </a-select>
          </a-form-model-item>
        </a-col>

        <!-- 周期字段 -->
        <a-col :span="24">
          <a-form-model-item ref="subscribeFieldId"
                             prop="subscribeFieldId"
                             label="周期字段">
            <a-select v-model="form.subscribeFieldId"
                      placeholder="请选择周期字段"
                      :show-search="true"
                      :filter-option="filterOptions"
                      :options.sync="options.subscribe" >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <BuiltinModal v-if="builtinVisible"
                  :editor="editor"
                  :modalData="modalData"
                  @submit="onBuiltinConditionsSubmit"
                  @close="onModalClose">
    </BuiltinModal>
  </div>
</template>

<script>
import BuiltinModal from '../../BuiltinModal'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  components: {
    BuiltinModal
  },
  data () {
    return {
      rules: {},
      layout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      options: {
        model: [],
        subscribe: []
      },
      // 模型ID
      modelId: undefined,
      modalData: {},
      builtinVisible: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      if (this.form.modelId) {
        this.modelId = this.form.modelId
        await this.handleModelChange(this.modelId)
      }
      let options = await this.editor.getModelList()
      this.options.model = options
      this.$emit('inited')
    },
    onModelChange (value) {
      let _this = this
      if (!_this.modelId) {
        _this.handleModelChange(value)
      } else {
        _this.$confirm({
          title: `您确定切换模型吗？`,
          content: '更改模型将清空当前组件数据配置',
          confirmLoading: true,
          okText: '确定',
          cancelText: '取消',
          async onOk () {
            await _this.handleModelChange(value)
          },
          onCancel () { }
        })
      }
    },
    async handleModelChange (value) {
      this.modelId = value
      this.form.modelId = this.modelId
      let modelData = await this.editor.getModelData(value)
      this.$emit('model-change', modelData)
    },
    onBuiltin () {
      this.modalData = {
        builtinConditions: this.form.builtinConditions,
        modelId: this.form.modelId
      }
      this.builtinVisible = true
    },
    filterOptions (input, option) {
      return (
        option.componentOptions.children[0].text.includes(input)
      )
    },
    onBuiltinConditionsSubmit (data) {
      this.form.builtinConditions = data
    },
    onModalClose () {
      this.modalData = {}
      this.builtinVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-model-panel{
    .action-icon{
      cursor: pointer;
      color: var(--active-color); 
    }
  }
</style>
