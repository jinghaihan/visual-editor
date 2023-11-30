import { isRef, toRaw } from 'vue'
import { isArray } from 'lodash-es'

interface Instance {
  [key: string]: any
}

export class InstanceManager {
  private instance: { [key: string]: Instance }

  constructor() {
    this.instance = {}
  }

  set(instanceKey: string, props): void {
    const _props = {}

    Object.keys(props).forEach((key) => {
      if (isRef(props[key])) {
        _props[key] = {
          ref: () => props[key],
          setValue: (value) => {
            props[key].value = value
            if (isArray(value)) {
              props[key].value = props[key].value.slice()
            }
          },
          getValue: () => {
            return toRaw(props[key].value)
          },
          push: (value) => {
            if (isArray(props[key].value)) {
              props[key].value.push(value)
            }
          },
          filter: (fn) => {
            if (isArray(props[key].value)) {
              return props[key].value.filter(fn)
            }
          },
          find: (fn) => {
            if (isArray(props[key].value)) {
              return props[key].value.find(fn)
            }
          },
          merge: (value) => {
            props[key].value = {
              ...props[key].value,
              ...value,
            }
          },
        }
      } else {
        _props[key] = props[key]
      }
    })

    this.instance[instanceKey] = _props
  }

  get(instanceKey: string): Instance | undefined {
    return this.instance[instanceKey]
  }

  getProxy(instanceKey: string): Instance['instance'] | undefined {
    return this.instance[instanceKey]?.instance.proxy
  }

  getRefs(instanceKey: string): Instance['instance']['$refs'] | undefined {
    const proxy = this.getProxy(instanceKey)
    return proxy?.$refs
  }
}
