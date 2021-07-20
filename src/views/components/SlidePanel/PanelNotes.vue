<template>
  <div class="slide-panel__notes">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      notes: {
        type: [String],
        default: 'Please review carefully before approving the record.'
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .slide-panel__notes {
    width: 100%;
    padding: 10px 25px;
    background: $light-blue;
    color: $black;
  }

</style>