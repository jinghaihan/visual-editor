import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
  title: {
    type: 'collapseForm',
    name: '标题配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input',
        label: '标题',
        key: 'vm-propsData-title',
        defaultValue: '边框标题'
      }
    ]
  }
}

const configMap = {
  'dv-border-Box-1': [],
  'dv-border-Box-2': [],
  'dv-border-Box-3': [],
  'dv-border-Box-4': [],
  'dv-border-Box-4-reverse': [],
  'dv-border-Box-5': [],
  'dv-border-Box-5-reverse': [],
  'dv-border-Box-6': [],
  'dv-border-Box-7': [],
  'dv-border-Box-8': [],
  'dv-border-Box-8-reverse': [],
  'dv-border-Box-9': [],
  'dv-border-Box-10': [],
  'dv-border-Box-11': ['title'],
  'dv-border-Box-12': [],
  'dv-border-Box-13': []
}

const configData = {}

Object.keys(configMap).forEach(key => {
  configData[key] = {}
  
  configMap[key].forEach(configType => {
    if (!configData[key][FormModel[configType].type]) {
      configData[key][FormModel[configType].type] = []
    }
    configData[key][FormModel[configType].type].push({ ...FormModel[configType], key: configType })
  })
  
  configData[key]['form'] = mergeGlobalConfig(configData[key]['form'])
})

export default configData
