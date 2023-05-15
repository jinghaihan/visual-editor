<template>
  <div class="visual-editor-auxiliarypanel-container">
    <FormGenerator ref="Form"
                   configKey="auxiliary"
                   :config="this.editor.config.formModel.auxiliary"
                   @change="onChange"
                   @notify-event="onNotify">
    </FormGenerator>
  </div>
</template>

<script>
import FormGenerator from '../../FormGenerator/formModel.vue'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    FormGenerator
  },
  data () {
    return {}
  },
  created () {
    this.editor.setInstance({ key: 'auxiliaryPanel', vm: this })
  },
  methods: {
    onChange (data) {
      let paper = this.editor.getCurrentPaper()
      paper.setConfigData(data)

      paper.handleAuxiliary()
    },
    onNotify (message) {
      let paper = this.editor.getCurrentPaper()
      paper[message.key](message.data)
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-auxiliarypanel-container{
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    color: var(--font-color);
  }
</style>
