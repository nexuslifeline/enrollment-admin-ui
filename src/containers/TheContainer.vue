<template>
  <div class="c-app">
    <!-- <TheSidebar/> -->
    <b-overlay :show="isLoading" class="full-overlay-container">
      <div v-if="!isLoading" class="c-wrapper">
        <TheHeader v-if="!$route.meta.hideHeader" />
        <div
          v-if="!$route.meta.hideMainArea"
          class="main-content"
          :class="{ shrink: !isHome && !isReport, report: isReport, home: isHome }">
          <!-- <LeftPane /> -->
          <div class="c-body">
            <main class="c-main">
              <div class="container-fluid" :style="isReport ? { height: '100%' } : {}">
                <router-view></router-view>
              </div>
            </main>
            <!-- <TheFooter/> -->
          </div>
        </div>
        <template v-else>
          <router-view></router-view>
        </template>
      </div>
    </b-overlay>
  </div>
</template>

<script>
//import LeftPane from './ContentLeftPane';
import TheHeader from './Header';
import TheFooter from './TheFooter';
import { AcademicRecordApi, AuthApi } from '../mixins/api';

export default {
  name: 'TheContainer',
  mixins: [AuthApi, AcademicRecordApi],
  components: {
    //LeftPane,
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      isLoading: true
    };
  },
  created() {
    this.loadProfile();
    this.loadApprovalCount();
  },
  computed: {
    isHome() {
      return this.$route.path?.includes('/home');
    },
    isReport() {
      return this.$route.path?.includes('/report');
    },
  },
  methods: {
    loadProfile() {
      this.isLoading = true;
      this.getAuthenticatedUser()
        .then(({ data }) => {
          this.isLoading = false;
          localStorage.setItem('userGroupId', data.userGroupId); // needs to be remove once were done
          this.$store.commit('SET_USER', data);
        })
        .catch((error) => {
          this.isLoading = false;
          this.$router.push({ path: '/login' })
        });
    },
    loadApprovalCount() {
      if (!this.$store.state?.schoolYear?.id) {
        console.warn('No selected School Year found!');
        return;
      }

      const params = {
        schoolYearId: this.$store.state.schoolYear.id,
      };
      this.getApprovalCount(params).then(({ data }) => {
        this.$store.commit('SET_APPROVAL_COUNT', data);
      });
    },
  },
  watch: {
    '$store.state.schoolYear': function(newVal) {
      this.loadApprovalCount();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  padding: 0;
  margin: 175px 0 0 0;
  transition: all .3s;

  .c-body {
    transition: all .3s;
  }

  &.shrink {
    margin-top: 85px;

    .c-body {
      margin-left: 0;
    }
  }

  &.report {
    margin-left: 280px;
    margin-top: 13px;
    height: 100%;

    .c-body {
      margin-left: 0;
    }
  }

  &.home {
    margin: 0;
  }
}

.full-overlay-container {
  height: 100vh;
}
</style>
