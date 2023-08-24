<template>
  <div class="visual-template-image">
    <img class="image"
         :src="data.props.image"
         :alt="data.name">
  </div>
</template>

<script>
export default {
  name: 'MediaImage',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-image{
    height: 100%;
    width: 100%;
    .image{
      height: 100%;
      width: 100%;
    }
  }
</style>
