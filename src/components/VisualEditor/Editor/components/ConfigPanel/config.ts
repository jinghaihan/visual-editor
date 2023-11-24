import { getPixelProps } from '@/components/VisualEditor/Renderer/components/template/props'

export const generalFormConfig = [
  {
    key: 'name',
    label: '组件名称',
    type: 'input',
    props: {},
  },
  {
    key: 'keepRatio',
    label: '锁定宽高比',
    type: 'switch',
    props: {},
  },
  {
    key: 'rotation',
    label: '旋转角度',
    type: 'slider',
    props: {
      min: 0,
      max: 360,
      formatter: (value: number) => {
        return `${value}°`
      },
    },
  },
  {
    key: 'x',
    label: 'X',
    type: 'input-number',
    props: { ...getPixelProps() },
    layout: {
      col: 12,
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    },
  },
  {
    key: 'y',
    label: 'Y',
    type: 'input-number',
    props: { ...getPixelProps() },
    layout: {
      col: 12,
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    },
  },
  {
    key: 'w',
    label: '宽',
    type: 'input-number',
    props: { ...getPixelProps() },
    layout: {
      col: 12,
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    },
  },
  {
    key: 'h',
    label: '高',
    type: 'input-number',
    props: { ...getPixelProps() },
    layout: {
      col: 12,
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    },
  },
]
