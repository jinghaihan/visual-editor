<template>
  <div :class="`${prefixCls}-HelpWidget`">
    <a-popover>
      <Action title="帮助">
        <Icon type="question-circle-outlined" />
      </Action>
    </a-popover>
  </div>
</template>

<script lang="ts" setup name="VisualNavHelpWidget">
  import { prefixCls } from '@/settings/designSetting'

  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-HelpWidget';

  .@{prefix-cls} {
    width: 45px;
  }
</style>
