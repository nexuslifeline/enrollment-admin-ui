<template>
  <div>
    <GradingPeriodList :schoolYearId="form.fields.id" />
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
import GradingPeriodList from '../../components/GradingPeriod/List';
import { SchoolYearApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';

export default {
  SchoolCategories,
  SchoolYearStatuses,
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    Toggle,
    GradingPeriodList
  },
  props: {
    form: {
      type: Object
    }
  },
  mixins: [ SchoolYearApi ],
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    onContinue() {
      // save here
      // alert('save here!')
      // after saving
      this.isProcessing = true
      const { id: schoolYearId } = this.form.fields
      const data = { schoolYearStatusId: this.$options.SchoolYearStatuses.SETUP_SECTION_SCHEDULE.id}

      this.patchSchoolYear(data, schoolYearId).then(({ data }) => {
        copyValue(data, this.form )
        const nextStage = 3;
        this.$emit('onContinue', nextStage);
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
