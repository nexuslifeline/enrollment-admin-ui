<template>
  <v-select
    :options="options || schoolCategories"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    class="mt-2"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
  />
</template>
<script>
import { SchoolCategories } from '../../helpers/enum';
export default {
  props: {
    options: {
      type: [Array]
    },
    value: {
      type: [Object]
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
  },
  data() {
    return {
      schoolCategories: SchoolCategories?.values?.filter(
        v => this.$store.state?.user?.userGroup?.schoolCategories?.map(c => c.id).includes(v.id)
      ) || []
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
@import '../../assets/scss/shared.scss';

</style>
