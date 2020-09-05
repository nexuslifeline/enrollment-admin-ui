<style lang="scss" scoped>
  @import "../assets/scss/shared.scss";

  .main-content__left-panel {
    width: 270px;
    height: 100%;
    padding: 55px 20px 20px 40px;
  }

  .left-panel__section {
    border-bottom: 1px solid $brand-border-color;
    width: 100%;
  }

  .left-panel__text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: $dark-gray-300;
  }
</style>
<template>
  <div class="main-content__left-panel">
    <div class="left-panel__section">
      <p class="left-panel__text">
        <v-icon
          name="envelope"
          class="mr-2"
          scale="1"
        /> {{user.username}}
      </p>
      <p class="left-panel__text">
        <v-icon
          name="address-card"
          class="mr-2"
          scale="1"
        /> {{userGroup}}
      </p>
    </div>
    <div class="left-panel__section mt-3">
      <p class="left-panel__text">
        <v-icon
          name="map-marker-alt"
          class="mr-2"
          scale="1"
        /> {{userAddress}}
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


