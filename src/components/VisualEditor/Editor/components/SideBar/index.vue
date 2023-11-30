<template>
  <div :class="`${prefixCls}-SideBar`">
    <div :class="`${prefixCls}-SideBar-SwitchContainer`">
      <Action
        v-for="panel in panels"
        :key="panel.type"
        :title="panel.name"
        :propsData="{ placement: 'right' }"
        :class="activeKey === panel.type ? 'action-active' : 'action'"
        @click="activeKey = panel.type"
      >
        <Icon :type="panel.icon" />
      </Action>
    </div>

    <div :class="`${prefixCls}-SideBar-ContentContainer`">
      <!-- component panel -->
      <ComponentPanel v-show="activeKey === 'component'" :editor="props.editor" />
    </div>
  </div>
</template>

<script lang="ts" setup name="VisualSideBar">
  import { ref } from 'vue'
  import { cloneDeep } from 'lodash-es'
  import ComponentPanel from './componentPanel/index.vue'

  import { prefixCls } from '@/settings/designSetting'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })

  const panels = ref(cloneDeep(props.editor.setting.sideBarSetting))
  const activeKey = ref(panels.value[0].type)
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-SideBar';

  .@{prefix-cls} {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    > div {
      height: 100%;
    }

    &-SwitchContainer {
      flex-shrink: 0;
      width: 45px;
      background-color: @background-color;

      :deep(.action) {
        height: 45px;
        width: 45px;
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;
      }

      :deep(.action-active) {
        background: @selection-color;
        border-left: 2px solid @primary-color;
      }
    }

    &-ContentContainer {
      width: 100%;
      overflow: hidden;
    }
  }
</style>
