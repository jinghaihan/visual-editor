import _ from 'lodash'
import { globalCellFormConfig } from '../config/formModel'

// 整合全局配置
export function mergeGlobalConfig (target) {
  let globalFormConfig = Object.keys(globalCellFormConfig).map(key => {
    return {
      ...globalCellFormConfig[key],
      key
    }
  })
  target = globalFormConfig.concat(target || [])

  return target
}

// 过滤config数据
export function filterConfigData (configData, whiteList) {
  let data = {}
  configData = _.cloneDeep(configData)
  whiteList = whiteList || []

  Object.keys(configData).forEach(key => {
    if (!key.includes('vm-') && !whiteList.includes(key)) {
      data[key] = configData[key]
    }
  })

  return data
}

// 触发vm数据修改
export function triggerVmDataUpdate (vm, formData) {
  const factory = {
    'Array': (target, key, data) => {
      vm.$set(target, key, [data])
    },
    'Color': (target, key, data) => {
      vm.$set(target, key, data.hex)
    },
    'Pixel': (target, key, data) => {
      vm.$set(target, key, data + 'px')
    }
  }
  Object.keys(formData).forEach(key => {
    if (key.includes('vm-')) {
      let data = formData[key]
      let path = key.split('-')
      path.shift()
      let rootTarget = path[0]

      let target
      while (path.length) {
        if (path.length === 1) {
          if (path[0].includes('?')) {
            let type = path[0].split('?')[1]
            factory[type](target, path[0].split('?')[0], data)
          } else {
            vm.$set(target, path[0], data)
          }
        }
        target = vm[path[0]]
        path.shift()
      }

      vm[rootTarget] = { ...vm[rootTarget] }
    }
  })
}
