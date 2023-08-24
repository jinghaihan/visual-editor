<template>
  <div ref="Container"
       class="visual-template-bloomText"
       :style="propsData">
    <p class="text">{{propsData.text}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      propsData: {
        text: '文本内容',
        primaryColor: '',
        deputyColor: '',
        fontSize: '',
        fontWeight: '',
        textAlign: 'center'
      }
    }
  },
  watch: {
    propsData: {
      deep: true,
      immediate: true,
      handler: function (value) {
        this.$refs.Container.style['background-image'] = `linear-gradient(to right,${value.primaryColor},${value.deputyColor})`
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-bloomText{
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: hidden;
    background-image: linear-gradient(to right,#ff69b3,#40e1d2);
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 100%; 
    animation: BloomText 4s linear infinite;
  }
</style>

<style>
  @keyframes BloomText{
    0% {
      background-position: 0  0;
    }
    100% {
      background-position: -100%  0;
    }
  }
</style>
