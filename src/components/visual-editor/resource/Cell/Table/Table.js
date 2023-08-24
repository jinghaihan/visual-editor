import _ from 'lodash'

import Setting from '../../../config/setting'
import FormModelConfig from './config/FormModel'
import { triggerVmDataUpdate } from '../../../utils/hook'

class Table {
  constructor (option) {
    this.componentType = 'table'
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
    let _this = this
    triggerVmDataUpdate(_this.component, _this.configData.styleConfig.formData)
    const factory = {
      'dv-scroll-board': () => {
        // 列对齐方式
        _this.component.propsData.align = _this.component.propsData.header.map(() => {
          return _this.configData.styleConfig.formData['vm-propsData-align']
        })

        _this.component.initStyle()
      },
      'dv-scroll-ranking-board': () => {
        _this.component.initStyle()
      },
      'detail-table': () => {
        _this.component.initStyle()
      }
    }

    if (factory[_this.type]) {
      factory[_this.type]()
    }
  }
}

export default Table
