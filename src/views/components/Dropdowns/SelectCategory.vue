<template>
  <v-select
    :options="options || schoolCategories"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
    :appendToBody="appendToBody"
  />
</template>
<script>
import { SchoolCategories } from '../../../helpers/enum';
export default {
  props: {
    options: {
      type: [Array]
    },
    value: {
      type: [Object, Number]
    },
    label: {
      type: [String],
      default: 'name'
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
    isPersist: {
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
  created() {
    if (this.isPersist) {
      this.$watch('value', this.storeLocal, { deep: true, immediate: false });
      this.showDefaultSchoolCategory();
    }
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    storeLocal() {
      localStorage.setItem('schoolCategory', this.value ? JSON.stringify(this.value) : '');
    },
    getStoreCategory() {
      const category = localStorage.getItem('schoolCategory');
      return category ? JSON.parse(category) : null;
    },
    showDefaultSchoolCategory() {
      const category = this.getStoreCategory();
      if (category) this.onInput(category)
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
