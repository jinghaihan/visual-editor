import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
  
}

const configMap = {
  'image': [],
  'video': [],
  'audio': []
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
