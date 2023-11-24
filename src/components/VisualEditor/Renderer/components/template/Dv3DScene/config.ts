import { isString } from 'lodash-es'
import { readAsText, readAsBase64 } from '../reader'
import { FormType } from '@/components/Application/FormGenerator/model'

let currentPerspective = 0

const lightConfig = [
  {
    key: 'color',
    label: '光照颜色',
    type: 'ColorPicker?raw',
    defaultValue: '#fff',
    props: {
      type: 'hex',
    },
  },
  {
    key: 'intensity',
    label: '光照强度',
    type: 'slider',
    defaultValue: 1,
    props: {
      min: -5,
      max: 5,
      step: 0.01,
    },
  },
  {
    key: 'horizontal',
    label: '水平方向',
    type: 'slider',
    defaultValue: 1,
    props: {
      min: -10,
      max: 10,
      step: 0.01,
    },
  },
  {
    key: 'vertical',
    label: '垂直方向',
    type: 'slider',
    defaultValue: 1,
    props: {
      min: -10,
      max: 10,
      step: 0.01,
    },
  },
  {
    key: 'sistance',
    label: '光源距离',
    type: 'slider',
    defaultValue: 1,
    props: {
      min: 0,
      max: 10,
      step: 0.01,
    },
  },
]

export const config = [
  {
    key: 'background',
    label: '背景',
    type: FormType.RADIOBUTTON,
    props: {
      icon: 'picture-outlined',
    },
    children: [
      {
        key: 'panorama',
        label: '全景图片',
        type: 'UploadDragger?raw',
        props: {
          accept: '.png',
          reader: readAsBase64,
        },
      },
      {
        key: 'hdr',
        label: 'HDR图片',
        type: 'UploadDragger?raw',
        props: {
          accept: '.hdr',
        },
      },
    ],
  },
  {
    key: 'light',
    label: '光照',
    type: FormType.RADIOBUTTON,
    props: {
      icon: 'bulb-outlined',
    },
    children: [
      {
        key: 'ambientLight',
        label: '环境光',
        type: FormType.COLLAPSE,
        children: [...lightConfig].slice(0, 2),
      },
      {
        key: 'directionalLight',
        label: '平行光',
        type: FormType.COLLAPSE,
        children: [...lightConfig],
      },
      {
        key: 'spotLight',
        label: '聚光灯',
        type: FormType.COLLAPSE,
        children: [
          ...lightConfig,
          {
            key: 'angle',
            label: '光线照射范围',
            type: 'slider',
            defaultValue: 0,
            props: {
              min: 0,
              max: 2,
              step: 0.01,
            },
          },
          {
            key: 'penumbra',
            label: '边缘聚光度',
            type: 'slider',
            defaultValue: 0,
            props: {
              min: 0,
              max: 1,
              step: 0.01,
            },
          },
          {
            key: 'shadowFocus',
            label: '投影聚焦度',
            type: 'slider',
            defaultValue: 0,
            props: {
              min: 0,
              max: 3,
              step: 0.01,
            },
          },
          {
            key: 'distance',
            label: '光源照射距离',
            type: 'slider',
            defaultValue: 0,
            props: {
              min: 0,
              max: 500,
              step: 1,
            },
          },
        ],
      },
    ],
  },
  {
    key: 'scene',
    label: '场景',
    type: FormType.RADIOBUTTON,
    props: {
      icon: 'robot-outlined',
    },
    children: [
      {
        key: 'model',
        label: '模型',
        type: FormType.COLLAPSE,
        children: [
          {
            key: 'file',
            label: '模型文件',
            type: 'UploadDragger?raw',
            props: {
              accept: '.glb,.gltf,.obj,.fbx',
              // reader: readAsObjectUrl,
            },
          },
          {
            key: 'scale',
            label: '模型比例',
            type: 'input-number',
            defaultValue: 300,
            props: {
              precision: 0,
              min: 1,
            },
          },
        ],
      },
      {
        key: 'city',
        label: '城市',
        type: FormType.COLLAPSE,
        children: [
          {
            key: 'geoJson',
            label: '城市数据',
            type: 'UploadDragger?raw',
            props: {
              accept: '.geojson',
              reader: readAsText,
            },
          },
        ],
      },
    ],
  },
  {
    key: 'camera',
    label: '视角',
    type: FormType.RADIOBUTTON,
    props: {
      icon: 'camera-outlined',
    },
    children: [
      {
        key: 'perspectives',
        label: '场景坐标',
        type: 'textarea',
        defaultValue: '[]',
        props: {
          autoSize: true,
        },
        meta: [
          {
            key: 'savePerspective',
            type: 'button',
            props: {
              name: '保存视角',
              size: 'small',
            },
            event: {
              click: (data) => {
                try {
                  const { editor, cellKey, formData, formItemConfig, onChange } = data
                  const paper = editor.getCurrentPaper()
                  const cell = paper.cells[cellKey]

                  const position = cell.loader?.camera?.position
                  const target = cell.loader?.controls?.target

                  let value = formData.value[formItemConfig.key]
                  if (isString(value)) {
                    value = JSON.parse(value)
                  }

                  value.push({
                    position,
                    target,
                  })
                  formData.value[formItemConfig.key] = JSON.stringify(value)
                  onChange()
                } catch (error) {
                  console.log('save perspective: ', error)
                }
              },
            },
          },
          {
            key: 'changePerspective',
            type: 'button',
            props: {
              name: '切换视角',
              size: 'small',
              type: 'primary',
            },
            event: {
              click: (data) => {
                try {
                  const { editor, cellKey } = data
                  const paper = editor.getCurrentPaper()

                  const cell = paper.cells[cellKey]
                  if (cell) {
                    let { perspectives } = cell.configData.style.camera
                    perspectives = JSON.parse(perspectives)

                    if (perspectives && perspectives.length) {
                      const animateHandler = cell.loader.models[0].animateHandler

                      animateHandler.changePerspective(
                        perspectives[currentPerspective],
                        (animateHandler.duration / perspectives.length) * 1000,
                      )

                      if (currentPerspective >= perspectives.length - 1) {
                        currentPerspective = 0
                      } else {
                        currentPerspective += 1
                      }
                    }
                  }
                } catch (error) {
                  console.log('change perspective: ', error)
                }
              },
            },
          },
        ],
      },
    ],
  },
]
