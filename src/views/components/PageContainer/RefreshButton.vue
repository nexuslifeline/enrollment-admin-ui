<template>
  <b-button variant="dark" @click="$emit('reload')">
    <BIconArrowRepeat />
  </b-button>
</template>
<script>
export default {
  props: {
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
