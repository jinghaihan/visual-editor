<template>
  <div ref="Container"
       id="visual-scrollboard-container"
       class="visual-scrollboard-container">
    <dv-scroll-board ref="ScrollBoard"
                     v-bind="{
                      config: propsData
                     }"
                     :style="{
                      width: '100%',
                      height: '100%'
                     }" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      propsData: {
        header: ['列1', '列2', '列3'],
        data: [
          ['行1列1', '行1列2', '行1列3'],
          ['行2列1', '行2列2', '行2列3'],
          ['行3列1', '行3列2', '行3列3'],
          ['行4列1', '行4列2', '行4列3'],
          ['行5列1', '行5列2', '行5列3'],
          ['行6列1', '行6列2', '行6列3'],
          ['行7列1', '行7列2', '行7列3'],
          ['行8列1', '行8列2', '行8列3'],
          ['行9列1', '行9列2', '行9列3'],
          ['行10列1', '行10列2', '行10列3']
        ]
      }
    }
  },
  methods: {
    onResize () {
      try {
        this.$refs.ScrollBoard.initWH()
      } catch (error) {
        
      }
    },
    initStyle () {
      const propertys = ['headerFontColor', 'columnFontColor']
      propertys.forEach(key => {
        this.$refs.Container.style.setProperty('--' + key, this.propsData[key])
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #visual-scrollboard-container{
    --headerFontColor: #fff;
    --columnFontColor: #fff;
  }
  .visual-scrollboard-container{
    height: 100%;
    width: 100%;
    /deep/.dv-scroll-board{
      .header-item{
        color: var(--headerFontColor);
      }
      .row-item{
        color: var(--columnFontColor);
      }
    }
  }
</style>
