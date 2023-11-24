import type { App, Plugin } from 'vue'
import { v4 } from 'uuid'

export function uuid(): string {
  return v4()
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    // @ts-ignore
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}
