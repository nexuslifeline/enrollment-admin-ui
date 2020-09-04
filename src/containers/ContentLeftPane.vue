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
    color: $dark-gray-200;
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
        /> chrisrueda14@yahoo.com
      </p>
      <p class="left-panel__text">
        <v-icon
          name="address-card"
          class="mr-2"
          scale="1"
        /> System Administrator
      </p>
    </div>
    <div class="left-panel__section mt-3">
      <p class="left-panel__text">
        <v-icon
          name="map-marker-alt"
          class="mr-2"
          scale="1"
        /> San Jose, San Simon, Pampanga, Ph
      </p>
      <p class="left-panel__text">
        <v-icon
          name="paper-plane"
          class="mr-2"
          scale="1"
        /> 09357467601
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
  data(){
    return {

    }
  },
  created(){

  },
  computed: {

  }
}
</script>


