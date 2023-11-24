import { readAsText } from '../reader'
import { FormType } from '@/components/Application/FormGenerator/model'

function getCell(data) {
  const { editor, cellKey } = data
  const paper = editor.getCurrentPaper()
  const cell = paper.cells[cellKey]

  return cell
}

export const config = [
  {
    key: 'toolbar',
    label: '工具栏',
    type: 'Toolbar?raw',
    props: {
      buttons: [
        {
          key: 'stop',
          name: '禁用',
          icon: 'stop-outlined',
          event: {
            click: (data) => {
              const cell = getCell(data)
              if (cell) {
                cell.loader.variable.drawingType = null
              }
            },
          },
        },
        {
          key: 'line',
          name: '绘制连线',
          icon: 'subnode-outlined',
          event: {
            click: (data) => {
              const cell = getCell(data)
              if (cell) {
                cell.loader.variable.drawingType = 'line'
                cell.loader.variable.darwingPoints = []
              }
            },
          },
        },
        {
          key: 'polygon',
          name: '绘制范围',
          icon: 'border-outlined',
          event: {
            click: (data) => {
              const cell = getCell(data)
              if (cell) {
                cell.loader.variable.drawingType = 'polygon'
              }
            },
          },
        },
      ],
    },
  },
  {
    key: 'scene',
    label: '场景',
    children: [
      {
        key: 'city',
        label: '城市',
        type: FormType.COLLAPSE,
        children: [
          {
            key: 'geoJson',
            label: '建筑数据',
            type: 'UploadDragger?raw',
            props: {
              accept: '.geojson',
              reader: readAsText,
            },
          },
          {
            key: 'buildingColor',
            label: '建筑颜色',
            type: 'ColorPicker?raw',
            defaultValue: '#fff',
            props: {
              type: 'hex',
              trigger: 'openChange',
            },
          },
          {
            key: 'exHeightField',
            label: '层高字段',
            type: 'input',
            defaultValue: 'Elevation',
            props: {},
          },
          {
            key: 'exHeightScale',
            label: '每层高度',
            type: 'input-number',
            defaultValue: 5,
            props: {
              precision: 0,
              min: 0,
              max: Infinity,
            },
          },
        ],
      },
    ],
  },
]
