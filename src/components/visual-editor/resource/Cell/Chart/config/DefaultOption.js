export const BarOptions = {
  default: {
    'tooltip': {
      'show': true
    },
    'xAxis': {
      'type': 'category',
      'data': [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G'
      ]
    },
    'yAxis': {
      'type': 'value'
    },
    'series': [
      {
        'name': 'X',
        'data': [
          120,
          200,
          150,
          80,
          70,
          110,
          130
        ],
        'type': 'bar'
      }
    ],
    'grid': {
      'top': 60,
      'bottom': 60
    }
  }
}

export const BarStackOptions = {
  default: {
    'tooltip': {
      'trigger': 'axis',
      'axisPointer': {
        'type': 'shadow'
      },
      'show': true
    },
    'xAxis': {
      'type': 'category',
      'data': [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G'
      ]
    },
    'yAxis': [
      {
        'type': 'value'
      }
    ],
    'series': [
      {
        'name': 'X',
        'type': 'bar',
        'stack': 'stack',
        'emphasis': {
          'focus': 'series'
        },
        'data': [
          120,
          132,
          101,
          134,
          90,
          230,
          210
        ]
      },
      {
        'name': 'Y',
        'type': 'bar',
        'stack': 'stack',
        'emphasis': {
          'focus': 'series'
        },
        'data': [
          220,
          182,
          191,
          234,
          290,
          330,
          310
        ]
      },
      {
        'name': 'Z',
        'type': 'bar',
        'stack': 'stack',
        'emphasis': {
          'focus': 'series'
        },
        'data': [
          150,
          232,
          201,
          154,
          190,
          330,
          410
        ]
      }
    ],
    'grid': {
      'top': 60,
      'bottom': 60
    }
  }
}

export const LineOptions = {
  default: {
    'xAxis': {
      'type': 'category',
      'data': [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G'
      ]
    },
    'yAxis': {
      'type': 'value'
    },
    'series': [
      {
        'name': 'X',
        'data': [
          150,
          230,
          224,
          218,
          135,
          147,
          260
        ],
        'type': 'line'
      }
    ],
    'tooltip': {
      'show': true
    },
    'grid': {
      'top': 60,
      'bottom': 60
    }
  }
}

export const LineAreaOptions = {
  default: {
    'xAxis': {
      'type': 'category',
      'boundaryGap': false,
      'data': [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G'
      ]
    },
    'yAxis': {
      'type': 'value'
    },
    'series': [
      {
        'name': 'X',
        'data': [
          820,
          932,
          901,
          934,
          1290,
          1330,
          1320
        ],
        'type': 'line',
        'areaStyle': {}
      }
    ],
    'tooltip': {
      'show': true
    },
    'grid': {
      'top': 60,
      'bottom': 60
    }
  }
}

export const PieOptions = {
  default: {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'X',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: 'A' },
          { value: 735, name: 'B' },
          { value: 580, name: 'C' },
          { value: 484, name: 'D' },
          { value: 300, name: 'E' }
        ]
      }
    ]
  }
}

export const PieRingOptions = {
  default: {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        data: [
          { value: 1048, name: 'A' },
          { value: 735, name: 'B' },
          { value: 580, name: 'C' },
          { value: 484, name: 'D' },
          { value: 300, name: 'E' }
        ]
      }
    ]
  }
}

export const PieRoseOptions = {
  default: {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: [
          { value: 235, name: 'A' },
          { value: 274, name: 'B' },
          { value: 310, name: 'C' },
          { value: 335, name: 'D' },
          { value: 400, name: 'E' }
        ],
        roseType: 'radius'
      }
    ]
  }
}

export const FunnelOptions = {
  default: {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'funnel',
        sort: 'descending',
        top: 60,
        bottom: 20,
        minSize: '0%',
        maxSize: '180%',
        data: [
          { value: 60, name: 'A' },
          { value: 40, name: 'B' },
          { value: 20, name: 'C' },
          { value: 80, name: 'D' },
          { value: 100, name: 'E' }
        ]
      }
    ]
  }
}

export const GaugeOptions = {
  default: {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 10
        },
        axisLine: {
          lineStyle: {
            width: 10
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          length: 10,
          distance: 10,
          lineStyle: {
            color: '#63677A',
            width: 3
          }
        },
        axisLabel: {
          show: true,
          distance: 15,
          fontSize: 12
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 10
          }
        },
        detail: {
          show: true,
          fontSize: 30,
          valueAnimation: true,
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
}

export const RadarOptions = {
  default: {
    radar: {
      indicator: [
        { name: 'A', max: 6500 },
        { name: 'B', max: 16000 },
        { name: 'C', max: 30000 },
        { name: 'D', max: 38000 },
        { name: 'E', max: 52000 },
        { name: 'F', max: 25000 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'X'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Y'
          }
        ]
      }
    ]
  }
}

export const ScatterOptions = {
  default: {
    'xAxis': {
      'type': 'value'
    },
    'yAxis': {
      'scale': true,
      'type': 'value'
    },
    'series': [
      {
        'name': 'A',
        'data': [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68]
        ],
        'type': 'scatter'
      }
    ],
    'tooltip': {
      'show': true
    },
    'grid': {
      'top': 60,
      'bottom': 60
    }
  }
}

export const BubbleOptions = {
  default: {
    'grid': {
      'top': 60,
      'bottom': 60
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      scale: true,
      type: 'category'
    },
    series: [
      {
        name: 'A',
        data: [
          [10.0, 8.04, 1709],
          [8.07, 6.95, 276],
          [13.0, 7.58, 1154],
          [9.15, 8.81, 1058],
          [11.0, 8.33, 49],
          [14.0, 7.66, 5694],
          [13.4, 6.81, 789],
          [10.0, 6.33, 254],
          [14.0, 8.96, 87],
          [12.5, 6.82, 122],
          [9.15, 7.2, 2019],
          [11.5, 7.2, 429],
          [11.0, 4.23, 3397],
          [12.2, 7.83, 424],
          [2.02, 4.47, 3819],
          [1.05, 3.33, 424],
          [11.0, 4.96, 381],
          [6.03, 7.24, 1475],
          [12.0, 6.26, 5399],
          [12.0, 8.84, 57],
          [7.08, 5.82, 252],
          [5.02, 5.68, 4297]
        ],
        type: 'scatter',
        symbolSize: function (data) {
          return Math.sqrt(data[2])
        }
      }
    ]
  }
}

export const MapScatterOptions = {
  default: {
    tooltip: {
      show: true,
      formatter (params) {
        return `地区：${params.name}</br>数值：${params.value[2]}`
      }
    },
    geo: {
      show: true,
      map: 'china',
      roam: false,
      zoom: 1.2,
      scaleLimit: {
        min: 0.1,
        max: 12
      },
      label: {
        show: false,
        color: '#333',
        fontSize: 12
      },
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#000'
      },
      emphasis: {
        label: {
          show: false,
          color: '#fff',
          fontSize: 12
        },
        itemStyle: {
          areaColor: '#eee',
          borderColor: '#000'
        }
      }
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        effectType: 'ripple',
        showEffectOn: 'render',
        hoverAnimation: true,
        zlevel: 1,
        rippleEffect: {
          period: 10,
          scale: 10,
          brushType: 'fill'
        },
        data: [
          { name: '北京市', value: [116.405285, 39.904989, 1000] }
        ]
      }
    ]
  }
}

export const MapHeatmapOptions = {
  default: {
    tooltip: {
      show: true,
      formatter (params) {
        return `地区：${params.name}</br>数值：${params.value || '-'}`
      }
    },
    visualMap: {
      left: 'left',
      min: 800,
      max: 50000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.2,
        scaleLimit: {
          min: 0.1,
          max: 12
        },
        label: {
          show: false,
          color: '#333',
          fontSize: 12
        },
        itemStyle: {
          areaColor: '#eee',
          borderColor: '#000'
        },
        emphasis: {
          label: {
            show: false,
            color: '#fff',
            fontSize: 12
          },
          itemStyle: {
            areaColor: '#eee',
            borderColor: '#000'
          }
        },
        data: [
          { name: '北京市', value: 1000 },
          { name: '浙江省', value: 50000 },
          { name: '四川省', value: 8000 },
          { name: '江西省', value: 10000 }
        ]
      }
    ]
  }
}
