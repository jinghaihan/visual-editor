import { VisualEditor } from './index'

export enum ActionHandlerEnum {
  UNDO = 'undo',
  REDO = 'redo',
  COPY = 'copy',
  PASTE = 'paste',
  DELETE = 'delete',
  LOCK = 'lock',
  GRID_SHOW = 'gridShow',
  GROUP = 'group',
  LAYER_UP = 'layerUp',
  LAYER_DOWN = 'layerDown',
  LAYER_TOP = 'layerTop',
  LAYER_BOTTOM = 'layerBottom',
  SCALE_UP = 'scaleUp',
  SCALE_DOWN = 'scaleDown',
  SCALE_CHANGE = 'scaleChange',
  SCALE_RESET = 'scaleReset',
  VISIBLE = 'visible',
  CLEAR_PAPER = 'clearPaper',
  SCREENSHOT = 'screenshot',
}

export function ActionHandler(editor: VisualEditor, event: string, argument?: any) {
  const paper = editor.getCurrentPaper()

  if (paper) {
    switch (event) {
      case ActionHandlerEnum.UNDO:
        paper.changeState(true)
        break
      case ActionHandlerEnum.REDO:
        paper.changeState(false)
        break
      case ActionHandlerEnum.COPY:
        break
      case ActionHandlerEnum.PASTE:
        break
      case ActionHandlerEnum.DELETE:
        paper.deleteActiveCell()
        break
      case ActionHandlerEnum.LOCK:
        break
      case ActionHandlerEnum.GRID_SHOW:
        paper.changeGrid()
        break
      case ActionHandlerEnum.GROUP:
        break
      case ActionHandlerEnum.LAYER_UP:
        break
      case ActionHandlerEnum.LAYER_DOWN:
        break
      case ActionHandlerEnum.LAYER_TOP:
        break
      case ActionHandlerEnum.LAYER_BOTTOM:
        break
      case ActionHandlerEnum.SCALE_UP:
        paper.changeScale(null, 'up')
        break
      case ActionHandlerEnum.SCALE_DOWN:
        paper.changeScale(null, 'down')
        break
      case ActionHandlerEnum.SCALE_CHANGE:
        const { scale } = argument
        paper.changeScale(scale)
        break
      case ActionHandlerEnum.SCALE_RESET:
        paper.resetScale()
        break
      case ActionHandlerEnum.VISIBLE:
        break
      case ActionHandlerEnum.CLEAR_PAPER:
        paper.onClear()
        break
      case ActionHandlerEnum.SCREENSHOT:
        break
      default:
        break
    }
  }
}
