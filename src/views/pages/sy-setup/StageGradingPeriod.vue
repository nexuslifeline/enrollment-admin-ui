<template>
  <div>
    <GradingPeriodList :schoolYearId="1" />
    <ActionRow
      :showBack="true"
      nextLabel="Continue"
      @onContinue="onContinue"
      @onBack="onBack"
    />
  </div>
</template>

<script>
import Card from '../../components/Card';
import { InputGroup, InputContainer } from '../../components/InputGroup';
import ActionRow from './ActionRow';
import { SchoolCategories } from '../../../helpers/enum';
import Toggle from '../../components/Form/Toggle';
import GradingPeriodList from '../../components/GradingPeriod/List';

export default {
  SchoolCategories,
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    Toggle,
    GradingPeriodList
  },
  data() {
    return {

    };
  },
  methods: {
    onContinue() {
      // save here
      alert('save here!')
      // after saving
      const nextStage = 3;
      this.$emit('onContinue', nextStage);
    },
    onBack() {

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
