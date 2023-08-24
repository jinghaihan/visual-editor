<template>
  <a-modal
    :visible="true"
    @cancel="closeModal()"
    :maskClosable="false"
    :keyboard="false"
    :width="900"
    :footer="null"
    :title="modalTitle"
    :getContainer="getContainer()"
    wrapClassName="visual-editor-modal"
  >
    <div class="content">
      <textarea ref="textarea"></textarea>
    </div>
  </a-modal>
</template>

<script>
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/nord.css'

export default {
  props: {
    modalTitle: {
      type: String,
      required: false,
      default: '查看源码'
    },
    code: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let _this = this
      await _this.$nextTick()

      _this.cm = CodeMirror.fromTextArea(_this.$refs.textarea, {
        lineNumbers: true,
        theme: 'nord'
      })
      _this.cm.setSize('100%', '100%')
      _this.cm.setOption('readOnly', true)
      _this.cm.setOption('value', JSON.stringify(JSON.parse(this.code), null, '\t'))
      _this.cm.refresh()
    },
    closeModal () {
      this.$emit('close')
    },
    getContainer () {
      return () => document.getElementById('visual-editor-container') || document.body
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-modal-body{
    padding: 0;
    .content{
      height: 600px;
    }
  }
</style>
