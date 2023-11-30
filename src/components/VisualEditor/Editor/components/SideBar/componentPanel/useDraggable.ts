import { cloneDeep } from 'lodash-es'
import { uuid } from '@/utils'
import { parents } from '@/utils/dom'

export function useDraggable(props) {
  let cloneEl: HTMLElement | null = null
  let currentMove: any = {}
  let initial: any = {}
  let dragging = false
  const queue: any[] = []

  const onMouseDown = (e, element) => {
    e.preventDefault()
    if (cloneEl) {
      return
    }

    const parentNodes = parents(e.target, '.draggable-el')
    if (parentNodes && parentNodes.length) {
      const el = parentNodes[0].querySelector('.draggable-ghost') as HTMLElement
      if (!el) {
        return
      }

      currentMove = {
        ...element,
        key: uuid(),
        w: element.w || 300,
        h: element.h || 300,
      }

      cloneEl = el.cloneNode(true) as HTMLElement
      cloneEl.style.position = 'absolute'
      cloneEl.style.zIndex = '1000'
      cloneEl.style.pointerEvents = 'none'

      initMove(
        e,
        { width: el.offsetWidth },
        { w: currentMove.w, h: currentMove.h },
        currentMove.key,
      )

      const container = props.getContainer()
      container.appendChild(cloneEl)
      dragging = true
      el.classList.add('hide')
      queue.push(() => {
        el.classList.remove('hide')
      })
    }
  }

  const onMouseMove = (e) => {
    if (dragging && cloneEl) {
      moveFlutter(e.pageX - initial.offsetX, e.pageY - initial.offsetY, distance(e))
    }
  }

  const onMouseUp = (e) => {
    const container = props.getCanvas()

    const lostX = e.x - container.getBoundingClientRect().left
    const lostY = e.y - container.getBoundingClientRect().top

    done(lostX, lostY)
  }

  const onMouseLeave = () => {
    end()
  }

  const onBlur = () => {
    end()
  }

  const initMove = ({ offsetX, offsetY, pageX, pageY }, { width }, dragSize, flag) => {
    initial = { offsetX, offsetY, pageX, pageY, width, dragSize, flag }
    moveFlutter(pageX - offsetX, pageY - offsetY)
  }

  const moveFlutter = (x, y, _d = 0) => {
    const options = [
      `left: ${x}px`,
      `top: ${y}px`,
      `width: ${initial.dragSize.w * props.getScale()}px`,
      `height: ${initial.dragSize.h * props.getScale()}px`,
    ]
    updateStyle(options)
  }

  const updateStyle = (arr) => {
    if (cloneEl) {
      const original = cloneEl.style.cssText.split(';')
      original.pop()
      cloneEl.style.cssText = original.concat(arr).join(';') + ';'
    }
  }

  const distance = ({ pageX, pageY }) => {
    const { pageX: x, pageY: y } = initial
    const b = pageX - x
    const a = pageY - y

    return Math.hypot(b, a)
  }

  const end = () => {
    dragging = false
    if (!cloneEl) {
      return
    }

    cloneEl.style.transition = 'all 0.3s'
    updateStyle([
      `left: ${initial.pageX - initial.offsetX}px`,
      `top: ${initial.pageY - initial.offsetY}px`,
      'transform: scale(1)',
    ])

    setTimeout(() => {
      queue.length && queue.shift()()
      cloneEl && cloneEl.remove()
      cloneEl = null
    }, 300)
  }

  const done = (x, y) => {
    if (!cloneEl) {
      return
    }

    const scale = props.getScale()
    currentMove.x = parseInt(((x - initial.offsetX) / scale).toString())
    currentMove.y = parseInt(((y - initial.offsetY) / scale).toString())

    props.done(cloneDeep(currentMove))
    currentMove = {}

    end()
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onBlur,
  }
}
