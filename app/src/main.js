import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'normalize.css'
import '@/assets/main.css'
//引入Elmessage和Elloading的css样式文件
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/icon/iconfont.js'

import _ from 'lodash'

const app = createApp(App)
app.config.globalProperties.$debounce = _.debounce
app.config.globalProperties.$throttle = _.throttle
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia()).use(router).mount('#app')
