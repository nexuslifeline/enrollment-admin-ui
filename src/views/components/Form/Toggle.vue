<template>
  <label class="toggle-switch">
    <input type="checkbox" @input="onInput" :checked="value" :disabled="isDisabled"/>
    <span class="toggle-switch__slider round" />
  </label>
</template>

<script>
export default {
  props: {
    value: [Boolean, Number],
    isDisabled: {
      type: [Boolean],
      default: false
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.checked);
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
    margin: 0;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  .toggle-switch__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $gray;
    -webkit-transition: .4s;
    transition: .4s;

    &.round {
      border-radius: 34px;
    }

    &.round:before {
      border-radius: 50%;
    }

    &:before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }
  }

  input:checked + .toggle-switch__slider {
    background-color: $brand-primary;
  }

  input:focus + .toggle-switch__slider {
    box-shadow: 0 0 1px $brand-primary;
  }

  input:checked + .toggle-switch__slider:before {
    -webkit-transform: translateX(22px);
    -ms-transform: translateX(22px);
    transform: translateX(22px);
  }
</style>