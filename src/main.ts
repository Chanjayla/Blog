import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import { Menu, MenuItem, Submenu } from 'element-ui'
import { timestampFilter } from './filters'

Vue.filter('timestampToDate', timestampFilter)
Vue.config.productionTip = false
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
