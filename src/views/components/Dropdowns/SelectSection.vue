<template>
  <v-select
    :options="options.sections.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
    :loading="options.sections.isBusy"
    :appendToBody="appendToBody">
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
    <!-- <template #option="{ name, isActive }">
      <div class="school-year__option">
        <div>{{ `${name} ` }}<span v-if="isActive">(Active)</span></div>
        <v-icon name="check" v-if="isActive"></v-icon>
      </div>
    </template>
    <template #selected-option="{ name, isActive }">
      <div class="school-year__option">
        <div>{{ `${name} ` }}<span v-if="isActive">(Active)</span></div>
      </div>
    </template> -->
  </v-select>
</template>
<script>
import {  SectionApi } from '../../../mixins/api';

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
    schoolYearId: {
      type: [String, Number]
    },
    schoolCategoryId: {
      type: [String, Number]
    },
    levelId: {
      type: [String, Number]
    },
    courseId: {
      type: [String, Number]
    },
    semesterId: {
      type: [String, Number]
    }
  },
  mixins: [ SectionApi ],
  data() {
    return {
      options: {
        sections: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    this.loadSections()
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    loadSections() {
      const { sections } = this.options
      const params = { paginate: false, schoolYearId: this.schoolYearId,
      schoolCategoryId: this.schoolCategoryId, levelId: this.levelId, courseId: this.courseId, semesterId: this.semesterId  }
      sections.isBusy = true
      this.getSectionList(params).then(({ data }) => {
        sections.items = data
        sections.isBusy = false
      })
    }
  },
  watch: {
    'schoolYearId': function() {
      this.loadSections()
    },
    'schoolCateoryId': function() {
      this.loadSections()
    },
    'levelId': function() {
      this.loadSections()
    },
    'courseId': function() {
      this.loadSections()
    },
    'semesterId': function() {
      this.loadSections()
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.school-year__option {
  display: flex;
  justify-content: space-between;
}
</style>
