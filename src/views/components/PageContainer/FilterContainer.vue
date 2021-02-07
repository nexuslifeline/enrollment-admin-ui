<template>
  <div class="c-side-filter__container">
    <div class="c-side-filter__container-header">
      <span>
        Filter
      </span>
    </div>
    <div class="c-side-filter__body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visisble: {
      type: Boolean,
      default: true
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.c-side-filter__container {
  height: 100%;
  border-right: 1px solid $light-gray-10;
  position: fixed;
  top: 85px;
  left: 0;
  width: 240px;
  background-color: $white;
  z-index: 2;
}

.c-side-filter__container-header {
  border-bottom: 1px solid $light-gray-10;
  padding: 7px 10px;
  font-weight: 500;
  //box-shadow: 0 3px 6px 0 #e2e2e2;
}

.c-side-filter__body {
  height: 100%;
  padding: 15px 10px;
}

</style>
