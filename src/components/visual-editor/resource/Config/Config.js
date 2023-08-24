import { handleCellStyleConfig } from '../../utils/hook'
import Setting from '../../config/setting'

class Config {
  constructor (option) {
    this.vm = option.vm

    this.queue = []

    this.init()
  }
  init () {
    this.global = {
      style: {}
    }
    this.layout = {
      search: [],
      paper: [],
      componentSet: {}
    }
    this.searchs = {}
    this.views = {}
  }
  
  flowToJson () {
    this.init()

    this.globalToJson()
    this.layoutToJson()
    this.searchsToJson()
    this.viewsToJson(this.vm.cells)

    let basicConfig = this.vm.configData.basic || {}

    return {
      id: this.vm.key,
      // 基础配置
      name: basicConfig.name,
      description: basicConfig.description,
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
  }
  // TODO
  searchsToJson () {

  }
  viewsToJson (cells) {
    Object.keys(cells).forEach(key => {
      let cell = cells[key]
      
      let { styleConfig } = cell.configData
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

      this.views[key] = config
      
      // 组件集类型组件
      if (Setting.componentSetComponents.includes(cell.type)) {
        this.viewsToJson(cell.component.componentSetInstance.paper.cells)
        this.layout.componentSet[key] = cell.component.layout
      }
    })
  }

  async jsonToFlow (config) {
    return new Promise(async (resolve, reject) => {
      let basicConfig = {
        // 基础配置
        name: config.name,
        description: config.description
      }
      this.vm.configData.basic = basicConfig

      // 全局配置
      await this.jsonToGlobal(config.global)

      // 布局配置
      this.jsonToLayout(config.layout)

      this.queue.forEach(task => { task() })
      this.queue = []
      
      // 组件配置
      setTimeout(async () => {
        await this.jsonToSearchs(config.searchs)
        await this.jsonToViews(config.views, config.layout)
        
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
          formModel.triggerFormItemChange()
        })
      }
    })
  }
  jsonToLayout (config) {
    let paperInstance = this.vm.instance.paper
    paperInstance.cells = config.paper
  }
  // TODO
  jsonToSearchs (config) {

  }
  jsonToViews (config, layout) {
    return new Promise((resolve, reject) => {
      Promise.all(Object.keys(config).map(async key => {
        let cell = this.vm.cells[key]

        if (cell) {
          handleCellStyleConfig({
            cell,
            config,
            key,
            layout
          })
        }
      })).then(() => {
        resolve()
      })
    })
  }
}

export default Config
