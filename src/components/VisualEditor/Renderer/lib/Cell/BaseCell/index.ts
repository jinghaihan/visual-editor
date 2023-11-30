import { cloneDeep, capitalize, debounce } from 'lodash-es'
import { VisualAdapter } from '@/components/VisualEditor/Editor/lib/Adapter'
import { VisualPaper } from '@/components/VisualEditor/Editor/lib/Paper'
import { Setting as ComponentSetting } from '../../../setting'
import { ComponentStyleFormConfig } from '../../../components/template'
import { FormGeneratorConfig } from '@/components/Application/FormGenerator/model'

interface ConfigData {
  name: string
  style: Record<string, any>
  event: any[]
  animate: any[]
}

export class BaseCell extends VisualAdapter {
  public key: string
  public type: string
  public paper: VisualPaper

  public configData: ConfigData
  public componentSetting: any
  public styleFormConfig: FormGeneratorConfig[]

  constructor(option) {
    super(option)

    this.key = option.key
    this.type = option.type
    this.paper = option.paper
    this.configData = {
      name: option.name,
      style: {},
      event: [],
      animate: [],
    }

    this.componentSetting = cloneDeep(ComponentSetting)
    this.styleFormConfig = this.getStyleFormConfig()

    this.update = debounce(this.update, this.setting.debounceSetting.interval)
    this.resize = debounce(this.resize, this.setting.debounceSetting.interval)
  }

  resize() {
    const component = this.getComponentRef()
    if (component && 'resize' in component) {
      component.resize()
    }
  }

  update(key, value) {
    const prev = cloneDeep(this.configData[key])

    const diff = this.$formTransfer.getDiff(prev, value)

    this.configData[key] = value
    this.updateHandler(diff)
  }

  updateHandler(_diff) {
    const component = this.getComponentRef()
    component.propsData = cloneDeep(this.configData.style)
  }

  getComponentRef() {
    return this.$instance.getRefs('Renderer').Component
  }

  getStyleFormConfig() {
    const key = this.type
      .split('-')
      .map((str) => capitalize(str))
      .join('')
    return cloneDeep(ComponentStyleFormConfig[key])
  }

  getStyleFormDefaultValue() {
    const config = {}
    if (this.styleFormConfig) {
      return this.$formTransfer.getDefaultValue(this.styleFormConfig)
    }
    return config
  }
}
