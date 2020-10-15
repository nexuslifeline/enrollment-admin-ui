<template>
  <div class="c-app">
    <!-- <TheSidebar/> -->
    <b-overlay :show="isLoading" class="full-overlay-container">
      <div v-if="!isLoading" class="c-wrapper">
        <TheHeader/>
        <div class="main-content">
          <LeftPane />
          <div class="c-body">
            <main class="c-main">
              <div class="container-fluid">
                <router-view></router-view>
              </div>
            </main>
            <!-- <TheFooter/> -->
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import LeftPane from './ContentLeftPane'
import TheHeader from './Header'
import TheFooter from './TheFooter'
import { AuthApi } from '../mixins/api'

export default {
  name: 'TheContainer',
  mixins: [AuthApi],
  components: {
    LeftPane,
    TheHeader,
    TheFooter
  },
  data() {
    return {
      isLoading: true
    }
  },
  created() {
    this.loadProfile();
  },
  methods: {
    loadProfile() {
      this.isLoading = true;
      this.getAuthenticatedUser().then(({ data }) => {
        this.isLoading = false;
        localStorage.setItem('userGroupId', data.userGroupId); // needs to be remove once were done
        this.$store.commit('SET_USER', data);
      }).catch((error) => {
        this.isLoading = false;
        this.$router.push({ path: '/login' });
      })
    }
  },
}
</script>

<style scoped>
.main-content {
  display: flex;
  padding: 0;
  margin: 175px 0 0 0;
}

.full-overlay-container {
  height: 100vh;
}
</style>
