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
import { Semesters, SchoolCategories, Levels } from '../../../helpers/enum';
export default {
  Semesters,
  SchoolCategories,
  Levels,
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
    },
    levelId: {
      type: [Number],
      default: null
    }
  },
  data() {
    return {
      Semesters: [],
    }
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
  },
  computed: {
    filteredSemester() {
      if(this.schoolCategoryId) {
        if(this.filteredSchoolCategory.includes(this.schoolCategoryId)) {
          return this.$options.Semesters?.values
        }
      }
      else if(this.levelId) {
        if(this.filteredLevels.includes(this.levelId)) {
          return this.$options.Semesters?.values
        }
      }

      return []
    },
    filteredLevels(){
      const { GRADE_11, GRADE_12, FIRST_YEAR_COLLEGE, SECOND_YEAR_COLLEGE, THIRD_YEAR_COLLEGE,
        FOURTH_YEAR_COLLEGE, FIFTH_YEAR_COLLEGE, MASTERS_DEGREE, DOCTORATE_DEGREE } = this.$options.Levels

      return [ GRADE_11.id, GRADE_12.id, FIRST_YEAR_COLLEGE.id, SECOND_YEAR_COLLEGE.id, THIRD_YEAR_COLLEGE.id,
          FOURTH_YEAR_COLLEGE.id, FIFTH_YEAR_COLLEGE.id, MASTERS_DEGREE.id, DOCTORATE_DEGREE.id ]
    },
    filteredSchoolCategory() {
      const { SENIOR_HIGH_SCHOOL, COLLEGE, GRADUATE_SCHOOL } = this.$options.SchoolCategories
      return [ SENIOR_HIGH_SCHOOL.id, COLLEGE.id, GRADUATE_SCHOOL.id ]
    }

  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
