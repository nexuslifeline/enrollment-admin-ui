<template>
  <v-select
    :options="filteredOptions"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
    :appendToBody="appendToBody">
    <template v-slot:selected-option="data">
      {{ formatOption(data) }}
    </template>
    <template slot="option" slot-scope="data">
      <div>
        {{ formatOption(data) }}
      </div>
    </template>
  </v-select>
</template>
<script>
import { AcademicRecordApi } from '../../../mixins/api';
import { AcademicRecordStatuses } from '../../../helpers/enum'

export default {
  props: {
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
    studentId: {
      type: [String, Number],
      default: false
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    includeDraftStatus:{
      //show draft status academic record
      type: [Boolean],
      default: true
    }
  },
  mixins: [AcademicRecordApi],
  data() {
    return {
      AcademicRecordStatuses,
      options: {
        academicRecords: {
          items: []
        }
      }
    }
  },
  created() {
    const { academicRecords } = this.options
    const params = { paginate: false, studentId: this.studentId }
    this.getAcademicRecordList(params).then(({ data }) => {
      academicRecords.items = data
    })
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    formatOption(data) {
      return `${data?.schoolYear?.name || 'No School Year'} - ${data?.level?.name} ${data?.semester?.name}`;
    }
  },
  computed: {
    filteredOptions() {
      const { academicRecords } = this.options
      if(!this.includeDraftStatus) {
        return academicRecords.items.filter(v => v.academicRecordStatusId !== this.AcademicRecordStatuses.DRAFT.id)
      }
      return academicRecords.items
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
