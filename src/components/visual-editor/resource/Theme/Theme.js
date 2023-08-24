class Theme {
  constructor (option) {
    this.vm = option.vm

    this.global = {
      backgroundColor: '#fff'
    }
    this.chart = {
      theme: 'default', // Chart主题
      fontColor: { // 字体颜色
        isColor: true,
        value: '#333',
        keys: [
          'xAxis-axisLine-lineStyle-color/yAxis-axisLine-lineStyle-color',
          'legend-textStyle-color',
          'title-textStyle-color',
          'series-label-color',
          'series-detail-color',
          'series-axisTick-lineStyle-color',
          'series-axisLabel-color',
          'radar-axisName-color'
        ]
      }
    }
  }
  changeTheme (options) {
    this.vm.triggerCellDeactive()

    // 背景颜色
    this.global.backgroundColor = options.backgroundColor
    this.vm.configData.paper.backgroundColor = { hex: this.global.backgroundColor }
    this.vm.onPaperBackgroundChange({
      type: 'color',
      color: {
        hex: this.global.backgroundColor
      }
    })

    // Chart
    this.chart.theme = options.chartTheme
    this.chart.fontColor.value = options.fontColor

    // 改变当前画布元素相关属性
    Object.keys(this.vm.cells).forEach(key => {
      let cell = this.vm.cells[key]

      switch (cell.componentType) {
        case 'chart':
          // 主题
          let obj = cell.configData.styleConfig.formData
          obj.theme = this.chart.theme

          // 字体颜色
          this.chart.fontColor.keys.forEach(key => {
            if (obj[key]) {
              obj[key] = { hex: this.chart.fontColor.value }
            }
          })
          break
        default:
          break
      }

      cell.update()
    })
  }
  getTheme (type, attr) {
    let data = this[type][attr]
    return data instanceof Object ? data.value : data
  }

  handleThemeDefaultValue (config, cell) {
    switch (cell.componentType) {
      case 'chart':
        if (config.key === 'theme') {
          config.defaultValue = this.chart.theme
        }

        let keys = Object.keys(this.chart)

        for (let i = 0; i < keys.length; i++) {
          let key = keys[i]
          let conf = this.chart[key]
          if (conf instanceof Object) {
            if (conf.keys.includes(config.key)) {
              config.defaultValue = conf.isColor ? { hex: conf.value } : conf.value
              return
            }
          }
        }
        break
      default:
        break
    }
  }
}

export default Theme
