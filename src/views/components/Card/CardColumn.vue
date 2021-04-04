<template>
  <div class="card-col__container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.card-col__container {
  flex: 1;
}

</style>
