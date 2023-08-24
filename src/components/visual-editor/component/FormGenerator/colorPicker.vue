<template>
  <div class="color-picker"
       :style="{
        cursor: isDisabled ? 'not-allowed' : 'pointer'
       }">
    <a-dropdown @visibleChange="onChange">
      <div ref="holder" class="holder"></div>
      <template slot="overlay"
                v-if="!isDisabled">
        <ColorPicker v-model="value"></ColorPicker>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    color: {
      type: Object,
      required: true
    }
  },
  components: {
    ColorPicker: Sketch
  },
  data () {
    return {
      value: this.color
    }
  },
  computed: {
    isDisabled () {
      return this.config.props && this.config.props.disabled
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (value) {
        this.onChange()
      }
    },
    color: {
      immediate: true,
      handler: function (value) {
        this.value = value
        this.onChange()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$refs.holder.style.background = this.value.hex
    },
    onChange () {
      if (this.$refs.holder) {
        this.$refs.holder.style.background = this.value.hex
        this.form[this.config.key] = this.value
        this.$emit('change')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .color-picker{
    padding-top: 10px;
    .holder{
      border: 1px solid var(--basic-color);
      border-radius: 2px;
      width: 24px;
      height: 24px;
    }
  }
</style>
