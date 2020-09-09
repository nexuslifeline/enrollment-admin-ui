<template>
  <div class="my-activity__main-container">
    <div class="my-activity__announcement-container">
      <p>Thank you for being patient. We are still doing some work on this feature. </p>
      <p class="team-text">- Nexus Team</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  @import "../../assets/scss/shared.scss";

  .my-activity__main-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 60px;

    @include for-size(phone-only) {
      padding: 10px;
    }
  }

  .my-activity__announcement-container {
    height: auto;
    width: 100%;
    padding: 40px;
    font-size: 18px;
  }

</style>