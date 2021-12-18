<template>
  <div>
    <InlineItem label="Transaction No">
      {{ data.transactionNo || 'N/A' }}
    </InlineItem>
    <InlineItem label="Reference No">
      {{ data.referenceNo || 'N/A'  }}
    </InlineItem>
    <InlineItem label="Billing No">
      {{ billing && billing.billingNo || 'N/A'  }}
    </InlineItem>
    <InlineItem label="Due Date">
      {{ billing && billing.dueDate || 'N/A'  }}
    </InlineItem>
    <InlineItem label="Billing Type">
      {{ billingTypeName  }}
    </InlineItem>
    <InlineItem label="Billing Amount">
      <b-badge variant="warning">{{ billing && billing.totalAmount  }}</b-badge>
    </InlineItem>
    <InlineItem label="Paid Amount">
      <b-badge variant="success">{{ data.amount }}</b-badge>
    </InlineItem>
    <InlineItem label="Payment Mode">
      {{ paymentMode && paymentMode.name || 'N/A' }}
    </InlineItem>
    <h4 class="content-title">Billing Details</h4>
    <BillingItems :billingId="data.billingId"/>
  </div>
</template>
<script>

import { BillingTypes } from '../../../helpers/enum';
import BillingItems from '../PendingPayments/BillingItems'
export default {
  BillingTypes,
  components: { BillingItems },
  props: {
    data: {
      type: [Object]
    },
    studentCategory: {
      type: [Object]
    }
  },
  computed: {
    billing() {
      return this.data?.billing
    },
    paymentMode() {
      return this.data?.paymentMode
    },
    billingTypeName() {
      const { billintTypeId } = this.billing
      if(billintTypeId)
      return this.$options.BillingTypes.getName(billintTypeId)

      return 'N/A'
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .student-name {
    display: flex;
    align-items: center;
  }

</style>
