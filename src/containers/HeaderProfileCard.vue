<template>
  <div class="header__account-main-card">
    <div class="header__main-card-cover">
      <WaveBackground />
    </div>
    <div class="header__main-card-content">
      <div class="header__account-photo-container">
        <AvatarMaker
          class="header__main-card-photo"
          :avatarId="user.id"
          :size="110"
          :text="`${user.userable.firstName.charAt(0)}${user.userable.lastName.charAt(0)}`"
          :src="userPhoto"
        />
      </div>
      <div class="header__account-profile-details">
        <p class="header__account-name">{{ user.userable.name }}</p>
        <p class="header__account-group">{{ userGroup }}</p>
        <p class="header__account-address">San Jose, San Simon, Pampanga, Philippines</p>
      </div>
    </div>
    <ul class="home-profile__menu">
      <template v-for="menu in homeMenus">
        <li class="home-profile__menu-item" :class="{ active: $route.path.startsWith(menu.to) }">
          <a :href="`#${menu.to}`" class="home-profile__menu-item-link">{{ menu.label }}</a>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import AvatarMaker from '../views/components/AvatarMaker';
import WaveBackground from '../views/components/WaveMaker';
import Navs from './navs';

export default {
  props: {
    user: Object,
  },
  data() {
    return {
      homeMenus: Navs.filter(v => v?.label === 'Home')?.[0]?.children,
    }
  },
  components: {
    AvatarMaker,
    WaveBackground
  },
  computed: {
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
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/shared.scss';

.home-profile__menu {
  list-style: none;
  margin: 0;
  padding: 0 35px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-start;
  border-top: 1px solid $light-gray-200;
}

.home-profile__menu-item {
  display: flex;
  align-items: center;
  margin-right: 50px;
  padding: 0 15px;
  height: 100%;

  &.active {
    border-bottom: 3px solid $blue;

    .home-profile__menu-item-link {
      color: $dark-gray-500;
      font-weight: 500;
    }
  }
}

.home-profile__menu-item-link {
  color: $dark-gray-200;
}

.header__account-main-card {
  display: flex;
  flex-direction: column;
  z-index: 1;
  width: 100%;
  max-width: $header-details-row-max-width;
  margin: 0 auto;
  height: 400px;
  z-index: 2;
  border: 1px solid $light-gray-200;
  background-color: $white;
  border-radius: 6px;
  overflow: hidden;
  padding: 0;
  margin-bottom: 30px;
}

.header__account-photo-container {
  position: absolute;
  top: -60px;
  left: 30px;
}

.header__main-card-cover {
  position: relative;
  height: 180px;
  background-color: $blue;
  margin: 0;
}

.header__main-card-content {
  flex: 1;
  position: relative;
}

.header__main-card-photo {
  border: 3px solid $white;
}

.header__account-profile-details {
  margin-top: 60px;
  padding-left: 30px;
}

.header__account-name {
  font-size: 22px;
  font-weight: 500;
  color: $dark-gray-500;
  margin: 0;
}

.header__account-group {
  font-size: 14px;
  font-weight: 500;
  color: $dark-gray-300;
  margin: 0;
}

.header__account-address {
  font-size: 14px;
  color: $dark-gray-200;
  margin: 0;
}
</style>