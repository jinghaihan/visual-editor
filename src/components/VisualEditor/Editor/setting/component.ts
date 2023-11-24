import { ComponentGroupEnum, ComponentEnum } from '@/enums/componentEnums'

export function getComponentSetting() {
  return [
    {
      type: ComponentGroupEnum.CHART,
      name: '图表组件',
      icon: 'area-chart-outlined',
      components: [
        {
          type: ComponentEnum.DV_BAR,
          name: '柱状图',
        },
        {
          type: ComponentEnum.DV_BAR_STACK,
          name: '堆积柱状图',
        },
        {
          type: ComponentEnum.DV_STRIP,
          name: '条形图',
        },
        {
          type: ComponentEnum.DV_STRIP_STACK,
          name: '堆积条形图',
        },
        {
          type: ComponentEnum.DV_LINE,
          name: '折线图',
        },
        {
          type: ComponentEnum.DV_LINE_AREA,
          name: '面积图',
        },
        {
          type: ComponentEnum.DV_BIAXIAL,
          name: '双轴图',
        },
        {
          type: ComponentEnum.DV_PIE,
          name: '饼图',
        },
        {
          type: ComponentEnum.DV_RADAR,
          name: '雷达图',
        },
        {
          type: ComponentEnum.DV_FUNNEL,
          name: '漏斗图',
        },
        {
          type: ComponentEnum.DV_SCATTER,
          name: '散点图',
        },
        {
          type: ComponentEnum.DV_HEATMAP,
          name: '热力图',
        },
        {
          type: ComponentEnum.DV_TREE_MAP,
          name: '树图',
        },
        {
          type: ComponentEnum.DV_LIQUID_FILL,
          name: '计量图',
        },
        {
          type: ComponentEnum.DV_WORD_CLOUD,
          name: '词云图',
        },
        {
          type: ComponentEnum.DV_TABLE,
          name: '二维表',
        },
        {
          type: ComponentEnum.DV_TABLE_CROSS,
          name: '交叉表',
        },
      ],
    },
    {
      type: ComponentGroupEnum.SEARCH,
      name: '查询组件',
      icon: 'search-outlined',
      components: [],
    },
    {
      type: ComponentGroupEnum.TEXT,
      name: '文本组件',
      icon: 'font-colors-outlined',
      components: [
        {
          type: ComponentEnum.DV_TEXT,
          name: '单文本',
        },
        {
          type: ComponentEnum.DV_TITLE,
          name: '标题',
        },
        {
          type: ComponentEnum.DV_MARQUEE,
          name: '跑马灯',
        },
        {
          type: ComponentEnum.DV_STATISTIC,
          name: '指标卡',
        },
        {
          type: ComponentEnum.DV_CLOCK,
          name: '时间',
        },
        {
          type: ComponentEnum.DV_WEATHER,
          name: '天气',
        },
      ],
    },
    {
      type: ComponentGroupEnum.MEDIA,
      name: '多媒体组件',
      icon: 'picture-outlined',
      components: [
        {
          type: ComponentEnum.DV_BORDER,
          name: '边框',
        },
        {
          type: ComponentEnum.DV_IMAGE,
          name: '图片',
        },
      ],
    },
    {
      type: ComponentGroupEnum.ADVANCE,
      name: '高级组件',
      icon: 'appstore-add-outlined',
      components: [
        {
          type: ComponentEnum.DV_SWIPER,
          name: '轮播容器',
        },
        {
          type: ComponentEnum.DV_3D_SCENE,
          name: '3D场景',
          props: {
            full: true,
          },
        },
        {
          type: ComponentEnum.DV_GIS_SCENE,
          name: 'GIS场景',
          props: {
            full: true,
          },
        },
      ],
    },
  ]
}
