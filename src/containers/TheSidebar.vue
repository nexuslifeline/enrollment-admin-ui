<style scoped>
  a.c-sidebar-brand:hover {
    text-decoration: none;
  }
  .logo__stc-brand {
    display: flex;
    align-items: center;
    padding: 16px 8px;
    font-weight: bold;
  }
  .logo__stc-brand img {
      width: 60px;
      height: auto;
      margin: 0 8px;
  }
  .c-sidebar-minimized .logo__stc-brand .logo__title {
    display: none;
    opacity: 0;
  }
  .c-sidebar-minimized .logo__stc-brand img {
    width: 40px;
    height: auto;
  }
</style>
<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <div class="logo__stc-brand">
        <img src="../assets/images/stc_logo.png"> <span class="logo__title">Saint Theresa College <br> of Tandag Inc.</span>
      </div>
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="$options.nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  nav,
  computed: {
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    }
  }
}
</script>


