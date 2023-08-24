<template>
  <a-row id="form-header-container" class="form-header-container">
    <a-col v-for="(item, index) in header"
            :key="index"
            :span="item.column"
            :class="item.center ? 'header-wrapper center-header-wrapper' : 'header-wrapper'">
      <span class="required" v-if="item.required">*</span>
      <span>{{item.name}}</span>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    header: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="less" scoped>
  .form-header-container{
    margin: 0;
    line-height: 40px;
    font-weight: bold;
    background: #f4f6f8;
    .center-header-wrapper{
      text-align: center;
    }
    .required{
      color: #f5222d;
    }
  }
</style>
