<template>
  <a-tooltip v-bind="propsData">
    <template #title>{{ title }}</template>
    <div class="action">
      <slot></slot>
    </div>
  </a-tooltip>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Action',
    props: {
      title: {
        type: String,
        required: true,
      },
      propsData: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    setup() {
      return {}
    },
  })
</script>

<style lang="less" scoped>
  .action {
    height: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
  }

  .action:hover {
    transition: background-color, 0.3s;
    background-color: @selection-color;
    color: @foreground-color;
    filter: brightness(150%);
  }
</style>
