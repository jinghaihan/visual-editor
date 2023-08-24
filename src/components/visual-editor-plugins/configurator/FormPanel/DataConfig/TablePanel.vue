<template>
  <div class="visual-editor-table-panel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      v-bind="layout"
    >
      <!-- 全局配置 -->
      <a-divider>
        <span class="title">全局配置</span>
      </a-divider>
      <a-row>
        <!-- 展示字段排序 -->
        <a-col :span="24" v-if="cell.type === 'detail-table'">
          <a-form-model-item label="聚合控制">
            <TooltipIcon class="action sort-action"
                         title="展示字段排序"
                         type="sort-ascending"
                         @click="onSort">
            </TooltipIcon>
          </a-form-model-item>
        </a-col>
        <!-- 聚合控制 -->
        <a-col :span="24">
          <a-form-model-item ref="isGroupBy"
                             prop="isGroupBy"
                             label="聚合控制">
            <a-switch v-model="form.isGroupBy"
                      @change="onGroupByChange">
            </a-switch>
          </a-form-model-item>
        </a-col>
        <!-- 默认排序 -->
        <a-col :span="24">
          <a-form-model-item ref="orderField"
                             prop="orderField"
                             label="默认排序">
            <a-select v-model="form.orderField"
                      placeholder="请选择默认排序"
                      :show-search="true"
                      :filter-option="filterOptions"
                      allowClear
                      :options="orderFieldOptions"
                      @change="onOrderFieldChange" >
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="form.orderField"
                             ref="orderType"
                             prop="orderType">
            <a-radio-group v-model="form.orderType"
                           :options="orderTypeOptions"
                           @change="onOrderTypeChange">
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 字段配置 -->
      <a-divider>
        <span class="title">字段配置</span>
      </a-divider>
      <a-row>
        <!-- 数据类型 -->
        <a-col :span="24">
          <a-form-model-item ref="type"
                             prop="type"
                             label="数据类型">
            <a-select v-model="form.type"
                      placeholder="请选择数据类型"
                      :show-search="true"
                      :filter-option="filterOptions"
                      allowClear
                      :options="typeOptions"
                      @change="onTypeChange" >
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- 文字内容 -->
        <a-col :span="24" v-if="form.type === 'TEXT'">
          <a-form-model-item ref="text"
                             prop="text"
                             label="文字内容">
            <a-input v-model="form.text"
                     placeholder="请输入文字内容"
                     @change="onChange">
            </a-input>
          </a-form-model-item>
        </a-col>
        <!-- 数据字段 -->
        <a-col :span="24" v-if="form.type === 'FIELD'">
          <a-form-model-item ref="fieldData"
                             prop="fieldData"
                             label="数据字段">
            <a-row :gutter="4">
              <a-col :span="(form.isGroupBy && fieldDataType === 'MEASURE') ? 10 : 24">
                <a-tree-select
                  v-model="form.fieldData"
                  placeholder="请选择数据字段"
                  :tree-data="fieldTree"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  show-search
                  :filterTreeNode="filterTreeOptions"
                  tree-default-expand-all
                  @change="onFieldDataChange"
                >
                </a-tree-select>
              </a-col>
              <template v-if="form.isGroupBy && fieldDataType === 'MEASURE'">
                <a-col :span="8">
                  <a-select v-model="form.aggregationType"
                            placeholder="请选择"
                            :show-search="true"
                            :filter-option="filterOptions"
                            :options="aggregationOptions"
                            @change="onChange">
                  </a-select>
                </a-col>
                <!-- 指标乘除计算 -->
                <a-col :span="3">
                  <a-tooltip>
                    <template slot="title">指标乘除计算</template>
                    <img v-show="form.fieldData"
                         class="action"
                         :src="form.calculation ? icon['calculation'] : icon['calculationUnused']"
                         @click="onCalculation()">
                  </a-tooltip>
                </a-col>
                <!-- 小数点规整 -->
                <a-col :span="3">
                  <a-tooltip>
                    <template slot="title">小数点规整</template>
                    <img v-show="form.fieldData"
                        class="action"
                        :src="form.decimal ? icon['decimal'] : icon['decimalUnused']"
                        @click="onDecimal()">
                  </a-tooltip>
                </a-col>
              </template>
            </a-row>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

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

const typeOptions = [
  { label: '文字', value: 'TEXT' },
  { label: '字段', value: 'FIELD' }
]

const orderTypeOptions = [
  { label: '升序', value: 'ASC' },
  { label: '降序', value: 'DESC' }
]

const clearFormItemKeys = ['type', 'text', 'fieldData', 'aggregationType', 'calculation', 'decimal']

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    cell: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    modelData: {
      type: Object,
      required: true
    },
    selector: {
      required: false
    }
  },
  components: {
    TooltipIcon,
    CalculationModal,
    DecimalModal
  },
  data () {
    return {
      rules: {},
      layout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      typeOptions,
      orderTypeOptions,
      aggregationOptions: Setting.aggregationOptions,
      fieldOptions: [],
      icon: {
        calculation: require('./assets/calculation.png'),
        calculationUnused: require('./assets/calculation_unused.png'),
        decimal: require('./assets/decimalPoint.png'),
        decimalUnused: require('./assets/decimalPoint_unused.png')
      },
      // 弹窗
      modalData: {},
      calculationVisible: false,
      decimalVisible: false,
      sortVisible: false
    }
  },
  computed: {
    orderFieldOptions () {
      let options = []
      let tableConfig = this.cell.configData.tableConfig
      if (!tableConfig) return options

      Object.keys(tableConfig).forEach(ri => {
        Object.keys(tableConfig[ri]).forEach(ci => {
          let data = tableConfig[ri][ci]
          if (data.type === 'FIELD' && data.fieldData) {
            let fieldData = JSON.parse(data.fieldData)
            let name = fieldData.name

            if (fieldData.fieldType === 'MEASURE') {
              let aggregation = Setting.aggregationOptions.find(item => item.value === data.aggregationType)
              name = `${name}(${aggregation.label})`
            }

            options.push({
              label: name,
              title: name,
              value: JSON.stringify(fieldData)
            })
          }
        })
      })

      return options
    },
    fieldDataType () {
      let type = ''
      if (this.form.fieldData) {
        let fieldData = JSON.parse(this.form.fieldData)
        type = fieldData.fieldType
      }
      return type
    },
    fieldTree () {
      let options = []

      this.fieldOptions.forEach(option => {
        let fieldData = JSON.parse(option.value)
        let index = options.findIndex(opt => opt.value === fieldData.fieldType)
        if (index === -1) {
          options.push({
            label: Setting.fieldNameMap[fieldData.fieldType],
            title: Setting.fieldNameMap[fieldData.fieldType],
            value: fieldData.fieldType,
            children: [],
            isLeaf: false,
            selectable: false
          })
          index = options.length - 1
        }

        options[index].children.push({
          label: fieldData.name,
          value: option.value,
          isLeaf: true
        })
      })
      
      return options
    }
  },
  watch: {
    modelData: {
      deep: true,
      immediate: true,
      handler: function (value) {
        this.init()
      }
    },
    selector: {
      deep: true,
      immediate: true,
      handler: function (value) {
        this.initConfig()
      }
    }
  },
  methods: {
    init () {
      let _this = this

      let fieldData = []

      Setting.fieldType.forEach(type => {
        let key = type.toLowerCase() + 's'
        let data = this.modelData[key]
        if (data && data.length) {
          fieldData = fieldData.concat(data.map(i => {
            return { 
              ...i,
              type,
              label: i.name,
              value: JSON.stringify({
                id: generateUUID(),
                fieldId: i.id,
                fieldType: type,
                name: i.name
              })
            }
          }))
        }
      })
      this.fieldOptions = fieldData

      const factory = {
        default: () => {
          _this.handleDefaultTableData(fieldData)
        }
      }

      if (!factory[this.cell.type]) {
        factory['default']()
      } else {
        factory[this.cell.type]()
      }
    },
    handleDefaultTableData (fieldData) {
      let tableConfig = {
        0: {},
        1: {}
      }

      fieldData.forEach((field, index) => {
        tableConfig[0][index] = {
          type: 'TEXT',
          text: field.name
        }

        tableConfig[1][index] = {
          type: 'FIELD',
          fieldData: field.value,
          aggregationType: this.form.isGroupBy ? 'SUM' : undefined
        }
      })

      this.cell.onConfigDataChange('tableConfig', tableConfig)
      this.cell.loadData()
      this.cell.setSelector()

      this.initConfig()
    },
    // 表单配置回显
    initConfig () {
      try {
        let configData = this.cell.configData.tableConfig[this.selector.ri][this.selector.ci]
        Object.keys(configData).forEach(key => {
          this.$set(this.form, key, configData[key])
        })
      } catch (error) {
        clearFormItemKeys.forEach(key => {
          this.$set(this.form, key, undefined)
        })
      }
    },
    onSort () {

    },

    // 全局配置
    onChange () {
      this.$forceUpdate()

      let data = _.cloneDeep(this.form)
      clearFormItemKeys.forEach(key => {
        delete data[key]
      })

      this.$emit('change', data)
    },
    onGroupByChange () {
      this.onChange()
    },
    onOrderFieldChange () {
      if (!this.form.orderType) {
        this.form.orderType = 'ASC'
      }
      this.onChange()
    },
    onOrderTypeChange () {
      this.onChange()
    },

    // 字段配置
    onFiledChange () {
      let data = _.cloneDeep(this.form)
      Object.keys(data).forEach(key => {
        if (!clearFormItemKeys.includes(key)) {
          delete data[key]
        }
      })

      if (!this.cell.configData.tableConfig) {
        this.cell.configData.tableConfig = {}
      }
      if (!this.cell.configData.tableConfig[this.selector.ri]) {
        this.cell.configData.tableConfig[this.selector.ri] = {}
      }
      this.cell.configData.tableConfig[this.selector.ri][this.selector.ci] = data

      this.cell.loadData()
    },
    onTypeChange (value) {
      if (value === 'TEXT') {
        delete this.form.fieldData
        delete this.form.aggregationType
        delete this.form.calculation
        delete this.form.decimal
      } else {
        delete this.form.fieldData
      }

      this.onFiledChange()
    },
    onFieldDataChange () {
      if (this.fieldDataType === 'DIMENSION') {
        delete this.form.aggregationType
        delete this.form.calculation
        delete this.form.decimal
      } else {
        if (this.form.isGroupBy && !this.form.aggregationType) {
          this.form.aggregationType = 'SUM'
        }
      }
      this.onFiledChange()
    },
    onCalculation () {
      let fieldData = JSON.parse(this.form.fieldData)
      this.modalData = {
        isGroupBy: this.form.isGroupBy,
        measureName: fieldData.name,
        calculation: this.form.calculation || {}
      }
      this.calculationVisible = true
    },
    onDecimal () {
      let fieldData = JSON.parse(this.form.fieldData)
      this.modalData = {
        isGroupBy: this.form.isGroupBy,
        measureName: fieldData.name,
        decimal: this.form.decimal || {}
      }
      this.decimalVisible = true
    },
    async onModalSubmit (data, type) {
      this.form[type] = data
      this.onFiledChange()
    },
    onModalClose () {
      this.modalData = {}
      this.calculationVisible = false
      this.decimalVisible = false
      this.sortVisible = false
    },

    filterOptions (input, option) {
      return (
        option.componentOptions.children[0].text.includes(input)
      )
    },
    filterTreeOptions (input, option) {
      let flag = false
      if (!option.data.props.isLeaf) {
        option.componentOptions.children.forEach(item => {
          if (item.data.props.title.toLowerCase().includes(input.toLowerCase())) {
            flag = true
          }
        })
      } else {
        flag = option.componentOptions.propsData.title.toLowerCase().includes(input.toLowerCase())
      }

      return flag
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-table-panel{
    .title{
      font-weight: bold;
    }
    .action{
      cursor: pointer;
      height: 24px;
      width: 24px;
    }
    .sort-action{
      color: var(--active-color);
      font-size: 18px;
    }
  }
</style>
