<template>
  <a-modal
    :visible="true"
    @cancel="closeModal(false)"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="true"
    width="100%"
    height="100%"
    wrapClassName="fullScreenModal"
  >
    <div v-if="loading"
         class="loading-container">
      <dv-loading class="loading">Loading...</dv-loading>
    </div>

    <slot v-else></slot>
  </a-modal>
</template>

<script>

export default {
  name: 'FullScreenModal',
  props: {
    
  },
  data () {
    return {
      loading: true
    }
  },
  created () {
    setTimeout(() => {
      this.loading = false
    }, 300)
  },
  methods: {
    closeModal (refresh) {
      this.$emit('close', refresh)
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-modal:first-of-type {
    padding-bottom: 0;
    top: 0 !important;
    overflow: hidden;
  }
  /deep/.ant-modal-body:first-of-type{
    height: 100vh !important;
    max-height: none !important;
    padding: 0;
  }
  .loading-container{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
