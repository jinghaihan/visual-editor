interface Action {
  notifyPaperUpdate: Function
}

export class StateManager {
  private index: number
  private state: string[]
  private setting: any
  private action: Action

  constructor(option) {
    this.index = 0
    this.state = []

    this.setting = option.setting

    this.action = option.action
  }

  storeState(config: any): boolean {
    const stringify = JSON.stringify(config)
    // determine if it is the same as the latest cache config
    if (stringify === this.state[0]) {
      return false
    }

    this.state.unshift(stringify)

    if (this.state.length > this.setting.storeSetting.max) {
      this.state.length = this.setting.storeSetting.max
    }

    if (this.index !== 0) {
      this.index -= 1
    }

    this.action.notifyPaperUpdate()
    return true
  }

  getState(isUndo: boolean): any {
    if (isUndo) this.index += 1
    else this.index -= 1

    if (this.index > this.setting.storeSetting.max) this.index = this.setting.storeSetting.max
    if (this.index < 0) this.index = 0

    const config = this.state[this.index]
    if (!config) {
      this.index = 0
    }

    return config ? JSON.parse(config) : ''
  }
}
