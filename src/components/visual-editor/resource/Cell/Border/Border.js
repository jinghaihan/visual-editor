import _ from 'lodash'

import Setting from '../../../config/setting'
import FormModelConfig from './config/FormModel'
import { triggerVmDataUpdate } from '../../../utils/hook'

class Border {
  constructor (option) {
    this.componentType = 'border'
    this.type = option.type
    this.name = option.name

    this.vm = option.vm
    this.key = option.key
    this.component = this.vm.$refs.Component

    this.formModelConfig = this.getFormModelConfig()

    this.configData = option.configData || {
      styleConfig: {
        formData: {
          cellName: this.name
        }
      }
    }
    
    this.update = _.debounce(this.update, Setting.debounceInterval)
  }
  onConfigDataChange (key, data) {
    this.configData[key] = data
    this.configData = _.cloneDeep(this.configData)
  }
  resize () {
    if (this.component.onResize) {
      this.component.onResize()
    }
  }
  getFormModelConfig () {
    return _.cloneDeep(FormModelConfig[this.type])
  }
  update () {
    triggerVmDataUpdate(this.component, this.configData.styleConfig.formData)
  }
}

export default Border
