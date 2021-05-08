<template>
  <div>
    <BillingTermList :schoolYearId="schoolYearId" />
    <ActionRow
      :showBack="true"
      nextLabel="Continue"
      @onContinue="onContinue"
      @onBack="onBack"
      :isBusy="isProcessing"
    />
  </div>
</template>

<script>
import Card from '../../components/Card';
import { InputGroup, InputContainer } from '../../components/InputGroup';
import ActionRow from './ActionRow';
import { SchoolCategories, SchoolYearStatuses } from '../../../helpers/enum';
import Toggle from '../../components/Form/Toggle';
import BillingTermList from '../../components/BillingTerms/List';
import { SchoolYearApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { showNotification } from '../../../helpers/forms';

export default {
  SchoolCategories,
  SchoolYearStatuses,
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    Toggle,
    BillingTermList
  },
  mixins: [ SchoolYearApi ],
  props: {
    schoolYearId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    onContinue() {
      this.isProcessing = true
      const { schoolYearId } = this;

      const nextStageId = this.$options.SchoolYearStatuses.SETUP_GRADING_PERIOD.id;
      const data = { schoolYearStatusId: nextStageId }

      this.patchSchoolYear(data, schoolYearId).then(({ data }) => {
        this.$emit('onContinue', nextStageId - 1);
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        showNotification(this, 'danger', 'Error!')
        this.isProcessing = false
      });
    },
    onBack() {
      this.$emit('onBack')
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .setup__table-category {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    border: 1px solid $light-gray-10;
    background-color: $white;

    th {
      text-transform: uppercase;
      font-size: 13px;
      background-color: $light-gray-50;
    }

    td {
      font-size: 15px;
    }

    td, th {
      padding: 13px 20px;
      border-bottom: 1px solid $light-gray-10;

      &:last-child {
        text-align: center;
      }
    }
  }
</style>
