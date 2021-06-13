<template>
  <v-select
    :options="options || filteredSemester"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
  />
</template>
<script>
import { Semesters, SchoolCategories } from '../../../helpers/enum';
export default {
  Semesters,
  SchoolCategories,
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
    schoolCategoryId: {
      type: [Number],
      default: null
    }
  },
  data() {
    return {
      Semesters: []
    }
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
  },
  computed: {
    filteredSemester() {
      const { SENIOR_HIGH_SCHOOL, COLLEGE, GRADUATE_SCHOOL } = this.$options.SchoolCategories
      if(this.schoolCategoryId) {
        if([ SENIOR_HIGH_SCHOOL.id, COLLEGE.id, GRADUATE_SCHOOL.id ].includes(this.schoolCategoryId)) {
          return this.$options.Semesters?.values
        }
      }
      return []
    },

  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
