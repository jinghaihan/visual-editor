import { cloneDeep } from 'lodash-es'
import { EventBus } from './EventBus'
import { InstanceManager } from './InstanceManager'
import { FormTransfer } from './FormTransfer'
import { AssetsMananger } from './AssetsMananger'
import { Setting } from '../../setting'

interface Action {
  emitter?: Function
  getTheme?: Function
}

export class VisualAdapter {
  public key: string
  public $event: EventBus
  public $instance: InstanceManager
  public $assetsManager: AssetsMananger
  public $formTransfer: FormTransfer

  public setting: any

  public action: Action

  constructor(option) {
    this.key = option.key

    this.$event = option.$event || new EventBus()
    this.$instance = new InstanceManager()
    this.$assetsManager = option.$assetsManager || new AssetsMananger()
    this.$formTransfer = new FormTransfer()

    this.action =
      option.action ||
      new Proxy(
        {},
        {
          get: function (target, property) {
            if (target[property]) {
              return target[property]
            }

            return () => {}
          },
        },
      )

    this.setting = cloneDeep(option.setting) || Setting
  }

  addBroadcastListener(eventName, callback) {
    this.$event.on(eventName, this.key, callback)
  }

  removeBroadcastListener(eventName) {
    this.$event.off(eventName, this.key)
  }

  addEventListener(eventName, callback) {
    this.$event.addEventListener(eventName, this.key, callback)
  }

  removeEventListener(eventName) {
    this.$event.removeEventListener(eventName, this.key)
  }
}
