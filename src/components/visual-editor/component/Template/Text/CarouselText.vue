<template>
  <div ref="container"
       class="visual-template-carouselText">
    <p class="text"
       :text="propsData.text"
       :style="propsData">
      {{propsData.text}}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      propsData: {
        text: '文本内容',
        color: '',
        fontSize: '',
        fontWeight: '',
        animation: 'CarouselText 4s linear infinite'
      },
      animation: {
        duration: 4
      }
    }
  },
  watch: {
    'animation.duration': {
      handler: function (value) {
        this.propsData.animation = `CarouselText ${value}s linear infinite`
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-carouselText{
    height: 100%;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    .text{
      position: relative;
      width: fit-content;
      padding-left: 20px;
    }
    .text::after{
      position: absolute; 
			right: -100%;
			content: attr(text);
    }
    
  }
</style>

<style>
  @keyframes CarouselText {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
