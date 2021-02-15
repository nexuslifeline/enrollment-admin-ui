<template>
  <div class="main__container">
    <div class="no-access__container">
      <h3 class="no-access__title">We're preparing to serve you better</h3>
      <img class="no-access__img" src="img/maintenance.svg" />
      <div class="no-access__message">
        Opps! It seem you have no access on this feature.
        Please, contact your administrator.
      </div>
      <p class="no-access__team">- Nexus Team</p>
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

  .no-access__container {
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

  .no-access__img {
    height: 240px;
    width: auto;

    @include for-size(phone-only) {
      height: 170px;
    }
  }

  .no-access__title {
    margin-bottom: 40px;

    @include for-size(phone-only) {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  .no-access__message {
    margin-top: 40px;
    text-align: center;
    font-size: 16px;
  }

  .no-access__team {
    margin-top: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

</style>