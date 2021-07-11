<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Reject Payment"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.payment.states.disapprovalNotes"
        :invalid-feedback="forms.payment.errors.disapprovalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.payment.fields.disapprovalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Rejection"
        @onConfirm="onRejectPayment"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.payment.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { PaymentApi } from '../../../mixins/api';

const paymentFields = {
  disapprovalNotes: null
}
export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    paymentId: {
      type: [Number, String]
    }
  },
  mixins: [ PaymentApi ],
  components: {
    FooterAction
  },
  data() {
    return {
      forms: {
        payment: {
          isProcessing: false,
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields }
        }
      }
    }
  },
  created() {

  },
  methods: {
    onRejectPayment() {
      const { payment, payment: { fields } } = this.forms
      payment.isProcessing = true

      reset(payment)

      this.rejectPayment({...fields}, this.paymentId).then(({ data }) => {
        payment.isProcessing = false
        showNotification(this, 'warning', 'Payment has been reject.')
        this.$emit('onRejected')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(payment, errors, this)
        payment.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>