<template>
  <div class="header" :class="{ shrink: !isHome && !isReport, left: isReport }">
    <div class="header__menus-container">
      <ul class="header__menus">
        <template v-for="(nav, idx) in $options.navItems.filter((v, i) => i < mainNavLimit)">
          <li
            v-if="isAccessible(nav.permissionIds)"
            :key="idx"
            class="header__menu-item"
            :class="{ active: $route.path.startsWith(nav.to) }">
            <a :href="`#${redirectTo(nav)}`" class="header__menu-link">
              {{ nav.label }}
            </a>
          </li>
        </template>
        <template v-if="$options.navItems.length > mainNavLimit">
          <li
            class="header__menu-item header__menu-item-more"
            :class="{ active: isMainNavActive }">
            <a
              @click.prevent.stop="onMainNavViewMore(activeIndex)"
              class="header__menu-link">
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
              class="header__main-nav-dropdown-container">
              <ul class="header__main-nav-dropdown">
                <template v-for="(nav, idx) in moreMainNavItems">
                  <template v-if="isAccessible(nav.permissionIds)">
                    <li
                      @click="mainNavOpen = []"
                      class="header__main-nav-dropdown-item"
                      :class="{ active: $route.path.startsWith(nav.to) }"
                      :key="idx">
                      <a
                        :href="`#${redirectTo(nav)}`"
                        class="header__menu-link">
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
      <YearDropdown />
      <OverviewDropdown :user="user" @onLogout="logout" :isLoggingOut="isLoading" />
    </div>
    <div v-if="isVisibleSubNav" class="header__account-details">
      <!-- <HeaderProfileCard v-if="isHome" :user="user" /> -->
      <div class="header__sub-menus-container">
        <template v-if="isReport" >
          <div class="header__left-panel-header">
            <span>List of Reports</span>
          </div>
          <div class="header__left-panel-search-container">
            <b-form-input
              type="text"
              placeholder="Search"
              v-model="search"
            ></b-form-input>
          </div>
        </template>
        <ul class="header__sub-menus">
          <template
            v-for="(subNav, idx) in visibleSubNavItems">
            <template v-if="isAccessible(subNav.permissionIds)">
              <li
                :key="idx"
                class="header__sub-menu-item"
                :class="{ active: $route.path === subNav.to }">
                <a :href="`#${subNav.to}`" class="header__sub-menu-link">
                  {{ subNav.label }}
                  <div
                    class="ml-1"
                    v-if="[
                      'Evaluation',
                      'Enlistment',
                      'Assessment',
                      'Payment',
                    ].includes(subNav.label) &&
                      $options.navItems[activeIndex].label === 'Enrollment' &&
                      $store.state.approvalCount[subNav.label.toLowerCase()] > 0">
                  <span
                    v-b-tooltip.hover="{
                    variant: 'info',
                    title:
                    `${$store.state.approvalCount[subNav.label.toLowerCase()]} Pending ${subNav.label}`,}">
                      ({{$store.state.approvalCount[subNav.label.toLowerCase()] }})
                  </span>
                  </div>
                  <span v-if="isReport" class="header__menu-description">
                    {{ subNav.description }}
                  </span>
                </a>
              </li>
            </template>
          </template>
          <template
            v-if="$options.navItems[activeIndex].children.length > subNavLimit">
            <li
              class="header__sub-menu-item header__menu-link-more"
              :class="{ active: isSubNavActive }">
              <a
                @click.prevent.stop="onSubNavViewMore(activeIndex)"
                class="header__menu-link">
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
                class="header__sub-navs-dropdown-container">
                <ul class="header__sub-navs-dropdown">
                  <template v-for="(subNav, idx) in moreSubNavItems">
                    <template v-if="isAccessible(subNav.permissionIds)">
                      <li
                        @click="subNavOpen = []"
                        :key="idx"
                        class="header__sub-navs-dropdown-item"
                        :class="{ active: $route.path === subNav.to }">
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
import { AuthApi, SchoolYearApi } from '../mixins/api';
import WaveBackground from '../views/components/WaveMaker';
import Access from '../mixins/utils/Access';
import { createLimiter } from '../helpers/utils';
import OverviewDropdown from './OverviewDropdown';
import YearDropdown from './YearDropdown';
import AvatarMaker from '../views/components/AvatarMaker';
import HeaderProfileCard from './HeaderProfileCard';

const MAIN_NAV_LIMIT = 8;
const SUB_NAV_LIMIT = 6;

export default {
  name: 'TheHeader',
  components: {
    ProfileMaker,
    WaveBackground,
    OverviewDropdown,
    YearDropdown,
    AvatarMaker,
    HeaderProfileCard
  },
  mixins: [AuthApi, SchoolYearApi, Access],
  navItems,
  createLimiter,
  data() {
    return {
      search: '',
      isOverviewOpen: false,
      showDropdown: false,
      isLoading: false,
      subNavLimit: SUB_NAV_LIMIT,
      mainNavLimit: MAIN_NAV_LIMIT,
      subNavOpen: [],
      mainNavOpen: [],
      options: {
        schoolYears: {
          items: [],
        },
      },
    };
  },
  computed: {
    isVisibleSubNav() {
      return !this.$route.meta?.hideSubNav;
    },
    visibleSubNavItems() {
      const { search, isReport, $options, subNavLimit, activeIndex } = this;
      const { children } = $options.navItems[activeIndex];
      if (isReport) {
        if (search) {
           return children.filter(v => [v?.label, v?.description].join(' ').toLowerCase().includes(search));
        } else {
          return children;
        }
      }

      return children.filter((v, i) => i < subNavLimit);
    },
    isHome() {
      return this.$route.path?.includes('/home');
    },
    isReport() {
      return this.$route.path?.includes('/report');
    },
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
    console.log(this.user)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateNavLimit);
    window.removeEventListener('click', this.hideDropdownItems);
  },
  methods: {
    loadSchoolYearList() {
      const { schoolYears } = this.options;
      this.getSchoolYearList({ paginate: false }).then(({ data }) => {
        const activeSchoolYear = data.find((d) => d.isActive === 1);
        this.$store.state.schoolYearId = activeSchoolYear
          ? activeSchoolYear.id
          : null;
        schoolYears.items = data;
      });
    },
    calculateNavLimit() {
      this.subNavLimit = this.getSubNavLimit();
      this.mainNavLimit = this.getMainNavLimit();
    },
    getSubNavLimit() {
      return this.$options.createLimiter([5, 5, 4, 4, 2, 2, 2, 1]);
    },
    getMainNavLimit(w) {
      return this.$options.createLimiter([6, 6, 6, 4, 4, 3, 2, 1]);
    },
    hideDropdownItems() {
      this.showDropdown = false;
      this.isOverviewOpen = false;
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
  created() {
    this.loadSchoolYearList();
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


.header__sub-menu-item {
  margin-right: 20px;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 18px;
  //color: $white;
  background-color: $white;

  &.active,
  &:hover {
    font-weight: 600;
    color: $dark-gray-500;
    background-color: $white;
    border-bottom: 3px solid $brand-primary;
  }

  &:last-child {
    margin-right: 0;
  }

  @include for-size(tablet-portrait-down) {
    margin-right: 15px;
    padding: 0 12px;
  }
}

.header {
  position: fixed;
  width: 100%;
  z-index: 10;

  &.shrink {
    .header__menus {
      // .header__menu-item {
      //   &.active {
      //     &:after {
      //       border-color: transparent transparent $white transparent;
      //     }
      //   }
      // }
    }

    .header__account-details {
      height: 39px;
      background-color: $white;
      border-bottom: 1px solid $light-gray-10;
      align-items: flex-start;

      .header__sub-menus-container {
        margin-left: 15px;
        margin-top: 0;
      }

      .header__sub-menus {
        max-width: none;
        margin: 0;
        padding-left: 15px;
      }

      .header__sub-menu-item {
        background: none;
        color: black;
        margin-right: 5px;

        &.active {
          border-bottom: 3px solid $brand-primary;
        }
      }
    }
  }

  &.left {
    .header__left-panel-search-container {
      padding: 10px 10px 0 10px;
      //border-bottom: 1px solid $light-gray-10;
      //background-color: $white;
    }

    // .header__menu-item {
    //   &.active {
    //     &:after {
    //       border-color: transparent transparent $white transparent;
    //     }
    //   }
    // }

    .header__account-details {
      position: fixed;
      top: 45px;
      left: 0;
      width: 280px;
      bottom: 0;
      height: 100%;
    }

    .header__sub-menus-container {
      height: 100%;
      max-height: none;
      width: 100%;
      margin: 0;
      background-color: $light-gray-100;
      border-right: 1px solid $light-gray-10;
    }

    .header__sub-menus {
      margin: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 15px 0;
      height: auto;
      max-width: none;
      margin: 0;
    }

    .header__sub-menu-item {
      color: $black;
      padding: 0;
      display: flex;
      flex-direction: column;
      font-weight: 500;
      font-size: 15px;
      padding: 10px 15px 15px 15px;
      margin: 0;
      border-radius: 3px;
      background-color: $white;
      margin: 3px 8px;
      border-bottom: 0;

      &.active {
        color: $black;
        border-left: 3px solid $blue;
      }

      &:hover {
        border-left: 3px solid $blue;
      }
    }

    .header__sub-menu-link {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .header__menu-description {
      color: $dark-gray;
      font-weight: normal;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      cursor: pointer;
      line-height: 17px;
    }

    .header__left-panel-header {
      padding: 8px 15px;
      font-size: 13px;
      height: 36px;
      font-weight: 600;
      text-transform: uppercase;
      color: $dark-gray-500;
      border-bottom: 1px solid $light-gray-10;
      background-color: $white;
      display: flex;
      align-items: center;
    }
  }
}

.header__menus-container {
  background-color: $dark-gray-500;
  height: 45px;
  width: 100%;
  padding: 0 60px;
  display: flex;

  @include for-size(tablet-landscape-down) {
    padding: 0 20px;
  }
}

.header__sub-menus-container {
  max-height: 38px;
  flex: 1;
  align-items: flex-end;
  //margin-left: 235px;
  z-index: 1;
  transition: all .3s;
  background-color: $white;

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
      // border-color: transparent transparent #40acdb transparent;
      border-color: transparent transparent $white transparent;
      opacity: 0.95;
    }
  }

  @include for-size(tablet-landscape-down) {
    margin-right: 45px;
  }
}

.header__account-details {
  height: 115px;
  //background-color: #24a0d6;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all .3s;
  justify-content: flex-end;
  align-items: center;
}

.header__sub-menus {
  list-style: none;
  padding: 0;
  max-width: $header-details-row-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 100%;
  align-items: center;
  padding: 0 20px 0 70px;

  @include for-size(tablet-portrait-down) {
    padding: 0;
  }
}

.header__account-profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 0 15px 75px;

  @include for-size(tablet-portrait-down) {
    padding: 10px;
    justify-content: center;
  }
}

.header__account-name {
  font-size: 18px;
  font-weight: 600;
  color: $white;
  margin: 0;

  @include for-size(tablet-portrait-down) {
    font-size: 16px;
  }
}

.header__account-group {
  font-size: 13px;
  line-height: 15px;
  margin: 0;
  color: $white;
}

.header__menu-link, .header__sub-menu-link {
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

.header__school-year {
  margin-right: 15px;
}
</style>
