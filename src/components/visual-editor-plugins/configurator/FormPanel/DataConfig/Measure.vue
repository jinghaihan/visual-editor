<template>
  <div class="visual-editor-measureconfig-container">
    <a-row :gutter="4"
           v-for="item in form.measures"
           :key="item.key + '-' + form.measures.length">
      <!-- 指标 -->
      <a-col :span="form.isGroupBy ? 8 : 16">
        <a-select v-model="item.measure"
                  placeholder="请选择"
                  :show-search="true"
                  :filter-option="filterOptions"
                  :options="measureOptions"
                  @change="onChange" >
        </a-select>
      </a-col>

      <!-- 聚合方式 -->
      <a-col :span="8" v-if="form.isGroupBy">
        <a-select v-model="item.aggregationType"
                  placeholder="请选择"
                  :show-search="true"
                  :filter-option="filterOptions"
                  :options="options.aggregation"
                  @change="onChange" >
        </a-select>
      </a-col>

      <!-- 指标乘除计算 -->
      <a-col :span="3">
        <a-tooltip>
          <template slot="title">指标乘除计算</template>
          <img v-show="item.measure"
               class="action"
               :src="item.calculation ? icon['calculation'] : icon['calculationUnused']"
               @click="onCalculation(item)">
        </a-tooltip>
      </a-col>

      <!-- 小数点规整 -->
      <a-col :span="3">
        <a-tooltip>
          <template slot="title">小数点规整</template>
          <img v-show="item.measure"
               class="action"
               :src="item.decimal ? icon['decimal'] : icon['decimalUnused']"
               @click="onDecimal(item)">
        </a-tooltip>
      </a-col>

      <!-- 操作按钮 -->
      <a-col :span="2">
        <TooltipIcon v-show="form.measures.length > 1"
                     title="删除"
                     type="close"
                     @click="onDelete(item)">
        </TooltipIcon>
      </a-col>
    </a-row>

    <CalculationModal v-if="calculationVisible"
                      :modalData="modalData"
                      @submit="onModalSubmit"
                      @close="onModalClose">
    </CalculationModal>

    <DecimalModal v-if="decimalVisible"
                  :modalData="modalData"
                  @submit="onModalSubmit"
                  @close="onModalClose">
    </DecimalModal>
  </div>
</template>

<script>
import _ from 'lodash'
import { generateUUID } from '@/components/visual-editor/utils'
import Setting from '@/components/visual-editor-plugins/config/setting'

import TooltipIcon from '@/components/visual-editor/component/TooltipIcon/tooltipIcon.vue'
import CalculationModal from './CalculationModal'
import DecimalModal from './DecimalModal'

export default {
  props: {
    form: {
      type: Object,
      required: true
    },
    modelData: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipIcon,
    CalculationModal,
    DecimalModal
  },
  data () {
    return {
      options: {
        aggregation: Setting.aggregationOptions
      },
      icon: {
        calculation: require('./assets/calculation.png'),
        calculationUnused: require('./assets/calculation_unused.png'),
        decimal: require('./assets/decimalPoint.png'),
        decimalUnused: require('./assets/decimalPoint_unused.png')
      },
      calculationVisible: false,
      decimalVisible: false
    }
  },
  computed: {
    measureOptions () {
      if (!this.modelData['measures']) {
        return []
      }

      return this.modelData['measures'].map(item => {
        return {
          label: item.name,
          title: item.name,
          value: JSON.stringify({
            fieldId: item.id,
            name: item.name
          })
        }
      })
    }
  },
  watch: {
    'form.isGroupBy': {
      deep: true,
      immediate: true,
      handler: function () {
        if (!this.form.isGroupBy) {
          this.form.measures.forEach(item => {
            if (item.calculation && item.calculation.aggregationPriority) {
              delete item.calculation.aggregationPriority
            }
            delete item.aggregationType
          })
        }
      }
    }
  },
  methods: {
    onAdd () {
      this.form.measures.push({
        key: generateUUID(),
        aggregationType: this.form.isGroupBy ? 'SUM' : undefined
      })
      this.onChange()
    },
    onDelete (item) {
      let index = this.form.measures.findIndex(i => i.key === item.key)
      this.form.measures.splice(index, 1)
      this.onChange()
    },
    onChange () {
      this.$emit('change')
    },
    onCalculation (item) {
      let fieldId = JSON.parse(item.measure).fieldId
      this.modalData = {
        key: item.key,
        measureName: this.modelData['measures'].find(item => item.id === fieldId).name,
        isGroupBy: this.form.isGroupBy,
        calculation: item.calculation || {}
      }
      this.calculationVisible = true
    },
    onDecimal (item) {
      let fieldId = JSON.parse(item.measure).fieldId
      this.modalData = {
        key: item.key,
        measureName: this.modelData['measures'].find(item => item.id === fieldId).name,
        isGroupBy: this.form.isGroupBy,
        decimal: item.decimal || {}
      }
      this.decimalVisible = true
    },
    async onModalSubmit (data, type) {
      try {
        this.form.measures.forEach(item => {
          if (item.key === this.modalData.key) {
            item[type] = data
            item = { ...item }
            throw new Error()
          }
        })
      } catch (error) {
        this.onChange()
      }
    },
    onModalClose () {
      this.modalData = {}
      this.calculationVisible = false
      this.decimalVisible = false
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
  .visual-editor-measureconfig-container{
    .action{
      cursor: pointer;
      height: 24px;
      width: 24px;
    }
  }
</style>
