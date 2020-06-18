<style scoped>
  a.c-header-brand:hover {
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
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <div class="logo__stc-brand">
        <img src="../assets/images/stc_logo.png"> <span class="logo__title">Saint Theresa College <br> of Tandag Inc.</span>
      </div>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <!--<CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem>-->
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  }
}
</script>
