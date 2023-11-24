import { getPixelProps } from '../props'
import { FormType } from '@/components/Application/FormGenerator/model'
import { primaryColor } from '@/settings/designSetting'

export const config = [
  {
    key: 'font',
    label: '字体',
    type: FormType.COLLAPSE,
    children: [
      {
        key: 'color',
        label: '颜色',
        type: 'ColorPicker?raw',
        defaultValue: primaryColor,
        props: {
          type: 'hex',
        },
      },
      {
        key: 'fontSize',
        label: '尺寸',
        type: 'input-number',
        defaultValue: 36,
        props: {
          ...getPixelProps(),
        },
      },
    ],
  },
]
