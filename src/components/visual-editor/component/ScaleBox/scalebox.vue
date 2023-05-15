<template>
  <div class="ScreenAdapter" :style="style">
    <slot />
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    width: {
      type: Number,
      default: 1920
    },
    height: {
      type: Number,
      default: 1080
    },
    padding: {
      type: Number,
      required: false,
      default: 0
    },
    vmRef: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      style: {
        width: this.width + 'px',
        height: this.height + 'px',
        transform: 'scale(1) translate(-50%, -50%)',
        locked: false,
        customScale: 1
      }
    }
  },
  watch: {
    width: {
      immediate: true,
      handler: function (value) {
        this.style.width = value + 'px'
        this.setScale()
      }
    },
    height: {
      immediate: true,
      handler: function (value) {
        this.style.height = value + 'px'
        this.setScale()
      }
    }
  },
  mounted () {
    this.setScale()
    window.onresize = this.Debounce(this.setScale, 1000)
  },
  methods: {
    Debounce: (fn, t) => {
      const delay = t || 500
      let timer
      return function () {
        const args = arguments
        if (timer) {
          clearTimeout(timer)
        }
        const context = this
        timer = setTimeout(() => {
          timer = null
          fn.apply(context, args)
        }, delay)
      }
    },
    getScale () {
      if (this.locked) {
        return this.customScale
      }

      let el = this.vmRef.PaperContent
      if (el) {
        let rect = el.getBoundingClientRect()
        const w = (rect.width - this.padding) / this.width
        const h = (rect.height - this.padding) / this.height

        let scale = w < h ? w : h
        return scale
        // return [w, h]
      }
    },
    // 设置比例
    setScale () {
      // this.style.transform =
      //   'scale(' + this.getScale()[0] + ',' + this.getScale()[1] + ') translate(-50%, -50%)'
      let scale = this.getScale()
      this.$emit('scale', scale)
      this.style.transform =
        'scale(' + scale + ') translate(-50%, -50%)'
    }
  }
}
</script>

<style lang="less" scoped>
  .ScreenAdapter {
    transform-origin: 0 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transition: 0.3s;
  }
</style>
