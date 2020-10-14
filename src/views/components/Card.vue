<template>
  <div class="c-card">
    <div class="c-card__header">
      <h4 class="c-card__header-title">
        {{ title }}
      </h4>
    </div>
    <div class="c-card__body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: [String]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .c-card {
    border: 1px solid $brand-border-color;
    padding: 0;
    border-radius: 3px;
    margin-bottom: 30px;
  }

  .c-card__header {
    border-bottom: 1px solid $brand-border-color;
    padding: 15px;
  }

  .c-card__body {
    padding: 20px;
  }

  .c-card__header-title {
    margin: 0;
    font-size: 21px;
  }

</style>