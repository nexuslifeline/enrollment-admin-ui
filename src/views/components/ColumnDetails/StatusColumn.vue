<template>
  <b-badge
    v-if="evaluationStatus.APPROVED.academicRecordStatuses.includes(data.academicRecord.academicRecordStatusId)"
    variant="success">
    Approved
  </b-badge>
  <b-badge
    v-else-if="evaluationStatus.PENDING.academicRecordStatuses.includes(data.academicRecord.academicRecordStatusId)"
    variant="warning">
    Pending
  </b-badge>
  <b-badge
    v-else-if="evaluationStatus.REJECTED.academicRecordStatuses.includes(data.academicRecord.academicRecordStatusId)"
    variant="danger">
    Rejected
  </b-badge>
</template>

<script>
  import { EvaluationStatuses } from '../../../helpers/enum';
  export default {
    props: {
      data: {
        type: [Object]
      }
    },
    data() {
      return {
        evaluationStatus: EvaluationStatuses
      }
    },
    created() {
      console.log('evaluation status', this.data)
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>