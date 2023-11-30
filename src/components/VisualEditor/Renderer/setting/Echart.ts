import { ComponentTypeEnum, ComponentEnum, ComponentCellEnum } from '@/enums/componentEnums'

const defaultOptionSetting = {}

const baseChartOption = {
  tooltip: {
    show: true,
  },
  grid: {},
}

const mockSeries = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const mockValues = [1830, 2800, 1800, 3300, 1600, 2950, 1850]

const axisChartOption = {
  xAxis: [
    {
      axisTick: false,
      type: 'category',
      data: mockSeries,
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#fff',
      },
    },
  ],
  yAxis: [
    {
      axisTick: false,
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#fff',
      },
      splitLine: {
        show: false,
      },
    },
  ],
}

ComponentCellEnum[ComponentTypeEnum.DV_ECHART_CELL].forEach((type) => {
  switch (type) {
    case ComponentEnum.DV_BAR:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'bar',
            data: mockValues,
          },
        ],
      }
      break
    case ComponentEnum.DV_BAR_STACK:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'bar',
            stack: 'stack',
            data: mockValues,
          },
          {
            type: 'bar',
            stack: 'stack',
            data: mockValues,
          },
        ],
      }
      break
    case ComponentEnum.DV_STRIP:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'bar',
            data: mockValues,
          },
        ],
      }
      reverseAxis(defaultOptionSetting[type])
      break
    case ComponentEnum.DV_STRIP_STACK:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'bar',
            stack: 'stack',
            data: mockValues,
          },
          {
            type: 'bar',
            stack: 'stack',
            data: mockValues,
          },
        ],
      }
      reverseAxis(defaultOptionSetting[type])
      break
    case ComponentEnum.DV_LINE:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'line',
            data: mockValues,
          },
        ],
      }
      break
    case ComponentEnum.DV_LINE_AREA:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'line',
            smooth: true,
            data: mockValues,
            areaStyle: {},
          },
        ],
      }
      break
    case ComponentEnum.DV_BIAXIAL:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        ...axisChartOption,
        series: [
          {
            type: 'bar',
            data: mockValues,
          },
          {
            type: 'line',
            smooth: true,
            data: mockValues,
            symbolSize: 0,
          },
        ],
      }
      break
    case ComponentEnum.DV_PIE:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            itemStyle: {
              label: {
                textStyle: {
                  color: '#fff',
                },
              },
            },
            data: [
              {
                name: 'A',
                value: mockValues[0],
              },
              {
                name: 'B',
                value: mockValues[1],
              },
              {
                name: 'C',
                value: mockValues[2],
              },
              {
                name: 'D',
                value: mockValues[3],
              },
            ],
          },
        ],
      }
      break
    case ComponentEnum.DV_RADAR:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        radar: {
          name: {
            textStyle: {
              color: '#fff',
            },
          },
          indicator: mockSeries.map((text) => {
            return {
              text,
              max: 3000,
            }
          }),
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: mockValues,
                areaStyle: {},
              },
            ],
          },
        ],
      }
      break
    case ComponentEnum.DV_FUNNEL:
      defaultOptionSetting[type] = {
        ...baseChartOption,
        series: [
          {
            type: 'funnel',
            data: [100, 80, 60, 40, 20].map((value, index) => {
              return {
                value,
                name: mockSeries[index],
              }
            }),
          },
        ],
      }
      break
    case ComponentEnum.DV_SCATTER:
      defaultOptionSetting[type] = {
        ...baseChartOption,
      }
      break
    case ComponentEnum.DV_HEATMAP:
      defaultOptionSetting[type] = {
        ...baseChartOption,
      }
      break
    case ComponentEnum.DV_TREE_MAP:
      defaultOptionSetting[type] = {
        ...baseChartOption,
      }
      break
    case ComponentEnum.DV_LIQUID_FILL:
      defaultOptionSetting[type] = {
        ...baseChartOption,
      }
      break
    case ComponentEnum.DV_WORD_CLOUD:
      defaultOptionSetting[type] = {
        ...baseChartOption,
      }
      break
    default:
      break
  }
})

export function reverseAxis(option) {
  const yAxis = option.xAxis
  option.xAxis = option.yAxis
  option.yAxis = yAxis
}

export { defaultOptionSetting }
