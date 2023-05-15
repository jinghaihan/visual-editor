<template>
  <VisualEditor :service="service"
                :plugin="plugin">
  </VisualEditor>
</template>

<script>
import VisualComponent from '@/components/visual-editor'
import DataConfigurator from '@/components/configurator'

export default {
  components: {
    VisualEditor: VisualComponent.VisualEditor
  },
  data () {
    return {
      service: DataConfigurator.service,
      plugin: DataConfigurator.component
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
