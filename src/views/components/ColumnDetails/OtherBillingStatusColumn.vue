<template>
  <b-badge
    v-if="data.billingStatusId === $options.BillingStatuses.PAID.id"
    variant="success">
    Paid
  </b-badge>
  <b-badge
    v-else
    :variant="data.isForwarded ? 'primary' : 'warning'">
    {{ data.billingStatusId === $options.BillingStatuses.UNPAID.id ? 'Unpaid': 'Partially Paid' }}
    <span v-if="data.isForwarded">&nbsp;+ Forwarded</span>
  </b-badge>
</template>

<script>
  import { BillingStatuses } from '../../../helpers/enum';
  export default {
    BillingStatuses,
    props: {
      data: {
        type: [Object]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>