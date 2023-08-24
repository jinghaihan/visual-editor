<template>
  <a-modal
    :visible="true"
    @cancel="closeModal()"
    @ok="onSubmit"
    :maskClosable="false"
    :keyboard="false"
    :width="500"
    title="主题库"
    :getContainer="getContainer()"
    wrapClassName="visual-editor-modal"
  >
		<FormGenerator ref="Form"
                   configKey="theme"
                   :config="config"
                   @change="onChange">
    </FormGenerator>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import FormGenerator from '../../FormGenerator/formModel.vue'

const config = [
  {
    type: 'select',
    label: '主题',
    key: 'theme',
    defaultValue: undefined,
    props: {
      options: [
        {
          label: '默认主题',
          value: JSON.stringify({
            backgroundColor: '#fff',
            chartTheme: 'default',
            fontColor: '#333'
          })
        },
        {
          label: '可视化大屏主题',
          value: JSON.stringify({
            backgroundColor: '#0E1B27',
            chartTheme: 'roma',
            fontColor: '#fff'
          })
        }
      ]
    },
    layout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
  }
]

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: { FormGenerator },
  data () {
    return {
      config,
      formData: null,
      themeOptions: []
    }
  },
  methods: {
    onSubmit () {
      let paper = this.editor.getCurrentPaper()
      paper.changeTheme(JSON.parse(this.formData.theme))

      this.closeModal()
    },
    onChange (data) {
      this.formData = _.cloneDeep(data.formData)
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
