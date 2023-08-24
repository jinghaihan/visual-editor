import DatasourceFormPanel from './configurator/FormPanel/DatasourceFormPanel.vue'
import BuiltinModal from './configurator/BuiltinModal'

import Config from './resource/Config/Config'

import service from './service'
import { getModelOptions } from './utils'

export default {
  plugin: {
    DatasourceFormPanel,
    BuiltinModal
  },
  hack: {
    ...service,
    datasourceType: 'multiple',
    getModelOptions
  },
  resource: {
    Config
  }
}
