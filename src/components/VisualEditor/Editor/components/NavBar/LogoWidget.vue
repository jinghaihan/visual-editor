<template>
  <div :class="`${prefixCls}-LogoWidget`">
    <Icon class="logo" type="svg-logo" />
    <div class="title">Visual Editor</div>
  </div>
</template>

<script lang="ts" setup name="VisualNavLogoWidget">
  import { prefixCls } from '@/settings/designSetting'
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-LogoWidget';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 45px;
      font-size: 36px;
      color: @cyan-color;
    }

    .title {
      color: @foreground-color;
      font-size: 20px;
      font-weight: 700;
      margin-left: 1rem;
    }
  }
</style>
