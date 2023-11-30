<template>
  <div
    class="visual-ScreenAdapter"
    :style="{
      width: adapterState.width + 'px',
      height: adapterState.height + 'px',
    }"
    @wheel="changeScale"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
  >
    <div
      class="visual-Scalebox"
      :style="{
        width: adapterConfig.width + 'px',
        height: adapterConfig.height + 'px',
        transform: `scale(${adapterConfig.scale}) translate(-50%, -50%)`,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup Name="VisualScreenAdapter">
  import {
    onMounted,
    onBeforeUnmount,
    ref,
    nextTick,
    getCurrentInstance,
    ComponentInternalInstance,
  } from 'vue'
  import { debounce } from 'lodash-es'
  import { useResizeObserver } from '@vueuse/core'

  const props = defineProps({
    paper: {
      type: Object,
      required: true,
    },
    paperRef: {
      type: Object,
      required: true,
    },
    adapterConfig: {
      type: Object,
      required: true,
    },
    draggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    resizable: {
      type: Boolean,
      required: false,
      default: false,
    },
    padding: {
      type: Number,
      required: false,
      default: 0,
    },
  })

  const emits = defineEmits(['drag'])

  const calculateScale = debounce(() => {
    try {
      const { proxy } = props.paperRef
      const paperRect = proxy.$el.getBoundingClientRect()

      const { width, height } = paperRect
      if (!width || !height) {
        return
      }
      adapterState.value.width = width
      adapterState.value.height = height

      const w = (width - props.padding * 2) / props.adapterConfig.width
      const h = (height - props.padding * 2) / props.adapterConfig.height
      const scale = w < h ? w : h

      if (!Number.isNaN(scale)) {
        props.paper.changeScale(Number(scale.toFixed(2)))
      }
    } catch (error) {}
  }, 100)

  function changeScale(e) {
    if (props.resizable) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const scale = parseFloat(
          Math.max(
            props.paper.setting.scaleSetting.step,
            props.adapterConfig.scale - e.deltaY / 500,
          ).toFixed(2),
        )

        props.paper.changeScale(scale)
      }
    }
  }

  const adapterState = ref({
    width: props.adapterConfig.width,
    height: props.adapterConfig.height,
  })

  const instance = getCurrentInstance() as ComponentInternalInstance
  props.paper.$instance.set('ScreenAdapter', {
    instance,
    calculateScale,
  })

  /**
   * life cycle
   */
  onMounted(() => {
    props.paper.addEventListener('mouseup', onMouseUp)

    nextTick(() => {
      const { proxy } = props.paperRef
      useResizeObserver(proxy.$el, () => {
        calculateScale()
      })
      calculateScale()
    })
  })

  onBeforeUnmount(() => {
    props.paper.removeEventListener('mouseup')
  })

  /**
   * drag container move canvas paper
   */
  const dragPos = {
    startX: undefined as number | undefined,
    startY: undefined as number | undefined,
    paperX: undefined as number | undefined,
    paperY: undefined as number | undefined,
  }

  function onMouseUp() {
    dragPos.startX = undefined
    dragPos.startY = undefined
    dragPos.paperX = undefined
    dragPos.paperY = undefined
  }

  function onMouseDown(event) {
    if (props.draggable) {
      dragPos.startX = event.clientX
      dragPos.startY = event.clientY

      dragPos.paperX = props.adapterConfig.x
      dragPos.paperY = props.adapterConfig.y
    }
  }

  function onMouseMove(event) {
    if (dragPos.startX !== undefined && dragPos.startY !== undefined) {
      const currentX = event.clientX
      const currentY = event.clientY

      const diffX = currentX - dragPos.startX
      const diffY = currentY - dragPos.startY

      emits('drag', {
        startX: dragPos.paperX,
        startY: dragPos.paperY,
        diffX,
        diffY,
      })
    }
  }
</script>

<style lang="less" scoped>
  .visual-ScreenAdapter {
    position: relative;
    cursor: grab;

    .visual-Scalebox {
      position: absolute;
      left: 50%;
      top: 50%;
      transform-origin: 0 0;
      transition: all 0.3s;
    }
  }
</style>
