import type { App } from 'vue'
import Antd from 'ant-design-vue'
import * as AntdIcon from '@ant-design/icons-vue'

import Action from './Application/Action/index.vue'
import AntIcon from './Application/AntIcon/index.vue'
import SvgIcon from './Application/SvgIcon/index.vue'
import Icon from './Application/Icon/index.vue'
import FormGenerator from './Application/FormGenerator/index.vue'

import { importAllSvg } from './Application/SvgIcon'

import { withInstall } from '@/utils'

/**
 * register all global component
 * @param app
 */
export function registerGlobalComponent(app: App): void {
  app
    .use(Antd)
    .use(withInstall(Action))
    .use(withInstall(AntIcon))
    .use(withInstall(SvgIcon))
    .use(withInstall(Icon))
    .use(withInstall(FormGenerator))

  for (const icon in AntdIcon) {
    app.component(icon, AntdIcon[icon])
  }
}

/**
 * setup assets & globalComponent
 * @param app
 */
export function setupComponent(app: App): void {
  importAllSvg()
  registerGlobalComponent(app)
}
