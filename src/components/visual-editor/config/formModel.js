const layoutChangeCallback = {
  change: (formData, configData, vm) => {
    vm.$emit('notify-event', {
      key: 'onCellLayoutChange',
      data: {
        type: 'layout',
        cellX: formData['cellX'],
        cellY: formData['cellY'],
        cellWidth: formData['cellWidth'],
        cellHeight: formData['cellHeight'],
        lockAspectRatio: formData['lockAspectRatio'],
        zIndex: formData['zIndex']
      }
    })
  }
}

export const formConfig = {
  'paper': [
    {
      type: 'switch',
      label: '自定义画布尺寸',
      key: 'customPaperSize',
      defaultValue: false,
      callback: {
        change: (formData, configData, vm) => {
          const conf = {
            paperSize: configData.find(i => i.key === 'paperSize'),
            paperSizeWidth: configData.find(i => i.key === 'paperSizeWidth'),
            paperSizeHeight: configData.find(i => i.key === 'paperSizeHeight')
          }

          if (formData.customPaperSize) {
            if (formData.paperSize) {
              formData.paperSize = undefined
              formData.paperSizeWidth = 1920
              formData.paperSizeHeight = 1080
            }
            
            conf.paperSize.props.disabled = true
            conf.paperSizeWidth.props.disabled = false
            conf.paperSizeHeight.props.disabled = false
          } else {
            if (!formData.paperSize) {
              formData.paperSize = '1920x1080'
              formData.paperSizeWidth = 1920
              formData.paperSizeHeight = 1080
            }
            
            conf.paperSize.props.disabled = false
            conf.paperSizeWidth.props.disabled = true
            conf.paperSizeHeight.props.disabled = true
          }
        }
      }
    },
    {
      type: 'select',
      label: '画布尺寸',
      key: 'paperSize',
      defaultValue: '1920/1080',
      props: {
        options: [
          { label: '1920x1080', value: '1920/1080' },
          { label: '3200x1080', value: '3200/1080' },
          { label: 'A4', value: '1240/1754' },
          { label: 'A3', value: '1754/2480' }
        ],
        disabled: false
      },
      callback: {
        change: (formData, configData, vm) => {
          if (formData.paperSize) {
            let size = formData.paperSize.split('/')
            formData.paperSizeWidth = parseInt(size[0])
            formData.paperSizeHeight = parseInt(size[1])
          }
        }
      }
    },
    {
      type: 'input-number',
      label: '画布宽度',
      key: 'paperSizeWidth',
      defaultValue: 1920,
      props: {
        min: 0,
        max: Infinity,
        disabled: true
      }
    },
    {
      type: 'input-number',
      label: '画布高度',
      key: 'paperSizeHeight',
      defaultValue: 1080,
      props: {
        min: 0,
        max: Infinity,
        disabled: true
      }
    },
    {
      type: 'switch',
      label: '使用背景图片',
      key: 'useBackgroundImage',
      defaultValue: false,
      props: {
        disabled: false
      },
      callback: {
        change: (formData, configData, vm) => {
          const conf = {
            useBackgroundImage: configData.find(i => i.key === 'useBackgroundImage'),
            backgroundColor: configData.find(i => i.key === 'backgroundColor'),
            backgroundImage: configData.find(i => i.key === 'backgroundImage')
          }

          if (formData.useBackgroundImage) {
            if (!formData.backgroundImage) {
              formData.backgroundColor = {
                hex: '#fff'
              }
              formData.backgroundImage = null
            }
            conf['backgroundColor'].props.disabled = true
            conf['backgroundImage'].props.disabled = false
          } else {
            if (formData.backgroundImage) {
              formData.backgroundColor = {
                hex: '#fff'
              }
              formData.backgroundImage = null
            }
            conf['backgroundColor'].props.disabled = false
            conf['backgroundImage'].props.disabled = true
          }
        }
      }
    },
    {
      type: 'color-picker',
      label: '背景颜色',
      key: 'backgroundColor',
      defaultValue: {
        hex: '#fff'
      },
      props: {
        disabled: false
      },
      callback: {
        change: (formData, configData, vm) => {
          vm.$emit('notify-event', {
            key: 'onPaperBackgroundChange',
            data: {
              type: 'color',
              color: formData['backgroundColor']
            }
          })
        }
      }
    },
    {
      type: 'image-upload',
      label: '背景图片',
      key: 'backgroundImage',
      defaultValue: null,
      props: {
        disabled: true
      },
      callback: {
        change: (formData, configData, vm) => {
          vm.$emit('notify-event', {
            key: 'onPaperBackgroundChange',
            data: {
              type: 'image',
              image: formData['backgroundImage']
            }
          })
        }
      }
    }
  ],
  'auxiliary': [
    {
      type: 'color-picker',
      label: '网格线颜色',
      key: 'paperGridColor',
      defaultValue: {
        rgba: {
          r: 0,
          g: 0,
          b: 0,
          a: 0.1
        }
      }
    },
    {
      type: 'input-number',
      label: '水平方向网格尺寸',
      key: 'paperGridSizeLevel',
      defaultValue: 20,
      props: {
        min: 1,
        max: Infinity
      }
    },
    {
      type: 'input-number',
      label: '垂直方向网格尺寸',
      key: 'paperGridSizeVertical',
      defaultValue: 20,
      props: {
        min: 1,
        max: Infinity
      }
    },
    {
      type: 'color-picker',
      label: '辅助线颜色',
      key: 'paperRefLineColor',
      defaultValue: {
        hex: '#1890ff'
      }
    },
    {
      type: 'switch',
      label: '对齐吸附',
      key: 'paperSnap',
      defaultValue: true
    },
    {
      type: 'input-number',
      label: '对齐吸附距离',
      key: 'paperSnapTolerance',
      defaultValue: 5,
      props: {
        min: 5,
        max: Infinity
      }
    },
    {
      type: 'switch',
      label: '拖拽冲突检测',
      key: 'paperConflictCheck',
      defaultValue: false
    },
    {
      type: 'input-number',
      label: '水平方向移动距离',
      key: 'paperMoveGridLevel',
      defaultValue: 1,
      props: {
        min: 1,
        max: Infinity
      }
    },
    {
      type: 'input-number',
      label: '垂直方向移动距离',
      key: 'paperMoveGridVertical',
      defaultValue: 1,
      props: {
        min: 1,
        max: Infinity
      }
    }
  ]
}

export const globalCellFormConfig = {
  'globalGeneral': {
    type: 'form',
    config: [
      {
        type: 'input',
        label: '组件名称',
        key: 'cellName',
        defaultValue: undefined,
        props: {}
      },
      {
        type: 'input-number',
        label: '堆叠顺序',
        key: 'zIndex',
        defaultValue: 0,
        callback: {
          ...layoutChangeCallback
        }
      },
      {
        type: 'switch',
        label: '锁定宽高比',
        key: 'lockAspectRatio',
        defaultValue: false,
        callback: {
          ...layoutChangeCallback
        }
      },
      {
        type: 'input-number',
        label: 'X',
        key: 'cellX',
        defaultValue: 0,
        props: {
          min: 0,
          max: Infinity
        },
        callback: {
          ...layoutChangeCallback
        },
        col: 12,
        layout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 18 }
        }
      },
      {
        type: 'input-number',
        label: 'Y',
        key: 'cellY',
        defaultValue: 0,
        props: {
          min: 0,
          max: Infinity
        },
        callback: {
          ...layoutChangeCallback
        },
        col: 12,
        layout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 18 }
        }
      },
      {
        type: 'input-number',
        label: '长',
        key: 'cellWidth',
        defaultValue: 0,
        props: {
          min: 0,
          max: Infinity
        },
        callback: {
          ...layoutChangeCallback
        },
        col: 12,
        layout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 18 }
        }
      },
      {
        type: 'input-number',
        label: '宽',
        key: 'cellHeight',
        defaultValue: 0,
        props: {
          min: 0,
          max: Infinity
        },
        callback: {
          ...layoutChangeCallback
        },
        col: 12,
        layout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 18 }
        }
      }
    ]
  }
}
