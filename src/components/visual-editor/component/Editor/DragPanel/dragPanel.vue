<template>
  <div class="visual-editor-dragpanel-container">
    <!-- 组件拖拽面板 -->
    <div ref="DragPanel"
         :class="`component-drag-panel ${type}-component-drag-panel`">
      <transition name="animate__animated animate_bounce"
                  enter-active-class="animate__fadeIn"
                  leave-active-class="animate__fadeOut"
                  appear>
        <a-row :gutter="[8, 8]">
          <a-col v-for="component in componentsList"
                :key="component.type + '-' + component.name"
                :span="component.col || 6"
                :class="`component-item component-item-col${component.col || 6}`"
                @mousedown="(e) => onMouseDown(e, component)">
            <a-card size="small"
                    hoverable
                    :title="component.name">
              <!-- 缩略图 -->
              <img v-if="component.image"
                   slot="cover"
                   class="component-image component-cloneEl"
                   :src="component.image"
                   :alt="component.type">
              <!-- 组件 -->
              <component v-else-if="component.component && !component.showComponentName"
                         slot="cover"
                         class="component-cloneEl"
                         :is="component.component"
                         :data="component">
              </component>
              <!-- 文字展示 -->
              <div v-else
                   slot="cover"
                   class="component-placeholder component-cloneEl">
                {{component.name}}
              </div>
            </a-card>
          </a-col>
        </a-row>
      </transition>
    </div>

    <!-- 分页组件 -->
    <div v-if="pagination"
         class="pagination-container">
      <a-pagination v-bind="pagination" size="small" @change="onPagination"></a-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import { generateUUID } from '../../../utils'
import { ComponentTemplate } from '../../../config/enum'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    components: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    pagination: {
      required: true
    }
  },
  components: {
    ...ComponentTemplate
  },
  data () {
    return {
      eventKey: generateUUID(),
      componentsList: _.cloneDeep(this.components),
      // 拖拽实现
      dragging: false,
      cloneEl: null,
      initial: {},
      queue: [],
      currentMove: {}
    }
  },
  created () {
    this.addEventListener()
  },
  beforeDestroy () {
    this.removeEventListener()
  },
  methods: {
    
    // 事件监听
    addEventListener () {
      let _this = this
      window.addEventListener('mousemove', _this.onMouseMove)
      window.addEventListener('mouseup', _this.onMouseUp)
      window.addEventListener('mouseleave', _this.onMouseLeave)
      window.onblur = () => {
        _this.end()
      }
    },
    removeEventListener () {
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
      window.removeEventListener('mouseleave', this.onMouseLeave)
    },

    // 拖拽实现
    onMouseDown (e, component) {
      e.preventDefault()
      if (this.cloneEl) {
        return
      }
      let parentNode = $(e.target).parents('.component-item')
      if (parentNode && parentNode.length) {
        let editorContaienr = this.editor.vm.$refs.Container

        editorContaienr.classList.add('component-draggable-active')
        let el = $(parentNode[0]).find('.component-cloneEl')[0]

        this.currentMove = {
          ...component,
          componentType: this.type === 'clipBoard' ? component.componentType : this.type,
          key: generateUUID(),
          w: component.w || 300,
          h: component.h || 300,
          lockAspectRatio: false,
          zIndex: 0
        }
        delete this.currentMove.image
        
        this.cloneEl = el.cloneNode(true)

        this.cloneEl.classList.remove('ant-col')
        this.cloneEl.classList.remove('ant-col-6')
        this.cloneEl.classList.remove('ant-col-12')
        this.cloneEl.classList.remove('ant-col-24')
        this.cloneEl.classList.add('component-draggable-flutter')

        this.initMove(e, { width: el.offsetWidth }, { w: this.currentMove.w, h: this.currentMove.h }, this.currentMove.key)

        editorContaienr.appendChild(this.cloneEl)
        this.dragging = true

        el.classList.add('hide')
        this.queue.push(() => {
          el.classList.remove('hide')
          editorContaienr.classList.remove('component-draggable-active')
        })
      }
    },
    initMove ({ offsetX, offsetY, pageX, pageY }, { width }, dragSize, flag) {
      this.initial = { offsetX, offsetY, pageX, pageY, width, dragSize, flag }
      this.moveFlutter(pageX - offsetX, pageY - offsetY)
    },
    moveFlutter (x, y, d = 0) {
      const options = [`left: ${x}px`, `top: ${y}px`, `width: ${this.initial.dragSize.w * this.editor.scale}px`]
      this.changeStyle(options)
    },
    changeStyle (arr) {
      const original = this.cloneEl.style.cssText.split(';')
      original.pop()
      this.cloneEl.style.cssText = original.concat(arr).join(';') + ';'
    },
    onMouseMove (e) {
      if (this.dragging && this.cloneEl) {
        this.moveFlutter(e.pageX - this.initial.offsetX, e.pageY - this.initial.offsetY, this.distance(e))
      }
    },
    distance ({ pageX, pageY }) {
      const { pageX: x, pageY: y } = this.initial
      const b = pageX - x
      const a = pageY - y
      // return Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2))

      return Math.hypot(b, a)
    },
    onMouseUp (e) {
      const paper = this.editor.getCurrentPaper()
      const container = paper.getInstance('paper').$refs.Draw.$el

      const lostX = e.x - container.getBoundingClientRect().left
      const lostY = e.y - container.getBoundingClientRect().top

      this.done(lostX, lostY, container.getBoundingClientRect())
    },
    done (x, y, rect) {
      if (!this.cloneEl) { return }

      let paper = this.editor.getCurrentPaper()
      let instance = paper.getInstance('paper')

      this.currentMove.x = parseInt((x - this.initial.offsetX) / this.editor.scale)
      this.currentMove.y = parseInt((y - this.initial.offsetY) / this.editor.scale)

      let callEnd = true
      let cellKey = null
      if (this.validateBoundary(rect)) {
        cellKey = this.currentMove.key
        instance.cells.push(_.cloneDeep(this.currentMove))
        callEnd = false
      }
      this.currentMove = {}
      if (callEnd) {
        this.end()
      } else {
        this.queue.length && this.queue.shift()()
        this.cloneEl && this.cloneEl.remove()
        this.cloneEl = null
      }

      this.$emit('done', cellKey)
    },
    // 容器边界判断
    validateBoundary (rect) {
      if (this.currentMove.x < 0 || this.currentMove.y < 0) {
        return false
      }
      if (this.currentMove.x + this.currentMove.w > rect.width / this.editor.scale) {
        return false
      }
      if (this.currentMove.y + this.currentMove.h > rect.height / this.editor.scale) {
        return false
      }

      return true
    },
    end () {
      this.dragging = false
      if (!this.cloneEl) { return }
      this.cloneEl.classList.add('component-draggable-return')
      this.changeStyle([`left: ${this.initial.pageX - this.initial.offsetX}px`, `top: ${this.initial.pageY - this.initial.offsetY}px`, 'transform: scale(1)'])
      setTimeout(() => {
        this.queue.length && this.queue.shift()()
        this.cloneEl && this.cloneEl.remove()
        this.cloneEl = null
      }, 300)

      this.$emit('done')
    },
    onMouseLeave () {
      this.end()
    },

    // 分页
    onPagination (page, pageSize) {
      this.$emit('pagination', page, pageSize)
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-dragpanel-container{
    width: 350px;
    .component-drag-panel{
      max-height: 450px;
      width: 100%;
      background: var(--panel-color);
      overflow-x: hidden;
      overflow-y: auto;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .component-item{
        cursor: grab;
        /deep/.ant-card{
          cursor: grab;
        }
      }
      .component-item:hover{
        filter: brightness(110%);
        transform: scale(1.01);
        transition: all .3s;
      }
      .component-placeholder{
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }
    }

    .component-item-col6{
      .component-cloneEl{
        height: 60px;
      }
    }
    .component-item-col12{
      .component-cloneEl{
        height: 150px;
      }
    }

    .pagination-container{
      margin-top: 12px;
    }
    
    .hide {
      opacity: 0;
    }
  }
</style>
