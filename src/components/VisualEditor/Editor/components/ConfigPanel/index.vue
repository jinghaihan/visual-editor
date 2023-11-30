<template>
  <div :class="`${prefixCls}-ConfigPanel`">
    <!-- global config panel -->
    <GlobalPanel v-show="activeKey === 'global'" :editor="props.editor" />

    <!-- component config panel -->
    <ComponentPanel v-show="activeKey !== 'global'" :editor="props.editor" :cellKey="cellKey" />
  </div>
</template>

<script lang="ts" setup name="ConfigPanel">
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    ComponentInternalInstance,
  } from 'vue'
  import GlobalPanel from './GlobalPanel.vue'
  import ComponentPanel from './ComponentPanel.vue'

  import { prefixCls } from '@/settings/designSetting'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })

  const activeKey = ref('global')
  const cellKey = ref('')

  const instance = getCurrentInstance() as ComponentInternalInstance
  props.editor.$instance.set('ConfigPanel', {
    instance,
  })

  onMounted(() => {
    props.editor.addBroadcastListener('notifyCellActivated', (message) => {
      const { key } = message
      cellKey.value = key
      activeKey.value = 'component'
    })
    props.editor.addBroadcastListener('notifyCellDeactivated', () => {
      cellKey.value = ''
      activeKey.value = 'global'
    })
  })

  onBeforeUnmount(() => {
    props.editor.removeBroadcastListener('notifyCellActivated')
    props.editor.removeBroadcastListener('notifyCellDeactivated')
  })
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-ConfigPanel';

  .@{prefix-cls} {
    height: 100%;
    width: 100%;
    overflow: hidden;

    > div {
      height: 100%;
      width: 100%;
    }
  }
</style>
