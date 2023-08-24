<template>
  <div class="visual-renderer-toolbar">
    <div class="visual-renderer-toolbar-action-container">
      <TooltipIcon v-for="opt in operations"
                  :key="opt.key"
                  :type="opt.icon"
                  :title="opt.name"
                  class="action"
                  @click="onAction(opt)">
      </TooltipIcon>
    </div>

    <CodeModal v-if="viewSourceModalVisible"
              :code="modalData.code"
              @close="onModalClose">
    </CodeModal>

    <ComponentDrawer v-if="componentDrawerVisible"
                    :modalData="modalData"
                    @close="onModalClose">
    </ComponentDrawer>
  </div>
</template>

<script>
import _ from 'lodash'
import TooltipIcon from '../TooltipIcon/tooltipIcon.vue'
import CodeModal from '../CodeModal/codeModal'
import ComponentDrawer from '../Editor/ComponentDrawer/componentDrawer'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    lockedCells: {
      type: Array,
      required: true
    }
  },
  components: {
    TooltipIcon,
    CodeModal,
    ComponentDrawer
  },
  data () {
    return {
      modalData: {},
      viewSourceModalVisible: false,
      componentDrawerVisible: false
    }
  },
  computed: {
    operations () {
      let config = _.cloneDeep(this.editor.config.operation.rendererToolbar)

      // 锁定/解除锁定
      if (this.lockedCells.includes(this.data.key)) {
        config = config.filter(i => i.key !== 'lock')
      } else {
        config = config.filter(i => i.key !== 'unlock')
      }

      // 查看源码
      if (this.data.componentType !== 'chart') {
        config = config.filter(i => i.key !== 'viewSource')
      }

      config.forEach(conf => {
        if (conf.usable && !conf.usable.includes(this.data.type)) {
          config = config.filter(i => i.key !== 'componentConfig')
        }
      })

      return config
    }
  },
  methods: {
    onAction (action) {
      let _this = this
      const paper = this.editor.getCurrentPaper()

      const factory = {
        copy: () => {
          paper.onCopy([_this.data.key])
        },
        viewSource: () => {
          let cell = paper.cells[_this.data.key]
          let sourceCode = cell.getOption()
          _this.modalData.code = JSON.stringify(sourceCode)
          _this.viewSourceModalVisible = true
        },
        lock: () => {
          paper.handleCellLock(_this.data.key, true)
        },
        unlock: () => {
          paper.handleCellLock(_this.data.key, false)
        },
        delete: () => {
          paper.deleteActiveCell()
        },
        componentConfig: () => {
          let cell = paper.cells[_this.data.key]
          let componentSetInstance = cell.getcomponentSetInstance()

          _this.modalData.instance = componentSetInstance
          _this.componentDrawerVisible = true
        }
      }
      factory[action.key]()
    },
    onModalClose () {
      this.modalData = {}

      this.viewSourceModalVisible = false
      this.componentDrawerVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-renderer-toolbar{
    height: 28px;
    .visual-renderer-toolbar-action-container{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: right;
    }
    .action{
      background: var(--active-color);
      height: 28px;
      width: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: var(--font-color);
    }
  }
</style>
