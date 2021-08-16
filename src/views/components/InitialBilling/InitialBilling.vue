<template>
  <Card
    title="Manage Initial Billing"
    titleSize="m"
    :hasFooter="true">
    <CardNote type="warning">
      Marking the initial billing as <b>Unpaid</b> will <b>cancel</b> all the payments posted to it.
    </CardNote>
    <InputGroup>
      <InputContainer>
        <InputInline>
          <Toggle @onChange="onMarkUnpaid" />
          <span class="ml-2">Mark as Unpaid</span>
        </InputInline>
      </InputContainer>
      <div class="initial-fee__container">
        <label class="required label">Registration Fee</label>
        <b-form-input />
      </div>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button v-if="!isReadOnly" variant="primary" @click="onUpdateAmount" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Update Amount
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>

<script>
  export default {
    props: {
      academicRecordId: {
        type: [Number, String]
      }
    },
    mixins: [],
    components: {

    },
    data() {
      return {
        isProcessing: false,
        forms: {}
      }
    },
    created() {
      // GET /academic-records/{academicRecordId}/initial-billing
    },
    methods: {
      onMarkUnpaid() {
        // should show a Confirmation modal before cancelling payments
        // POST billings/:billingId/cancel-payments
        console.log('cancel all the payments here')
      },
      onUpdateAmount() {
        // PUT academic-records/:billingId/initial-billing/:billingId
        console.log('update initial billing amount')
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .initial-fee__container {
    display: flex;
    flex: 2;

    .label {
      min-width: 130px;
    }
  }
</style>