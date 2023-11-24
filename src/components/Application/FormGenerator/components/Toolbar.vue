<template>
  <div class="radio-group-button">
    <a-radio-group v-model:value="action">
      <a-radio-button v-for="btn in props.buttons" :key="btn.key" :value="btn.key">
        <Action :title="btn.name" @click="btn.event.click(getEventParameters(config))">
          <Icon :type="btn.icon" />
        </Action>
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script lang="ts" setup name="RadioButtonGroup">
  import { ref } from 'vue'

  const props = defineProps({
    config: {
      type: Object,
      required: true,
    },
    buttons: {
      type: Array,
      required: true,
    },
    getEventParameters: {
      type: Function,
      required: true,
    },
  })

  const action = ref('')

  const init = () => {
    const button = props.buttons[0]
    action.value = button.key
  }
  init()
</script>

<style lang="less" scoped></style>
