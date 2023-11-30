<template>
  <span>{{ config.label }}</span>

  <template v-if="config.meta">
    <!-- button -->
    <template v-for="metaInfo in config.meta" :key="metaInfo.key">
      <a-button
        class="label-meta-item"
        v-if="metaInfo.type === 'button'"
        v-bind="metaInfo.props"
        @click="metaInfo.event.click(getEventParameters(config))"
      >
        {{ metaInfo.props.name }}
      </a-button>
    </template>
  </template>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'FormGeneratorLabelMeta',
    props: {
      config: {
        type: Object,
        required: true,
      },
      getEventParameters: {
        type: Function,
        required: true,
      },
    },
    setup() {
      return {}
    },
  })
</script>

<style lang="less" scoped>
  .label-meta-item {
    margin-left: 1rem;
  }
</style>
