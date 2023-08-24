<template>
  <div class="visual-template-tabContainer">
    <a-tabs v-if="layout.length"
            v-bind="propsData"
            @change="onChange">
      <a-tab-pane v-for="page in layout"
                  :key="page.key"
                  :tab="page.name"
                  forceRender>
        <Renderer :instance="componentSetInstance"
                  :data="page">
        </Renderer>
      </a-tab-pane>
    </a-tabs>

    <div class="empty-container" v-else>
      <a-empty description="请选择轮播图表"></a-empty>
    </div>
  </div>
</template>

<script>
import ComponentSet from '../../../resource/ComponentSet'

export default {
  name: 'TabContainer',
  props: {
    data: {
      type: Object,
      required: true
    },
    instance: {
      type: Object,
      required: true
    }
  },
  components: {
    Renderer: () => import('../../Render/renderer.vue')
  },
  watch: {
    propsData: {
      immediate: true,
      handler: function (config) {
        this.handleComponents(config.components)
      }
    }
  },
  data () {
    return {
      componentSetInstance: {},
      propsData: {
        hideAdd: true,
        size: 'default',
        tabPosition: 'top',
        type: 'line',
        tabBarGutter: 0,
        components: []
      },
      layout: []
    }
  },
  created () {
    this.initComponentSetInstance()
  },
  methods: {
    initComponentSetInstance () {
      this.componentSetInstance = new ComponentSet({
        vm: this
      })
    },
    handleComponents (components) {
      if (!components || !components.length) {
        this.layout = []
        return
      }

      let layout = []
      components.forEach(item => {
        if (item.value) {
          let comp = JSON.parse(item.value)
          layout.push({
            name: item.name,
            key: item.key,
            componentType: comp.componentType,
            type: comp.type,
            component: comp.component,
            props: {}
          })
        }
      })

      if (!this.componentSetInstance.paper.activeCell) {
        this.componentSetInstance.paper.activeCell = layout.length ? layout[0].key : null
      }

      this.componentSetInstance.clearCellCache(layout)

      this.layout = layout
    },
    onResize () {
      try {
        let cells = Object.values(this.componentSetInstance.paper.cells)
        cells.forEach(cell => {
          cell.resize()
        })
      } catch (error) {

      }
    },
    onChange (activeKey) {
      this.componentSetInstance.paper.activeCell = activeKey

      setTimeout(() => { this.onResize() }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-tabContainer{
    height: 100%;
    width: 100%;
    /deep/.ant-tabs{
      height: 100%;
      .ant-tabs-bar{
        margin: 0;
      }
      .ant-tabs-content{
        height: calc(~"100% - 45px");
      }
    }
    .empty-container{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
