<template>
  <div class="note__container">
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
    background-color: $light-blue;
    padding: 15px 20px;
    margin: -20px;
    margin-bottom: 30px;
    color: black;
  }
</style>
