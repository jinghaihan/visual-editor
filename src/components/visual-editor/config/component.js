const imagePath = '/component/chart/'

const componentConfig = [
  {
    type: 'chart',
    name: '图表',
    icon: 'area-chart',
    components: [
      {
        name: '柱状图',
        type: 'bar',
        image: require('../assets' + imagePath + 'bar.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '堆叠柱状图',
        type: 'bar-stack',
        image: require('../assets' + imagePath + 'bar-stack.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '折线图',
        type: 'line',
        image: require('../assets' + imagePath + 'line.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '面积图',
        type: 'line-area',
        image: require('../assets' + imagePath + 'line-area.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '饼状图',
        type: 'pie',
        image: require('../assets' + imagePath + 'pie.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '环状图',
        type: 'pie-ring',
        image: require('../assets' + imagePath + 'pie-ring.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '玫瑰图',
        type: 'pie-rose',
        image: require('../assets' + imagePath + 'pie-rose.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '漏斗图',
        type: 'funnel',
        image: require('../assets' + imagePath + 'funnel.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '仪表盘',
        type: 'gauge',
        image: require('../assets' + imagePath + 'gauge.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '雷达图',
        type: 'radar',
        image: require('../assets' + imagePath + 'radar.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '散点图',
        type: 'scatter',
        image: require('../assets' + imagePath + 'scatter.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '气泡图',
        type: 'bubble',
        image: require('../assets' + imagePath + 'bubble.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '散点地图',
        type: 'map-scatter',
        image: require('../assets' + imagePath + 'map-scatter.png'),
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '热力地图',
        type: 'map-heatmap',
        image: require('../assets' + imagePath + 'map-heatmap.png'),
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'table',
    name: '表格',
    icon: 'table',
    components: [
      {
        name: '明细表格',
        type: 'detail-table',
        component: 'DetailTable',
        showComponentName: true,
        col: 6,
        w: 700,
        h: 370,
        props: {}
      },
      {
        name: '轮播表',
        type: 'dv-scroll-board',
        component: 'ScrollBoard',
        showComponentName: true,
        col: 6,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '排名轮播表',
        type: 'dv-scroll-ranking-board',
        component: 'ScrollRankingBoard',
        showComponentName: true,
        col: 6,
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'text',
    name: '文本',
    icon: 'font-size',
    components: [
      {
        name: '文本',
        type: 'multi-line-text',
        component: 'MultilineText',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '轮播文本',
        type: 'carousel-text',
        component: 'CarouselText',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '流光文本',
        type: 'bloom-text',
        component: 'BloomText',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '数字翻牌器',
        type: 'dv-digital-flop',
        component: 'DigitalFlop',
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'border',
    name: '边框',
    icon: 'border-outer',
    components: [
      {
        name: '边框1',
        type: 'dv-border-Box-1',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框2',
        type: 'dv-border-Box-2',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框3',
        type: 'dv-border-Box-3',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框4',
        type: 'dv-border-Box-4',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框4(翻转)',
        type: 'dv-border-Box-4-reverse',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '边框5',
        type: 'dv-border-Box-5',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框5(翻转)',
        type: 'dv-border-Box-5-reverse',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '边框6',
        type: 'dv-border-Box-6',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框7',
        type: 'dv-border-Box-7',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框8',
        type: 'dv-border-Box-8',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框8(翻转)',
        type: 'dv-border-Box-8-reverse',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '边框9',
        type: 'dv-border-Box-9',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框10',
        type: 'dv-border-Box-10',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框11',
        type: 'dv-border-Box-11',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {
          title: '边框标题'
        }
      },
      {
        name: '边框12',
        type: 'dv-border-Box-12',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '边框13',
        type: 'dv-border-Box-13',
        component: 'Border',
        col: 12,
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'decoration',
    name: '装饰',
    icon: 'star',
    components: [
      {
        name: '装饰1',
        type: 'dv-decoration-1',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰2',
        type: 'dv-decoration-2',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰2(翻转)',
        type: 'dv-decoration-2-reverse',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '装饰3',
        type: 'dv-decoration-3',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰4',
        type: 'dv-decoration-4',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰4(翻转)',
        type: 'dv-decoration-4-reverse',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '装饰5',
        type: 'dv-decoration-5',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰6',
        type: 'dv-decoration-6',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰7',
        type: 'dv-decoration-7',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰8',
        type: 'dv-decoration-8',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰8(翻转)',
        type: 'dv-decoration-8-reverse',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {
          reverse: true
        }
      },
      {
        name: '装饰9',
        type: 'dv-decoration-9',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰10',
        type: 'dv-decoration-10',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰11',
        type: 'dv-decoration-11',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '装饰12',
        type: 'dv-decoration-12',
        component: 'Decoration',
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'image',
    name: '图片',
    icon: 'picture',
    pagination: true
  },
  {
    type: 'video',
    name: '视频',
    icon: 'video-camera',
    pagination: true
  },
  {
    type: 'audio',
    name: '音频',
    icon: 'audio',
    pagination: true
  },
  {
    type: 'custom',
    name: '高级组件',
    icon: 'appstore',
    components: [
      {
        name: '加载容器',
        type: 'load-container',
        component: 'LoadContainer',
        showComponentName: true,
        col: 6,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '轮播容器',
        type: 'carousel-container',
        component: 'CarouselContainer',
        showComponentName: true,
        col: 6,
        w: 0,
        h: 0,
        props: {}
      },
      {
        name: '标签页容器',
        type: 'tab-container',
        component: 'TabContainer',
        showComponentName: true,
        col: 6,
        w: 0,
        h: 0,
        props: {}
      }
    ]
  },
  {
    type: 'clipBoard',
    name: '剪贴板',
    icon: 'copy'
  }
]

export default componentConfig
