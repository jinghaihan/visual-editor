<template>
  <div class="visual-template-decoration">
    <component :is="getComponent()"
               v-bind="propsData"
               ref="Decoration">
    </component>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Decoration',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      propsData: _.cloneDeep(this.data.props) || {}
    }
  },
  methods: {
    getComponent () {
      return this.data.type.replace('-reverse', '')
    },
    onResize () {
      try {
        this.$refs.Border.initWH()
      } catch (error) {
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-decoration{
    height: 100%;
    width: 100%;
  }
</style>
