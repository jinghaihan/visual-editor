import _ from 'lodash'
import moment from 'moment'
import hotkeys from 'hotkeys-js'

import Paper from './Paper'

import component from '../config/component'
import operation from '../config/operation'
import { formConfig as formModel } from '../config/formModel'
import Setting from '../config/setting'
import { generateUUID, downloadJson, loadPluginComponent } from '../utils'
import EventEmitter from '../utils/eventEmitter'

class Editor {
  constructor (option) {
    this.vm = option.vm

    this.timer = {
      draft: null
    }
    this.$event = new EventEmitter()

    this.setting = { ...Setting }

    this.config = {
      component: [...component],
      operation: { ...operation },
      formModel: { ...formModel }
    }
    this.instance = {}

    this.grid = true
    this.scale = 1
    this.customScale = false

    this.clipBoard = {}

    this.paper = {}
    this.currentPaper = null
    
    this.plugin = option.plugin || {}
    this.hack = option.hack || {}
    this.resource = option.resource || {}

    this.init()
  }
  init () {
    this.createPaper()

    Promise.all([
      this.loadPlugin(),
      this.proxyHack()
    ]).then(() => {
      this.vm.onInited()
    })
  }
  setInstance (data) {
    this.instance[data.key] = data.vm
  }
  getInstance (key) {
    return this.instance[key]
  }
  setInterval () {
    let _this = this
    _this.timer.draft = setInterval(() => {
      _this.onDraft()
    }, Setting.draftInterval)
  }
  clearInterval () {
    Object.keys(this.timer).forEach(key => {
      clearInterval(this.timer[key])
    })
  }
  created () {
    this.bindHotKeys()
    this.setInterval()
  }
  destroy () {
    this.unbindHotKeys()
    this.clearInterval()
  }
  createPaper (paperKey) {
    let key = paperKey || generateUUID()
    this.paper[key] = new Paper({
      key,
      vm: this.vm,
      editor: this
    })

    if (!paperKey) {
      this.currentPaper = key
      this.vm.papers.push(this.currentPaper)
    }
  }
  removePaper (key) {
    delete this.paper[key]

    this.vm.papers = this.vm.papers.filter(i => i !== key)
  }
  getCurrentPaper () {
    return this.paper[this.currentPaper]
  }
  changeScale (type) {
    let scale = this.scale
    if (type === 'up') {
      scale += 0.05
    } else {
      scale -= 0.05
    }
    if (scale < Setting.minScale) scale = Setting.minScale
    if (scale > Setting.maxScale) scale = Setting.maxScale
    this.scale = scale
    this.customScale = true

    const paper = this.getCurrentPaper()
    paper.setScale(this.scale)
  }
  resetScale () {
    this.customScale = false
    const paper = this.getCurrentPaper()
    paper.resetScale()
  }
  changeGridDisplay () {
    this.grid = !this.grid
    const paper = this.getCurrentPaper()
    paper.changeGridDisplay(this.grid)
  }
  async setConfig (config) {
    this.vm.loading = true

    Object.keys(this.paper).forEach(key => {
      this.removePaper(key)
    })

    await this.vm.$nextTick()

    let configMap = {}
    config.forEach(async item => {
      this.createPaper(item.id)
      configMap[item.id] = item
    })

    this.currentPaper = config[0].id

    this.vm.papers = Object.keys(this.paper)

    Promise.all(this.vm.papers.map(async key => {
      await this.paper[key].setConfig(configMap[key])
    })).then(() => {
      this.vm.loading = false
    })
  }
  getConfig () {
    return new Promise((resolve, reject) => {
      Promise.all(Object.keys(this.paper).map(async key => {
        let data = await this.paper[key].getConfig()
        return data
      })).then(async config => {
        resolve(config)
      })
    })
  }
  async getCurrentPaperConfig () {
    let paper = this.getCurrentPaper()
    let data = await paper.getConfig()
    return data
  }
  onClear () {
    const paper = this.getCurrentPaper()
    paper.onClear()
  }
  async onSave () {
    let config = await this.getConfig()
    this.vm.$emit('save', config)
  }
  async onExport () {
    let config = await this.getConfig()
    downloadJson('config.json', config)
  }
  async onDraft () {
    let config = await this.getConfig()
    try {
      config.forEach(item => {
        this.paper[item.id].storeState(item)
      })
    } catch (error) {
      
    }
  }
  deleteCell () {
    const paper = this.getCurrentPaper()
    paper.deleteActiveCell()
  }
  copyCell (cells) {
    if (!cells || !cells.length) return

    cells.forEach(cell => {
      let key = cell.instance.configData.styleConfig.formData.cellName
        ? cell.instance.configData.styleConfig.formData.cellName + '-' + moment().format('HH:mm:ss')
        : moment().format('HH:mm:ss')

      this.clipBoard[key] = {
        name: key,
        component: cell.layout.component,
        componentType: cell.instance.componentType,
        type: cell.instance.type,
        image: cell.props.image,
        w: cell.layout.w,
        h: cell.layout.h,
        col: 12,
        props: {
          template: {
            option: _.cloneDeep(cell.instance.option),
            theme: cell.instance.theme,
            axisFlip: cell.instance.axisFlip,
            configData: _.cloneDeep(cell.instance.configData)
          }
        }
      }

      // 删除数据来源配置
      delete this.clipBoard[key].props.template.configData.datasourceConfig
    })

    let keys = Object.keys(this.clipBoard)
    if (keys.length > Setting.maxClipBoard) {
      for (let i = 0; i < keys.length - Setting.maxClipBoard; i++) {
        delete this.clipBoard[keys[0]]
      }
    }

    this.instance.sideBar.active = 'clipBoard'
    this.instance.sideBar.updateDragPanelComponentList()
    this.instance.sideBar.triggetActive()
  }
  getScreenShot () {
    const paper = this.getCurrentPaper()
    paper.getScreenShot()
  }
  expandConfigPanel () {
    if (!this.vm.triggerExpand.configPanel) {
      this.getInstance('configPanel').isExpand = true
      this.vm.onTrigger('configPanel', true)
    }
  }
  changePaperState (isUndo) {
    let paper = this.getCurrentPaper()
    paper.changeState(isUndo)
  }
  bindHotKeys () {
    hotkeys('ctrl+z, command+z', (event) => {
      this.changePaperState(true)
    })
    hotkeys('ctrl+shift+y, command+shift+y', (event) => {
      this.changePaperState(false)
    })
    hotkeys('ctrl+up, command+up', (event) => {
      this.changeScale('up')
    })
    hotkeys('ctrl+down, command+down', (event) => {
      this.changeScale('down')
    })
    hotkeys('ctrl+shift+k, command+shift+k', (event) => {
      this.changeGridDisplay()
    })
    hotkeys('ctrl+c, command+c', async (event) => {
      let paper = this.getCurrentPaper()
      paper.onCopy(paper.instance.paper.activeCells)
    })
    hotkeys('ctrl+v, command+v', async (event) => {
      let paper = this.getCurrentPaper()
      paper.onPaste(_.cloneDeep(Object.values(this.clipBoard)[0]))
    })
    hotkeys('delete, backspace', (event) => {
      this.deleteCell()
    })
  }
  unbindHotKeys () {
    hotkeys.unbind('ctrl+z, command+z')
    hotkeys.unbind('ctrl+shift+y, command+shift+y')
    hotkeys.unbind('ctrl+up, command+up')
    hotkeys.unbind('ctrl+down, command+down')
    hotkeys.unbind('ctrl+shift+k, command+shift+k')
    hotkeys.unbind('ctrl+c, command+c')
    hotkeys.unbind('delete, backspace')
  }
  loadPlugin () {
    Object.keys(this.plugin).forEach(key => {
      loadPluginComponent(key, this.plugin[key])
    })
  }
  proxyHack () {
    Object.keys(this.hack).forEach(key => {
      this[key] = this.hack[key]
    })
  }
}

export default Editor
