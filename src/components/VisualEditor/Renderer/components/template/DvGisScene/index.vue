<template>
  <div
    ref="Scene"
    class="visual-dv-gis-scene"
    :id="`visual-dv-gis-scene-${config.key}`"
    :style="{
      transform: `scale(${1 / scale})`,
      width: config.w * scale + 'px',
      height: config.h * scale + 'px',
      'transform-origin': 'left top',
    }"
  >
  </div>
</template>

<script lang="ts">
  import { ref, onBeforeUnmount, defineComponent } from 'vue'

  export default defineComponent({
    name: 'VisualDvGisScene',
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
    setup(props) {
      const scale = ref(props.paper.configData.variable.scale)

      props.paper.$event.on('notifyScaleChange', props.config.key, (message) => {
        const { scale: scaleValue } = message
        scale.value = scaleValue
      })

      onBeforeUnmount(() => {
        props.paper.$event.off('notifyScaleChange', props.config.key)
      })

      return {
        scale,
      }
    },
  })
</script>

<style lang="less" scoped>
  .visual-dv-gis-scene {
    height: 100%;
    width: 100%;
  }
</style>
