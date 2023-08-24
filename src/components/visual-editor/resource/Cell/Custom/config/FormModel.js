import { mergeGlobalConfig } from '../../../../utils/hook'
import components from '../../../../config/component'

function getComponentOptions () {
  let options = []
  let componentTypes = ['chart', 'table']

  componentTypes.forEach((componentType, index) => {
    options = options.concat(components[index].components.map(item => {
      return {
        label: item.name,
        value: JSON.stringify({
          componentType: componentType,
          type: item.type,
          component: item.component
        })
      }
    }))
  })

  return options
}

const FormModel = {
  'load-container': {
    type: 'form',
    config: [
      {
        type: 'input',
        label: '自定义组件名称',
        key: 'componentName',
        props: {}
      }
    ]
  },
  'carousel-container': {
    type: 'collapseForm',
    name: '轮播配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input-number',
        label: '切换间隔',
        key: 'vm-propsData-delay',
        defaultValue: 0,
        props: {
          min: 0,
          max: Infinity
        }
      }
    ]
  },
  'tab-container': {
    type: 'collapseForm',
    name: '标签页配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'select',
        label: '页签尺寸',
        key: 'vm-propsData-size',
        defaultValue: 'default',
        props: {
          options: [
            { label: 'large', value: 'large' },
            { label: 'default', value: 'default' },
            { label: 'small', value: 'small' }
          ]
        }
      },
      {
        type: 'select',
        label: '页签位置',
        key: 'vm-propsData-tabPosition',
        defaultValue: 'top',
        props: {
          options: [
            { label: 'top', value: 'top' },
            { label: 'right', value: 'right' },
            { label: 'bottom', value: 'bottom' },
            { label: 'left', value: 'left' }
          ]
        }
      },
      {
        type: 'select',
        label: '页签基本样式',
        key: 'vm-propsData-type',
        defaultValue: 'line',
        props: {
          options: [
            { label: 'line', value: 'line' },
            { label: 'card', value: 'card' }
          ]
        }
      },
      {
        type: 'input-number',
        label: '页签间隙',
        key: 'vm-propsData-tabBarGutter',
        defaultValue: 0,
        props: {}
      }
    ]
  },
  'componentSet-component-select': {
    type: 'customForm',
    component: 'ComponentSetSelect',
    props: {
      options: getComponentOptions()
    }
  }
}

const configMap = {
  'load-container': ['load-container'],
  'carousel-container': ['carousel-container', 'componentSet-component-select'],
  'tab-container': ['tab-container', 'componentSet-component-select']
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
