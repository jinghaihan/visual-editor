<template>
  <div class="visual-template-digitalFlop">
    <dv-digital-flop ref="DigitalFlop"
                     v-bind="{
                      config: {
                        ...propsData,
                        style: {
                          fontSize: propsData.fontSize,
                          stroke: propsData.fill,
                          fill: propsData.fill
                        }
                      }
                     }"
                     :style="{
                      width: '100%',
                      height: '100%',
                     }" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      propsData: {
        number: [100],
        toFixed: 0,
        content: '',
        fill: '#3de7c9',
        fontSize: 30
      }
    }
  },
  methods: {
    onResize () {
      try {
        this.$refs.DigitalFlop.initWH()
      } catch (error) {
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-digitalFlop{
    height: 100%;
    width: 100%;
  }
</style>
