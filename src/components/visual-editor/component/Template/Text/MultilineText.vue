<template>
  <div class="visual-template-text"
       :style="propsData">
    {{propsData.text}}
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
        textAlign: 'center'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-text{
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: hidden;
  }
</style>
