<template>
  <v-select
    :options="options.courses.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :loading="options.courses.isBusy"
    :disabled="disabled"
    :appendToBody="appendToBody">
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
  </v-select>
</template>
<script>
import {  CourseApi } from '../../../mixins/api';

export default {
  props: {
    value: {
      type: [Number, Object],
      default: null
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
    levelId: {
      type: [Number],
      default: null
    },
    schoolCategoryId: {
      type: [Number],
      default: null
    }
  },
  mixins: [ CourseApi ],
  data() {
    return {
      options: {
        courses: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    this.loadCourses()
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    loadCourses() {
      const { courses } = this.options
      courses.isBusy = true
      const params = { paginate: false,  schoolCategoryId: this.schoolCategoryId, levelId: this.levelId }
      this.getCourseList(params).then(({ data }) => {
        courses.items = data
        courses.isBusy = false
      })
    }
  },
  watch: {
    'levelId': function() {
      this.loadCourses()
    },
    'schoolCategoryId': function() {
      this.loadCourses()
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
