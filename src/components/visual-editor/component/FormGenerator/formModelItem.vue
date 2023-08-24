<template>
  <a-form-model-item :ref="config.key"
                     :prop="config.key"
                     v-bind="layout">
    <template slot="label">
      <template v-if="!config.help">{{config.label}}</template>
      <template v-else>
        <a-tooltip>
          <template slot="title">
            {{config.help}}
          </template>
          <span>
            {{config.label}}
            <a-icon class="help-icon" type="question-circle"></a-icon>
          </span>
        </a-tooltip>
      </template>
    </template>
    <!-- 输入框 -->
    <a-input v-if="config.type === 'input'"
              v-model="form[config.key]"
              :placeholder="'请输入' + config.label"
              v-bind="config.props || {}"
              @change="onChange" />
    <!-- 文本框 -->
    <Textarea v-if="config.type === 'textarea'"
              :config="config"
              :form="form"
              @change="onChange">
    </Textarea>
    <!-- 数字输入框 -->
    <a-input-number v-if="config.type === 'input-number'"
                    v-model="form[config.key]"
                    :placeholder="'请输入' + config.label"
                    v-bind="config.props || {}"
                    style="width: 100%"
                    @change="onChange" />
    <!-- 下拉框 -->
    <a-select v-if="config.type === 'select'"
              v-model="form[config.key]"
              :placeholder="'请选择' + config.label"
              v-bind="config.props || {}"
              :show-search="true"
              :filter-option="filterOptions"
              @change="onChange">
    </a-select>
    <!-- 级联下拉框 -->
    <a-cascader v-if="config.type === 'cascader'"
                v-model="form[config.key]"
                v-bind="config.props || {}"
                @change="onChange"
                :allowClear="false">
    </a-cascader>
    <!-- 多选框 -->
    <a-checkbox v-if="config.type === 'checkbox'"
                v-model="form[config.key]"
                v-bind="config.props || {}"
                @change="onChange">
      {{config.text}}
    </a-checkbox>
    <!-- 单选框 -->
    <a-radio-group v-if="config.type === 'radio'"
                   v-model="form[config.key]"
                   v-bind="config.props || {}"
                   @change="onChange">
      {{config.text}}
    </a-radio-group>
    <!-- 日期选择框 -->
    <a-date-picker v-if="config.type === 'date-picker'"
                   v-model="form[config.key]"
                   v-bind="config.props || {}"
                   @change="onChange">
    </a-date-picker>
    <!-- 时间范围选择器 -->
    <a-range-picker v-if="config.type === 'range-picker'"
                    v-model="form[config.key]"
                    v-bind="config.props || {}"
                    @change="onChange">
    </a-range-picker>
    <!-- 开关 -->
    <a-switch v-if="config.type === 'switch'"
              v-model="form[config.key]"
              v-bind="config.props || {}"
              @change="onChange" >
    </a-switch>
    <!-- 评分 -->
    <a-rate v-if="config.type === 'rate'"
            v-model="form[config.key]"
            v-bind="config.props || {}"
            @change="onChange"
            :allowClear="false">
    </a-rate>
    <!-- 颜色选择器 -->
    <ColorPicker v-if="config.type === 'color-picker'"
                 :config="config"
                 :form="form"
                 :color="form[config.key]"
                 @change="onChange">
    </ColorPicker>
    <!-- 图片选择器 -->
    <ImageUpload v-if="config.type === 'image-upload'"
                 :config="config"
                 :form="form"
                 @change="onChange">
    </ImageUpload>
  </a-form-model-item>
</template>

<script>
import Textarea from './textarea.vue'
import ColorPicker from './colorPicker.vue'
import ImageUpload from './imageUpload'

export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    configData: {
      type: Array,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    layout: {
      type: Object,
      required: true
    }
  },
  components: {
    Textarea,
    ColorPicker,
    ImageUpload
  },
  data () {
    return {

    }
  },
  methods: {
    onChange () {
      if (this.config.callback && this.config.callback.change) {
        this.config.callback.change(this.form, this.configData, this)
      }
    },
    filterOptions (input, option) {
      return (
        option.componentOptions.children[0].text.includes(input)
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .help-icon{
    color: var(--help-color);
  }
</style>
