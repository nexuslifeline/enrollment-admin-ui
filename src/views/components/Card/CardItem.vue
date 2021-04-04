<template>
  <div class="card-item__container">
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

.card-item__container {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px 20px;
}

</style>
