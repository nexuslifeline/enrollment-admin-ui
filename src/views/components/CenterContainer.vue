<template>
  <div class="main-container">
    <b-overlay :show="isBusy" rounded="sm">
      <slot></slot>
    </b-overlay>
  </div>
</template>
<script>
export default {
  props: {
    isBusy: {
      type: Boolean,
      default: false
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';
.main-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  // background-color: $light-gray-50;

  @include for-size(phone-only) {
    margin-top: 30px;
  }
}
</style>
