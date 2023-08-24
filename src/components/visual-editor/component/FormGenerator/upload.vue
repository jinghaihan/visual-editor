<template>
  <div class="upload-container">
    <a-upload-dragger
      :accept="accept"
      :multiple="multiple"
      :showUploadList="false"
      :beforeUpload="onUpload"
      :file-list="[]"
      :disabled="!!fileList.length || disabled"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" />
      </p>
      <p class="ant-upload-text">
        将文件拖到此处，或<em>点击选择</em>
      </p>
      <p class="ant-upload-hint" v-if="accept">
        文件支持{{accept}}类型
      </p>
    </a-upload-dragger>
  </div>
</template>

<script>

export default {
  props: {
    accept: {
      type: String,
      required: false,
      default: '.png,.jpg,.jpeg'
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      queue: [],
      fileList: [],
      count: 0
    }
  },
  methods: {
    onUpload (file, filelist) {
      let _this = this
      _this.count += 1

      // 扩展名校验
      if (_this.accept) {
        let name = file.name
        let suffix = '.' + name.split('.')[name.split('.').length - 1]
        let accept = _this.accept.split(',')
        if (!accept.includes(suffix.toLowerCase())) {
          _this.$notification.error({
            message: '错误',
            description: `不支持此文件格式 ${file.name}`
          })
        }
      }

      _this.queue.push(new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve({
            name: file.name,
            base64: reader.result
          })
        }
      }))

      if (_this.count === filelist.length) {
        Promise.all(_this.queue).then(fileList => {
          _this.fileList = fileList
          _this.$emit('change', _this.fileList)
        })
      }

      return false
    }
  }
}
</script>

<style lang="less" scoped>
  .upload-container{
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/.ant-upload-drag{
      height: 160px;
      width: 220px;
    }
    em{
      color: var(--font-color);
      font-style: normal;
    }
  }
</style>
