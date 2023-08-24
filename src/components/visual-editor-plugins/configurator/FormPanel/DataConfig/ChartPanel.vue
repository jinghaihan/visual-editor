<template>
  <div class="visual-editor-chart-panel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      v-bind="layout"
    >
      <a-row>
        <!-- 聚合控制 -->
        <a-col :span="24">
          <a-form-model-item ref="isGroupBy"
                             prop="isGroupBy"
                             label="聚合控制">
            <a-switch v-model="form.isGroupBy"
                      @change="onChange">
            </a-switch>
          </a-form-model-item>
        </a-col>

        <!-- 维度 -->
        <a-col :span="24">
          <a-form-model-item ref="dimensions"
                             prop="dimensions">
            <template slot="label">
              <a-tooltip>
                <template slot="title">注：若您绑定的维度，维度值过多，报表展示时默认只展示前100维度值下的数据情况。</template>
                维度 <a-icon class="help-icon" type="question-circle"></a-icon>
              </a-tooltip>
            </template>
            <a-select v-model="form.dimensions"
                      placeholder="请选择维度"
                      mode="multiple"
                      :show-search="true"
                      :filter-option="filterOptions"
                      :options="options.dimension"
                      @change="onDimensionChange" >
            </a-select>
          </a-form-model-item>
        </a-col>

        <!-- 指标 -->
        <a-col :span="24">
          <a-form-model-item ref="measures"
                             prop="measures">
            <template slot="label">
              <a-tooltip placement="topLeft">
                <template slot="title">新增</template>
                指标 <a-icon class="action-icon"
                            type="plus-square"
                            @click="addMeasure">
                    </a-icon>
              </a-tooltip>
            </template>
            <Measure ref="Measure"
                     :form.sync="form"
                     :modelData="modelData"
                     @change="onMeasureChange">
            </Measure>
          </a-form-model-item>
        </a-col>

        <!-- 默认排序 -->
        <a-col :span="24" v-if="orderFieldVisible">
          <!-- 排序字段 -->
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

          <!-- 默认排序 -->
          <a-form-model-item v-if="form.orderField"
                             ref="orderType"
                             prop="orderType">
            <a-radio-group v-model="form.orderType"
                           :options="[
                            { label: config.circle.includes(cell.type) ? '顺时针升序' : '升序', value: 'ASC' },
                            { label: config.circle.includes(cell.type) ? '顺时针降序' : '降序', value: 'DESC' }
                           ]"
                           @change="onChange">
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { generateUUID } from '@/components/visual-editor/utils'
import Setting from '@/components/visual-editor-plugins/config/setting'
import Measure from './Measure.vue'

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
    }
  },
  components: {
    Measure
  },
  data () {
    return {
      rules: {},
      layout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      config: {
        hideOrderField: ['funnel', 'map-scatter', 'map-heatmap'],
        circle: ['pie', 'pie-ring', 'pie-rose', 'radar']
      },
      dimensionMap: {},
      measureMap: {},
      options: {
        dimension: []
      }
    }
  },
  computed: {
    orderFieldVisible () {
      if (this.config.hideOrderField.includes(this.cell.type)) {
        return false
      }
      return true
    },
    orderFieldOptions () {
      let options = []

      if (!Object.keys(this.dimensionMap).length || !Object.keys(this.measureMap).length) return

      if (this.form.dimensions && this.form.dimensions instanceof Array) {
        this.form.dimensions.forEach(item => {
          let fieldData = JSON.parse(item)
          options.push({
            label: this.dimensionMap[fieldData.fieldId].name,
            title: this.dimensionMap[fieldData.fieldId].name,
            value: JSON.stringify({
              id: fieldData.id,
              fieldId: fieldData.fieldId,
              fieldType: 'DIMENSION',
              name: this.dimensionMap[fieldData.fieldId].name
            })
          })
        })
      }

      if (this.form.measures && this.form.measures instanceof Array) {
        this.form.measures.forEach(item => {
          if (!item.measure) return
          if (!item.aggregationType && this.form.isGroupBy) return

          let fieldData = JSON.parse(item.measure)
          let aggregation = Setting.aggregationOptions.find(option => option.value === item.aggregationType)
          let label = item.aggregationType
            ? this.measureMap[fieldData.fieldId].name + `（${aggregation.label}）`
            : this.measureMap[fieldData.fieldId].name
            
          if (!options.find(option => option.label === label)) {
            options.push({
              label: label,
              value: JSON.stringify({
                id: item.key,
                fieldId: fieldData.fieldId,
                fieldType: 'MEASURE',
                name: fieldData.name
              })
            })
          }
        })
      }

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
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.form.measures.length) {
        this.addMeasure()
      }
      this.handleModelData()
    },
    addMeasure () {
      if (this.$refs.Measure) {
        this.$refs.Measure.onAdd()
      }
    },
    handleModelData () {
      let options = []
      this.dimensionMap = {}
      this.measureMap = {}

      let fieldIdMap = {}

      if (this.form.dimensions && this.form.dimensions.length) {
        this.form.dimensions.forEach(item => {
          let fieldData = JSON.parse(item)
          fieldIdMap[fieldData.fieldId] = fieldData.id
        })
      }

      if (this.modelData['dimensions'] && this.modelData['dimensions'].length) {
        this.modelData['dimensions'].forEach(item => {
          this.dimensionMap[item.id] = {
            ...item,
            key: fieldIdMap[item.id] || generateUUID()
          }
          options.push({
            label: item.name,
            title: item.name,
            value: JSON.stringify({
              id: this.dimensionMap[item.id].key,
              fieldId: item.id,
              fieldType: 'DIMENSION',
              name: item.name
            })
          })
        })
      }

      if (this.modelData['measures'] && this.modelData['measures'].length) {
        this.modelData['measures'].forEach(item => {
          this.measureMap[item.id] = item
        })
      }

      this.options.dimension = options
    },
    onChange () {
      this.$forceUpdate()
      this.$emit('change')
    },
    onDimensionChange () {
      this.validateField()
      this.onChange()
    },
    onMeasureChange () {
      this.validateField()
      this.onChange()
    },
    onOrderFieldChange () {
      if (!this.form.orderType && typeof this.form.orderType !== 'boolean') {
        this.form.orderType = 'ASC'
      }
      this.onChange()
    },
    validateField () {
      if (!this.form.orderField) return

      if (!this.orderFieldOptions.find(item => item.value === this.form.orderField)) {
        this.form.orderField = undefined
        this.form.orderType = undefined
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
  .visual-editor-chart-panel{
    .action-icon{
      cursor: pointer;
      color: var(--active-color);
    }
    .help-icon{
      cursor: pointer;
      color: var(--help-color);
    }
  }
</style>
