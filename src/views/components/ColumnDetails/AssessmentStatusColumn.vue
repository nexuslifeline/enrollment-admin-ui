<template>
  <b-badge
    v-if="assessmentStatus.APPROVED.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="success">
    Approved
  </b-badge>
  <b-badge
    v-else-if="assessmentStatus.PENDING.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="warning">
    Pending
  </b-badge>
  <b-badge
    v-else-if="assessmentStatus.REJECTED.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="danger">
    Rejected
  </b-badge>
</template>

<script>
  import { AssessmentStatuses } from '../../../helpers/enum';
  export default {
    props: {
      data: {
        type: [Object]
      }
    },
    data() {
      return {
        assessmentStatus: AssessmentStatuses
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>