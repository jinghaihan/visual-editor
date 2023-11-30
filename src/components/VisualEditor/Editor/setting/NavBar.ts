import { ActionSettingConfig } from './Setting'
import { ActionHandlerEnum } from '../lib/Editor/ActionHandler'

export function getActionBarSetting(): ActionSettingConfig[] {
  return [
    {
      type: 'save',
      name: '保存',
      icon: 'save-outlined',
    },
    {
      type: 'eye',
      name: '查看',
      icon: 'eye-outlined',
    },
    {
      type: 'lock',
      name: '锁定',
      icon: 'lock-outlined',
    },
    {
      type: 'import',
      name: '导入配置',
      icon: 'import-outlined',
    },
    {
      type: 'export',
      name: '导出配置',
      icon: 'export-outlined',
    },
    {
      type: ActionHandlerEnum.SCREENSHOT,
      name: '截图',
      icon: 'camera-outlined',
    },
  ].reverse()
}

export function getToolBarSetting(): ActionSettingConfig[] {
  return [
    {
      type: ActionHandlerEnum.CLEAR_PAPER,
      name: '清空画布',
      icon: 'delete-filled',
    },
    {
      type: 'multi-selected',
      name: '多选',
      icon: 'expand-outlined',
    },
  ]
}
