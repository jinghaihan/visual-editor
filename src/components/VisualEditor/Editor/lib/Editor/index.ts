import dayjs from 'dayjs'
import hotkeys from 'hotkeys-js'
import { cloneDeep } from 'lodash-es'

import { VisualAdapter } from '../Adapter'
import { VisualPaper } from '../Paper'
import { ActionHandler, ActionHandlerEnum } from './ActionHandler'

import { ComponentGroupEnum } from '@/enums/componentEnums'
import { uuid } from '@/utils'

interface ConfigData {
  global: {
    theme: any[]
    defaultPaper: string
    order: string[]
  }
  variable: {
    currentPaper: string
    clipboard: any
    timer: Record<string, any>
  }
}

export class VisualEditor extends VisualAdapter {
  public configData: ConfigData
  public papers: Record<string, VisualPaper>

  constructor() {
    super({ key: uuid() })

    this.configData = {
      // global setting
      global: {
        theme: [],
        defaultPaper: '',
        order: [],
      },
      // temporary variables
      variable: {
        currentPaper: '',
        clipboard: {},
        timer: {},
      },
    }

    this.papers = {}
  }

  // Paper
  /**
   * create paper instance & update vm paper
   * @param paperKey
   */
  async createPaper(paperKey?: string): Promise<void> {
    const key = paperKey || uuid()
    this.papers[key] = new VisualPaper({
      key,
      $event: this.$event,
      $assetsManager: this.$assetsManager,
      setting: this.setting,
      action: {
        emitter: this.emitter.bind(this),
        getTheme: () => {
          return this.configData.global.theme
        },
      },
    })

    this.$instance.get('Editor')?.papers.push(key)

    if (!paperKey) {
      this.changePaper(key)
    }

    this.$event.emit('notifyPaperCreated', { key })
  }
  /**
   * change current active paper
   * @param paperKey
   */
  changePaper(paperKey: string): void {
    const { currentPaper } = this.configData.variable

    // freeze paper event callback
    this.$event.freezeEventsByKey(currentPaper)
    this.$event.removeEventListenersByKey(currentPaper)

    // restore paper event callback
    this.$event.unfreezeEventsByKey(paperKey)
    this.$event.restoreEventListenersByKey(paperKey)

    this.configData.variable.currentPaper = paperKey

    this.$instance.get('Editor')?.currentPaper.setValue(paperKey)
  }
  /**
   * delete paper instance by key
   * @param paperKey
   */
  removePaper(paperKey: string): void {
    if (paperKey === this.configData.variable.currentPaper) {
      const firstPaperKey = Object.keys(this.papers)[0]
      this.changePaper(firstPaperKey)
    }

    this.$instance.get('Editor')?.papers.filter((key) => key !== paperKey)
    delete this.papers[paperKey]

    this.$event.emit('notifyPaperRemoved')
  }
  /**
   * get current active paper instance
   * @returns
   */
  getCurrentPaper(): VisualPaper | undefined {
    return this.papers[this.configData.variable.currentPaper]
  }
  /**
   * get default paper instance
   * @returns
   */
  getDefaultPaper(): VisualPaper | undefined {
    return this.papers[this.configData.global.defaultPaper]
  }

  // Lifecycle Hook
  /**
   * create hotkeys, interval, and listener
   */
  createHook(): void {
    this.bindHotkeys()
    this.setTimer()
    this.addListener()
  }

  /**
   * set paper config or create paper
   */
  mountHook(): void {
    this.createPaper()
  }

  /**
   * clear hotkeys, interval, and listener
   */
  destroyHook(): void {
    this.unbindHotkeys()
    this.clearTimer()
    this.removeListener()
  }

  // Hotkey
  /**
   * bind editor hotkeys
   */
  bindHotkeys(): void {
    hotkeys('ctrl+z, command+z', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.UNDO)
    })
    hotkeys('ctrl+y, command+y', (event: KeyboardEvent) => {
      event.preventDefault()
      ActionHandler(this, ActionHandlerEnum.REDO)
    })
    hotkeys('ctrl+c, command+c', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.COPY)
    })
    hotkeys('ctrl+v, command+v', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.PASTE)
    })
    hotkeys('delete, backspace', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.DELETE)
    })
    hotkeys('ctrl+up, command+up', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.LAYER_UP)
    })
    hotkeys('ctrl+down, command+down', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.LAYER_DOWN)
    })
    hotkeys('ctrl+k, command+k', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.GRID_SHOW)
    })
    hotkeys('ctrl+l, command+l', (event: KeyboardEvent) => {
      event.preventDefault()
      ActionHandler(this, ActionHandlerEnum.LOCK)
    })
    hotkeys('ctrl+g, command+g', (event: KeyboardEvent) => {
      event.preventDefault()
      ActionHandler(this, ActionHandlerEnum.GROUP)
    })
    hotkeys('ctrl+h, command+h', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.VISIBLE)
    })
    hotkeys('ctrl+], command+]', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.LAYER_TOP)
    })
    hotkeys('ctrl+[, command+[', (_event: KeyboardEvent) => {
      ActionHandler(this, ActionHandlerEnum.LAYER_BOTTOM)
    })
  }
  /**
   * unbind editor hotkeys
   */
  unbindHotkeys(): void {
    hotkeys.unbind('ctrl+z, command+z')
    hotkeys.unbind('ctrl+shift+y, command+shift+y')
    hotkeys.unbind('ctrl+c, command+c')
    hotkeys.unbind('ctrl+v, command+v')
    hotkeys.unbind('delete, backspace')
    hotkeys.unbind('ctrl+up, command+up')
    hotkeys.unbind('ctrl+down, command+down')
    hotkeys.unbind('ctrl+k, command+k')
    hotkeys.unbind('ctrl+shift+l, command+shift+l')
    hotkeys.unbind('ctrl+m, command+m')
    hotkeys.unbind('ctrl+g, command+g')
    hotkeys.unbind('ctrl+h, command+h')
  }

  // Timer
  /**
   * set draft interval
   */
  setTimer(): void {
    const onDraft = this.onDraft.bind(this)

    this.configData.variable.timer.draft = setInterval(() => {
      onDraft()
    }, this.setting.draftSetting.interval)
  }
  /**
   * clear all intervals
   */
  clearTimer(): void {
    Object.keys(this.configData.variable.timer).forEach((key) => {
      clearInterval(this.configData.variable.timer[key])
      delete this.configData.variable.timer[key]
    })
  }

  // Listener
  /**
   * init event listener
   */
  addListener(): void {
    this.addBroadcastListener('notifyClipboardAdd', (message) => {
      const { cells } = message

      if (!cells || !cells.length) {
        return
      }
      this.onClipboard(cells)
    })

    this.addBroadcastListener('notifyActionHandler', (message) => {
      const { event } = message
      ActionHandler(this, event)
    })
  }

  /**
   * remove event listener
   */
  removeListener(): void {
    this.removeBroadcastListener('notifyClipboardAdd')
    this.removeBroadcastListener('notifyActionHandler')
  }

  // Method
  /**
   * get all paper config
   * @returns {Promise<object>}
   */
  async getConfig(): Promise<object> {
    const config: { [key: string]: any } = {}
    await Promise.all(
      Object.values(this.papers).map(async (paper) => {
        const paperConfig = await paper.getConfig()
        config[paper.key] = paperConfig
      }),
    )
    return config
  }
  /**
   * set all paper config
   * @param config
   */
  async setConfig(config: {
    papers: object
    defaultPaper: string
    order: string[]
    style: { theme: any[] }
  }): Promise<void> {
    const { papers, defaultPaper, order, style } = config
    const { theme } = style

    this.configData.global.theme = theme
    this.configData.global.defaultPaper = defaultPaper
    this.configData.global.order = order

    const editorInstance = this.$instance.get('Editor')
    editorInstance?.loading.setValue(true)
    editorInstance?.papers.setValue([])

    Object.keys(this.papers).forEach((key) => {
      this.removePaper(key)
    })

    this.changePaper(defaultPaper)
    await Promise.all(
      order.map(async (key) => {
        await this.createPaper(key)
      }),
    )

    await Promise.all(
      order.map(async (key) => {
        const paper = this.papers[key]
        await paper.setConfig({ config: papers[key] })
      }),
    )

    editorInstance?.loading.setValue(false)
    this.$event.emit('notifySetConfigFinished')
  }

  /**
   * draft all paper state
   */
  async onDraft(): Promise<void> {
    const config = await this.getConfig()
    Object.keys(config).forEach((key: string) => {
      this.papers[key].storeState(config[key])
    })
  }

  /**
   * store template cell in clipboard store
   * @param cells
   */
  onClipboard(cells: Array<{ cell: any; layout: any; props: any }>): void {
    cells.forEach((data) => {
      const { cell, layout, props } = data
      const name = cell.configData.name + '-' + dayjs().format('HH:mm:ss')

      this.configData.variable.clipboard[name] = {
        name,
        type: cell.type,
        component: cell.component,
        w: layout.w,
        h: layout.h,
        col: 12,
        props: {
          template: {
            configData: cloneDeep(cell.configData),
          },
          display: {
            image: props.image,
            name,
          },
        },
      }

      const keys = Object.keys(this.configData.variable.clipboard)
      if (keys.length > this.setting.clipBoardSetting.max) {
        for (let i = 0; i < keys.length - this.setting.clipBoardSetting.max; i++) {
          delete this.configData.variable.clipboard[keys[0]]
        }
      }
    })

    this.$instance.get('ComponentBar')?.triggerActive(ComponentGroupEnum.CLIPBOARD)
  }

  /**
   * emit custom event
   * @param eventName
   * @param message
   */
  emitter(eventName: string, message: any) {
    const editorInstance = this.$instance.get('Editor')
    editorInstance?.emit(eventName, {
      ...message,
      instance: {
        editor: this,
      },
    })
  }
}
