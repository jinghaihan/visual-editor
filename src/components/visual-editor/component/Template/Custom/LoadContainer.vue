<template>
  <div class="visual-template-loadcontainer">
    <div class="loading-container"
         v-if="!componentName">
      <dv-loading class="loading">Loading...</dv-loading>
    </div>

    <div class="component-container" v-else>
      <component ref="Component"
                 :is="componentName"
                 v-bind="propsData"
                 v-on="eventCallback">
      </component>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'

export default {
  name: 'LoadContainer',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      componentName: null,
      propsData: {},
      eventCallback: {}
    }
  },
  methods: {
    registerComponent (name, component) {
      this.componentName = name

      Vue.component(name, component)
    },
    onResize () {
      try {
        this.$refs.Component.onResize()
      } catch (error) {
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-loadcontainer{
    height: 100%;
    width: 100%;
    .loading-container{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .component-container{
      height: 100%;
      width: 100%;
    }
  }
</style>
