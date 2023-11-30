<template>
  <a-layout :id="prefixCls" :class="prefixCls">
    <a-layout-header :class="`${prefixCls}-header`">
      <VisualNavBar :editor="editor" />
    </a-layout-header>

    <a-layout :class="`${prefixCls}-layout-content`">
      <!-- siderbar content -->
      <a-layout-sider
        :class="`${prefixCls}-sider`"
        :collapsible="true"
        :defaultCollapsed="false"
        :width="220"
        :collapsedWidth="45"
      >
        <VisualSideBar :editor="editor" />
      </a-layout-sider>

      <!-- paper content -->
      <a-layout-content :class="`${prefixCls}-content`">
        <template v-for="paperKey in papers" :key="paperKey">
          <VisualPaper
            :class="`${prefixCls}-paper`"
            :paper="editor.papers[paperKey]"
            :paperKey="paperKey"
            :style="{
              opacity: paperKey === currentPaper ? 1 : 0,
              zIndex: paperKey === currentPaper ? 0 : -1,
            }"
          />
        </template>
      </a-layout-content>

      <!-- configBar content -->
      <a-layout-sider
        :class="`${prefixCls}-configSider`"
        :collapsible="true"
        :width="260"
        :collapsedWidth="0"
        :reverseArrow="true"
      >
        <VisualConfigPanel :editor="editor" />
      </a-layout-sider>
    </a-layout>

    <a-layout-footer :class="`${prefixCls}-footer`" />
  </a-layout>
</template>

<script lang="ts" setup name="VisualEditor">
  import {
    onMounted,
    onBeforeUnmount,
    ref,
    getCurrentInstance,
    ComponentInternalInstance,
  } from 'vue'
  import { VisualEditor } from './lib/Editor/index'
  import VisualPaper from './components/Paper/index.vue'
  import VisualNavBar from './components/NavBar/index.vue'
  import VisualSideBar from './components/SideBar/index.vue'
  import VisualConfigPanel from './components/ConfigPanel/index.vue'

  import { prefixCls } from '@/settings/designSetting'

  const instance = getCurrentInstance() as ComponentInternalInstance
  const emits = defineEmits([''])

  const papers = ref([])
  const currentPaper = ref('')
  const loading = ref(false)

  const editor = new VisualEditor()
  editor.$instance.set('Editor', {
    instance,
    papers,
    currentPaper,
    loading,
    emits,
  })

  editor.createHook()

  onMounted(() => {
    editor.mountHook()
  })

  onBeforeUnmount(() => {
    editor.destroyHook()
  })
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}';

  .@{prefix-cls} {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: @background-color;
    color: @foreground-color;
    overflow: hidden;

    &-header {
      height: 45px;
      padding: 0;
      background-color: @background-light-color;
      display: flex;
    }

    &-layout-content {
      position: relative;
      height: 100%;
    }

    &-content {
      position: relative;
      background-color: @background-color;
      overflow: hidden;
    }

    &-paper {
      position: absolute;
      top: 0;
      left: 0;
      transition: 'opacity .3s';
    }

    &-sider {
      overflow: hidden;
    }
    &-sider,
    &-configSider {
      background-color: @background-darker-color;

      :deep(.@{ant-prefix}-layout-sider-trigger) {
        position: sticky;
        bottom: -48px;
        background-color: @background-dark-color;
      }
      :deep(.@{ant-prefix}-layout-sider-zero-width-trigger) {
        background-color: @background-dark-color;
      }
    }

    &-footer {
      height: 20px;
      padding: 0;
      background-color: @background-lighter-color;
      display: flex;
      z-index: 10;
    }
  }
</style>

<style lang="less">
  ::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
</style>
