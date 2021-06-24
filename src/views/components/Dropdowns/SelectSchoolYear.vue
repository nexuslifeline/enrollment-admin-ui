<template>
  <v-select
    :options="options.schoolYears.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
    :loading="options.schoolYears.isBusy">
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
    <template #option="{ name, isActive }">
      <div class="school-year__option">
        <div>{{ `${name} ` }}<span v-if="isActive">(Active)</span></div>
        <v-icon name="check" v-if="isActive"></v-icon>
      </div>
    </template>
    <template #selected-option="{ name, isActive }">
      <div class="school-year__option">
        <div>{{ `${name} ` }}<span v-if="isActive">(Active)</span></div>
      </div>
    </template>
  </v-select>
</template>
<script>
import {  SchoolYearApi } from '../../../mixins/api';

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
  },
  mixins: [ SchoolYearApi ],
  data() {
    return {
      options: {
        schoolYears: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    const { schoolYears } = this.options
    const params = { paginate: false }
    schoolYears.isBusy = true
    this.getSchoolYearList(params).then(({ data }) => {
      schoolYears.items = data
      schoolYears.isBusy = false
    })
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.school-year__option {
  display: flex;
  justify-content: space-between;
}
</style>
