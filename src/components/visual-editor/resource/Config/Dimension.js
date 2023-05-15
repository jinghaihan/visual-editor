class Dimension {
  constructor (data) {
    this.id = null
    this.fieldId = null
    this.name = null

    this.init(data)
  }
  init (data) {
    try {
      let fieldData = JSON.parse(data)
    
      this.id = fieldData.id
      this.fieldId = fieldData.fieldId
      this.name = fieldData.name
    } catch (error) {
      
    }
  }
}

export default Dimension
