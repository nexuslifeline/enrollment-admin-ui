<template>
  <button class="filter-button" @click="$emit('toggle', isExpanded)">
    <BIconChevronLeft v-if="isExpanded" class="filter__icon-left" />
    <BIconChevronRight v-else class="filter__icon-left" />
    <BIconFunnelFill />
  </button>
</template>
<script>
export default {
  props: {
    isExpanded: {
      type: Boolean,
      default: true
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
.filter-button {
  background: none;
  outline: 0;
  border: 1px solid $light-gray-10;
  border-radius: 4px;
  padding: 4px 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: $light-gray-50;
  }
}

.filter__icon-left {
  color: gray;
  height: 10px;
  margin-right: 5px;
}
</style>
