<template>
  <div class="input-group__container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
  },
};
</script>
<style lang="scss">
@import '../../../assets/scss/shared.scss';

.input-group__container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 5px;
}

</style>
