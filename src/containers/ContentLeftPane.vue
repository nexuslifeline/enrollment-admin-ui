<template>
  <div class="main-content__left-panel">
    <div class="left-panel__section">
      <p class="left-panel__text">
        <BIconEnvelope scale="1.25" class="mr-2" /> {{user.username}}
      </p>
      <p class="left-panel__text">
        <BIconPersonBadge scale="1.25" class="mr-2" /> {{userGroup}}
      </p>
    </div>
    <div class="left-panel__section mt-3">
      <p class="left-panel__text">
        <BIconGeoAlt scale="1.25" class="mr-2" /> {{userAddress}}
      </p>
      <p v-if="!!(user.userable.mobileNo || user.userable.phone_no)" class="left-panel__text">
        <v-icon
          name="paper-plane"
          class="mr-2"
          scale="1"
        /> {{user.userable.mobileNo || user.userable.phone_no}}
      </p>
      <p class="left-panel__text">
        <v-icon
          name="calendar-alt"
          class="mr-2"
          scale="1"
        /> January 1, 2019
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    user() {
      return this.$store.state.user;
    },
    userAddress() {
      return this.user.userable && this.user.userable.address || 'Surigao, Philippines';
    },
    userGroup() {
      const userGroup = this.user && this.user.userGroup;
      const name = userGroup && userGroup.name || 'System Administrator';
      return name;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/shared.scss";

  .main-content__left-panel {
    position: fixed;
    width: 224px;
    height: 100%;
    padding: 55px 0 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .left-panel__section {
    border-bottom: 1px solid $brand-border-color;
    width: 100%;
    max-width: calc(100% - 30px);
  }

  .left-panel__text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: $dark-gray-300;
    padding: 0 2px;
  }
</style>


