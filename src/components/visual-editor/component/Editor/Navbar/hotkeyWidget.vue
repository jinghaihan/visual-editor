<template>
  <a-popover title="快捷键"
             overlayClassName="visual-editor-overlay"
              :getPopupContainer="triggerNode => {
                return triggerNode.parentNode || document.body;
              }">
    <template slot="content">
      <div class="hotkey-container"
           v-for="key in hotkeys"
           :key="key.description">
        <!-- tag展示 -->
        <div class="tag-container">
          <a-tag v-for="tag in key.combo"
                 :key="tag">
            {{tag}}
          </a-tag>
        </div>
        <!-- 描述 -->
        <span class="description"
              v-if="key.description">
          {{key.description}}
        </span>
      </div>
    </template>
    <a-icon class="action hotkey-action" type="question-circle"></a-icon>
  </a-popover>
</template>

<script>
export default {
  data () {
    return {
      hotkeys: [
        { combo: ['ctrl + z', 'command + z'], description: '撤销' },
        { combo: ['ctrl+shift > y', 'command+shift > y'], description: '回退' },
        { combo: ['ctrl + c', 'command + c'], description: '复制组件' },
        { combo: ['ctrl + v', 'command + v'], description: '粘贴组件' },
        { combo: ['delete', 'backspace'], description: '删除组件' },
        { combo: ['ctrl + up', 'command + up'], description: '放大画布' },
        { combo: ['ctrl + down', 'command + down'], description: '缩小画布' },
        { combo: ['ctrl+shift > k', 'command+shift > k'], description: '画布网格线' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
  .hotkey-action{
    font-size: 16px;
    margin: 0 8px;
    color: var(--help-color);
  }
  
  .visual-editor-overlay{
    .hotkey-container{
      margin: 8px 0;
      width: 340px;
      display: flex;
      align-items: center;
      .tag-container{
        width: 240px;
      }
      .description{
        opacity: .9;
      }
    }
  }
</style>
