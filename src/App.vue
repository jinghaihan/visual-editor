<template>
  <a-config-provider :locale="locales">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'App',
  data () {
    return {
      locales: zhCN
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>
