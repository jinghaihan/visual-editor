<template>
  <div class="visual-editor-navbar-container">
    <!-- 模板库&主题库 -->
    <div class="library-container">
      <a-button v-for="action in editor.config.operation.library"
                :key="action.key"
                :icon="action.icon"
                :type="action.type || 'default'"
                size="small"
                @click="onAction(action)">
        {{action.name}}
      </a-button>
    </div>

    <!-- 工具栏 -->
    <div class="toolbox-container">
      <ToolBox :editor="editor"></ToolBox>
    </div>

    <!-- 操作栏 -->
    <div class="action-container">
      <div v-for="action in editor.config.operation.navbar"
           :key="action.key"
           class="action"
           @click="onAction(action)">
        <template v-if="action.key !== 'import'">
          <TooltipIcon class="close-icon"
                        :type="action.icon"
                        :title="action.name">
          </TooltipIcon>
        </template>

        <!-- 导入配置 -->
        <template v-else>
          <a-upload :beforeUpload="beforeUpload"
                    :fileList="[]"
                    accept=".json">
            <TooltipIcon class="close-icon"
                         :type="action.icon"
                         :title="action.name">
            </TooltipIcon>
          </a-upload>
        </template>
      </div>
    </div>
    
    <FullScreenModal v-if="viewportModalVisible" @close="onModalClose">
      <ViewPort :config="modalData.config"></ViewPort>
    </FullScreenModal>

    <ThemeModal v-if="themeModalVisible" :editor="editor" @close="onModalClose"></ThemeModal>
  </div>
</template>

<script>
import TooltipIcon from '../../TooltipIcon/tooltipIcon.vue'
import ToolBox from './toolbox'
import { readJsonFile } from '../../../utils'

import FullScreenModal from '../../FullScreenModal/fullScreenModal.vue'
import ThemeModal from '../ThemeModal/themeModal.vue'
import ViewPort from '../../ViewPort'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipIcon,
    ToolBox,
    FullScreenModal,
    ThemeModal,
    ViewPort
  },
  data () {
    return {
      modalData: {},
      viewportModalVisible: false,
      themeModalVisible: false
    }
  },
  methods: {
    onAction (action) {
      let _this = this
      const factory = {
        'template': () => {

        },
        'theme': () => {
          _this.themeModalVisible = true
        },
        'view': async () => {
          let config = await _this.editor.getCurrentPaperConfig()
          _this.modalData.config = config
          _this.viewportModalVisible = true
        },
        'lock': async () => {
          let paper = _this.editor.getCurrentPaper()
          paper.lockPaperCells()
        },
        'batchEdit': () => {

        },
        'screenshot': () => {
          _this.editor.getScreenShot()
        },
        'export': () => {
          _this.editor.onExport()
        },
        'import': () => {},
        'save': () => {
          _this.editor.onSave()
        }
      }

      if (factory[action.key]) {
        factory[action.key]()
      }
    },
    beforeUpload (file, filelist) {
      this.renderConfig(file)
      return false
    },
    async renderConfig (file) {
      let content = await readJsonFile(file)
      this.editor.setConfig(JSON.parse(content))
    },
    onModalClose () {
      this.modalData = {}

      this.viewportModalVisible = false
      this.themeModalVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .visual-editor-navbar-container{
    height: 40px;
    background: var(--deputy-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .library-container{
      height: 100%;
      width: 200px;
      padding-left: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/.ant-btn-sm{
        height: 20px;
        padding: 0 4px;
      }
    }
    .toolbox-container{
      height: 100%;
    }
    .action-container{
      height: 100%;
      width: 260px;
      display: flex;
      align-items: center;
      justify-content: right;
      .action{
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--font-color);
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
</style>
