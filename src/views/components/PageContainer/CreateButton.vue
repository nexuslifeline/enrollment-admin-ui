<template>
  <b-button variant="primary" @click="$emit('create')" :disabled="isBusy">
    <BSpinner v-if="isBusy" small type="grow" />
    <BIconPlus v-else scale="1.5" />
    <span class="ml-2">
      Create New
    </span>
  </b-button>
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
</style>
