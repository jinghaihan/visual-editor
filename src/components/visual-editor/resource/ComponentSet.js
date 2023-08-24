import { handleCellStyleConfig } from '../utils/hook'

class ComponentSet {
  constructor (options) {
    this.vm = options.vm

    this.current = null
    this.$event = {
      on: () => {},
      off: () => {}
    }

    let paper = this.vm.instance.getCurrentPaper()
    this.paper = {
      cells: {},
      activeCell: null,
      setCell: (data) => {
        this.paper.cells[data.key] = data.cell
      }
    }
    this.proxyPaper(paper)

    this.proxyHack()
  }
  getCurrentPaper () {
    return this.paper
  }
  async renderComponentSetCells (data) {
    let { config, layout, view } = data

    this.vm.layout.push({ ...view })
    await this.vm.$nextTick()

    setTimeout(() => {
      let conf = {}
      conf[config.id] = config

      handleCellStyleConfig({
        cell: this.paper.cells[config.id],
        config: conf,
        key: config.id,
        layout
      })
    }, 0)
  }
  clearCellCache (layout) {
    if (layout && layout.length) {
      let keys = layout.map(page => page.key)
      Object.keys(this.vm.componentSetInstance.paper.cells).forEach(key => {
        if (!keys.includes(key)) {
          delete this.vm.componentSetInstance.paper.cells[key]
        }
      })
    }
  }
  proxyPaper (paper) {
    const attr = ['getTheme', 'handleThemeDefaultValue']

    attr.forEach(key => {
      this.paper[key] = paper[key].bind(paper)
    })
  }
  proxyHack () {
    if (Object.getPrototypeOf(this.vm.instance).constructor.name === 'Editor') {
      Object.keys(this.vm.instance.hack).forEach(key => {
        this[key] = this.vm.instance.hack[key]
      })
    }
  }
}

export default ComponentSet
