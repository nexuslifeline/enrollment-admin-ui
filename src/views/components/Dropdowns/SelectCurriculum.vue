<template>
  <v-select
    :options="options.curriculums.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :loading="options.curriculums.isBusy">
    <!-- <template v-slot:selected-option="data">
      {{ formatOption(data) }}
    </template> -->
    <!-- <template slot="option" slot-scope="data">
      <div>
        {{ formatOption(data) }}
      </div>
    </template> -->
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
  </v-select>
</template>
<script>
import {  CurriculumApi } from '../../../mixins/api';

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
    courseId: {
      type: [String, Number]
    },
    levelId: {
      type: [String, Number]
    },
  },
  mixins: [ CurriculumApi ],
  data() {
    return {
      options: {
        curriculums: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    const { curriculums } = this.options
    const params = { paginate: false, courseId: this.courseId }
    curriculums.isBusy = true
    this.getCurriculumList(params).then(({ data }) => {
      curriculums.items = data
      curriculums.isBusy = false
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
</style>
