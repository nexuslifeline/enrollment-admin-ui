<template>
  <v-select
    :options="options.academicRecords.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable">
    <template v-slot:selected-option="data">
      {{ `${data.schoolYear.name} - ${data.level.name}` }} {{ data.semester ?  ` - ${data.semester.name}` : '' }}
    </template>
    <template slot="option" slot-scope="data">
      <div>
        {{ `${data.schoolYear.name} - ${data.level.name}` }} {{ data.semester ?  ` - ${data.semester.name}` : '' }}
      </div>
    </template>
  </v-select>
</template>
<script>
import { AcademicRecordApi } from '../../../mixins/api';

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
  },
  mixins: [ AcademicRecordApi ],
  data() {
    return {
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
      // console.log(data)
      academicRecords.items = data
    })
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
