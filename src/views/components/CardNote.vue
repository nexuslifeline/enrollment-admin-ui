<template>
  <div :class="`note__container ${type}`">
    <slot></slot>
  </div>
</template>
<script>

export default {
  props: {
    type: {
      type: String,
      default: 'info'
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/shared.scss';

  .note__container {
    padding: 15px 20px;
    margin: -20px;
    margin-bottom: 30px;
    color: black;
    margin-top: -21px;

    &.info {
      background-color: $light-blue;
    }

    &.warning {
      background-color: #fff3cd;
      color: #aa8105;
    }
  }
</style>
