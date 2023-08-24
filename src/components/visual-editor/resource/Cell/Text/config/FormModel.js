import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
  'text': {
    type: 'form',
    config: [
      {
        type: 'input',
        label: '文本内容',
        key: 'vm-propsData-text',
        defaultValue: '文本内容'
      }
    ]
  },
  'wrap-text-font': {
    type: 'collapseForm',
    name: '字体设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '字体颜色',
        key: 'vm-propsData-color?Color',
        defaultValue: { hex: '#333' }
      },
      {
        type: 'input-number',
        label: '字体大小',
        key: 'vm-propsData-fontSize?Pixel',
        defaultValue: 24
      },
      {
        type: 'select',
        label: '字体粗细',
        key: 'vm-propsData-fontWeight',
        defaultValue: 'normal',
        props: {
          options: [
            { label: '默认', value: 'normal' },
            { label: '粗', value: 'bold' },
            { label: '加粗', value: 'bolder' },
            { label: '细', value: 'lighter' }
          ]
        }
      },
      {
        type: 'select',
        label: '对齐方式',
        key: 'vm-propsData-textAlign',
        defaultValue: 'center',
        props: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' }
          ]
        }
      }
    ]
  },
  'inline-text-font': {
    type: 'collapseForm',
    name: '字体设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '字体颜色',
        key: 'vm-propsData-color?Color',
        defaultValue: { hex: '#333' }
      },
      {
        type: 'input-number',
        label: '字体大小',
        key: 'vm-propsData-fontSize?Pixel',
        defaultValue: 24
      },
      {
        type: 'select',
        label: '字体粗细',
        key: 'vm-propsData-fontWeight',
        defaultValue: 'normal',
        props: {
          options: [
            { label: '默认', value: 'normal' },
            { label: '粗', value: 'bold' },
            { label: '加粗', value: 'bolder' },
            { label: '细', value: 'lighter' }
          ]
        }
      }
    ]
  },
  'carousel-text': {
    type: 'collapseForm',
    name: '轮播设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input-number',
        label: '轮播速度（s）',
        key: 'vm-animation-duration',
        defaultValue: 4
      }
    ]
  },
  'bloom-text-font': {
    type: 'collapseForm',
    name: '字体设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '字体主色',
        key: 'vm-propsData-primaryColor?Color',
        defaultValue: { hex: '#ff69b3' }
      },
      {
        type: 'color-picker',
        label: '字体副色',
        key: 'vm-propsData-deputyColor?Color',
        defaultValue: { hex: '#40e1d2' }
      },
      {
        type: 'input-number',
        label: '字体大小',
        key: 'vm-propsData-fontSize?Pixel',
        defaultValue: 24
      },
      {
        type: 'select',
        label: '字体粗细',
        key: 'vm-propsData-fontWeight',
        defaultValue: 'normal',
        props: {
          options: [
            { label: '默认', value: 'normal' },
            { label: '粗', value: 'bold' },
            { label: '加粗', value: 'bolder' },
            { label: '细', value: 'lighter' }
          ]
        }
      },
      {
        type: 'select',
        label: '对齐方式',
        key: 'vm-propsData-textAlign',
        defaultValue: 'center',
        props: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' }
          ]
        }
      }
    ]
  },
  'digital-flop': {
    type: 'collapseForm',
    name: '数字翻牌器设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input',
        label: '内容模板',
        key: 'vm-propsData-content',
        defaultValue: '{nt}',
        help: 'number中的元素将被用于替换content内容模版中的{nt}标记，其替换顺序与模版标记的顺序一一对应'
      },
      {
        type: 'input-number',
        label: '小数位数',
        key: 'vm-propsData-toFixed',
        defaultValue: 0
      },
      {
        type: 'select',
        label: '对齐方式',
        key: 'vm-propsData-textAlign',
        defaultValue: 'center',
        props: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中对齐', value: 'center' },
            { label: '右对齐', value: 'right' }
          ]
        }
      }
    ]
  },
  'digital-flop-font': {
    type: 'collapseForm',
    name: '字体设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '字体颜色',
        key: 'vm-propsData-fill?Color',
        defaultValue: {
          hex: '#3de7c9'
        }
      },
      {
        type: 'input-number',
        label: '字体大小',
        key: 'vm-propsData-fontSize',
        defaultValue: 30
      }
    ]
  }
}

const configMap = {
  'multi-line-text': ['text', 'wrap-text-font'],
  'carousel-text': ['text', 'inline-text-font', 'carousel-text'],
  'bloom-text': ['text', 'bloom-text-font'],
  'dv-digital-flop': ['digital-flop', 'digital-flop-font']
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
