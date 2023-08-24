import Vue from 'vue'
import {
  ConfigProvider,
  Button,
  Icon,
  Row,
  Col,
  Card,
  Modal,
  Spin,
  Tooltip,
  Divider,
  Popover,
  Tag,
  Dropdown,
  Empty,
  FormModel,
  Switch,
  Select,
  Input,
  InputNumber,
  Upload,
  Tabs,
  Collapse,
  Radio,
  TreeSelect,
  Cascader,
  Pagination,
  Carousel,
  Drawer,
  notification
} from 'ant-design-vue'

Vue.prototype.$notification = notification
Vue.prototype.$confirm = Modal.confirm

Vue.use(ConfigProvider)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Modal)
Vue.use(Spin)
Vue.use(Tooltip)
Vue.use(Divider)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(Empty)
Vue.use(FormModel)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(Collapse)
Vue.use(Radio)
Vue.use(TreeSelect)
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(Drawer)
