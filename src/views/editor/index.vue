<template>
  <VisualEditor
    v-bind="VisualEditorPlugins"
    @save="onSave">
  </VisualEditor>
</template>

<script>
import VisualComponent from '@/components/visual-editor'
import VisualEditorPlugins from '@/components/visual-editor-plugins'

export default {
  components: {
    VisualEditor: VisualComponent.VisualEditor
  },
  data () {
    return {
      VisualEditorPlugins
    }
  },
  methods: {
    onSave (config) {
      console.log('onSave', config)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
