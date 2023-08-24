<template>
  <div ref="Container"
       id="visual-template-scrollRankingBoard"
       class="visual-template-scrollRankingBoard">
    <dv-scroll-ranking-board  ref="ScrollRankingBoard"
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
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 78
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          },
          {
            name: '信阳',
            value: 45
          },
          {
            name: '漯河',
            value: 29
          }
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
      const propertys = ['rankFontColor', 'infoFontColor', 'valueFontColor']
      propertys.forEach(key => {
        this.$refs.Container.style.setProperty('--' + key, this.propsData[key])
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #visual-template-scrollRankingBoard{
    --rankFontColor: #1370fb;
    --infoFontColor: #fff;
    --valueFontColor: #fff;
  }
  .visual-template-scrollRankingBoard{
    height: 100%;
    width: 100%;
    /deep/.dv-scroll-ranking-board{
      .ranking-info{
        .rank{
          color: var(--rankFontColor);
        }
        .info-name{
          color: var(--infoFontColor);
        }
        .ranking-value{
          color: var(--valueFontColor);
        }
      }
    }
  }
</style>
