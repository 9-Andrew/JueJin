import SvgIcon from './SvgIcon/index.vue'
import CustomedAvatar from './CustomedAvatar/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const components = { SvgIcon, CustomedAvatar }

export default {
  install(app) {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
