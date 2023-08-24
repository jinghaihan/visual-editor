<template>
  <div class="image-upload-container">
     <!-- 无数据 -->
      <Upload v-if="isVisible('upload')"
              v-bind="config.props"
              @change="onChange">
      </Upload>
      <!-- 缩略图 -->
      <img v-if="isVisible('image')"
          :src="form[config.key]"
          class="image"
          alt="background">
      <!-- 遮罩层 -->
      <div v-if="isVisible('mask')"
           class="mask">
        <TooltipIcon class="action"
                     type="delete"
                     title="删除"
                     @click="onDelete">
        </TooltipIcon>
      </div>
  </div>
</template>

<script>
import TooltipIcon from '../../component/TooltipIcon/tooltipIcon.vue'
import Upload from './upload.vue'

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
  components: { 
    TooltipIcon,
    Upload
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    isVisible (type) {
      let flag = false
      switch (type) {
        case 'upload':
          if (!this.form[this.config.key] || this.form[this.config.key] === 'none') flag = true
          break
        case 'image':
          if (this.form[this.config.key] && this.form[this.config.key] !== 'none') flag = true
          break
        case 'mask':
          if (this.form[this.config.key] && this.form[this.config.key] !== 'none') flag = true
          break
        default:
          break
      }
      return flag
    },
    onChange (image) {
      this.form[this.config.key] = image[0].base64
      this.$emit('change')
    },
    onDelete () {
      this.form[this.config.key] = 'none'
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
  .image-upload-container{
    height: 160px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px dashed var(--basic-color);
    .image{
      height: 100%;
      width: 100%;
    }
    .mask{
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      .action {
        font-size: 16px;
        color: transparent;
        margin: 0 8px
      }
    }
    .mask:hover {
      background-color: var(--deputy-color);
      opacity: 0.6;
      .action {
        color: var(--font-color);
      }
    }
  }
</style>
