import _ from 'lodash'
import moment from 'moment'
import { getSnapshot, downloadFile, generateUUID } from '../utils'
import Config from './Config/Config'
import Theme from './Theme/Theme'
import Setting from '../config/setting'

class Paper {
  constructor (option) {
    this.vm = option.vm
    this.key = option.key

    this.editor = option.editor

    this.instance = {}
    this.cells = {}

    this.state = []
    this.stateIndex = 0

    this.pos = {}
    
    let ConfigOptions = {
      vm: this
    }

    this.config = new Config(ConfigOptions)

    this.theme = new Theme({
      vm: this
    })

    this.configData = {
      paper: {},
      auxiliary: {}
    }

    this.changeState = _.debounce(this.changeState, 100)
  }
  setInstance (data) {
    this.instance[data.key] = data.vm
  }
  getInstance (key) {
    return this.instance[key]
  }
  setMousePos (pos) {
    this.pos = pos
  }
  storeState (config) {
    if (JSON.stringify(config) === JSON.stringify[this.state[0]]) {
      return
    }
    
    this.state.unshift(config)

    if (this.state.length > Setting.maxStore) {
      this.state.length = Setting.maxStore
    }

    if (this.stateIndex !== 0) {
      this.stateIndex -= 1
    }
  }
  changeState (isUndo) {
    if (isUndo) {
      this.stateIndex += 1
    } else {
      this.stateIndex -= 1
    }

    if (this.stateIndex > Setting.maxStore) {
      this.stateIndex = Setting.maxStore
    }
    if (this.stateIndex < 0) {
      this.stateIndex = 0
    }

    if (this.state[this.stateIndex]) {
      this.setConfig(this.state[this.stateIndex])
    } else {
      this.stateIndex = 0
    }
  }
  setConfigData (data) {
    this.configData[data.key] = data.formData
  }
  // 画布清空
  onClear () {
    let _this = this

    _this.vm.$confirm({
      title: '清空',
      content: `确定要清空当前画布吗？`,
      okType: 'danger',
      onOk () {
        _this.instance.paper.cells = []
        _this.instance.paper.activeCells = []
        _this.cells = {}
      },
      onCancel () {}
    })
  }
  setCell (data) {
    this.cells[data.key] = data.cell
  }
  // 元素删除
  deleteActiveCell () {
    let _this = this

    _this.vm.$confirm({
      title: '删除',
      content: `确定要删除当前选中组件吗？`,
      okType: 'danger',
      onOk () {
        let activeCells = _this.instance.paper.activeCells

        activeCells.forEach(key => {
          _this.deleteCell(key)
        })
        
        _this.instance.paper.activeCells = []
      },
      onCancel () {}
    })
  }
  deleteCell (key) {
    delete this.cells[key]
    this.instance.paper.cells = this.instance.paper.cells.filter(i => i.key !== key)
  }
  // 辅助功能
  handleAuxiliary () {
    let keys = Object.keys(this.configData.auxiliary)
    if (keys.length) {
      let needSetAttribute = false
      const paperInstance = this.instance.paper
      if (paperInstance.setting.paperSnap !== this.configData.auxiliary.paperSnap ||
        paperInstance.setting.paperConflictCheck !== this.configData.auxiliary.paperConflictCheck) {
        needSetAttribute = true
      }
      paperInstance.setting = { ...this.configData.auxiliary }
      paperInstance.$refs.PaperContainer.style.setProperty('--refline-color', this.configData.auxiliary.paperRefLineColor.hex)

      if (needSetAttribute) {
        paperInstance.setCellAttribute()
      }
      paperInstance.initGrid()
    }
  }
  // 元素锁定
  handleCellLock (key, isLock) {
    let paperInstance = this.instance.paper
    if (isLock) {
      paperInstance.lockedCells.push(key)
    } else {
      paperInstance.lockedCells = paperInstance.lockedCells.filter(i => i !== key)
    }
  }
  // 元素复制
  onCopy (keys) {
    Promise.all(keys.map(key => {
      return new Promise(async (resolve, reject) => {
        let image = await getSnapshot(this.cells[key].vm.$el)

        resolve({
          instance: this.cells[key],
          layout: this.instance.paper.cells.find(i => i.key === key),
          props: {
            image
          }
        })
      })
    })).then((result) => {
      this.editor.copyCell(result)
    })
  }
  // 元素粘贴
  onPaste (component) {
    if (!component) {
      return
    }
    if (this.pos.status !== 'inside') {
      return
    }

    let key = generateUUID()
    let cell = {
      ...component,
      x: this.pos.x,
      y: this.pos.y,
      key,
      lockAspectRatio: false,
      zIndex: 0
    }

    this.instance.paper.cells.push(cell)
    this.triggerCellActive(key)
  }
  // 获取画布配置
  async getConfig () {
    let config = await this.config.flowToJson()

    if (this.editor.resource && this.editor.resource.Config) {
      const instance = new this.editor.resource.Config({
        vm: this,
        config
      })
      config = await instance.getConfig()
    }

    return config
  }
  // 渲染画布配置
  async setConfig (config) {
    try {
      await this.config.jsonToFlow(config)

      if (this.editor.resource && this.editor.resource.Config) {
        const instance = new this.editor.resource.Config({
          vm: this,
          config,
          Setting
        })
        instance.setConfig()
      }

      this.triggerCellDeactive()
    } catch (error) {
      
    }
  }
  
  // 画布缩放
  setScale (scale) {
    let ScaleBox = this.instance.paper.$refs.ScaleBox
    ScaleBox.locked = true
    ScaleBox.customScale = scale
    ScaleBox.setScale()
  }
  resetScale () {
    let ScaleBox = this.instance.paper.$refs.ScaleBox
    ScaleBox.locked = false
    ScaleBox.customScale = 1
    ScaleBox.setScale()
  }
  // 锁定当前画布全部组件
  lockPaperCells () {
    this.instance.paper.lockedCells = Object.keys(this.cells)
  }
  async getScreenShot () {
    let scrennshot = await getSnapshot(this.instance.paper.$refs.Draw.$el)
    let fileName = '截图-' + moment().format('HH:mm:ss') + '.png'
    downloadFile(fileName, scrennshot)
  }
  getCellLayoutConfig (key) {
    const paperInstance = this.instance.paper
    return paperInstance.cells.find(item => item.key === key)
  }
  triggerCellActive (key) {
    const paperInstance = this.instance.paper
    paperInstance.handleActivated({ key })
  }
  triggerCellDeactive () {
    const paperInstance = this.instance.paper
    paperInstance.activeCells = []
    paperInstance.cells.forEach(item => {
      item.active = false
    })

    this.editor.$event.emit('onCellDeactivated')
  }
  
  // 网格线展示
  changeGridDisplay (show) {
    const paperInstance = this.instance.paper
    if (show) {
      paperInstance.$set(paperInstance.gridStyle, 'display', 'block')
    } else {
      paperInstance.$set(paperInstance.gridStyle, 'display', 'none')
    }
  }

  // 配置回调
  onPaperBackgroundChange (data) {
    let paperEl = this.instance.paper.$refs.Draw.$el
    const factory = {
      color: () => {
        paperEl.style.backgroundColor = data.color.hex
      },
      image: () => {
        paperEl.style.backgroundImage = data.image === 'none' ? 'none' : `url(${data.image})`
      }
    }
    factory[data.type]()
  }
  async onCellLayoutChange (data, key) {
    let paperInstance = this.instance.paper
    let cells = paperInstance.cells
    
    try {
      cells.forEach(cell => {
        if (cell.key === key) {
          cell.zIndex = data.zIndex
          cell.x = data.cellX
          cell.y = data.cellY
          cell.w = data.cellWidth
          cell.h = data.cellHeight
          cell.lockAspectRatio = data.lockAspectRatio

          throw new Error()
        }
      })
    } catch (error) {
      // 触发resize事件
      await paperInstance.$nextTick()
      
      let ref = paperInstance.$refs['Renderer-' + key][0]
      if (ref) {
        ref.resize()
      }
    }
  }

  changeTheme (data) {
    this.theme.changeTheme(data)
  }
  getTheme (type, attr) {
    return this.theme.getTheme(type, attr)
  }
  handleThemeDefaultValue (config, cell) {
    this.theme.handleThemeDefaultValue(config, cell)
  }
}

export default Paper
