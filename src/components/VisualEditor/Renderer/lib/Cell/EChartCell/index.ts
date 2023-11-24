import * as Chart from 'echarts'
import { BaseCell } from '../BaseCell'

export class EchartCell extends BaseCell {
  public chart: Chart.ECharts | null
  public defaultOption: Chart.EChartsOption | null
  public option: Chart.EChartsOption | null

  constructor(option) {
    super(option)

    this.chart = null
    this.defaultOption = this.getDefaultOption()
    this.option = null
  }

  init() {
    const el = this.getComponentRef().$refs.Chart
    this.chart = Chart.init(el)
    this.setOption(this.defaultOption)
  }

  resize() {
    if (this.chart) {
      this.chart.resize()
    }
  }

  setOption(option) {
    if (this.chart) {
      this.chart.setOption(option, true)
      this.option = option
    }
  }

  getDefaultOption() {
    return this.componentSetting.echart.defaultOptionSetting[this.type]
  }
}
