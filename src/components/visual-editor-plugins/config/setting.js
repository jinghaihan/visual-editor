const Setting = {
  aggregationOptions: [
    { label: '总和', value: 'SUM' },
    { label: '最大值', value: 'MAX' },
    { label: '最小值', value: 'MIN' },
    { label: '平均值', value: 'AVG' },
    { label: '数量', value: 'COUNT' },
    { label: '数量(去重)', value: 'COUNT_DISTINCT' }
  ],
  calculationOptions: [
    { label: '乘以', value: '*' },
    { label: '除以', value: '/' }
  ],
  aggregationPriorityOptions: [
    { label: '先聚合后计算', value: 'FIRST' },
    { label: '先计算后聚合', value: 'LATTER' }
  ],
  truncTypeOptions: [
    { label: '四舍五入', value: 'ROUNDING' },
    { label: '截取', value: 'TRUNCATION' }
  ],
  fieldType: [
    'DIMENSION', 'MEASURE'
  ],
  fieldNameMap: {
    'DIMENSION': '维度',
    'MEASURE': '指标'
  }
}

const optionsEnum = [
  'aggregationOptions',
  'calculationOptions',
  'aggregationPriorityOptions',
  'truncTypeOptions'
]

optionsEnum.forEach(key => {
  Setting[key] = Setting[key].map((opt) => {
    return {
      ...opt,
      title: opt.label
    }
  })
})

export default Setting
