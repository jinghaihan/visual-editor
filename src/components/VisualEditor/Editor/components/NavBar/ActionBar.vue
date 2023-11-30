<template>
  <Action
    v-for="action in props.actions"
    :key="action.type"
    :title="action.name"
    @click="actionHandler(action)"
  >
    <Icon :type="action.icon" />
  </Action>
</template>

<script lang="ts" setup name="VisualNavActionBar">
  import { VisualEditor } from '../../lib/Editor/index'
  import { ActionHandler } from '../../lib/Editor/ActionHandler'

  const props = defineProps({
    editor: {
      type: VisualEditor,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
  })

  const actionHandler = (action) => {
    const { type } = action

    ActionHandler(props.editor, type)
  }
</script>
