<template>
  <div>
    <a-textarea v-if="config.type === 'textarea'"
                v-model="form[config.key]"
                :placeholder="'请输入' + config.label"
                v-bind="config.props || {}"
                :class="config.props && config.props.maxLength ? 'textarea-has-marker' : ''"
                @change="onChange" />
    <!-- textarea角标 -->
    <span v-if="config.type === 'textarea' && config.props && config.props.maxLength"
          class="textarea-marker">
      {{form[config.key] ? form[config.key].length : 0}}/{{config.props.maxLength}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  methods: {
    onChange () {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
  .textarea-marker{
    position: absolute;
    right: 0;
    bottom: -24px;
    opacity: .6;
    color: var(--font-color);
  }
</style>
