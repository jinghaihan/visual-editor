<template>
  <div ref="ContainerRef" class="visual-component-renderer">
    <component
      ref="Component"
      :is="ComponentTemplate[getComponentName()]"
      v-bind="{
        paper: props.paper,
        config: props.config,
      }"
    />
  </div>
</template>

<script lang="ts" setup name="VisualComponentRenderer">
  import { computed, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
  import { capitalize } from 'lodash-es'
  import { ComponentTypeEnum, ComponentCellEnum } from '@/enums/componentEnums'

  import { BaseCell, EchartCell, ThreeCell, CesiumCell } from './lib/Cell'
  import { ComponentTemplate } from './components/template/index'

  const props = defineProps({
    paper: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  })

  const componentType = computed(() => {
    const { type } = props.config

    if (ComponentCellEnum[ComponentTypeEnum.DV_ECHART_CELL].includes(type)) {
      return ComponentTypeEnum.DV_ECHART_CELL
    } else if (ComponentCellEnum[ComponentTypeEnum.DV_THREE_CELL].includes(type)) {
      return ComponentTypeEnum.DV_THREE_CELL
    } else if (ComponentCellEnum[ComponentTypeEnum.DV_CESIUM_CELL].includes(type)) {
      return ComponentTypeEnum.DV_CESIUM_CELL
    } else {
      return ComponentTypeEnum.DV_BASE_CELL
    }
  })

  const getComponentName = () => {
    if (componentType.value === ComponentTypeEnum.DV_ECHART_CELL) {
      return 'DvEchart'
    } else {
      return props.config.type
        .split('-')
        .map((str) => {
          return capitalize(str)
        })
        .join('')
    }
  }

  const initCellInstance = () => {
    const option = getExtendOption()

    let cell
    switch (componentType.value) {
      case ComponentTypeEnum.DV_BASE_CELL:
        cell = new BaseCell(option)
        break
      case ComponentTypeEnum.DV_ECHART_CELL:
        cell = new EchartCell(option)
        break
      case ComponentTypeEnum.DV_THREE_CELL:
        cell = new ThreeCell(option)
        break
      case ComponentTypeEnum.DV_CESIUM_CELL:
        cell = new CesiumCell(option)
        break
      default:
        break
    }

    return cell
  }

  const getExtendOption = () => {
    return {
      paper: props.paper,
      key: props.config.key,
      type: props.config.type,
      name: props.config.name,
      $event: props.paper.$event,
      $assetsManager: props.paper.$assetsManager,
      setting: props.paper.setting,
      action: props.paper.action,
    }
  }

  const instance = getCurrentInstance() as ComponentInternalInstance
  onMounted(() => {
    const cell = initCellInstance()

    cell.$instance.set('Renderer', {
      instance,
    })
    props.paper.setCell(cell)

    if ('init' in cell) {
      cell.init()
    }
  })
</script>

<style lang="less" scoped>
  .visual-component-renderer {
    height: 100%;
    width: 100%;
    overflow: hidden;
    color: #333;
  }
</style>
