<template>
  <div class="visual-template-carouselContainer">
    <Swiper v-if="layout.length"
            ref="Swiper"
            :options="options"
            @slideChange="onChange">

      <SwiperSlide class="slide-page"
                   v-for="page in layout"
                   :key="page.key">
        <Renderer :instance="componentSetInstance"
                  :data="page">
        </Renderer>
      </SwiperSlide>

      <div class="swiper-pagination" slot="pagination"></div>
    </Swiper>
    
    <div class="empty-container" v-else>
      <a-empty description="请选择轮播图表"></a-empty>
    </div>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import ComponentSet from '../../../resource/ComponentSet'

export default {
  name: 'CarouselContainer',
  props: {
    data: {
      type: Object,
      required: true
    },
    instance: {
      type: Object,
      required: true
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    Renderer: () => import('../../Render/renderer.vue')
  },
  data () {
    return {
      componentSetInstance: {},
      propsData: {
        delay: 0,
        components: []
      },
      options: {
        loop: true,
        allowTouchMove: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      },
      layout: []
    }
  },
  watch: {
    propsData: {
      immediate: true,
      handler: function (config) {
        this.handleOptions(config)
        this.handleComponents(config.components)
      }
    }
  },
  created () {
    this.initComponentSetInstance()
  },
  methods: {
    async initComponentSetInstance () {
      this.componentSetInstance = new ComponentSet({
        vm: this
      })
    },
    handleOptions (config) {
      if (Object.getPrototypeOf(this.instance).constructor.name !== 'Editor') {
        if (config.delay) {
          this.options.autoplay = {
            delay: config.delay,
            pauseOnMouseEnter: true
          }
        } else {
          delete this.options.autoplay
        }
      }
    },
    handleComponents (components) {
      if (!components || !components.length) {
        this.layout = []
        return
      }

      let layout = []
      components.forEach(item => {
        if (item.value) {
          let comp = JSON.parse(item.value)
          layout.push({
            key: item.key,
            componentType: comp.componentType,
            type: comp.type,
            component: comp.component,
            props: {}
          })
        }
      })

      if (!this.componentSetInstance.current) {
        this.componentSetInstance.current = 0
        this.componentSetInstance.paper.activeCell = layout.length ? layout[0].key : null
      }

      this.componentSetInstance.clearCellCache(layout)

      this.layout = layout
    },
    onResize () {
      try {
        let cells = Object.values(this.componentSetInstance.paper.cells)
        cells.forEach(cell => {
          cell.resize()
        })
      } catch (error) {

      }
    },
    onChange () {
      this.componentSetInstance.current = this.$refs.Swiper.$swiper.activeIndex - 1
      this.componentSetInstance.paper.activeCell = this.layout[this.componentSetInstance.current].key
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-template-carouselContainer{
    height: 100%;
    width: 100%;
    /deep/.swiper-container{
      height: 100%;
      width: 100%;
      .swiper-wrapper{
        height: 100%;
        width: 100%;
      }
    }
    .empty-container{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
