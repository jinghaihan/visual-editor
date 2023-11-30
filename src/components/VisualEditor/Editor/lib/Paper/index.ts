import { debounce, isNumber } from 'lodash-es'
import { nextTick } from 'vue'
import { Modal } from 'ant-design-vue'

import { VisualAdapter } from '../Adapter'
import { StateManager } from './StateManager'
import { LayerManager } from './LayerManager'
import { ConfigTransfer } from './ConfigTransfer'

import { uuid } from '@/utils'
import { getSnapshot } from '@/utils/file'

interface ConfigData {
  paper: {
    width: number
    height: number
    backgroundColor: { hex8: string }
    backgroundImage: null | string
    grid: {
      color: { hex8: string }
      sizeX: number
      sizeY: number
    }
  }
  meta: Record<string, string>
  variable: {
    scale: number
    showGrid: boolean
    snapshot: null | string
    paperPos: null | PaperPos
    mousePos: null | MousePos
  }
}

interface PaperPos {
  x: number
  y: number
}

interface MousePos {
  x: number
  y: number
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  inside: boolean
}

export class VisualPaper extends VisualAdapter {
  public $stateManager: StateManager
  public $layerManager: LayerManager
  public $configTransfer: ConfigTransfer

  public configData: ConfigData

  public cells: Record<string, any>
  public setCellCallbackQueue: any

  constructor(option) {
    super(option)

    this.$stateManager = new StateManager({
      setting: this.setting,
      action: {
        notifyPaperUpdate: () => {
          this.$event.emit('notifyPaperUpdate', { key: this.key })
        },
      },
    })
    this.$layerManager = new LayerManager()
    this.$configTransfer = new ConfigTransfer()

    this.configData = {
      paper: {
        width: 1920,
        height: 1080,
        backgroundColor: { hex8: '#191A21FF' },
        backgroundImage: null,
        grid: {
          color: { hex8: '#0000001A' },
          sizeX: 20,
          sizeY: 20,
        },
      },
      meta: {},
      variable: {
        scale: 1,
        showGrid: true,
        snapshot: null,
        paperPos: null,
        mousePos: null,
      },
    }

    this.cells = {}
    this.setCellCallbackQueue = new Proxy(
      {},
      {
        set: function (target, property, value) {
          target[property] = value
          return true
        },
        get: function (target, property) {
          return target[property]
        },
        deleteProperty: function (target, property) {
          if (target[property]) {
            target[property]()
          }
          delete target[property]
          return true
        },
      },
    )

    this.changeState = debounce(this.changeState, this.setting.storeSetting.debounceInterval)
  }

  // Method
  /**
   * transfer current paper config to json
   * @returns
   */
  async getConfig() {
    const config = await this.$configTransfer.toJson()
    return config
  }
  /**
   * transfer json config to view
   * @param config
   */
  async setConfig(config) {
    this.triggerCellDeactive()

    await this.$configTransfer.toView(config)

    const paperInstance = this.$instance.get('Paper')
    paperInstance?.updatePaperStyle()
  }

  /**
   * store state draft
   * @param config
   */
  async storeState(config) {
    const result = this.$stateManager.storeState(config)

    if (result) {
      const image = await this.getSnapshot()
      this.configData.variable.snapshot = image
      this.$event.emit('notifyPaperSnapshotUpdate', {
        key: this.key,
        image: this.configData.variable.snapshot,
      })
    }
  }
  /**
   * redo & undo
   * @param isUndo
   */
  changeState(isUndo: boolean) {
    const config = this.$stateManager.getState(isUndo)
    if (config) {
      this.setConfig(config)
    }
  }

  /**
   * trigger cell active by cell key
   * @param key
   */
  triggerCellActive(key: string) {
    this.$instance.get('Paper')?.handleActivated({ key })
  }
  /**
   * change all cells to deactive status
   */
  triggerCellDeactive() {
    this.$instance.get('Paper')?.handleDeactivated()
  }

  /**
   * change paper attr by keys
   */
  updateCellsStatus(attribute: string, keys: string[]) {
    if (['lockedCells', 'invisibleCells'].includes(attribute)) {
      const paperInstance = this.$instance.get('Paper')

      if (paperInstance) {
        // target
        const targetKeys = keys || paperInstance.activeCells.getValue()
        const targetCells = paperInstance[attribute].getValue()

        const mergeKeys = targetKeys.filter((key) => !targetCells.includes(key))
        const filterKeys = targetKeys.filter((key) => targetCells.includes(key))

        // update attribute value
        let value = [...targetCells]
        value = [...new Set([...value, ...mergeKeys])]
        value = value.filter((key) => !filterKeys.includes(key))

        paperInstance[attribute].setValue(value)
      }
    }
  }

  /**
   * store cell
   * @param cell
   */
  setCell(cell) {
    this.cells[cell.key] = cell
    delete this.setCellCallbackQueue[cell.key]
  }

  /**
   * add cell
   * @param cell
   */
  addCell(cell) {
    const paperInstance = this.$instance.get('Paper')
    const center = this.getPaperCenter()

    const config = {
      ...cell,
      x: isNumber(cell.x) ? parseInt(cell.x) : center.x,
      y: isNumber(cell.y) ? parseInt(cell.y) : center.y,
      w: isNumber(cell.w) ? parseInt(cell.w) : 300,
      h: isNumber(cell.h) ? parseInt(cell.h) : 300,
      rotation: 0,
      keepRatio: false,
    }

    const { full } = cell.props || {}
    if (full) {
      config.x = 0
      config.y = 0
      config.w = this.configData.paper.width
      config.h = this.configData.paper.height
      delete cell.props.full
    }

    paperInstance?.cells.push(config)
  }

  /**
   * delete cell by cell key
   * @param key
   */
  deleteCell(key) {
    if ('destroy' in this.cells[key]) {
      this.cells[key].destroy()
    }
    this.cells[key] = null
    delete this.cells[key]

    const paperInstance = this.$instance.get('Paper')
    paperInstance?.cells.setValue(paperInstance?.cells.filter((cell) => cell.key !== key))
  }

  /**
   * delete all active cells
   */
  deleteActiveCell() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this

    Modal.confirm({
      title: '删除',
      content: `确定要删除当前选中组件吗？`,
      okType: 'danger',
      onOk() {
        const paperInstance = _this.$instance.get('Paper')
        paperInstance?.activeCells.getValue().forEach((key) => {
          _this.deleteCell(key)
        })
        paperInstance?.handleDeactivated()
      },
      onCancel() {},
    })
  }

  /**
   * get cell layout
   * @param key
   * @returns
   */
  getCellLayout(key: string) {
    try {
      return this.$instance.get('Paper')?.cells.find((item) => item.key === key)
    } catch (error) {
      return {}
    }
  }
  /**
   * config panel change cell layout update cell position & trigger resize
   * @param data
   * @returns
   */
  async updateCellLayout(data) {
    const { x, y, w, h, rotation, keepRatio } = data

    const paperInstance = this.$instance.get('Paper')
    const keys = paperInstance?.activeCells.getValue()
    const key = keys[keys.length - 1]

    const cells = paperInstance?.cells.getValue().map((cell) => {
      if (cell.key === key) {
        return {
          ...cell,
          x,
          y,
          w,
          h,
          rotation,
          keepRatio,
        }
      }

      return cell
    })

    paperInstance?.cells.setValue(cells)
    this.cells[key].resize()

    await nextTick()
    const refs = this.$instance.getRefs('Paper')
    if (refs['Moveable-' + key]) {
      const ref = refs['Moveable-' + key][0]
      ref.updateTarget()
    }
  }

  /**
   * clear all cells in paper
   */
  onClear() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    Modal.confirm({
      title: '清空',
      content: `确定要清空当前画布吗？`,
      okType: 'danger',
      onOk() {
        const paperInstance = _this.$instance.get('Paper')
        Object.keys(_this.cells).forEach((key) => {
          _this.deleteCell(key)
        })
        paperInstance?.handleDeactivated()
        paperInstance?.cells.setValue([])
        _this.cells = {}
      },
    })
  }

  /**
   * store all active cell to clipboard
   */
  async onCopy() {
    const paperInstance = this.$instance.get('Paper')

    const cells = await Promise.all(
      paperInstance?.activeCells.getValue().map(async (key) => {
        const image = await getSnapshot(this.cells[key].getRendererEl())

        return {
          cell: this.cells[key],
          layout: this.getCellLayout(key),
          props: {
            image,
          },
        }
      }),
    )

    this.$event.emit('notifyClipboardAdd', { cells })
  }
  /**
   * paste cell by template
   * @param config
   * @returns
   */
  onPaste(config) {
    if (!config || !this.configData.variable.mousePos?.inside) {
      return
    }

    const key = uuid()
    const cell = {
      ...config,
      key,
      x: this.configData.variable.mousePos.x,
      y: this.configData.variable.mousePos.y,
      props: {
        template: config.props.template,
      },
    }

    this.addCell(cell)
    this.triggerCellActive(key)
  }

  /**
   * change paper container scale
   * @param scale
   */
  setScale(scale: number) {
    this.$instance.get('Paper')?.adapterConfig.merge({
      scale,
    })
    this.configData.variable.scale = scale
  }
  /**
   * reset paper container scale
   */
  async resetScale() {
    this.$instance.get('ScreenAdapter')?.calculateScale()

    const paperInstance = this.$instance.get('Paper')
    paperInstance?.adapterConfig.merge({
      x: 0,
      y: 0,
    })
  }
  /**
   * nofiy editor instance change scale
   * @param scale
   */
  changeScale(value: number | null, direction?: 'up' | 'down') {
    let scale = this.configData.variable.scale

    if (direction) {
      if (direction === 'up') scale += this.setting.scaleSetting.step
      else scale -= this.setting.scaleSetting.step
    } else {
      scale = value || this.configData.variable.scale
    }

    if (scale < this.setting.scaleSetting.min) scale = this.setting.scaleSetting.min
    if (scale > this.setting.scaleSetting.max) scale = this.setting.scaleSetting.max

    if (this.configData.variable.scale !== scale) {
      this.configData.variable.scale = scale

      this.setScale(scale)

      // notify scale widget
      this.$event.emit('notifyScaleChange', { scale: this.configData.variable.scale })
    }
  }

  /**
   * change grid line display
   */
  changeGrid() {
    this.$instance.get('Paper')?.gridLineConfig.merge({
      display: !this.configData.variable.showGrid ? 'block' : 'none',
    })
    this.configData.variable.showGrid = !this.configData.variable.showGrid
  }

  /**
   * get paper center vector
   * @returns
   */
  getPaperCenter() {
    const defaultSize = {
      width: 300,
      height: 300,
    }

    const centerX = Math.floor(this.configData.paper.width / 2)
    const centerY = Math.floor(this.configData.paper.height / 2)

    const x = centerX - defaultSize.width / 2
    const y = centerY - defaultSize.height / 2

    return { x, y }
  }

  /**
   * set paper position status
   * @param pos
   */
  setPaperPos(pos: PaperPos) {
    this.configData.variable.paperPos = pos
  }

  /**
   * set mouse position status
   * @param pos
   */
  setMousePos(pos: MousePos) {
    this.configData.variable.mousePos = pos
  }

  /**
   * get paper snapshot
   * @returns
   */
  getSnapshot() {
    return null
  }
}
