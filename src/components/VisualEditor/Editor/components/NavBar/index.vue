<template>
  <div class="visual-editor-NavBar">
    <div class="visual-editor-NavBar-Logo">
      <LogoWidget />
    </div>
    <div class="visual-editor-NavBar-WidgetBar">
      <StateWidget :editor="props.editor" />
      <ScaleWidget :editor="props.editor" />
      <ActionBar :editor="props.editor" :actions="actions.toolBarSetting" />
      <HelpWidget :editor="props.editor" />
    </div>
    <div class="visual-editor-NavBar-ActionBar">
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
  .visual-editor-NavBar {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .visual-editor-NavBar-Logo {
      flex-shrink: 0;
      height: 100%;
      width: 260px;
      display: flex;
      justify-content: left;
    }

    .visual-editor-NavBar-WidgetBar {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    .visual-editor-NavBar-ActionBar {
      flex-shrink: 0;
      width: 260px;
      height: 100%;
      display: flex;
      justify-content: right;
    }
  }
</style>
