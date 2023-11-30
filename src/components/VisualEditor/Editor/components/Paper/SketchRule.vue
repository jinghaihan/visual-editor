<template>
  <div
    class="visual-sketch-rule"
    :style="{
      width: state.size + 'px',
    }"
  >
    <SketchRule
      v-bind="{
        ...state,
        width: state.size,
        height: state.size,
      }"
    />

    <div
      class="visual-sketch-rule-content"
      :style="{
        position: 'absolute',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup name="VisualSketchRule">
  import { computed } from 'vue'
  import SketchRule from 'vue3-sketch-ruler/lib/index.es'

  const props = defineProps({
    adapterConfig: {
      type: Object,
      required: true,
    },
    thick: {
      type: Number,
      required: false,
      default: 20,
    },
  })

  const state = computed(() => {
    return {
      thick: props.thick,
      // scale: props.adapterConfig.scale,
      cornerActive: true,
      startX: 0,
      startY: 0,
      horLineArr: [],
      verLineArr: [],
      width: props.adapterConfig.width,
      height: props.adapterConfig.height,
      // size: 10000,
      size:
        props.adapterConfig.width < props.adapterConfig.height
          ? props.adapterConfig.height
          : props.adapterConfig.width,
    }
  })
</script>

<style lang="less" scoped>
  .visual-sketch-rule {
    position: absolute;
    aspect-ratio: 1;

    .visual-sketch-rule-content {
      overflow: hidden;
    }

    :deep(.mb-ruler) {
      .h-container,
      .v-container {
        z-index: 1000;
      }
      .line,
      .indicator {
        z-index: 1000;
        border-color: @primary-color !important;
      }
      .indicator .value {
        background: @background-light-color;
        color: @green-color;
      }
      .action {
        color: @green-color;
      }
    }
  }
</style>
