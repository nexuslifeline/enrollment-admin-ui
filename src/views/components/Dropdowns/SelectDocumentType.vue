<template>
  <v-select
    :options="options.documentTypes.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="selectable"
    :clearable="clearable"
    :loading="options.documentTypes.isBusy"
    :disabled="disabled"
    :appendToBody="appendToBody">
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
  </v-select>
</template>
<script>
import {  DocumentTypeApi } from '../../../mixins/api';

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
  mixins: [ DocumentTypeApi ],
  data() {
    return {
      options: {
        documentTypes: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    this.loadDocumentTypes()
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    loadDocumentTypes() {
      const { documentTypes } = this.options
      documentTypes.isBusy = true
      const params = { paginate: false }
      this.getDocumentTypeList(params).then(({ data }) => {
        documentTypes.items = data
        documentTypes.isBusy = false
      })
    }
  },

};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
