import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  isLoggedIn: !!localStorage.getItem('access_token') ?? false,
  user: [],
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
  loginUser (state) {
    state.isLoggedIn = true
  },
  logoutUser (state) {
    state.isLoggedIn = false
  },
  user (state, user_data) {
    state.user = user_data
  },
}

export default new Vuex.Store({
  state,
  mutations
})