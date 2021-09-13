<template>
  <div class="card__loader" :style="cardLoaderStyle">
    <BSpinner small />
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: [Number, String],
      default: 30
    }
  },
  computed: {
    cardLoaderStyle() {
      return {
        '--height' : `${this.height}px`
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.card__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 10px 0 15px 0;
  height: var(--height);
}
</style>
