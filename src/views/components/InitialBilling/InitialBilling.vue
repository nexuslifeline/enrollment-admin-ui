<template>
  <Card
    title="Manage Initial Fee"
    titleSize="m"
    :hasFooter="true">
    <CardNote type="warning">
      <b>Initial Fee</b> is the amount that should be paid to be officially enrolled.
      If the amount is incorrect, you can override the amount here.
      Marking the initial billing as <b>Unpaid</b> will <b>cancel</b> all the payments posted to it.
    </CardNote>
    <b-overlay :show="isLoading" rounded="sm">
      <InputGroup>
        <InputContainer>
          <InputInline>
            <Toggle @input="onMarkUnpaid" v-model="isUnpaid"/>
            <span class="ml-2">Mark as Unpaid</span>
          </InputInline>
        </InputContainer>
        <div class="initial-fee__container">
          <label class="required label">Registration Fee</label>
          <!-- <b-form-input v-model="forms.billing.fields.totalAmount"/> -->
          <vue-autonumeric
            v-model="forms.billing.fields.totalAmount"
            class="form-control text-right"
            :options="[{modifyValueOnWheel: false,emptyInputBehavior: 0,},]"
          />
        </div>
      </InputGroup>
    </b-overlay>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button v-if="!isReadOnly" variant="primary" @click="onUpdateAmount" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Update Amount
        </b-button>
      </CardFooterRow>
    </template>
    <ConfirmationModal
      :isShown="showConfirmation"
      :isConfirmBusy="isProcessing"
      @onYes="onUpdateBilling"
      @onCancel="onCancelUpdateBilling"
      title="Mark Billing as Unpaid">
      <template #modal-body>
        Are you sure you want to mark this billing as unpaid?
        <br>Note: Marking as unpaid will cancell all payments on this billing.
      </template>
    </ConfirmationModal>
  </Card>
</template>

<script>
import { copyValue } from '../../../helpers/extractor'
import { reset, showNotification, validate } from '../../../helpers/forms'
import ConfirmationModal from '../ConfirmationModal'
const billingFields = {
  id: null,
  totalAmount: null
}
import { AcademicRecordApi, BillingApi } from '../../../mixins/api'
  export default {
    props: {
      academicRecordId: {
        type: [Number, String]
      },
      isReadOnly: {
        type: [Boolean],
        default: false
      }
    },
    mixins: [AcademicRecordApi,BillingApi],
    components: {
      ConfirmationModal
    },
    data() {
      return {
        isProcessing: false,
        showConfirmation: false,
        isUnpaid: false,
        forms: {
          billing: {
            fields: { ...billingFields },
            states: { ...billingFields },
            errors: { ...billingFields }
          }
        },
        isLoading: true
      }
    },
    created() {
      // GET /academic-records/{academicRecordId}/initial-billing
      const { academicRecordId } = this
      const { fields } = this.forms.billing
      this.isLoading = true
      this.getInitialBilling(academicRecordId).then(({ data }) => {
        copyValue(data, fields)
        this.isLoading = false
      })
    },
    methods: {
      onMarkUnpaid() {
        // should show a Confirmation modal before cancelling payments
        // POST billings/:billingId/cancel-payments
        if(this.isUnpaid) {
          this.showConfirmation = true
        }
      },
      onCancelUpdateBilling() {
        this.isUnpaid = false
        this.showConfirmation = false
      },
      onUpdateBilling() {
        this.isProcessing = true
        const { billing, billing: { fields: { id: billingId }} } = this.forms
        this.cancelPayments(billingId).then(({ data }) => {
           showNotification(this, 'success', 'Success')
           this.isProcessing = true
           this.showConfirmation = false
        }).catch((error) => {
          const errors = error.response.data.errors;
          validate(billing, errors, this);
          this.isProcessing = false
        })
      },
      onUpdateAmount() {
        // PUT academic-records/:billingId/initial-billing/:billingId
        const { billing, billing: { fields: { id: billingId, totalAmount }} } = this.forms
        const { academicRecordId } = this
        this.isProcessing = true
        reset(billing)
        this.updateInitialBilling(academicRecordId, billingId, { totalAmount }).then(({ data }) => {
          showNotification(this, 'success', 'Amount has been updated.')
          this.isProcessing = false
        }).catch((error) => {
          const errors = error.response.data.errors;
          validate(billing, errors, this);
          this.isProcessing = false
        })
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