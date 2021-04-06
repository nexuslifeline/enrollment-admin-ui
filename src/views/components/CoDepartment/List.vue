<template>
  <div class="co-department__container">
    
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: [String],
    },
    showRefresh: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.co-department__container {
  width: 100%;
  min-height: 400px;
  border: 1px solid $light-gray-200;
  border-radius: 8px;
  background-color: $white;
}

</style>
