<template>
  <div class="color-picker">
    <a-popover
      :trigger="['click']"
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
      @open-change="onPopoverChange"
    >
      <div
        class="holder"
        :style="{ backgroundColor: type === 'rgba' ? getRgbaColor(color[type]) : color[type] }"
      >
      </div>
      <template #content>
        <Sketch v-model="color" />
      </template>
    </a-popover>
  </div>
</template>

<script lang="ts" setup name="ColorPicker">
  import { ref, watch } from 'vue'
  import { Sketch } from '@ckpack/vue-color'
  import { getRgbaColor } from '@/utils/style'

  const props = defineProps({
    config: {
      type: Object,
      required: true,
    },
    value: {
      type: null,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    setValue: {
      type: Function,
      required: true,
    },
    trigger: {
      type: String,
      required: false,
      default: 'change',
    },
  })

  const emits = defineEmits(['change'])

  const color = ref({})

  watch(
    color,
    () => {
      if (props.trigger === 'change') {
        onChange()
      }
    },
    { deep: true },
  )

  const init = () => {
    const data = {}
    data[props.type] = props.value
    color.value = data
  }
  init()

  function onChange() {
    props.setValue(color.value[props.type])
    emits('change')
  }

  function onPopoverChange(visible) {
    if (!visible && props.trigger === 'openChange') {
      onChange()
    }
  }
</script>

<style lang="less" scoped>
  .color-picker {
    .holder {
      cursor: pointer;
      height: 24px;
      width: 24px;
      border: 1px solid @selection-color;
      border-radius: 2px;
    }
  }
</style>
