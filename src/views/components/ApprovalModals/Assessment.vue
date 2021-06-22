<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Approve Assessment"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.studentFee.states.approvalNotes"
        :invalid-feedback="forms.studentFee.errors.approvalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.studentFee.fields.approvalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Approval"
        @onConfirm="onApproveAssessment"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.studentFee.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { AcademicRecordApi, StudentApi } from '../../../mixins/api';

const applicationFields = {
  approvalNotes: null
}
export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    academicRecordId: {
      type: [Number, String]
    },
    fees: {
      type: [Array]
    },
    previousBalance: {
      type: [Number],
      default: 0
    },
  },
  mixins: [ AcademicRecordApi, StudentApi ],
  components: {
    FooterAction
  },
  data() {
    return {
      forms: {
        studentFee: {
          isProcessing: false,
          fields: { ...applicationFields },
          states: { ...applicationFields },
          errors: { ...applicationFields }
        }
      }
    }
  },
  created() {

  },
  methods: {
    onApproveAssessment() {

      const { studentFee, studentFee: { fields } } = this.forms
      studentFee.isProcessing = true

      const fees = this.fees.map((fee) => {
        const { id: schoolFeeId, pivot: { amount, notes, isInitialFee } } = fee;
        return { schoolFeeId, amount, notes, isInitialFee };
      });

      const data = {
        ...fields,
        totalAmount: this.totalFee,
        enrollmentFee: this.enrollmentFee,
        isComputedByUnits: this.isComputedByUnits,
        previousBalance: this.previousBalance,
        fees
      }

      reset(studentFee)
      this.approveAssessment(this.academicRecordId, data).then(({ data }) => {
          studentFee.isProcessing = false
          showNotification(this, 'success', 'Assessment has been approved.')
          this.$emit('update: isShown', false)
          this.$emit('onApproved')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(studentFee, errors)
        studentFee.isProcessing = false
      });
    }
  },
  computed: {
    enrollmentFee() {
      //is initial fee
      return this.fees.reduce((acc, curr) => {
        return acc += parseInt(curr.pivot.isInitialFee) === 1 ? parseFloat(curr.pivot.amount) : 0
      }, 0)
    },
    totalFee() {
      //total amount of fees
      return this.fees.reduce((acc, curr) => {
         return acc += parseFloat(curr.pivot.amount)
      }, 0)
    },
    isComputedByUnits() {
      //if first element is initial fee = is computed by units
      //not sure for now
      if(this.fees.length > 0) {
        return parseInt(this.fees[0].pivot.isInitialFee)
      }
      return 0
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
