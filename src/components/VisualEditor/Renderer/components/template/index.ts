import DvEchart from './DvEchart/index.vue'
import DvClock from './DvClock/index.vue'
import DvStatistic from './DvStatistic/index.vue'
import Dv3dScene from './Dv3dScene/index.vue'
import DvGisScene from './DvGisScene/index.vue'

const ComponentTemplate = {
  DvEchart,
  DvClock,
  DvStatistic,
  Dv3dScene,
  DvGisScene,
}

const ComponentStyleFormConfig = {}
Object.keys(ComponentTemplate).forEach((component) => {
  let module
  try {
    module = require(`./${component}/config.ts`)
  } catch (error) {}

  if (module) {
    ComponentStyleFormConfig[component] = module.config
  }
})

export { ComponentTemplate, ComponentStyleFormConfig }
