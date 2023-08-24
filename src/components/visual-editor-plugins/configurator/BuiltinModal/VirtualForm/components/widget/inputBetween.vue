<template>
  <a-input-group compact>
    <a-input class="input input-left"
             :disabled="disabled"
             :placeholder="placeholder ? placeholder[0] : ''"
             v-model="min"
             @change="onChange" />
    <a-input
      class="holder"
      placeholder="~"
      disabled
    />
    <a-input class="input input-right"
             :disabled="disabled"
             :placeholder="placeholder ? placeholder[1]: ''"
             v-model="max"
             @change="onChange" />
  </a-input-group>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: Array,
      required: false
    },
    formData: {
      type: Object,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler: function (data) {
        if (data.value) {
          try {
            let value = JSON.parse(data.value)
            this.min = value[0]
            this.max = value[1]
          } catch (error) { }
        }
      }
    }
  },
  data () {
    return {
      min: undefined,
      max: undefined
    }
  },
  methods: {
    onChange () {
      try {
        let value = [this.min, this.max]
        this.formData.value = JSON.stringify(value)
        this.$emit('change')
      } catch (error) { }
    }
  }
}
</script>

<style lang="less" scoped>
  .input{
    width: calc(~"(100% - 30px) / 2") !important;
    text-align: center !important;
  }
  .input-right{
    border-left: 0;
  }
  .holder{
    width: 30px !important;
    border-left: 0;
    pointer-events: none;
    background-color: #fff;
  }
</style>
