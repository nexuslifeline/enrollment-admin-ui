import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  isLoggedIn: !!localStorage.getItem('adminAccessToken') ?? false,
  user: [],
}

const mutations = {
  TOGGLE_SIDEBAR_DESKTOP (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  TOGGLE_SIDEBAR_MOBILE (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
  LOGIN_USER (state) {
    state.isLoggedIn = true
  },
  LOGOUT_USER (state) {
    state.isLoggedIn = false
  },
  SET_USER (state, user_data) {
    state.user = user_data
  },
}

export default new Vuex.Store({
  state,
  mutations
})