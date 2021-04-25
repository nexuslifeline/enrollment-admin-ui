<template>
  <div class="input-field__inline">
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

.input-field__inline{
  display: flex;
  align-items: center;
}

</style>
