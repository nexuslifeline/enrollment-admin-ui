<template>
  <v-select
    :options="options"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable">
    <template slot="option" slot-scope="data">
      <div>
        {{ 'SY 2015-2016 - First Year - 1st Semester' }}
      </div>
    </template>
  </v-select>
</template>
<script>

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
  },
  data() {
    return {
      options: [
        {} // for testing only
      ]
    }
  },
  created() {
    console.log('load academic records here')
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
