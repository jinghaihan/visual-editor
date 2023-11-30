<template>
  <div class="upload-dragger">
    <a-upload-dragger :fileList="[]" :accept="props.accept" :beforeUpload="beforeUpload">
      <div class="icon">
        <Icon type="cloud-upload-outlined" />
      </div>
      <p class="description"> 将文件拖到此处，或<em>点击选择</em> </p>
      <p class="hint" v-if="accept"> 文件支持{{ props.accept }}类型 </p>
    </a-upload-dragger>
  </div>
</template>

<script lang="ts" setup name="UploadDragger">
  const props = defineProps({
    accept: {
      type: String,
      required: true,
    },
    reader: {
      type: Function,
      required: false,
    },
    setValue: {
      type: Function,
      required: true,
    },
    assetsManager: {
      type: Object,
      required: false,
    },
  })

  const emits = defineEmits(['change'])

  const beforeUpload = (file) => {
    handleFile(file)
    return false
  }

  const handleFile = async (file) => {
    if (props.assetsManager) {
      const key = props.assetsManager.set({
        file,
        reader: props.reader,
      })
      props.setValue(key)
    } else {
      props.setValue(file)
    }

    emits('change')
  }
</script>

<style lang="less" scoped>
  .upload-dragger {
    .icon {
      font-size: 24px;
    }

    em {
      color: @primary-color;
      font-style: normal;
    }
  }
</style>
