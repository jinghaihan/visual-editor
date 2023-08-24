import BuiltinCondition from './BuiltinCondition'
import View from './View'

class Config {
  constructor (option) {
    this.vm = option.vm

    this.queue = []

    this.init()
  }
  init () {
    this.global = {
      style: {},
      data: {
        model: null,
        builtinConditions: null
      }
    }
    this.layout = {
      searchs: [],
      paper: []
    }
    this.searchs = {}
    this.views = {}
  }
  
  flowToJson () {
    this.init()

    this.globalToJson()
    this.layoutToJson()
    this.searchsToJson()
    this.viewsToJson()

    let basicConfig = this.vm.configData.basic || {}

    return {
      id: this.vm.key,
      // 基础配置
      name: basicConfig.name,
      description: basicConfig.description,
      // 权限配置
      canExport: basicConfig.canExport,
      canSubscribe: basicConfig.canSubscribe,
      cycleType: basicConfig.cycleType,
      subscribeFieldId: basicConfig.subscribeFieldId,
      subscribeDay: basicConfig.subscribeDay,
      subscribePreCycle: basicConfig.subscribePreCycle,
      // 画布配置
      global: this.global,
      layout: this.layout,
      searchs: this.searchs,
      views: this.views
    }
  }
  globalToJson () {
    let _this = this

    const factory = {
      model: () => {
        if (_this.vm.configData.builtinConditions) {
          _this.global['data'].builtinConditions = _this.vm.configData.builtinConditions.map(item => {
            return {
              ...new BuiltinCondition(item)
            }
          })
        }
        if (_this.global['data'].model) {
          _this.global['data'].model = {
            type: 'DATA_MODEL',
            id: _this.vm.configData.model.id
          }
        }
      },
      default: (key) => {
        Object.keys(_this.vm.configData[key]).forEach(configKey => {
          if (!_this.global['style'][key]) {
            _this.global['style'][key] = {}
          }
          if (configKey.includes('Color') || configKey.includes('color')) {
            if (configKey === 'paperGridColor') {
              _this.global['style'][key][configKey] = { rgba: _this.vm.configData[key][configKey].rgba }
            } else {
              _this.global['style'][key][configKey] = { hex: _this.vm.configData[key][configKey].hex }
            }
          } else {
            _this.global['style'][key][configKey] = _this.vm.configData[key][configKey]
          }
        })
      }
    }

    Object.keys(_this.vm.configData).forEach(key => {
      if (factory[key]) {
        factory[key](key)
      } else {
        factory['default'](key)
      }
    })
  }
  layoutToJson () {
    let paperInstance = this.vm.instance.paper
    this.layout.paper = paperInstance.cells.map(item => {
      return {
        ...item,
        active: false
      }
    })

    // TODO
    this.layout.searchs = []
  }
  // TODO
  searchsToJson () {

  }
  viewsToJson () {
    let _this = this
    Object.keys(_this.vm.cells).forEach(key => {
      let cell = _this.vm.cells[key]
      
      if (!cell.componentType === 'search') {
        return
      }

      let { styleConfig, datasourceConfig } = cell.configData
      let config = {
        type: cell.type,
        id: key,
        name: styleConfig.formData.cellName,
        style: {
          ui: {
            ...styleConfig
          }
        },
        data: null
      }

      const factory = {
        // TODO
        table: () => {

        },
        default: () => {
          let obj = {
            globalConfig: {
              ..._this.global.data
            },
            ...datasourceConfig ? datasourceConfig.formData : {}
          }
          if (datasourceConfig && datasourceConfig.formData) {
            obj.modelId = datasourceConfig.formData.modelId
              ? datasourceConfig.formData.modelId
              : (this.global.data.model ? this.global.data.model.id : null)
            obj.builtinConditions = datasourceConfig.formData.builtinConditions
              ? datasourceConfig.formData.builtinConditions
              : (this.vm.configData.builtinConditions ? this.vm.configData.builtinConditions : null)
          }
          config.data = new View(obj)
        }
      }

      if (factory[cell.componentType]) {
        factory[cell.componentType]()
      } else {
        factory['default']()
      }

      this.views[key] = config
    })
  }

  async jsonToFlow (config) {
    return new Promise(async (resolve, reject) => {
      let basicConfig = {
        // 基础配置
        name: config.name,
        description: config.description,
        // 权限配置
        canExport: config.canExport,
        canSubscribe: config.canSubscribe,
        cycleType: config.cycleType,
        subscribeFieldId: config.subscribeFieldId,
        subscribeDay: config.subscribeDay,
        subscribePreCycle: config.subscribePreCycle
      }
      this.vm.configData.basic = basicConfig

      // 全局配置
      try {
        await this.jsonToGlobal(config.global)
      } catch (error) {
        
      }

      // 布局配置
      this.jsonToLayout(config.layout)
      
      // 组件配置
      setTimeout(async () => {
        this.queue.forEach(task => {
          task()
        })
        this.queue = []
        await this.jsonToSearchs(config.searchs)
        await this.jsonToViews(config.views)
        resolve()
      }, 0)
    })
  }
  async jsonToGlobal (config) {
    Object.keys(config.style).forEach(key => {
      this.vm.configData[key] = config.style[key]
  
      let instance = this.vm.editor.getInstance(key + 'Panel')
      if (instance) {
        this.queue.push(() => {
          let formModel = instance.$refs.Form
          formModel.form = config.style[key]
          
          // 触发表单项的change事件
          setTimeout(() => {
            formModel.triggerFormItemChange()
          }, 0)
        })
      }
    })
  
    if (config.data.model && config.data.model.id) {
      let modelData = await this.vm.editor.getModelData(config.data.model.id)
      this.vm.configData.model = {
        ...modelData,
        id: config.data.model.id
      }
    }
  
    if (config.data.builtinConditions) {
      let modelOptions = this.vm.editor.getModelOptions(this.vm.configData.model || {}, false)
      this.vm.configData.builtinConditions = this.transferBuitinConditions(config.data.builtinConditions, modelOptions)
    }
  }
  jsonToLayout (config) {
    let paperInstance = this.vm.instance.paper
    paperInstance.cells = config.paper
  }
  // TODO
  jsonToSearchs (config) {

  }
  jsonToViews (config) {
    return new Promise((resolve, reject) => {
      Promise.all(Object.keys(config).map(async key => {
        let cell = this.vm.cells[key]
  
        cell.configData.styleConfig = {
          ...config[key].style.ui
        }
          
        try {
          let modelOptions = []
          if (config[key].data.model) {
            let modelData = await this.vm.editor.getModelData(config[key].data.model.id)
            modelOptions = this.vm.editor.getModelOptions(modelData || {}, false)
          }
        
          cell.configData.datasourceConfig = this.transferDatasourceConfig({ ...config[key].data }, modelOptions)
        } catch (error) {
            
        }
  
        cell.update()
      })).then(() => {
        resolve()
      })
    })
  }

  transferBuitinConditions (builtinConditions, options) {
    try {
      return builtinConditions.map(data => {
        return {
          field: JSON.stringify({
            fieldId: data.fieldId,
            fieldType: data.fieldType,
            name: options.find(opt => opt.fieldId === data.fieldId).name
          }),
          option: data.option,
          values: data.values.length > 1 ? JSON.stringify(data.values) : data.values[0]
        }
      })
    } catch (error) {
      
    }
  }
  transferDatasourceConfig (config, options) {
    let dvFieldsMap = {}
    
    let data = {
      formData: {
        dimensions: config.dimensions ? config.dimensions.map(dim => {
          dvFieldsMap[dim.id] = {
            fieldId: dim.fieldId,
            fieldType: 'DIMENSION',
            name: dim.name
          }
          return JSON.stringify({
            id: dim.id,
            fieldId: dim.fieldId,
            fieldType: 'DIMENSION',
            name: dim.name
          })
        }) : undefined,
        measures: config.measures ? config.measures.map(mea => {
          dvFieldsMap[mea.id] = {
            fieldId: mea.fieldId,
            fieldType: 'MEASURE',
            name: mea.name
          }
          return {
            key: mea.id,
            measure: JSON.stringify({
              fieldId: mea.fieldId,
              name: mea.name
            }),
            aggregationType: mea.aggregationType,
            calculation: mea.calculation ? {
              calculation: mea.calculation,
              number: mea.number,
              aggregationPriority: mea.aggregationPriority
            } : undefined,
            decimal: mea.decimalPlace ? {
              decimalPlace: mea.decimalPlace,
              truncType: mea.truncType
            } : undefined
          }
        }) : undefined
      }
    }

    delete config.dimensions
    delete config.measures

    if (config.orders && config.orders.length) {
      let order = config.orders[0]
      data.formData.orderType = order.orderType
      data.formData.orderField = JSON.stringify({
        id: order.dvFieldId,
        fieldId: dvFieldsMap[order.dvFieldId].fieldId,
        fieldType: dvFieldsMap[order.dvFieldId].fieldType,
        name: dvFieldsMap[order.dvFieldId].name
      })
    }
    delete config.orders

    if (config.model) {
      data.formData.modelId = config.model.id
      delete config.model
    }

    if (config.builtinConditions) {
      data.formData.builtinConditions = this.transferBuitinConditions(config.builtinConditions, options)
      delete config.builtinConditions
    }

    return {
      ...data,
      formData: {
        ...data.formData,
        ...config
      }
    }
  }
}

export default Config
