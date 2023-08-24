import { mergeGlobalConfig } from '../../../../utils/hook'

const FormModel = {
  'scroll-board-general': {
    type: 'collapseForm',
    name: '滚动基础配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input-number',
        label: '表行数',
        key: 'vm-propsData-rowNum',
        defaultValue: 5
      },
      {
        type: 'input-number',
        label: '轮播时间间隔(ms)',
        key: 'vm-propsData-waitTime',
        defaultValue: 2000
      },
      {
        type: 'select',
        label: '轮播方式',
        key: 'vm-propsData-carousel',
        defaultValue: 'single',
        props: {
          options: [
            { label: '单条滚动', value: 'single' },
            { label: '整页滚动', value: 'page' }
          ]
        }
      }
    ]
  },
  'scroll-board': {
    type: 'collapseForm',
    name: '轮播表配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'input-number',
        label: '表头高度',
        key: 'vm-propsData-headerHeight',
        defaultValue: 35
      },
      {
        type: 'select',
        label: '列宽度',
        key: 'vm-propsData-columnWidth',
        defaultValue: [],
        props: {
          mode: 'tags'
        }
      },
      {
        type: 'select',
        label: '对齐方式',
        key: 'vm-propsData-align',
        defaultValue: 'left',
        props: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中对齐', value: 'center' },
            { label: '右对齐', value: 'right' }
          ]
        }
      },
      {
        type: 'switch',
        label: '显示行号',
        key: 'vm-propsData-index',
        defaultValue: false
      },
      {
        type: 'input',
        label: '行号表头',
        key: 'vm-propsData-indexHeader',
        defaultValue: '#'
      },
      {
        type: 'switch',
        label: '悬浮暂停轮播',
        key: 'vm-propsData-hoverPause',
        defaultValue: true
      }
    ]
  },
  'scroll-board-color': {
    type: 'collapseForm',
    name: '颜色配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '表头字体颜色',
        key: 'vm-propsData-headerFontColor?Color',
        defaultValue: {
          hex: '#fff'
        }
      },
      {
        type: 'color-picker',
        label: '列字体颜色',
        key: 'vm-propsData-bodyFontColor?Color',
        defaultValue: {
          hex: '#fff'
        }
      },
      {
        type: 'color-picker',
        label: '表头背景色',
        key: 'vm-propsData-headerBGC?Color',
        defaultValue: {
          hex: '#00BAFF'
        }
      },
      {
        type: 'color-picker',
        label: '奇数行背景色',
        key: 'vm-propsData-oddRowBGC?Color',
        defaultValue: {
          hex: '#003B51'
        }
      },
      {
        type: 'color-picker',
        label: '偶数行背景色',
        key: 'vm-propsData-evenRowBGC?Color',
        defaultValue: {
          hex: '#0A2732'
        }
      }
    ]
  },
  'scroll-ranking-board': {
    type: 'collapseForm',
    name: '排名轮播表配置',
    switch: false,
    defaultValue: true,
    config: [
      
      {
        type: 'input',
        label: '数值单位',
        key: 'vm-propsData-unit',
        defaultValue: '人'
      },
      {
        type: 'switch',
        label: '自动排序',
        key: 'vm-propsData-sort',
        defaultValue: true
      }
    ]
  },
  'scroll-ranking-board-color': {
    type: 'collapseForm',
    name: '颜色配置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '排名字体颜色',
        key: 'vm-propsData-rankFontColor?Color',
        defaultValue: {
          hex: '#1370fb'
        }
      },
      {
        type: 'color-picker',
        label: '名称字体颜色',
        key: 'vm-propsData-infoFontColor?Color',
        defaultValue: {
          hex: '#fff'
        }
      },
      {
        type: 'color-picker',
        label: '数值字体颜色',
        key: 'vm-propsData-valueFontColor?Color',
        defaultValue: {
          hex: '#fff'
        }
      }
    ]
  },
  've-table-border': {
    type: 'collapseForm',
    name: '边框设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'switch',
        label: '外边框',
        key: 'vm-propsData-borderAround',
        defaultValue: true
      },
      {
        type: 'switch',
        label: '横向边框',
        key: 'vm-propsData-borderX',
        defaultValue: true
      },
      {
        type: 'switch',
        label: '纵向边框',
        key: 'vm-propsData-borderY',
        defaultValue: true
      }
    ]
  },
  've-table-color': {
    type: 'collapseForm',
    name: '颜色设置',
    switch: false,
    defaultValue: true,
    config: [
      {
        type: 'color-picker',
        label: '表头字体颜色',
        key: 'vm-styleData-headerCellColor?Color',
        defaultValue: {
          hex: '#000000d9'
        }
      },
      {
        type: 'color-picker',
        label: '表格行字体颜色',
        key: 'vm-styleData-bodyCellColor?Color',
        defaultValue: {
          hex: '#000000d9'
        }
      },
      {
        type: 'color-picker',
        label: '表头背景色',
        key: 'vm-styleData-headerCellBgColor?Color',
        defaultValue: {
          hex: '#fafafa'
        }
      },
      {
        type: 'color-picker',
        label: '表格行背景色',
        key: 'vm-styleData-bodyCellBgColor?Color',
        defaultValue: {
          hex: '#fff'
        }
      }
    ]
  }
}

const configMap = {
  'dv-scroll-board': ['scroll-board-general', 'scroll-board', 'scroll-board-color'],
  'dv-scroll-ranking-board': ['scroll-board-general', 'scroll-ranking-board'],
  'detail-table': ['ve-table-border', 've-table-color']
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
