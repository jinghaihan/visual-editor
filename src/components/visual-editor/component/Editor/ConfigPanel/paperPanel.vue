<template>
  <div class="visual-editor-basicpanel-container">
    <FormGenerator ref="Form"
                   configKey="paper"
                   :config="this.editor.config.formModel.paper"
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
    this.editor.setInstance({ key: 'paperPanel', vm: this })
  },
  methods: {
    onChange (data) {
      let paper = this.editor.getCurrentPaper()
      paper.setConfigData(data)
    },
    onNotify (message) {
      let paper = this.editor.getCurrentPaper()
      paper[message.key](message.data)
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-basicpanel-container{
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    color: var(--font-color);
  }
</style>
