<template>
  <a-drawer
    :visible="true"
    @close="closeModal()"
    :maskClosable="true"
    :keyboard="false"
    :width="260"
    title="组件配置"
    :getContainer="getContainer()"
    wrapClassName="visual-editor-drawer"
  >
    <ComponentPanel :editor="modalData.instance"
                    :activeCell="modalData.instance.paper.activeCell"
                    :ignoreGlobalConfig="true">
    </ComponentPanel>
  </a-drawer>
</template>

<script>
import ComponentPanel from '../ConfigPanel/componentPanel.vue'

export default {
  name: 'ComponentDrawer',
  props: {
    modalData: {
      type: Object,
      required: true
    }
  },
  components: { ComponentPanel },
  methods: {
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
  /deep/.ant-drawer-body{
    padding: 0;
  }
</style>
