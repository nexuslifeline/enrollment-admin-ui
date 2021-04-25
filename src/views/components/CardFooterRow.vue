<template>
  <div class="card-footer__action">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/shared.scss";

.card-footer__action {
  display: flex;
  justify-content: flex-end;
}
</style>
