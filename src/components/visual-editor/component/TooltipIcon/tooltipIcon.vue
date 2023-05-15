<template>
  <a-tooltip :placement="placement">
    <template slot="title">
      {{title}}
    </template>
    <a-icon class="icon"
            :type="type"
            @click="$emit('click')">
    </a-icon>
  </a-tooltip>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      required: false,
      default: 'top'
    },
    theme: {
      type: String,
      required: false,
      default: 'outlined'
    }
  }
}
</script>

<style lang="less" scoped>
  .icon{
    cursor: pointer;
  }
</style>
