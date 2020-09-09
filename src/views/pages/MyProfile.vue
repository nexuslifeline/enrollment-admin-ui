<template>
  <div class="my-profile__main-container">
    <div class="my-profile__announcement-container">
      <div>Thank you for being patient. We are still doing some work on this feature.</div>
      <div>We will release an update as soon as we can.</div>
      <p class="mt-4">- Nexus Team</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  @import "../../assets/scss/shared.scss";

  .my-profile__main-container {
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

  .my-profile__announcement-container {
    height: auto;
    width: 100%;
    padding: 40px;
    font-size: 18px;
  }

</style>