<template>
  <a-modal
    :visible="true"
    @ok="onSubmit"
    @cancel="closeModal()"
    :maskClosable="false"
    :keyboard="false"
    :width="650"
  >
    <template slot="footer">
      <a-button @click="onClear">清空</a-button>
      <a-button type="primary" @click="onSubmit">确定</a-button>
    </template>
    <template slot="title">指标<span class="name">[{{modalData.measureName}}]</span>乘除计算</template>
    <a-row :gutter="8">
      <!-- 计算方式 -->
      <a-col :span="8">
        <a-select v-model="data.calculation"
                  placeholder="计算方式"
                  :show-search="true"
                  :filter-option="filterOptions"
                  :options="options.calculation"
                  allowClear
                  style="width: 100%;" >
        </a-select>
      </a-col>
      <!--乘数/除数 -->
      <a-col :span="8">
        <a-input-number v-model="data.number"
                        placeholder='乘数/除数'
                        allowClear
                        style="width: 100%;" />
      </a-col>
      <!-- 计算与聚合优先级 -->
      <a-col :span="8" v-if="modalData.isGroupBy">
        <a-select v-model="data.aggregationPriority"
                  placeholder="计算与聚合优先级"
                  :show-search="true"
                  :filter-option="filterOptions"
                  :options="options.priority"
                  allowClear
                  style="width: 100%;" >
        </a-select>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import Setting from '@/components/visual-editor-plugins/config/setting'

export default {
  props: {
    modalData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      data: {},
      options: {
        calculation: Setting.calculationOptions,
        priority: Setting.aggregationPriorityOptions
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.data = this.modalData.calculation
    },
    onSubmit () {
      let { calculation, number, aggregationPriority } = this.data
      let and = calculation && (number || number === 0) && (this.modalData.isGroupBy ? aggregationPriority || aggregationPriority === 0 : true)
      let or = calculation || (number || number === 0) || (this.modalData.isGroupBy ? aggregationPriority || aggregationPriority === 0 : false)

      if (or && !and) {
        this.$notification.error({ message: '错误', description: '乘除计算配置项未完整填充，请检查' })
        return false
      }

      if (calculation && (number || number === 0) && (this.modalData.isGroupBy ? aggregationPriority || 0 : true)) {
        // 校验数字
        if (!Number.isInteger(+number)) {
          if (number.toString().split('.')[1].length > 4) {
            this.$notification.error({ message: '错误', description: '请输入小数点后4位' })
            return false
          }
        }
        if (number === 0 && calculation === '/') {
          this.$notification.error({ message: '错误', description: '乘除计算配置项不能除以0' })
          return false
        }
      }

      this.$emit('submit', this.data, 'calculation')
      this.closeModal()
    },
    onClear () {
      this.$emit('submit', null, 'calculation')
      this.closeModal()
    },
    closeModal () {
      this.$emit('close')
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
  .name{
    color: var(--basic-color);
  }
</style>
