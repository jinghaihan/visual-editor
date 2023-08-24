class BuiltinCondition {
  constructor (data) {
    this.fieldId = null
    this.fieldType = null
    this.option = null
    this.values = null
    
    this.init(data)
  }
  init (data) {
    let fieldData = JSON.parse(data.field)
    this.fieldId = fieldData.fieldId
    this.fieldType = fieldData.fieldType
    this.option = data.option
    this.values = data.option === 'BETWEEN' ? JSON.parse(data.values) : [data.values]
  }
}

export default BuiltinCondition
