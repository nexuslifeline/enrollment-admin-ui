<template>
  <div class="header">
    <div class="header__menus-container">
      <ul class="header__menus">
        <li
          v-for="(nav, idx) in $options.navItems.filter(
            (v, i) => i < mainNavLimit
          )"
          v-if="isAccessible(nav.permissionIds)"
          :key="idx"
          class="header__menu-item"
          :class="{ active: $route.path.startsWith(nav.to) }"
        >
          <a :href="`#${redirectTo(nav)}`" class="header__menu-link">
            {{ nav.label }}
          </a>
        </li>
        <template v-if="$options.navItems.length > mainNavLimit">
          <li
            class="header__menu-item header__menu-item-more"
            :class="{ active: isMainNavActive }"
          >
            <a
              @click.prevent.stop="onMainNavViewMore(activeIndex)"
              class="header__menu-link"
            >
              More
              <BIconCaretUpFill
                v-if="mainNavOpen.includes(activeIndex)"
                scale=".8"
                class="ml-2"
              />
              <BIconCaretDownFill v-else scale=".8" class="ml-2" />
            </a>
            <div
              v-if="mainNavOpen.includes(activeIndex)"
              class="header__main-nav-dropdown-container"
            >
              <ul class="header__main-nav-dropdown">
                <template v-for="(nav, idx) in moreMainNavItems">
                  <template v-if="isAccessible(nav.permissionIds)">
                    <li
                      @click="mainNavOpen = []"
                      class="header__main-nav-dropdown-item"
                      :class="{ active: $route.path.startsWith(nav.to) }"
                    >
                      <a
                        :href="`#${redirectTo(nav)}`"
                        class="header__menu-link"
                      >
                        {{ nav.label }}
                      </a>
                    </li>
                  </template>
                </template>
              </ul>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <div class="header__account-details">
      <WaveBackground />
      <div class="header__account-details-row">
        <div class="header__account-photo-container">
          <img
            v-if="!!userPhoto"
            class="header__account-photo"
            :src="userPhoto"
          />
          <ProfileMaker
            v-else
            class="header__account-photo"
            :initials="user.userable.name.charAt(0)"
            :colorIndex="user.id % 8"
          />
        </div>
        <div class="header__account-profile-details">
          <p class="header__account-name">{{ user.userable.name }}</p>
          <p class="header__account-group">{{ userGroup }}</p>
        </div>
        <div class="header__account-actions">
          <button
            @click.stop="showDropdown = !showDropdown"
            type="button"
            class="account-action__settings"
          >
            <v-icon name="cogs" scale="1.1" class="account-action__icon mr-2" />
            <v-icon
              name="caret-down"
              class="account-action__icon"
              scale=".85"
            />
            <div v-if="showDropdown" class="account-action__dropdown">
              <ul class="account-action__dropdown-items">
                <li class="account-action__dropdown-item">
                  <a href="#" class="account-action__dropdown-item-link">
                    My Profile
                  </a>
                </li>
                <li
                  @click.prevent.stop="logout"
                  class="account-action__dropdown-item"
                >
                  <a href="#" class="account-action__dropdown-item-link">
                    Logout
                    <v-icon v-if="isLoading" name="spinner" spin class="ml-2" />
                  </a>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
      <div class="header__sub-menus-container">
        <ul class="header__sub-menus">
          <template
            v-for="(subNav, idx) in $options.navItems[
              activeIndex
            ].children.filter((v, i) => i < subNavLimit)"
          >
            <template v-if="isAccessible(subNav.permissionIds)">
              <li
                :key="idx"
                class="header__sub-menu-item"
                :class="{ active: $route.path === subNav.to }"
              >
                <a :href="`#${subNav.to}`" class="header__menu-link">
                  {{ subNav.label }}
                  <div
                    class="ml-1"
                    v-if="
                      [
                        'Evaluation',
                        'Enlistment',
                        'Assessment',
                        'Payment',
                      ].includes(subNav.label) &&
                        $store.state.approvalCount[subNav.label.toLowerCase()] >
                          0
                    "
                  >
                    ({{
                      $store.state.approvalCount[subNav.label.toLowerCase()]
                    }})
                  </div>
                </a>
              </li>
            </template>
          </template>
          <template
            v-if="$options.navItems[activeIndex].children.length > subNavLimit"
          >
            <li
              class="header__sub-menu-item header__menu-link-more"
              :class="{ active: isSubNavActive }"
            >
              <a
                @click.prevent.stop="onSubNavViewMore(activeIndex)"
                class="header__menu-link"
              >
                More
                <BIconCaretUpFill
                  v-if="subNavOpen.includes(activeIndex)"
                  scale=".8"
                  class="ml-2"
                />
                <BIconCaretDownFill v-else scale=".8" class="ml-2" />
              </a>
              <div
                v-if="subNavOpen.includes(activeIndex)"
                class="header__sub-navs-dropdown-container"
              >
                <ul class="header__sub-navs-dropdown">
                  <template v-for="(subNav, idx) in moreSubNavItems">
                    <template v-if="isAccessible(subNav.permissionIds)">
                      <li
                        @click="subNavOpen = []"
                        :key="idx"
                        class="header__sub-navs-dropdown-item"
                        :class="{ active: $route.path === subNav.to }"
                      >
                        <a :href="`#${subNav.to}`" class="header__menu-link">
                          {{ subNav.label }}
                        </a>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import navItems from './navs';
import ProfileMaker from '../views/components/ProfileMaker';
import { AuthApi } from '../mixins/api';
import WaveBackground from '../views/components/WaveMaker';
import Access from '../mixins/utils/Access';
import { createLimiter } from '../helpers/utils';

const MAIN_NAV_LIMIT = 8;
const SUB_NAV_LIMIT = 6;

export default {
  name: 'TheHeader',
  components: {
    ProfileMaker,
    WaveBackground,
  },
  mixins: [AuthApi, Access],
  navItems,
  createLimiter,
  data() {
    return {
      showDropdown: false,
      isLoading: false,
      subNavLimit: SUB_NAV_LIMIT,
      mainNavLimit: MAIN_NAV_LIMIT,
      subNavOpen: [],
      mainNavOpen: [],
    };
  },
  computed: {
    activeIndex() {
      return this.$options.navItems.findIndex((v) =>
        this.$route.path.includes(v.to)
      );
    },
    user() {
      return this.$store.state.user;
    },
    userPhoto() {
      const userable = this.user && this.user.userable;
      const path =
        (userable && userable.photo && userable.photo.hashName) || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    userGroup() {
      const userGroup = this.user && this.user.userGroup;
      const name = (userGroup && userGroup.name) || 'System Administrator';
      return name;
    },
    moreSubNavItems() {
      return this.$options.navItems[this.activeIndex].children.filter(
        (v, i) => i >= this.subNavLimit
      );
    },
    moreMainNavItems() {
      return this.$options.navItems.filter((v, i) => i >= this.mainNavLimit);
    },
    isSubNavActive() {
      return (
        this.subNavOpen.includes(this.activeIndex) ||
        this.moreSubNavItems.map((v) => v.to).includes(this.$route.path)
      );
    },
    isMainNavActive() {
      return (
        this.mainNavOpen.includes(this.activeIndex) ||
        !!this.moreMainNavItems
          .map((v) => v.to)
          .filter((v) => this.$route.path.startsWith(v))?.length
      );
    },
  },
  mounted() {
    this.calculateNavLimit();
    window.addEventListener('resize', this.calculateNavLimit);
    window.addEventListener('click', this.hideDropdownItems);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateNavLimit);
    window.removeEventListener('click', this.hideDropdownItems);
  },
  methods: {
    calculateNavLimit() {
      this.subNavLimit = this.getSubNavLimit();
      this.mainNavLimit = this.getMainNavLimit();
    },
    getSubNavLimit() {
      return this.$options.createLimiter([6, 6, 5, 4, 3, 2, 2, 1]);
    },
    getMainNavLimit(w) {
      return this.$options.createLimiter([8, 8, 7, 6, 4, 4, 3, 1]);
    },
    hideDropdownItems() {
      this.showDropdown = false;
      this.subNavOpen = [];
      this.mainNavOpen = [];
    },
    redirectTo(nav) {
      const { children } = nav;
      const accessibleChildren = children.filter((child) =>
        this.isAccessible(child.permissionIds)
      );
      if (accessibleChildren.length > 0) {
        return accessibleChildren[0].to;
      }
      return nav.to;
    },
    logout() {
      // Note! needs to be refactored
      if (localStorage.adminAccessToken) {
        localStorage.clear();
        this.isLoading = true;
        this.revokeAuthentication()
          .then((response) => {
            this.$store.commit('LOGOUT_USER');
            setTimeout(() => {
              this.$store.commit('SET_USER', {});
              this.isLoading = false;
              this.$router.push({ name: 'Login' });
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }
    },
    onSubNavViewMore(idx) {
      this.subNavOpen = !!this.subNavOpen?.length ? [] : [idx];
    },
    onMainNavViewMore(idx) {
      this.mainNavOpen = !!this.mainNavOpen?.length ? [] : [idx];
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/scss/shared.scss';

.header__account-actions {
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  @include for-size(tablet-portrait-down) {
    padding: 10px;
  }
}

.account-action__settings {
  outline: 0;
  border: 1px solid $gray;
  background: none;
  padding: 5px 7px;
  border-radius: 3px;
  position: relative;
}

.account-action__icon {
  color: $white;
}

.account-action__dropdown {
  position: absolute;
  background-color: $white;
  border: 1px solid $brand-border-color;
  top: 35px;
  right: 0;
  min-width: 180px;
  border-radius: 3px;
}

.account-action__dropdown-items {
  list-style: none;
  width: 100%;
  padding: 8px 0;
  margin: 0;
}

.account-action__dropdown-item {
  padding: 5px 20px;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid $brand-border-color;

  &:last-child {
    border: 0;
  }
}

.account-action__dropdown-item-link {
  color: $dark-gray-600;
}

.header {
  position: fixed;
  width: 100%;
  z-index: 4;
}

.header__menus-container {
  background-color: $dark-gray-500;
  height: 45px;
  width: 100%;
  padding: 0 60px;

  @include for-size(tablet-landscape-down) {
    padding: 0 20px;
  }
}

.header__sub-menus-container {
  height: 33px;
  //width: 100%;
  flex: 1;
  margin-left: 235px;
  //padding: 0 230px;
  //background-color: $brand-primary;
  z-index: 1;

  @include for-size(tablet-portrait-down) {
    padding: 0 20px;
    margin-left: 0;
  }
}

.header__menus {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  color: $white;
  font-size: 14px;
  height: 100%;
  align-items: center;
}

.header__menu-item {
  margin-right: 60px;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  color: $gray;

  &.active {
    color: $white;

    &:after {
      content: ' ';
      position: absolute;
      z-index: 2;
      left: calc(50% - 20px);
      top: calc(45px - 10px);

      display: inline-block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 11px 10px 11px;
      border-color: transparent transparent #40acdb transparent;
      opacity: 0.95;
    }
  }

  @include for-size(tablet-landscape-down) {
    margin-right: 45px;
  }
}

.header__account-details {
  height: 130px;
  background-color: #24a0d6;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header__account-details-row {
  display: flex;
  z-index: 1;
}

.header__sub-menus {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 100%;
  align-items: center;
  padding: 0 20px;

  @include for-size(tablet-portrait-down) {
    padding: 0;
  }
}

.header__sub-menu-item {
  margin-right: 20px;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 18px;
  color: $white;

  &.active,
  &:hover {
    font-weight: 600;
    color: $dark-gray-500;
    background-color: $white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    //border-radius-top-left: 3px;
    //border-top: 3px solid $dark-blue;
  }

  &:last-child {
    margin-right: 0;
  }

  @include for-size(tablet-portrait-down) {
    margin-right: 15px;
    padding: 0 12px;
  }
}

.header__account-photo-container {
  width: 235px;

  @include for-size(tablet-portrait-down) {
    padding: 15px;
    width: auto;
    display: flex;
    flex: 0;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.header__account-profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 30px;

  @include for-size(tablet-portrait-down) {
    padding: 10px;
    justify-content: center;
  }
}

.header__account-photo {
  border-radius: 50%;
  height: 150px;
  width: 150px;
  object-fit: cover;
  position: absolute;
  left: 40px;
  top: 22%;
  border: 5px solid $white;
  font-size: 70px;

  @include for-size(tablet-portrait-down) {
    font-size: 30px;
    position: static;
    height: 70px;
    width: 70px;
  }
}

.header__account-name {
  font-size: 24px;
  font-weight: 600;
  color: $white;
  margin: 0;

  @include for-size(tablet-portrait-down) {
    font-size: 20px;
  }
}

.header__account-group {
  font-size: 14px;
  margin: 0;
  color: $white;
}

.header__menu-link {
  color: inherit;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
}

.header__menu-link-more {
  position: relative;
}

.header__sub-navs-dropdown-container {
  position: absolute;
  background-color: $white;
  min-width: 175px;
  border: 1px solid $brand-border-color;
  border-top: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 7px 0;
  top: 33px;
  left: 0;

  @include for-size(tablet-landscape-down) {
    top: 30px;
    left: auto;
    right: 0;
  }
}

.header__sub-navs-dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
}

.header__sub-navs-dropdown-item {
  color: $dark-gray-500;
  padding: 8px 15px;
  font-weight: normal;

  &:hover,
  &.active {
    background-color: $light-gray-100;
  }
}

.header__menu-item-more {
  position: relative;
}

.header__main-nav-dropdown-container {
  position: absolute;
  padding: 12px 0 6px 0;
  border: 1px solid $dark-gray-500;
  background-color: $dark-gray-500;
  top: 33px;
  left: -15px;
  z-index: 3;
  min-width: 175px;
}

.header__main-nav-dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
}

.header__main-nav-dropdown-item {
  padding: 7px 15px;

  &:hover,
  &.active {
    background-color: $dark-gray-600;
    color: $white;
  }
}
</style>
