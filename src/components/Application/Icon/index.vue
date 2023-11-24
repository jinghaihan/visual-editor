<template>
  <!-- svg-icon -->
  <SvgIcon v-if="isSvgIcon" class="anticon" :type="type" />
  <!-- ant-icon -->
  <AntIcon v-else :type="type" />
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import AntIcon from '../AntIcon/index.vue'
  import SvgIcon from '../SvgIcon/index.vue'

  export default defineComponent({
    name: 'Icon',
    components: {
      SvgIcon,
      AntIcon,
    },
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const isSvgIcon = computed(() => props.type?.startsWith('svg-'))

      return {
        isSvgIcon,
      }
    },
  })
</script>
