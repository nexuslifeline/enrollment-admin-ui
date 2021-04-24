<template>
  <div class="setup__main-container">
    <div class="setup__header">
      <button class="setup__action-back" @click="() => $router.push({ name: 'School Year' })">
        <BIconArrowLeft scale="1.5" />
        <vText size="s" color="primary" :marginLeft="15">Return to List</vText>
      </button>
    </div>
    <div class="setup__body">
      <div class="setup__side-panel">
        <StageIndicator
          :stages="stages"
          :activeIndex="selectedIndex"
          @selectedItem="onSelectStage"
        />
      </div>
      <div class="setup__content-area">
        <template v-if="selectedIndex === 0">
          <StageSchoolYear
            @onContinue="(idx) => selectedIndex = idx"
          />
        </template>
        <template v-if="selectedIndex === 1">
          <StageBillingTerms
            @onContinue="(idx) => selectedIndex = idx"
          />
        </template>
        <template v-if="selectedIndex === 2">
          <StageGradingPeriod
            @onContinue="(idx) => selectedIndex = idx"
          />
        </template>
        <template v-if="selectedIndex === 3">
          <StageSchedules
            @onContinue="(idx) => selectedIndex = idx"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import StageIndicator from '../../components/Wizard/StageIndicator';
import StageSchoolYear from './StageSchoolYear';
import StageBillingTerms from './StageBillingTerms';
import StageGradingPeriod from './StageGradingPeriod';
import StageSchedules from './StageSchedules';
import { InputGroup, InputContainer } from '../../components/InputGroup';

export default {
  components: {
    StageIndicator,
    InputGroup,
    InputContainer,
    StageSchoolYear,
    StageBillingTerms,
    StageGradingPeriod,
    StageSchedules
  },
  data() {
    return {
      selectedIndex: 0,
      stages: [
        {
          header: 'Setup New School Year',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        },
        {
          header: 'Setup Billing Terms',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          header: 'Setup Grading Period',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          header: 'Section & Schedule',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        }
      ]
    };
  },
  methods: {
    onSelectStage(idx) {
      if (idx < this.selectedIndex) {
        this.selectedIndex = idx;
      }
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .setup__main-container {
    background-color: $light-gray-50;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    padding-bottom: 80px;
  }

  .setup__header {
    height: 45px;
    // border-bottom: 1px solid $light-gray-10;
    // background-color: $white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 7px 20px;
  }

  .setup__body {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1;
  }

  .setup__side-panel {
    width: 300px;
    //border-right: 1px solid $light-gray-10;
    padding: 30px;

    @include for-size(phone-only) {
      display: none;
    }
  }

  .setup__content-area {
    padding: 30px;
    flex: 1;
  }

  .setup__action-back {
    border: 0;
    outline: none;
    background: none;
    color: $blue;
  }

</style>
