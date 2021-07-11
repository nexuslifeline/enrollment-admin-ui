<template>
  <v-select
    class="select-student-terms"
    :options="options.terms.items"
    :reduce="reduce"
    :value="value"
    @input="onInput"
    :label="label"
    :placeholder="placeholder"
    :searchable="searchable"
    :selectable="(v) => !v.pivot.isBilled"
    :clearable="clearable"
    :loading="options.terms.isBusy"
    :disabled="disabled">
    <!-- <template slot="selected-option" slot-scope="data">
      <div class="select-option">
        <span class="select-option-name">
          {{ data[label || 'name'] }}
        </span>
        <b-badge v-if="data.pivot.isBilled" variant="warning">
          Billed
        </b-badge>
      </div>
    </template> -->
    <template slot="option" slot-scope="data">
      <div class="select-option">
        <span class="select-option-name">
          {{ data[label || 'name'] }}
        </span>
        <b-badge v-if="data.pivot.isBilled" variant="warning">
          Billed
        </b-badge>
        <span v-if="data.schoolYear && data.semester" class="select-term-details">
          {{ data.schoolYear.name }}
          -
          {{ data.semester.name }}
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
    studentId: {
      type: [Number],
      default: null
    },
    schoolYearId: {
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
      if (!this.studentId) {
        console.warn('No Student ID found!');
        return;
      }

      if (!this.schoolYearId) {
        console.warn('No School Year ID found!');
        return;
      }

      const { terms } = this.options
      terms.isBusy = true;
      const params = { paginate: false, schoolYearId: this.schoolYearId }
      this.getStudentBillingTerms(this.studentId, params).then(({ data }) => {
        terms.items = data
        terms.isBusy = false
      }).catch((error) => {
        console.error(error);
      });
    }
  },
  watch: {
    'studentId': function() {
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

  .select-student-terms {
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

  .select-term-details {
    margin-left: 10px;
    color: $gray;
  }

</style>

<style lang="scss">
  .select-student-terms {
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
