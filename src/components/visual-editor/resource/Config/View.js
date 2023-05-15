import BuiltinCondition from './BuiltinCondition'
import Dimension from './Dimension'
import Measure from './Measure'
import Order from './Order'

class View {
  constructor (data) {
    this.model = null
    this.builtinConditions = null
    this.subscribeFieldId = null

    this.isGroupBy = null
    this.dimensions = null
    this.measures = null
    this.orders = null
    
    this.init(data)
  }
  init (data) {
    if (data.modelId) {
      this.model = {
        type: 'DATA_MODEL',
        id: data.modelId
      }
    }

    if (data.builtinConditions) {
      this.builtinConditions = data.builtinConditions.map(item => {
        return {
          ...new BuiltinCondition(item)
        }
      })
    }

    this.subscribeFieldId = data.subscribeFieldId
    this.isGroupBy = data.isGroupBy
    this.dimensions = data.dimensions ? data.dimensions.map(dim => {
      return new Dimension(dim)
    }) : null
    this.measures = data.measures ? data.measures.map(mea => {
      return new Measure(mea)
    }) : null
    this.orders = data.orderField ? [
      new Order(data)
    ] : null
  }
}

export default View
