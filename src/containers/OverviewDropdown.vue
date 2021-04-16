<template>
  <div class="header__secondary-account-details" @click.stop="isOverviewOpen = !isOverviewOpen">
    <AvatarMaker
      :avatarId="user.id"
      :size="31"
      :text="initialText"
      :src="userPhoto"
    />
    <div class="header__secondary-account-name">
      {{ user.userable.name }}
    </div>
    <button @click.stop="isOverviewOpen = !isOverviewOpen" class="header__secondary-overview-action">
      <v-icon name="ellipsis-v" />
      <div v-if="isOverviewOpen" class="header__secondary-overview-dropdown">
        <div class="header__secondary-overview-top-bar">
          <span class="header__top-bar-title">
            Overview
          </span>
          <span class="header__top-bar-action" @click.stop="$emit('onLogout')">
            <v-icon
              v-if="isLoggingOut"
              name="spinner"
              spin
              class="mr-2"
            />
            Logout
          </span>
        </div>
        <div class="header__secondary-overview-content">
          <div class="header__overview-personal-info-row">
            <BIconPerson class="header__overview-icon" />
            <div class="header__overview-personal-info">
              <div class="header__overview-personal-info-item">
                {{ user.userable.name }}
              </div>
              <div class="header__overview-personal-info-item-light">
                {{ user.userGroup.name }}
              </div>
            </div>
            <div class="header__overview-photo-container">
              <AvatarMaker
                :avatarId="user.id"
                :size="43"
                :text="initialText"
                :src="userPhoto"
              />
            </div>
          </div>
          <div v-if="user.username" class="header__overview-personal-info-row mt-0">
            <BIconEnvelope class="header__overview-icon" />
            <div class="header__overview-personal-info-item-light">
              {{ user.username }}
            </div>
          </div>
          <div v-if="user.userable && (user.userable.mobileNo || user.userable.phoneNo)" class="header__overview-personal-info-row mt-0">
            <BIconTelephone class="header__overview-icon" />
            <div class="header__overview-personal-info-item-light">
              {{ user.userable.mobileNo || user.userable.phoneNo }}
            </div>
          </div>
          <div v-if="user.userable && user.userable.completeAddress" class="header__overview-personal-info-row mt-0">
            <BIconGeoAlt class="header__overview-icon" />
            <div class="header__overview-personal-info-item-light">
              {{ user.userable.completeAddress }}
            </div>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import ProfileMaker from '../views/components/ProfileMaker';
import AvatarMaker from '../views/components/AvatarMaker';

export default {
  name: 'OverviewDropdown',
  components: {
    ProfileMaker,
    AvatarMaker
  },
  props: {
    user: Object,
    isLoggingOut: false
  },
  data() {
    return {
      isOverviewOpen: false
    }
  },
  computed: {
    userPhoto() {
      const userable = this.user && this.user.userable;
      const path =
        (userable && userable.photo && userable.photo.hashName) || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    initialText() {
      const u = this.user && this.user.userable;
      return `${u?.firstName?.charAt(0)}${u?.lastName?.charAt(0) || '?'}`;
    }
  },
  mounted() {
    window.addEventListener('click', this.hideDropdownItems);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdownItems);
  },
  methods: {
    hideDropdownItems() {
      this.isOverviewOpen = false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/shared.scss';

.header__secondary-overview-action {
  border: 0;
  outline: 0;
  background: none ;
  color: $white;
  position: relative;
}

.header__secondary-overview-dropdown {
  position: absolute;
  right: 6px;
  top: 30px;
  background-color: $white;
  border: 1px solid $light-gray-10;
  border-radius: 3px;
  box-shadow: 0 3px 6px 0 #e2e2e2;
  min-width: 280px;
  z-index: 10;
  padding-bottom: 20px;
}


.header__secondary-overview-top-bar {
  color: $dark-gray-500;
  display: flex;
  padding: 7px 15px;
  margin-bottom: 10px;
}

.header__top-bar-title {
  font-weight: 500;
  font-size: 15px;
  color: $dark-gray-500;
}

.header__top-bar-action {
  color: $blue;
  margin-left: auto;
  cursor: pointer;
}

.header__overview-personal-info-row {
  display: flex;
  padding: 5px 15px;
  color: $dark-gray-500;
}

.header__overview-icon {
  margin-right: 10px;
  margin-top: 2px;
  height: 20px;
  width: 20px;
}

.header__overview-personal-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header__overview-personal-info-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  color: $dark-gray-500;
  font-weight: 500;
  text-align: left;
}

.header__overview-personal-info-item-light {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  color: $dark-gray-100;
  font-size: 13px;
  text-align: left;
}

.header__overview-photo-container {
  margin-left: auto;
  margin-right: 0;
}

.header__secondary-account-details {
  display: flex;
  align-items: center;
  margin-right: -50px;
  cursor: pointer;
}

.header__secondary-account-photo {
  border-radius: 50%;
  object-fit: cover;
  height: 28px;
  width: 28px;
}

.header__secondary-account-name {
  flex: 1;
  margin: 0 10px;
  color: $white;
}

</style>
