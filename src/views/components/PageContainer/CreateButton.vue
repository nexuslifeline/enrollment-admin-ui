<template>
  <button class="create-button" @click="$emit('create')" :disabled="isBusy">
    <BSpinner v-if="isBusy" small type="grow" />
    <BIconPlus v-else />
  </button>
</template>
<script>
export default {
  props: {
    isBusy: {
      type: Boolean,
      default: false
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.create-button {
  background: none;
  outline: 0;
  border: 1px solid $light-gray-10;
  border-radius: 4px;
  padding: 4px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;

  &:hover {
    background-color: $light-gray-50;
  }
}
</style>
