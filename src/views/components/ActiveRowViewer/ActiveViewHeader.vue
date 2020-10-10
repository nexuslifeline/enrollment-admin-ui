<template>
  <div :id="id" class="active-view__headline-container">
    <div class="active-view__headline-highlight">
      <div class="active-view__headline-number">
        {{ circleText }}
      </div>
      <div class="active-view__headline-text">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: [String]
      },
      circleText: {
        type: [String]
      },
      id: {
        type: [String]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .active-view__headline-container {
    display: flex;
    align-items: center;
  }

  .active-view__headline-highlight {
    display: inline-flex;
    align-items: center;
    background-color: $light-orange;
    flex: 0 1 auto;
    border-radius: 32px;
    height: 32px;
  }

  .active-view__headline-number {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background-color: $orange;
    font-size: 20px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    z-index: 1;
  }

  .active-view__headline-text {
    font-size: 14px;
    margin: 0 20px 0 10px;
    font-weight: 500;
  }
</style>