<template>
  <v-select
    :options="options || StudentCategories"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
  />
</template>
<script>
import { StudentCategories } from '../../../helpers/enum';
export default {
  props: {
    options: {
      type: [Array]
    },
    value: {
      type: [Object, Number]
    },
    label: {
      type: [String]
    },
    placeholder: {
      type: [String]
    },
    searchable: {
      type: [Boolean],
      default: true
    },
    selectable: {
      type: [Function],
      default: option => true
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    reduce: {
      type: [Function],
      default: option => option,
    },
    appendToBody: {
      type: [Boolean],
      default: false
    },
    disabled: {
      type: [Boolean],
      default: false
    },
  },
  data() {
    return {
      StudentCategories: StudentCategories?.values || []
    }
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
