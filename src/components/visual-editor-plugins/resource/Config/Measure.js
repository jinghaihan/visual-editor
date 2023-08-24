class Measure {
  constructor (data) {
    this.id = null
    this.fieldId = null
    this.name = null
    this.aggregationType = null
    this.aggregationPriority = null
    this.calculation = null
    this.number = null
    this.decimalPlace = null
    this.truncType = null

    this.init(data)
  }
  init (data) {
    try {
      let fieldData = JSON.parse(data.measure)
      this.id = data.key || fieldData.id
      this.fieldId = fieldData.fieldId
      this.name = fieldData.name
      this.aggregationType = data.aggregationType
      // 乘除计算
      if (data.calculation) {
        this.aggregationPriority = data.calculation.aggregationPriority
        this.calculation = data.calculation.calculation
        this.number = data.calculation.number
      }
      // 小数点规整
      if (data.decimal) {
        this.decimalPlace = data.decimal.decimalPlace
        this.truncType = data.decimal.truncType
      }
    } catch (error) {
      
    }
  }
}

export default Measure
