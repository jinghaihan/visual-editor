<template>
  <div class="visual-editor-HelpWidget">
    <a-popover>
      <Action title="帮助">
        <Icon type="question-circle-outlined" />
      </Action>
    </a-popover>
  </div>
</template>

<script lang="ts" setup name="VisualNavHelpWidget">
  const props = defineProps({
    editor: {
      type: Object,
      required: true,
    },
  })
</script>

<style lang="less" scoped>
  .visual-editor-HelpWidget {
    width: 45px;
  }
</style>
