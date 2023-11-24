<template>
  <div ref="Chart" class="visual-dv-echart" :id="config.key"></div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'VisualDvEchart',
    props: {
      paper: {
        type: Object,
        required: true,
      },
      config: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {}
    },
  })
</script>

<style lang="less" scoped>
  .visual-dv-echart {
    height: 100%;
    width: 100%;
  }
</style>
