import { getComponentSetting } from './Component'
import { getSideBarSetting } from './SideBar'
import { getToolBarSetting, getActionBarSetting } from './NavBar'

export const Setting = {
  debounceSetting: {
    interval: 10,
  },
  draftSetting: {
    interval: 3000,
  },
  clipBoardSetting: {
    max: 20,
  },
  storeSetting: {
    max: 20,
    debounceInterval: 100,
  },
  scaleSetting: {
    step: 0.05,
    min: 0.1,
    max: 3.0,
  },
  componentSetting: getComponentSetting(),
  sideBarSetting: getSideBarSetting(),
  toolBarSetting: getToolBarSetting(),
  actionBarSetting: getActionBarSetting(),
}
