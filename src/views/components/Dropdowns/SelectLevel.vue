<template>
  <v-select
    :options="options.levels.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :disabled="disabled"
    :loading="options.levels.isBusy">
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
  </v-select>
</template>
<script>
import {  LevelApi } from '../../../mixins/api';

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
    schoolCategoryId: {
      type: [Number],
      default: null
    },
    disabled: {
      type: [Boolean],
      default: false
    },
  },
  mixins: [ LevelApi ],
  data() {
    return {
      options: {
        levels: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
   this.loadLevels()
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    loadLevels() {
      const { levels } = this.options
      const params = { paginate: false, schoolCategoryId: this.schoolCategoryId }
      levels.isBusy = true
      this.getLevelList(params).then(({ data }) => {
        levels.items = data
        levels.isBusy = false
      })
    }
  },
  watch: {
    'schoolCategoryId': function() {
      this.loadLevels()
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
