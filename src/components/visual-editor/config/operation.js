import Setting from './setting'

const operationConfig = {
  library: [
    { name: '模板库', icon: 'layout', key: 'template', type: 'primary' },
    { name: '主题库', icon: 'bg-colors', key: 'theme', type: 'danger' }
  ],
  navbar: [
    { name: '预览', icon: 'eye', key: 'view' },
    { name: '锁定组件', icon: 'lock', key: 'lock' },
    { name: '批量修改', icon: 'highlight', key: 'batchEdit' },
    { name: '截图', icon: 'camera', key: 'screenshot' },
    { name: '错误提示器', icon: 'warning', key: 'error' },
    { name: '导入配置', icon: 'import', key: 'import' },
    { name: '导出配置', icon: 'cloud-download', key: 'export' },
    { name: '保存', icon: 'save', key: 'save' }
  ],
  toolbox: [
    { name: '清空', icon: 'delete', key: 'clear' }
  ],
  configUnit: [
    { name: '画布配置', icon: 'form', key: 'paper' },
    { name: '辅助功能', icon: 'appstore', key: 'auxiliary' },
    { name: '数据来源', icon: 'database', key: 'datasource' },
    { name: '组件配置', icon: 'form', key: 'component' }
  ],
  rendererToolbar: [
    { name: '组件配置', key: 'componentConfig', icon: 'setting', usable: Setting.componentSetComponents },
    { name: '复制', key: 'copy', icon: 'copy' },
    { name: '查看源码', key: 'viewSource', icon: 'code' },
    { name: '锁定', key: 'lock', icon: 'lock' },
    { name: '解除锁定', key: 'unlock', icon: 'unlock' },
    { name: '删除', key: 'delete', icon: 'delete' }
  ]
}

export default operationConfig
