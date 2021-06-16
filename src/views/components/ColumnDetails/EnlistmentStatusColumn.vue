<template>
  <b-badge
    v-if="enlistmentStatus.APPROVED.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="success">
    Approved
  </b-badge>
  <b-badge
    v-else-if="enlistmentStatus.PENDING.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="warning">
    Pending
  </b-badge>
  <b-badge
    v-else-if="enlistmentStatus.REJECTED.academicRecordStatuses.includes(data.academicRecordStatusId)"
    variant="danger">
    Rejected
  </b-badge>
</template>

<script>
  import { EnlistmentStatuses } from '../../../helpers/enum';
  export default {
    props: {
      data: {
        type: [Object]
      }
    },
    data() {
      return {
        enlistmentStatus: EnlistmentStatuses
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>