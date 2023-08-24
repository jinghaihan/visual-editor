class Order {
  constructor (data) {
    this.dvFieldId = null
    this.fieldId = null
    this.fieldType = null
    this.orderType = null

    this.init(data)
  }
  init (data) {
    let fieldData = JSON.parse(data.orderField)
    this.dvFieldId = fieldData.dvFieldId || fieldData.id
    this.fieldId = fieldData.fieldId
    this.fieldType = fieldData.fieldType
    this.orderType = data.orderType
  }
}

export default Order
