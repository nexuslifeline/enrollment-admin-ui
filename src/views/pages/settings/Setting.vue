<template>
  <div class="c-page-content">
    <div class="main-container">
      <div class="left-pane">
        <p class="sub-nav__title">{{$options.subNav.title}}</p>
        <ul class="sub-nav">
          <li
            v-for="(item, idx) in accessibleNav"
            :key="idx"
            class="sub-nav__item"
            :class="{ active: $route.path.includes(item.to)}"
            >
            <router-link
              class="sub-nav__link"
              :to="`/home/settings${item.to}`">
              {{item.label}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="right-pane">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import subNav from './data/subNav';
import Access from '../../../mixins/utils/Access'
export default {
  subNav,
  mixins: [ Access ],
  data() {
    return {

    }
  },
  created() {
   this.loadDefaultNav()
  },
  methods: {
    loadDefaultNav() {
      const defaultNav = this.accessibleNav[0] ? this.accessibleNav[0] : null
      if(defaultNav) {
        this.$router.push(`/home/settings${defaultNav.to}`)
      }
    }
  },
  computed: {
    accessibleNav() {
      const { items } = this.$options.subNav
      return items.filter(e => this.isAccessible(e.permissionId))
    }
  }
}
</script>

<style lang="scss" scoped>

  @import "../../../assets/scss/shared.scss";

  .main-container {
    height: 100%;
    display: flex;
    overflow: hidden;
    @include for-size(phone-only) {
      flex-direction: column;
      padding: 20px 20px 0 20px;
    }
  }

  .sub-nav {
    list-style: none;
    padding: 0;
  }

  .sub-nav__item {
    margin-bottom: 10px;
    padding: 6px 20px;

    &.active {
      background-color: $light-blue-10;
      border-radius: 3px;

      .sub-nav__link {
        color: $brand-primary;
        font-weight: 500;
      }
    }
  }

  .sub-nav__title {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .left-pane {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    // border-right: 1px solid $light-gray-10;
  }

  .sub-nav__link {
    font-size: 14px;
    color: $black;
  }

  .right-pane {
    flex: 1;
    border: solid whitesmoke 1px;
    padding:30px;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

</style>