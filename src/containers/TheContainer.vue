<template>
  <div class="c-app">
    <!-- <TheSidebar/> -->
    <CWrapper>
      <TheHeader/>
      <div class="main-content">
        <LeftPane />
        <div class="c-body">
          <main class="c-main">
            <CContainer fluid>
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </CContainer>
          </main>
          <TheFooter/>
        </div>
      </div>
    </CWrapper>
  </div>
</template>

<script>
import LeftPane from './ContentLeftPane'
import TheHeader from './Header'
import TheFooter from './TheFooter'

export default {
  name: 'TheContainer',
  components: {
    LeftPane,
    TheHeader,
    TheFooter
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.main-content {
  display: flex;
  padding: 0;
  margin: 0;
}
</style>
