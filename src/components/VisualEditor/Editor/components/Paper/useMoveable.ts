import { isNumber } from 'lodash-es'
import { ref, computed } from 'vue'
import { ViewableWidget } from './widget'

export function useMoveable(props) {
  // cells & cells status
  const cells = ref([] as any[])
  const activeCells = ref([] as string[])
  const lockedCells = ref([] as string[])
  const invisibleCells = ref([] as string[])

  // moveable config
  const moveableConfig = computed(() => {
    const directions = {
      left: true,
      top: true,
      right: true,
      bottom: true,
      center: true,
      middle: true,
    }
    return {
      draggable: true,
      resizable: true,
      rotatable: true,
      snappable: true,
      bounds: {
        left: 0,
        top: 0,
        right: props.adapterConfig.value.width,
        bottom: props.adapterConfig.value.height,
      },
      snapDirections: directions,
      elementSnapDirections: directions,
      elementGuidelines: getElementGuidelines(),
      ables: [ViewableWidget],
      props: {
        ViewableWidget: true,
      },
    }
  })

  /**
   * get current element which need show guildLine (filter current activeCells)
   */
  function getElementGuidelines() {
    return cells.value
      .filter((cell) => !activeCells.value.includes(cell.key))
      .map((cell) => `#cell-${cell.key}`)
  }

  /**
   * cell event callback
   */
  function handleMoveable({ target, cssText }, cell) {
    updateCell(target, cssText, cell)
  }

  /**
   * update cell config & style then notify change
   */
  function updateCell(target, cssText, cell) {
    // not locked cell can update view
    if (!lockedCells.value.includes(cell.key)) {
      const attrs = analysisCssText(cssText, cell)

      Object.keys(attrs).forEach((key) => {
        if (attrs[key] || isNumber(attrs[key])) {
          cell[key] = attrs[key]
        }
      })

      const style = calculateCellStyle(cell)
      if (style.width) {
        target.style.width = style.width
      }
      if (style.height) {
        target.style.height = style.height
      }
      if (style.transform) {
        target.style.transform = style.transform
      }

      props.paper.$event.emit('notifyCellLayoutChange', { ...cell })
    }
  }

  /**
   * analysis cssText
   */
  function analysisCssText(str, origin) {
    const widthRegex = /width: (-?\d*\.?\d+)px;/
    const heightRegex = /height: (-?\d*\.?\d+)px;/
    const translateRegex = /translate\((-?\d*\.?\d+)px, (-?\d*\.?\d+)px\)/
    const rotateRegex = /rotate\((-?\d*\.?\d+)deg\)/

    const widthMatch = widthRegex.exec(str)
    const heightMatch = heightRegex.exec(str)
    const translateMatch = translateRegex.exec(str)
    const rotateMatch = rotateRegex.exec(str)

    const style = {
      w: widthMatch ? parseInt(widthMatch[1]) : origin.w,
      h: heightMatch ? parseInt(heightMatch[1]) : origin.h,
      x: translateMatch ? parseInt(translateMatch[1]) : origin.x,
      y: translateMatch ? parseInt(translateMatch[2]) : origin.y,
      rotation: rotateMatch ? parseInt(rotateMatch[1]) : origin.rotation,
    }

    return {
      ...style,
      x: style.x < 0 ? 0 : style.x,
      y: style.y < 0 ? 0 : style.y,
    }
  }

  /**
   * calculate cell style by cell config
   */
  function calculateCellStyle(cell) {
    const { x, y, w, h, rotation } = cell

    return {
      width: w + 'px',
      height: h + 'px',
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      zIndex: cells.value.findIndex((item) => item.key === cell.key),
      opacity: invisibleCells.value.includes(cell.key) ? 0 : 1,
    }
  }

  /**
   * calculate cell className by cell key
   */
  function getCellClassName(key: string) {
    const activated = isActive(key)

    return `moveable moveable-${activated ? 'acitve' : 'deactive'}`
  }

  /**
   * cell active status
   */
  function isActive(key: string) {
    // if lockedCell includes key the cell is deactive
    if (lockedCells.value.includes(key)) {
      return false
    }
    return activeCells.value.length === 1 && activeCells.value.includes(key)
  }

  return {
    cells,
    activeCells,
    lockedCells,
    invisibleCells,
    moveableConfig,

    handleMoveable,
    getCellClassName,
    calculateCellStyle,
  }
}
