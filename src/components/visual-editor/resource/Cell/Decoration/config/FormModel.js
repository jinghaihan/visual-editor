import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
}

const configMap = {
  'dv-decoration-1': [],
  'dv-decoration-2': [],
  'dv-decoration-2-reverse': [],
  'dv-decoration-3': [],
  'dv-decoration-4': [],
  'dv-decoration-4-reverse': [],
  'dv-decoration-5': [],
  'dv-decoration-6': [],
  'dv-decoration-7': [],
  'dv-decoration-8': [],
  'dv-decoration-8-reverse': [],
  'dv-decoration-9': [],
  'dv-decoration-10': [],
  'dv-decoration-11': [],
  'dv-decoration-12': []
}

const configData = {}

Object.keys(configMap).forEach(key => {
  configData[key] = {
    'form': []
  }
  
  configData[key]['form'] = mergeGlobalConfig(configData[key]['form'])
})

export default configData
