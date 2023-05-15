<template>
  <div class="form-generator-container">
    <a-form-model
      v-if="configData.length"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <a-row>
        <a-col v-for="conf in configData"
              :key="conf.key"
              :span="conf.col || 24">
          <FormModelItem :ref="'FormModelItem-' + conf.key"
                         :config="conf"
                         :configData="configData"
                         :form.sync="form"
                         :layout="conf.layout || layout"
                         @notify-event="onNotify">
          </FormModelItem>
        </a-col>
      </a-row>
    </a-form-model>

    <div class="empty-container" v-else>
      <a-empty></a-empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import FormModelItem from './formModelItem'

export default {
  props: {
    configKey: {
      type: String,
      required: true
    },
    config: {
      type: Array,
      required: true
    }
  },
  components: {
    FormModelItem
  },
  data () {
    return {
      form: {},
      rules: {},
      layout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      configData: _.cloneDeep(this.config)
    }
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler: function (form) {
        this.onChange()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let form = {}
      let rules = {}

      this.configData.forEach(conf => {
        // 默认值
        form[conf.key] = this.getDefaultValue(conf.defaultValue)
        // 规则
        rules[conf.key] = (conf.rules ? conf.rules : []).map(rule => {
          return {
            ...rule,
            trigger: ['change', 'blur']
          }
        })
      })
      this.form = form
      this.rules = rules
    },
    getDefaultValue (defaultValue) {
      if (!defaultValue && typeof defaultValue !== 'boolean' && defaultValue !== 0) {
        return undefined
      }
      return defaultValue
    },
    onChange () {
      this.$emit('change', {
        key: this.configKey,
        formData: this.form
      })
    },
    onNotify (message) {
      this.$emit('notify-event', message)
    },
    triggerFormItemChange () {
      this.configData.forEach(conf => {
        let ref = this.$refs['FormModelItem-' + conf.key][0]
        ref.onChange()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .form-generator-container{
    height: 100%;
    width: 100%;
    color: var(--font-color);
    padding: 12px;
  }
  .empty-container{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
