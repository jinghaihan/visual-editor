<template>
  <a-config-provider
    :prefixCls="prefixCls"
    :locale="zhCN"
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: { colorPrimary: primaryColor, borderRadius: 0 },
    }"
  >
    <VisualEditor />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { theme } from 'ant-design-vue'
  import zhCN from 'ant-design-vue/es/locale/zh_CN'

  import { prefixCls, primaryColor } from '@/settings/designSetting'
  import { Editor as VisualEditor } from '@/components/VisualEditor'
</script>

<style></style>
