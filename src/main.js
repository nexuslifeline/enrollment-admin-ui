import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
//import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { httpRequest, httpAuthRequest } from './helpers/http'
import { BootstrapVue } from 'bootstrap-vue'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/plus-circle'
import 'vue-awesome/icons/ellipsis-v'
import 'vue-awesome/icons/caret-left'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/pen'
import 'vue-awesome/icons/file-pdf'
import 'vue-awesome/icons/file-image'
import 'vue-awesome/icons/times-circle'
import 'vue-awesome/icons/paperclip'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/paper-plane'
import 'vue-awesome/icons/map-marker-alt'
import 'vue-awesome/icons/calendar-alt'
import 'vue-awesome/icons/address-card'
import 'vue-awesome/icons/cogs'
import 'vue-awesome/icons/caret-down'
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
//Vue.use(IconsPlugin)
Vue.component('vue-autonumeric', require('vue-autonumeric'))
//import axios from 'axios'
Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = httpRequest
Vue.prototype.$authHttp = httpAuthRequest

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
