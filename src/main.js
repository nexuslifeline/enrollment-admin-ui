import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { httpRequest, httpAuthRequest } from './helpers/http'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// const axiosConfig = {
//   baseURL: 'http://enrollment.test',
//   timeout: 30000
// }
Vue.config.performance = true
Vue.component('v-icon', Icon)
Vue.use(CoreuiVue)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('vue-autonumeric', require('vue-autonumeric'))
//import axios from 'axios'
Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = httpRequest
Vue.prototype.$authHttp = httpAuthRequest

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
