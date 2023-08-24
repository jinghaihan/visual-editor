<template>
  <a-row :gutter="8">
    <template v-for="conf in confs">
      <a-col :key="conf.key"
             :span="conf.column"
             :class="(!whiteList.includes(conf.key) && data[conf.key].errors.length) ? 'has-error' : ''">
        <!-- 气泡提示 -->
        <a-tooltip v-if="conf.tooltip" placement="topLeft">
          <template slot="title">{{data[conf.tooltip].value}}</template>
          <form-item :ref="'formItem-' + conf.key"
                    :config="conf"
                    :form="data"
                    :data="data[conf.key]"
                    :index="index"
                    :length="length"
                    :whiteList="whiteList"
                    :validateTrigger="validateTrigger"
                    @validate="onValidate"
                    @disabled="onDisabled"
                    @assign="onAssign"
                    @action="onAction">
          </form-item>
        </a-tooltip>
        <!-- 无气泡提示 -->
        <template v-else>
          <form-item :ref="'formItem-' + conf.key"
                    :config="conf"
                    :form="data"
                    :data="data[conf.key]"
                    :index="index"
                    :length="length"
                    :whiteList="whiteList"
                    :validateTrigger="validateTrigger"
                    @validate="onValidate"
                    @disabled="onDisabled"
                    @assign="onAssign"
                    @action="onAction"
                    @config=onConfig>
          </form-item>
        </template>
      </a-col>
    </template>
    <a-divider class="divider" v-if="divider"></a-divider>
  </a-row>
</template>

<script>
import _ from 'lodash'
import formItem from './FormItem'

export default {
  components: { formItem },
  props: {
    config: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
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
    },
    divider: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      confs: _.cloneDeep(this.config)
    }
  },
  mounted () {
    this.triggerRelation('config')
  },
  methods: {
    onValidate (fields) {
      fields.forEach(field => {
        let ref = this.$refs['formItem-' + field][0]
        ref.validate()
      })
    },
    onDisabled (data) {
      let fields = Object.keys(data)
      fields.forEach(field => {
        let ref = this.$refs['formItem-' + field][0]
        ref.disabled(data[field])
      })
    },
    onAssign (data) {
      let fields = Object.keys(data)
      fields.forEach(field => {
        let ref = this.$refs['formItem-' + field][0]
        ref.assign(data[field])
      })
    },
    onConfig (method, value) {
      let result = method(value, this.data)
      this.confs.forEach((conf, index) => {
        if (conf.key === result.key) {
          this.confs[index] = result.config
        }
      })
      this.$forceUpdate()
    },
    onAction (event) {
      this.$emit('action', {
        event,
        index: this.index,
        key: this.key
      })
    },
    triggerRelation (operation) {
      let _this = this
      _this.confs.forEach(conf => {
        let ref = _this.$refs['formItem-' + conf.key][0]
        ref.relation(operation)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .divider{
    margin-top: 55px;
  }
</style>
