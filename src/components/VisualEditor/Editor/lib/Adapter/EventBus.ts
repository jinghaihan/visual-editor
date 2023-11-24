type Callback = (...args: any[]) => void

export class EventBus {
  private events: { [eventName: string]: { key: string; callback: Callback; frozen: boolean }[] }
  private frozenEvents: { [eventName: string]: Set<string> }
  private eventListeners: { [key: string]: Callback }

  constructor() {
    this.events = {}
    this.frozenEvents = {}
    this.eventListeners = {}
  }

  on(eventName: string, key: string, callback: Callback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }

    this.events[eventName].push({
      key,
      callback,
      frozen: false,
    })
  }

  off(eventName: string, key: string): void {
    const eventCallbacks = this.events[eventName]
    if (!eventCallbacks) {
      return
    }

    const index = eventCallbacks.findIndex((callback) => callback.key === key)
    if (index !== -1) {
      eventCallbacks.splice(index, 1)
    }
  }

  emit(eventName: string, ...args: any[]): void {
    const eventCallbacks = this.events[eventName]
    if (!eventCallbacks) {
      return
    }

    eventCallbacks.forEach((callback) => {
      if (!this.isKeyFrozen(eventName, callback.key)) {
        callback.callback(...args)
      }
    })
  }

  addEventListener(eventName: string, key: string, callback: Callback): void {
    this.eventListeners[key] = callback
    if (!this.isKeyFrozen(eventName, key)) {
      window.addEventListener(eventName, callback)
    }
  }

  removeEventListener(eventName: string, key: string): void {
    const callback = this.eventListeners[key]
    if (callback) {
      delete this.eventListeners[key]
      window.removeEventListener(eventName, callback)
    }
  }

  freezeEvent(eventName: string, key: string): void {
    if (!this.frozenEvents[eventName]) {
      this.frozenEvents[eventName] = new Set()
    }

    this.frozenEvents[eventName].add(key)
  }

  unfreezeEvent(eventName: string, key: string): void {
    const frozenKeys = this.frozenEvents[eventName]
    if (frozenKeys) {
      frozenKeys.delete(key)
    }
  }

  freezeEventsByKey(key: string): void {
    Object.values(this.events).forEach((eventCallbacks) => {
      eventCallbacks.forEach((callback) => {
        if (callback.key === key) {
          callback.frozen = true
        }
      })
    })
  }

  unfreezeEventsByKey(key: string): void {
    Object.values(this.events).forEach((eventCallbacks) => {
      eventCallbacks.forEach((callback) => {
        if (callback.key === key) {
          callback.frozen = false
        }
      })
    })
  }

  removeEventListenersByKey(key: string): void {
    Object.entries(this.eventListeners).forEach(([eventKey, callback]) => {
      if (eventKey === key) {
        Object.keys(this.frozenEvents).forEach((eventName) => {
          window.removeEventListener(eventName, callback)
        })
      }
    })
  }

  restoreEventListenersByKey(key: string): void {
    Object.entries(this.eventListeners).forEach(([eventKey, callback]) => {
      if (eventKey === key) {
        this.eventListeners[eventKey] = callback
        Object.keys(this.frozenEvents).forEach((eventName) => {
          if (!this.isKeyFrozen(eventName, key)) {
            window.addEventListener(eventName, callback)
          }
        })
      }
    })
  }

  isKeyFrozen(eventName: string, key: string): boolean {
    const frozenKeys = this.frozenEvents[eventName]
    return frozenKeys && frozenKeys.has(key)
  }
}
