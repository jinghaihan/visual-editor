<template>
  <div class="visual-dv-statistic">
    <a-statistic
      v-bind="{
        title: '流水金额',
        value: 258888,
        precision: 0,
      }"
    />
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue'

  export default defineComponent({
    name: 'VisualDvStatistic',
    setup() {
      const propsData = ref({})

      return {
        propsData,
      }
    },
  })
</script>

<style lang="less" scoped>
  .visual-dv-statistic {
    height: 100%;
    width: 100%;
    font-size: 36px;

    :deep(.@{ant-prefix}-statistic) {
      height: 100%;
      width: 100%;
      font-size: inherit;
      color: @primary-color;

      &-title {
        font-size: 0.5em;
        color: inherit;
      }

      &-content {
        font-size: 1em;
        color: inherit;
      }
    }
  }
</style>
