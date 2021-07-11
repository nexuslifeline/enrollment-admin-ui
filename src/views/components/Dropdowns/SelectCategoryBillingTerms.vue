<template>
  <v-select
    class="select-billing-terms"
    :options="options.terms.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :clearable="clearable"
    :loading="options.terms.isBusy"
    :disabled="disabled">
    <template slot="option" slot-scope="data">
      <div class="select-option">
        <span class="select-option-name">
          {{ data[label || 'name'] }}
        </span>
         <span class="text-mute ml-auto">
          {{ `${data.schoolYear.name} - ${data.semester.name}` }}
        </span>
      </div>
    </template>
    <template #spinner="{ loading }">
      <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner">
      </div>
    </template>
  </v-select>
</template>
<script>
import { TermApi } from '../../../mixins/api';

export default {
  props: {
    value: {
      type: [Number, Object],
      default: null
    },
    label: {
      type: [String],
      default: 'name'
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
    schoolCategoryId: {
      type: [Number],
      default: null
    },
    schoolYearId: {
      type: [Number],
      default: null
    },
    semesterId: {
      type: [Number],
      default: null
    }
  },
  mixins: [TermApi],
  data() {
    return {
      options: {
        terms: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created() {
    this.loadterms();
  },
  methods: {
    onInput(item) {
      this.$emit('input', item);
    },
    loadterms() {
      if (!this.schoolCategoryId) {
        console.warn('No School Category ID found!');
        return;
      }

      if (!this.schoolYearId) {
        console.warn('No School Year ID found!');
        return;
      }

      const { terms } = this.options
      terms.isBusy = true;
      const params = {
        paginate: false,
        schoolYearId: this.schoolYearId,
        schoolCategoryId: this.schoolCategoryId,
        semesterId: this.semesterId
      }
      this.getTermList(params).then(({ data }) => {
        terms.items = data
        terms.isBusy = false
      }).catch((error) => {
        console.error(error);
      });
    }
  },
  watch: {
    'schoolCategoryId': function() {
      this.loadterms()
    },
    'schoolYearId': function() {
      this.loadterms()
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/shared.scss';

  .select-billing-terms {
    width: 100%;
  }

  .select-option {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
  }

  .select-option-name {
    flex: 1;
  }

</style>

<style lang="scss">
  .select-billing-terms {
  .vs__selected-options {
      position: relative;
    }
    .vs__selected {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
    }
  }
</style>
