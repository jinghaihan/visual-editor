<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="`#${type}`" />
  </svg>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {}
    },
  })
</script>

<style lang="less" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
