<template>
  <component
    :is="type"
    :style="`
    margin-bottom: ${marginBottom}px;
    margin-left: ${marginLeft}px;
    margin-top: ${marginTop}px;
    flex: ${flex};
    text-align: ${align};
    text-transform: ${transform}`"
    :class="`${size}-text ${color}-color ${weight}-weight`">
    <slot></slot>
  </component>
</template>
<script>
export default {
  props: {
    size: {
      type: [String],
      default: 'small' // large, semi-medium, medium, small, extra-small
    },
    color: {
      type: [String],
      default: 'normal' // normal, dark, light, lighter
    },
    type: {
      type: [String],
      default: 'span'
    },
    weight: {
      type: [String],
      default: 'normal' // normal, light, lighter
    },
    align: {
      type: [String],
      default: 'left' // normal, light, lighter
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginLeft: {
      type: [Number, String],
      default: 0
    },
    flex: {
      type: [Number, String],
      default: 0
    },
    transform: {
      type: [String],
      default: 'none'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

</style>