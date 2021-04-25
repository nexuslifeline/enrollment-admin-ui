<template>
  <div class="header__account-main-card">
    <div class="header__main-card-cover">
      <WaveBackground />
      <div class="action-container">
        <button @click="$router.push({ name: 'EditProfile' })" class="action-edit">
          <BIconPencil class="action-icon" /> Edit Profile
        </button>
      </div>
    </div>
    <div class="header__main-card-content">
      <div class="header__account-photo-container">
        <AvatarMaker
          @onPhotoChange="onPhotoChange"
          :avatarId="user.id"
          :size="110"
          :text="`${userable.firstName.charAt(0)}${userable.lastName.charAt(0)}`"
          :src="userPhoto"
          :borderSize="3"
          enableUpload
        />
      </div>
      <div class="header__account-details__container">
        <div class="header__account-details__column-left">
          <vText size="xl" weight="bold">{{ userable.name }}</vText>
          <vText size="m" weight="bold">{{ userGroup }}</vText>
          <vText size="s">{{ userable.completeAddress }}</vText>
        </div>
        <div class="header__account-details__column-right">
          <vText size="s" marginBottom="5">{{ user.username }}</vText>
          <vText size="s" marginBottom="5" v-if="!!userable.mobileNo || !!userable.phoneNo">
            {{ userable.mobileNo || userable.phoneNo }}
          </vText>
          <vText size="s" marginBottom="5" v-if="!!userable.facebookUrl">{{ userable.facebookUrl }}/</vText>
          <vText size="s" marginBottom="5" v-if="!!userable.webUrl">{{ userable.webUrl }}</vText>
        </div>
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
import { AuthApi, PersonnelApi } from '../mixins/api';
import AvatarMaker from '../views/components/AvatarMaker';
import WaveBackground from '../views/components/WaveMaker';
import Navs from './navs';
import { showNotification } from '../helpers/forms'

export default {
  props: {
    user: Object,
  },
  mixins: [PersonnelApi],
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
    userable() {
      return this.$store.state?.user?.userable || {};
    },
  },
  methods: {
    onPhotoChange(file) {
      const formData = new FormData();
      const { id: personnelId } = this.userable
      formData.append('photo', file);

      this.savePhoto(formData, personnelId).then(({ data }) => {
        const { user } = this.$store.state;
        const newUser = { ...user, userable: { ...this.userable, photo: { ...data } } };
        this.$store.commit('SET_USER', newUser);
        this.isLoading = false;
        showNotification(this, 'success', 'Your profile photo has been updated.')
      }).catch((error) => {
        showNotification(this, 'danger', 'Unable to update your photo. Please contact your system administrator.')
      });

    }
  },
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

.header__account-details__container {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  padding: 0 30px;
  flex-wrap: wrap;
}

.header__account-details__column-left {
  display: flex;
  flex-direction: column;
  flex: 60%;

  @include for-size(tablet-portrait-down) {
    flex: 100%;
  }
}

.header__account-details__column-right {
  display: flex;
  flex-direction: column;
  flex: 40%;

  @include for-size(tablet-portrait-down) {
    margin: 30px 0;
    flex: 100%;
  }
}

.action-container {
  z-index: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.action-edit {
  margin: 10px 10px 10px 0;
  padding: 6px 14px;
  background-color: $white;
  border: 0;
  border-radius: 3px;
  outline: none;

  &:hover {
    background-color: $black;
    color: $white;
  }
}

.action-icon {
  margin-right: 3px;
}

</style>