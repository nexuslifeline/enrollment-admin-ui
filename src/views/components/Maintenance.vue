<template>
  <div class="main__container">
    <div class="maintenance__container">
      <h3 class="maintenance__title">We're preparing to serve you better</h3>
      <img class="maintenance__img" src="img/maintenance.svg" />
      <div class="maintenance__message">
        Thank you for being patient. We are still doing some work with this feature. We will release an update as soon as we can.</div>
      <p class="maintenance__team">- Nexus Team</p>
    </div>
  </div>
</template>

<style lang="scss">
  @import "../../assets/scss/shared.scss";

  .main__container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 10px;
    padding-right: 40px;

    @include for-size(phone-only) {
      padding: 10px;
    }
  }

  .maintenance__container {
    height: auto;
    width: 100%;
    max-width: 700px;
    padding: 0 40px;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

     @include for-size(phone-only) {
       padding: 0 10px;
     }
  }

  .maintenance__img {
    height: 240px;
    width: auto;

    @include for-size(phone-only) {
      height: 170px;
    }
  }

  .maintenance__title {
    margin-bottom: 40px;

    @include for-size(phone-only) {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  .maintenance__message {
    margin-top: 40px;
    text-align: center;
    font-size: 16px;
  }

  .maintenance__team {
    margin-top: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

</style>