<template>
  <div class="active-view__detail-item">
    <div class="mr-2 font-weight-bold">{{label}}</div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: [String]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
  .active-view__detail-item {
    flex: 50%;

    @include for-size(phone-only) {
      flex: 100%;
    }
  }
</style>