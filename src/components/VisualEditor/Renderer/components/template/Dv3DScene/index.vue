<template>
  <div ref="Scene" class="visual-dv-3d-scene" :id="`visual-dv-3d-scene-${config.key}`"> </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'VisualDv3dScene',
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
  .visual-dv-3d-scene {
    height: 100%;
    width: 100%;
  }
</style>
