import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
  'general': {
    type: 'form',
    config: [
      {
        type: 'input',
        label: '自定义组件名称',
        key: 'componentName',
        props: {}
      }
    ]
  }
}

const configMap = {
  'custom-entry': ['general']
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
