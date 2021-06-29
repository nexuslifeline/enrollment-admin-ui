<template>
  <div>
    <template v-if="data.academicRecordStatusId === AcademicRecordStatuses.ENLISTMENT_APPROVED.id">
      <b-badge variant="warning">
        Assessment Review
      </b-badge>
    </template>
    <template v-else-if="data.academicRecordStatusId === AcademicRecordStatuses.ENROLLED.id">
      <b-badge variant="success">
        Enrolled
      </b-badge>
    </template>
    <template v-else>
      <b-badge
        v-if="data.manualStepId === ManualSteps.PROFILE_AND_ACCOUNT.id"
        variant="warning">
        Profile & Account
      </b-badge>
      <b-badge
        v-else-if="data.manualStepId === ManualSteps.SUBJECT_ENLISTMENT.id"
        variant="warning">
        Subject Enlistment
      </b-badge>
    </template>
  </div>
</template>

<script>
  import { ManualSteps, AcademicRecordStatuses } from '../../../helpers/enum';
  export default {
    ManualSteps,
    props: {
      data: {
        type: [Object]
      }
    },
    data() {
      return {
        ManualSteps,
        AcademicRecordStatuses
      }
    },
    created() {
      console.log('test', this.data)
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>