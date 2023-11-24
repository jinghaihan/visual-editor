<template>
  <component v-bind="$attrs" :is="type" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AntIcon',
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {}
    },
  })
</script>
