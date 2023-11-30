<template>
  <div :class="`${prefixCls}-NavBar`">
    <div :class="`${prefixCls}-NavBar-Logo`">
      <LogoWidget />
    </div>
    <div :class="`${prefixCls}-NavBar-WidgetBar`">
      <StateWidget :editor="props.editor" />
      <ScaleWidget :editor="props.editor" />
      <ActionBar :editor="props.editor" :actions="actions.toolBarSetting" />
      <HelpWidget :editor="props.editor" />
    </div>
    <div :class="`${prefixCls}-NavBar-ActionBar`">
      <ActionBar :editor="props.editor" :actions="actions.actionBarSetting" />
    </div>
  </div>
</template>

<script lang="ts" setup name="VisualNavBar">
  import { ref } from 'vue'
  import { cloneDeep } from 'lodash-es'

  import LogoWidget from './LogoWidget.vue'
  import HelpWidget from './HelpWidget.vue'
  import StateWidget from './StateWidget.vue'
  import ScaleWidget from './ScaleWidget.vue'
  import ActionBar from './ActionBar.vue'

  import { prefixCls } from '@/settings/designSetting'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })

  const actions = ref({
    toolBarSetting: cloneDeep(props.editor.setting.toolBarSetting),
    actionBarSetting: cloneDeep(props.editor.setting.actionBarSetting),
  })
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-NavBar';

  .@{prefix-cls} {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-Logo {
      flex-shrink: 0;
      height: 100%;
      width: 260px;
      display: flex;
      justify-content: left;
    }

    &-WidgetBar {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    &-ActionBar {
      flex-shrink: 0;
      width: 260px;
      height: 100%;
      display: flex;
      justify-content: right;
    }
  }
</style>
