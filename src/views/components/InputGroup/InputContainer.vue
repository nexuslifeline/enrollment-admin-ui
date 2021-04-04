<template>
  <div class="input-field__container">
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

.input-field__container {
  flex: 1;
}

.input-field__container ~ .input-field__container {
  margin-left: 15px;
}

</style>
