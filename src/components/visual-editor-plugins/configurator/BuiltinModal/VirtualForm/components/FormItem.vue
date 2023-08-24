<template>
  <div class="form-item-container">
    <!-- 输入框 -->
    <div :class="getClassName('input')"
         v-if="config.type === 'input'">
      <a-input class="form-item"
               :placeholder="config.placeholder"
               :disabled="formData.disabled"
               v-model="formData.value"
               @blur="onChange('blur')"
               @change="onChange('change')"
               :title="formData.disabled ? formData.value : ''"/>
    </div>
    <!-- 数字输入框 -->
    <div :class="getClassName('input-number')"
         v-if="config.type === 'number'">
      <a-input-number class="form-item"
                      :placeholder="config.placeholder"
                      :disabled="formData.disabled"
                      :precision="config.precision"
                      :min="config.min"
                      :max="config.max"
                      v-model="formData.value"
                      @blur="onChange('blur')"
                      @change="onChange('change')"/>
    </div>
    <!-- 下拉框 -->
    <div :class="getClassName('select')"
         v-if="config.type === 'select'">
      <a-select class="form-item"
                :options="config.options"
                :mode="config.mode ? config.mode : 'default'"
                :showSearch="config.showSearch ? config.showSearch : false"
                :placeholder="config.placeholder"
                :disabled="formData.disabled"
                v-model="formData.value"
                :filter-option="filterSelect"
                @change="onChange('change')">
      </a-select>
    </div>
    <!-- 树形下拉框 -->
    <div :class="getClassName('tree-select')"
         v-if="config.type === 'tree-select'">
      <a-tree-select class="form-item"
                    :tree-data="config.options"
                    :placeholder="config.placeholder"
                    :disabled="formData.disabled"
                    :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                    v-model="formData.value"
                    @change="onChange('change')">
      </a-tree-select>
    </div>
    <!-- 级联下拉框 -->
    <div :class="getClassName('cascader')"
         v-if="config.type === 'cascader'"
         :title="formData.disabled ? getCascaderTitle(formData.value, config.options) : ''">
      <a-cascader class="form-item"
                  :options="config.options"
                  :showSearch="config.showSearch ? config.showSearch : false"
                  :placeholder="config.placeholder"
                  :disabled="formData.disabled"
                  v-model="formData.value"
                  @change="onChange('change')"
                  :allowClear="false">
      </a-cascader>
    </div>
    <!-- 日期范围选择框 -->
    <div :class="getClassName('rangePicker')" 
         v-if="config.type === 'rangePicker'">
      <a-range-picker class="form-item"
                     :disabled="formData.disabled"
                     v-model="formData.value"
                     @change="onChange('change')"
                     v-bind="config.props ? config.props : {}">
      </a-range-picker>
    </div>
    <!-- 复选框 -->
    <div :class="getClassName('checkbox')" 
         v-if="config.type === 'checkbox'">
      <a-checkbox class="form-item"
                  :disabled="formData.disabled"
                  v-model="formData.value"
                  @change="onChange('change')">
        {{config.text}}
      </a-checkbox>
    </div>
    <!-- 单选框 -->
    <div :class="getClassName('radio')" 
         v-if="config.type === 'radio'">
      <a-radio-group class="form-item"
                     :options="config.options"
                     :disabled="formData.disabled"
                     v-model="formData.value"
                     @change="onChange('change')">
        {{config.text}}
      </a-radio-group>
    </div>
    <!-- 文本 -->
    <div :class="getClassName('text')"
         v-if="config.type === 'text'">
      {{formData.value}}
    </div>
    <!-- 序号 -->
    <div :class="getClassName('serial')"
         v-if="config.type === 'serial'">
      {{index + 1}}
    </div>
    <!-- 操作 -->
    <div :class="getClassName('action')"
         v-if="config.type === 'action'">
      <a-icon v-for="(opt, i) in config.operations"
              :key="i" :type="opt.icon"
              :title="opt.name"
              class="action-icon"
              @click="onAction(opt.event)"
              v-show="isShowAction(opt.event)">
      </a-icon>
    </div>
    <!-- 比较输入框 -->
    <div :class="getClassName('input-between')"
         v-if="config.type === 'input-between'">
      <InputBetween class="form-item"
                    :placeholder="config.placeholder"
                    :disabled="formData.disabled"
                    :formData="formData"
                    @change="onChange('change')">
      </InputBetween>
    </div>

    <!-- 错误信息 -->
    <div class="form-item-explain"
         v-if="!whiteList.includes(config.type)">
      <div class="form-item-explain-text" v-if="formData.errors.length">
        {{formData.errors.join(', ')}}
      </div>
    </div>
  </div>
</template>

<script>
import { requiredValidate, maxValidate, minValidate, patternValidate, validatorValidate } from '../validate'
import { getFieldsValue } from '../utils'
import InputBetween from './widget/inputBetween.vue'

export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    form: {
      required: false
    },
    data: {
      required: false
    },
    index: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    whiteList: {
      type: Array,
      required: true
    },
    validateTrigger: {
      type: String,
      required: true
    }
  },
  components: { InputBetween },
  data () {
    return {
      formData: this.data
    }
  },
  methods: {
    onChange (event) {
      if (this.validateTrigger !== event) return
      this.validate()
    },
    getClassName (type) {
      let result = ''
      result += 'form-item-wrapper' + ` ${type}-wrapper`
      if (this.config.center) {
        result += ' center-wrapper'
      }

      return result
    },
    onAction (event) {
      this.$emit('action', event)
    },
    isShowAction (event) {
      switch (event) {
        case 'delete':
          break
        case 'sort':
          if (this.length <= 1) return false
          break
        case 'up':
          if (!this.index) return false
          break
        case 'down':
          if (this.index === this.length - 1) return false
          break
        default:
          break
      }
      return true
    },
    validate () {
      this.formData.errors = []

      this.config.rules.forEach(rule => {
        let message
        // 必填校验
        if (rule.required) {
          message = requiredValidate(this.formData.value, rule)
        }
        // 最长校验
        if (rule.max) {
          message = maxValidate(this.formData.value, rule)
        }
        // 最小校验
        if (rule.min) {
          message = minValidate(this.formData.value, rule)
        }
        // 正则校验
        if (rule.pattern) {
          message = patternValidate(this.formData.value, rule)
        }
        // validator校验
        if (rule.validator) {
          let formData = getFieldsValue([this.form])[0]
          message = validatorValidate(this.formData.value, rule, formData)
        }

        if (!message) return
        this.formData.errors.push(message)
      })

      this.relation()
    },
    relation (opt) {
      if (!this.config.relations) return
      if (opt) {
        this.handleRelation(opt)
        return
      }
      Object.keys(this.config.relations).forEach(operation => {
        this.handleRelation(operation)
      })
    },
    handleRelation (operation) {
      if (!this.config.relations || !this.config.relations[operation]) return
      switch (operation) {
        case 'validate':
          this.$emit('validate', this.config.relations[operation])
          break
        case 'disabled':
          this.$emit('disabled', this.config.relations[operation])
          break
        case 'assign':
          this.$emit('assign', this.config.relations[operation])
          break
        case 'config':
          this.$emit('config', this.config.relations[operation], this.formData.value)
          break
        default:
          break
      }
    },
    disabled (method) {
      let formData = getFieldsValue([this.form])[0]
      let result = method(this.formData.value, formData)

      this.formData.disabled = result
      if (result) this.formData.value = this.config.defaultValue
    },
    assign (method) {
      let formData = getFieldsValue([this.form])[0]
      let result = method(this.formData.value, formData)

      this.formData.value = result
    },
    filterSelect (input, option) {
      return (
        option.componentOptions.children[0].text.includes(input)
      )
    },
    getCascaderTitle (value, options) {
      let result = ''
      if (!value || !value.length) return result
      if (!(value instanceof Array)) return result

      let opt = options
      value.forEach((item, layer) => {
        opt = opt.filter(data => data.value === value[layer])[0]
        if (layer !== value.length - 1) {
          result += (opt.title || opt.label) + ' / '
        } else {
          result += opt.title || opt.label
        }
        opt = opt.children
      })
      return result
    }
  }
}
</script>

<style lang="less" scoped>
  .form-item-container{
    .form-item-wrapper{
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      .form-item{
        width: 100%;
      }
    }
    .center-wrapper{
      justify-content: center;
    }
    .action-wrapper{
      color: #1890ff;
      .action-icon{
        margin: 0 6px;
      }
    }
    .form-item-explain{
      color: #f5222d;
      .form-item-explain-text{
        margin-bottom: 8px;
      }
    }
  }
</style>
