import _ from 'lodash'
import * as Echarts from 'echarts'

import Setting from '../../../config/setting'
import * as ChartOption from './config/DefaultOption'
import FormModelConfig from './config/FormModel'

import { transferUpperCamelCase } from '../../../utils'
import { filterConfigData } from '../../../utils/hook'

// Echarts主题
import 'echarts/theme/macarons'
import 'echarts/theme/infographic'
import 'echarts/theme/shine'
import 'echarts/theme/roma'

// Echarts地图
import china from '../../../assets/map/china.json'
Echarts.registerMap('china', china)
class Chart {
  constructor (option) {
    this.componentType = 'chart'
    this.type = option.type
    this.name = option.name

    this.vm = option.vm
    this.key = option.key

    this.chart = null

    this.defaultOption = this.getDefaultOption('default')
    this.option = option.option || _.cloneDeep(this.defaultOption)
    this.formModelConfig = this.getFormModelConfig()
    
    // 获取当前默认主题
    let paper = this.vm.instance.getCurrentPaper()
    this.theme = option.theme || paper.getTheme('chart', 'theme')

    this.axisFlip = option.axisFlip || false
    this.configData = option.configData || {
      styleConfig: {
        formData: {
          cellName: this.name,
          theme: this.theme
        }
      }
    }
    
    this.init()

    this.update = _.debounce(this.update, Setting.debounceInterval)
  }
  init () {
    this.chart = Echarts.init(this.vm.$refs.Component, this.configData.styleConfig.formData.theme)
    this.update()
  }
  changeTheme () {
    if (this.chart) {
      this.chart.dispose()
    }
  
    this.chart = Echarts.init(this.vm.$refs.Component, this.configData.styleConfig.formData.theme)
  
    this.theme = this.configData.styleConfig.formData.theme
  }
  update () {
    if (this.theme !== this.configData.styleConfig.formData.theme) {
      this.changeTheme()
    }
    const whiteList = [
      'theme',
      'zIndex',
      'cellName',
      'cellX',
      'cellY',
      'cellWidth',
      'cellHeight',
      'lockAspectRatio'
    ]

    let configData = filterConfigData(this.configData.styleConfig.formData, whiteList)
    let option = this.handleOption(configData)

    this.option = option
    this.chart.setOption(this.option, true)
  }
  resize () {
    this.chart.resize()
  }
  onConfigDataChange (key, data) {
    this.configData[key] = data
    this.configData = _.cloneDeep(this.configData)
  }
  getOption () {
    return _.cloneDeep(this.option)
  }
  getDefaultOption (type) {
    return _.cloneDeep(ChartOption[transferUpperCamelCase(this.type) + 'Options'][type])
  }
  getFormModelConfig () {
    return _.cloneDeep(FormModelConfig[transferUpperCamelCase(this.type)])
  }

  handleOption (configData) {
    const whiteList = [
      'dataZoomX',
      'dataZoomXHeight',
      'dataZoomY',
      'dataZoomXWidth',
      'axisFlip',
      'radius',
      'radiusInner',
      'radiusOuter'
    ]

    let option = { ...this.option }
    let list = Object.keys(configData)

    list.forEach(key => {
      if (whiteList.includes(key)) return
      let keys = key.split('/').map(item => item.split('-'))
      let values = typeof configData[key] === 'string' && configData[key].includes('/') 
        ? configData[key].split('/') : [configData[key]]
      if (values.length < keys.length) {
        for (let i = 0; i < keys.length - values.length; i++) {
          values.push(configData[key])
        }
      }
      keys.forEach((item, index) => {
        recursiveOptions(item, option, values[index])
      })
    })

    function recursiveOptions (keys, option, data) {
      let key = keys[0]
      if (!option[key]) {
        option[key] = {}
      } else {
        if (option[key] instanceof Array) {
          keys.splice(0, 1)
          option[key].forEach(item => {
            recursiveOptions(keys, item, data)
          })
          return
        }
      }
      keys.splice(0, 1)
      if (keys.length) {
        recursiveOptions(keys, option[key], data)
      } else {
        if (data || data === 0 || typeof data === 'boolean') {
          if (key.match(/\?percent/g)) {
            key = key.replace(/\?percent/g, '')
            option[key] = data + '%'
          } else {
            if (data.hex) {
              option[key] = data.hex
            } else {
              option[key] = data
            }
  
            if (typeof data === 'string' && data.match(/\?boolean/g)) {
              option[key] = data.replace(/\?boolean/g, '') === 'true'
            }
          }
        } else {
          delete option[key]
        }
      }
    }

    this.handleDataZoomOption({
      configData,
      option 
    })
    this.handleAxisFlipOption({
      configData,
      option
    })
    this.handleRadiusOption({
      configData,
      option
    })
    this.handleUnuseOption({
      option
    })

    return option
  }
  handleDataZoomOption (data) {
    let option = data.option
    let configData = data.configData

    delete option.dataZoom

    if (configData.dataZoomX) {
      if (!option.dataZoom) option.dataZoom = []
      option.dataZoom.push({
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none',
        height: configData.dataZoomXHeight || 15
      })
      option.dataZoom.push({
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none'
      })
    }

    if (configData.dataZoomY) {
      if (!option.dataZoom) option.dataZoom = []
      option.dataZoom.push({
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none',
        width: configData.dataZoomXWidth || 15
      })
      option.dataZoom.push({
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none'
      })
    }
  }
  handleAxisFlipOption (data) {
    let option = data.option
    let configData = data.configData

    if (configData.axisFlip || typeof configData.axisFlip === 'boolean') {
      if (configData.axisFlip !== this.axisFlip && typeof this.axisFlip === 'boolean') {
        let xAxis = option.yAxis
        let yAxis = option.xAxis
        option.xAxis = xAxis
        option.yAxis = yAxis
      }
      this.axisFlip = configData.axisFlip
    }
  }
  handleRadiusOption (data) {
    let option = data.option
    let configData = data.configData

    if (configData.radius) {
      option.series.forEach(item => {
        item.radius = configData.radius + '%'
      })
    }
    if (configData.radiusInner && configData.radiusOuter) {
      option.series.forEach(item => {
        item.radius = [configData.radiusInner + '%', configData.radiusOuter + '%']
      })
    }
  }
  handleUnuseOption (data) {
    let _this = this

    let option = data.option
    let collapseKeys = _this.configData.styleConfig.collapseKeys || []

    _this.formModelConfig['collapseForm'].forEach(collapse => {
      if (collapse.key && !collapseKeys.includes(collapse.key) && collapse.switch) {
        delete option[collapse.key]
        handleMapDefaultOption(collapse.key)
      }
    })
  
    function handleMapDefaultOption (key) {
      const mapDefaultConfigKeys = [
        'map-geo-label',
        'map-geo-itemStyle',
        'map-geo-emphasis',
        'map-series-label',
        'map-series-itemStyle',
        'map-series-emphasis'
      ]

      if (mapDefaultConfigKeys.includes(key)) {
        switch (key) {
          case 'map-geo-label':
            option.geo.label = _.cloneDeep(_this.defaultOption.geo.label)
            break
          case 'map-geo-itemStyle':
            option.geo.itemStyle = _.cloneDeep(_this.defaultOption.geo.itemStyle)
            break
          case 'map-geo-emphasis':
            option.geo.emphasis = _.cloneDeep(_this.defaultOption.geo.emphasis)
            break
          case 'map-series-label':
            option.series.forEach(item => {
              item.label = _.cloneDeep(_this.defaultOption.series[0].label)
            })
            break
          case 'map-series-itemStyle':
            option.series.forEach(item => {
              item.itemStyle = _.cloneDeep(_this.defaultOption.series[0].itemStyle)
            })
            break
          case 'map-series-emphasis':
            option.series.forEach(item => {
              item.emphasis = _.cloneDeep(_this.defaultOption.series[0].emphasis)
            })
            break
          default:
            break
        }
      }
    }
  }
}

export default Chart
