import { ActionSettingConfig } from './Setting'

export function getSideBarSetting(): ActionSettingConfig[] {
  return [
    {
      type: 'component',
      name: '组件',
      icon: 'appstore-outlined',
    },
    {
      type: 'layer',
      name: '图层',
      icon: 'block-outlined',
    },
    {
      type: 'theme',
      name: '主题',
      icon: 'bg-colors-outlined',
    },
    {
      type: 'extension',
      name: '扩展',
      icon: 'build-outlined',
    },
    {
      type: 'clipboard',
      name: '剪贴板',
      icon: 'copy-outlined',
    },
  ]
}
