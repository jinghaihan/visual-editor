<template>
  <div class="virtual-form-container">
    <!-- 表头 -->
    <div v-if="header" class="form-header-container">
      <form-header :header="header"></form-header>
    </div>
    <!-- 表单 -->
    <div :class="'form-content-container ' + (header? 'form-with-header' : 'form-without-header')">
      <DynamicScroller
        ref="scroller"
        class="virtual-scroller"
        key-field="key"
        :items="filterItems"
        :min-item-size="64"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[ item.errors ]"
            :data-index="index"
          >
            <form-row :ref="'formRow-' + item.key"
                      :key="item.key"
                      :config="config"
                      :data="item"
                      :index="item.index"
                      :length="form.length"
                      :whiteList="whiteList"
                      :validateTrigger="validateTrigger"
                      :divider="divider"
                      @action="onAction">
            </form-row>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import formHeader from './components/FormHeader'
import formRow from './components/FormRow'
import { requiredValidate, maxValidate, minValidate, patternValidate, validatorValidate } from './validate'
import { generateUUID, getFieldsValue, getFieldError } from './utils'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  name: 'virtualForm',
  components: { formHeader, formRow, DynamicScroller, DynamicScrollerItem },
  props: {
    config: {
      type: Array,
      required: true
    },
    header: {
      type: Array,
      required: false
    },
    validateTrigger: {
      type: String,
      required: false,
      default: 'change'
    },
    scrollAfterAdd: {
      type: Boolean,
      required: false,
      default: true
    },
    divider: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    filterItems () {
      const { value, field } = this.params

      if (!value) return this.form
      return this.form.filter(item => {
        return item[field].value && item[field].value.includes(value)
      }) 
    }
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler: function (value) {
        this.$emit('change')
      }
    }
  },
  data () {
    return {
      whiteList: ['key', 'index', 'action'],
      form: [],
      params: {
        value: undefined,
        field: undefined
      }
    }
  },
  methods: {
    /**
     * 校验全部组件
     * @returns {Promise}
     */
    validateFields () {
      let error = false
      
      let validate = {}
      this.config.forEach(item => {
        if (this.whiteList.includes(item.key)) return

        validate[item.key] = {
          rules: item.rules,
          rely: item.relyOn ? () => {
            let relyConfig = this.config.filter(conf => conf.key === item.relyOn)[0]
            return {
              method: relyConfig.relations.config,
              key: item.relyOn
            }
          } : ''
        }
        if (!item.relations) return
        validate[item.key].relations = item.relations.validate
      })

      return new Promise((resolve, reject) => {
        this.form.forEach((item, index) => {
          let valid = _.cloneDeep(validate)
          Object.keys(item).forEach(field => {
            if (this.whiteList.includes(field)) return

            if (valid[field].rely) {
              let data = valid[field].rely()
              let result = data.method(item[data.key].value, item)
              valid[result.key].rules = result.config.rules
              if (result.config.relations) {
                valid[result.key].relations = result.config.relations.validate
              } else {
                valid[result.key].relations = null
              }
            }
            
            let rules = valid[field].rules
            let relations = valid[field].relations

            if (this.validateRules(rules, item, index, field)) {
              error = true
            }
            if (this.validateRelations(relations, item, index)) {
              error = true
            }
          })
        })
      
        resolve({ error, value: getFieldsValue(this.form) })
      })
    },
    /**
     * 新增-number行表单
     * @param {number}
     * @return {}
     */
    onAdd (number) {
      if (!number) number = 1

      let arr = []
      let length = this.form.length

      for (let i = 0; i < number; i++) {
        let data = {
          key: generateUUID(),
          index: length + i
        }
        this.config.forEach(item => {
          data[item.key] = {
            value: item.defaultValue,
            errors: [],
            disabled: item.defaultDisabled ? item.defaultDisabled : false
          }
        })
        arr.push(data)
      }
      this.form = this.form.concat(arr)

      if (!this.scrollAfterAdd) return
      this.scrollToBottom()
    },
    /**
     * 过滤-单条件查询
     * @param {value}
     * @param {field}
     * @returns {Null}
     */
    onFilter (value, field) {
      this.params.value = value
      this.params.field = field
    },
    /**
     * 全局排序
     * @param {originalIndex}
     * @param {index}
     * @returns {Null}
     */
    onSort (originalIndex, index) {
      let data = this.form[originalIndex]
      this.form.splice(originalIndex, 1)
      this.form.splice(index, 0, data)
      // 刷新index
      this.form.forEach((item, index) => {
        this.form[index].index = index
      })
    },
    /**
     * 滚动至number行
     * @param {number}
     * @returns {}
     */
    onScroll (number) {
      if (!this.$refs.scroller) return
      if (number > this.form.length) number = this.form.length

      this.$refs.scroller.scrollToItem(number - 1)
    },
    /**
     * 更新form数据
     * @param {data}
     * @returns {}
     */
    onUpdate (data) {
      // 空数组
      if (!data.length) {
        this.form = data
        return
      }

      // 回显
      let arr = []
      let length = data.length

      for (let i = 0; i < length; i++) {
        let temp = {
          key: data[i].key || generateUUID(),
          index: i
        }
        this.config.forEach(item => {
          temp[item.key] = {
            value: data[i][item.key],
            errors: [],
            disabled: item.defaultDisabled ? item.defaultDisabled : false
          }
        })
        arr.push(temp)
      }

      this.form = arr
    },
    /**
     * 校验规则
     * @param {rules}
     * @param {item}
     * @param {index}
     * @param {field}
     * @returns {Boolean}
     */
    validateRules (rules, item, index, field) {
      let error = false

      rules.forEach(rule => {
        let message
        // 必填校验
        if (rule.required) {
          message = requiredValidate(item[field].value, rule)
        }
        // 最长校验
        if (rule.max) {
          message = maxValidate(item[field].value, rule)
        }
        // 最小校验
        if (rule.min) {
          message = minValidate(item[field].value, rule)
        }
        // 正则校验
        if (rule.pattern) {
          message = patternValidate(item[field].value, rule)
        }
        // validator校验
        if (rule.validator) {
          message = validatorValidate(item[field].value, rule, getFieldsValue([item])[0])
        }

        if (!message) return

        // 赋值错误信息
        let result = getFieldError(item[field].errors, [message])
        this.form[index][field].errors = result

        if (this.form[index][field].errors.length) error = true
      })

      return error
    },
    /**
     * 校验规则
     * @param {target}
     * @param {item}
     * @param {index}
     * @returns {Boolean}
     */
    // 关联校验规则
    validateRelations (target, item, index) {
      let error = false
      if (!target) return error

      target.forEach(data => {
        let config = this.config.filter(item => item.key === data)[0]
        if (this.validateRules(config.rules, item, index, data)) {
          error = true
        }
      })

      return error
    },
    /**
     * 表单操作
     * @param {data}
     * @returns {Null}
     */
    onAction (data) {
      let temp
      switch (data.event) {
        case 'delete':
          for (let i = data.index + 1; i < this.form.length; i++) {
            this.form[i].index -= 1
          }
          this.form.splice(data.index, 1)
          break
        case 'sort':
          this.$emit('sort', {
            min: 1,
            max: this.form.length,
            index: data.index
          })
          break
        case 'up':
          let prev = data.index - 1
          temp = this.form[data.index]
          this.$set(this.form, data.index, { ...this.form[prev], index: data.index })
          this.$set(this.form, prev, { ...temp, index: prev })
          break
        case 'down':
          let next = data.index + 1
          temp = this.form[data.index]
          this.$set(this.form, data.index, { ...this.form[next], index: data.index })
          this.$set(this.form, next, { ...temp, index: next })
          break
        default:
          break
      }
    },
    /**
     * 滚动虚拟列表底部
     * @return {}
     */
    scrollToBottom () {
      this.$refs.scroller.scrollToBottom()
    }
  }
}
</script>

<style lang="less" scoped>
  .virtual-form-container{
    height: 100%;
    .form-content-container{
      overflow: auto;
      overflow-x: hidden;
      .virtual-scroller{
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
      }
    }
    .form-with-header{
      height: calc(~"100% - 50px");
    }
    .form-without-header{
      height: 100%;
    }
  }
</style>
