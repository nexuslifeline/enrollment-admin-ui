import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
//import CoreuiVue from '@coreui/vue'
//import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { httpRequest, httpAuthRequest } from './helpers/http'
//import { BootstrapVue } from 'bootstrap-vue'
import vSelect from 'vue-select'
import { AlertPlugin } from 'bootstrap-vue';
import { AvatarPlugin } from 'bootstrap-vue';
import { BadgePlugin } from 'bootstrap-vue';
//import { BreadcrumbPlugin } from 'bootstrap-vue'
import { ButtonPlugin } from 'bootstrap-vue';
import { ButtonGroupPlugin } from 'bootstrap-vue'
import { ButtonToolbarPlugin } from 'bootstrap-vue'
//import { CalendarPlugin } from 'bootstrap-vue'
import { CardPlugin } from 'bootstrap-vue'
//import { CarouselPlugin } from 'bootstrap-vue'
import { CollapsePlugin } from 'bootstrap-vue'
import { DropdownPlugin } from 'bootstrap-vue'
import { EmbedPlugin } from 'bootstrap-vue'
import { FormPlugin } from 'bootstrap-vue'
import { FormCheckboxPlugin } from 'bootstrap-vue'
import { FormDatepickerPlugin } from 'bootstrap-vue'
import { FormFilePlugin } from 'bootstrap-vue'
import { FormGroupPlugin } from 'bootstrap-vue'
import { FormInputPlugin } from 'bootstrap-vue'
import { FormRadioPlugin } from 'bootstrap-vue'
//import { FormRatingPlugin } from 'bootstrap-vue'
import { FormSelectPlugin } from 'bootstrap-vue'
import { FormSpinbuttonPlugin } from 'bootstrap-vue'
//import { FormTagsPlugin } from 'bootstrap-vue'
import { FormTextareaPlugin } from 'bootstrap-vue'
import { FormTimepickerPlugin } from 'bootstrap-vue'
import { ImagePlugin } from 'bootstrap-vue'
import { InputGroupPlugin } from 'bootstrap-vue'
//import { JumbotronPlugin } from 'bootstrap-vue'
import { LayoutPlugin } from 'bootstrap-vue'
import { LinkPlugin } from 'bootstrap-vue'
import { ListGroupPlugin } from 'bootstrap-vue'
import { MediaPlugin } from 'bootstrap-vue'
import { ModalPlugin } from 'bootstrap-vue'
//import { NavPlugin } from 'bootstrap-vue'
//import { NavbarPlugin } from 'bootstrap-vue'
import { OverlayPlugin } from 'bootstrap-vue'
import { PaginationPlugin } from 'bootstrap-vue'
import { PaginationNavPlugin } from 'bootstrap-vue'
//import { PopoverPlugin } from 'bootstrap-vue'
//import { ProgressPlugin } from 'bootstrap-vue'
//import { SidebarPlugin } from 'bootstrap-vue'
import { SpinnerPlugin } from 'bootstrap-vue'
import { TablePlugin } from 'bootstrap-vue'
import { TabsPlugin } from 'bootstrap-vue'
//import { TimePlugin } from 'bootstrap-vue'
import { ToastPlugin } from 'bootstrap-vue'
//import { TooltipPlugin } from 'bootstrap-vue'
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
import 'vue-awesome/icons/chevron-down'
import 'vue-awesome/icons/chevron-left'
import Icon from 'vue-awesome/components/Icon'
// import vSelect from 'vue-select'

// Vue.component('v-select', vSelect);

//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// const axiosConfig = {
//   baseURL: 'http://enrollment.test',
//   timeout: 30000
// }
Vue.config.performance = true
Vue.component('v-icon', Icon)
Vue.component('v-select', vSelect)

//Vue.use(CoreuiVue)
//Vue.use(BootstrapVue)
//Vue.use(IconsPlugin)
Vue.component('vue-autonumeric', require('vue-autonumeric'))
//import axios from 'axios'
Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = httpRequest
Vue.prototype.$authHttp = httpAuthRequest


Vue.use(AlertPlugin);
Vue.use(AvatarPlugin);
Vue.use(BadgePlugin);
//Vue.use(BreadcrumbPlugin);
Vue.use(ButtonPlugin);
Vue.use(ButtonGroupPlugin)
Vue.use(ButtonToolbarPlugin)
//Vue.use(CalendarPlugin)
Vue.use(CardPlugin)
//Vue.use(CarouselPlugin)
Vue.use(CollapsePlugin)
Vue.use(DropdownPlugin)
Vue.use(EmbedPlugin)
Vue.use(FormPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormDatepickerPlugin)
Vue.use(FormFilePlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormRadioPlugin)
//Vue.use(FormRatingPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormSpinbuttonPlugin)
//Vue.use(FormTagsPlugin)
Vue.use(FormTextareaPlugin)
Vue.use(FormTimepickerPlugin)
Vue.use(ImagePlugin)
Vue.use(InputGroupPlugin)
//Vue.use(JumbotronPlugin)
Vue.use(LayoutPlugin)
Vue.use(LinkPlugin)
Vue.use(ListGroupPlugin)
Vue.use(MediaPlugin)
Vue.use(ModalPlugin)
//Vue.use(NavPlugin)
//e.use(NavbarPlugin)
Vue.use(OverlayPlugin)
Vue.use(PaginationPlugin)
Vue.use(PaginationNavPlugin)
//Vue.use(PopoverPlugin)
//Vue.use(ProgressPlugin)
//Vue.use(SidebarPlugin)
Vue.use(SpinnerPlugin)
Vue.use(TablePlugin)
Vue.use(TabsPlugin)
//ue.use(TimePlugin)
Vue.use(ToastPlugin)
//Vue.use(TooltipPlugin)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
