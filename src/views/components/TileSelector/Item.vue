<template>
  <button
    class="tile__item"
    :class="{ selected: isActive }"
    @click="$emit('onSelect')">
    {{ label }}
    <BSpinner v-if="isBusy" class="ml-2" small type="grow" />
  </button>
</template>
<script>

export default {
  props: {
    label: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isBusy: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSave() {

    }
  }
};
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .tile__item {
    min-height: 55px;
    border: 1px solid $light-blue-shadow;
    border-radius: 3px;
    margin-bottom: 10px;
    outline: none;
    background: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 500;
    position: relative;

    &.selected {
      &:after {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 35px;
        height: 35px;
        background: $green;
        z-index: 2;
        top: -14px;
        right: -14px;
        content: '\2713​';
        border-radius: 50%;
        font-size: 20px;
        font-weight: 600;
        color: $white;
      }
    }

    &:hover {
      background: $light-blue;
    }
  }
</style>
