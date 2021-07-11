<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Approve Evaluation"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.evaluation.states.approvalNotes"
        :invalid-feedback="forms.evaluation.errors.approvalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.evaluation.fields.approvalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Approval"
        @onConfirm="onApproveEvaluation"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.evaluation.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { EvaluationStatuses } from '../../../helpers/enum'
import { EvaluationApi } from '../../../mixins/api';

const evaluationFields = {
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
    evaluationId: {
      type: [Number, String]
    }
  },
  mixins: [ EvaluationApi ],
  EvaluationStatuses,
  components: {
    FooterAction
  },
  data() {
    return {
      forms: {
        evaluation: {
          isProcessing: false,
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields }
        }
      }
    }
  },
  created() {

  },
  methods: {
    onApproveEvaluation() {

      const { evaluation, evaluation: { fields } } = this.forms
      evaluation.isProcessing = true

      reset(evaluation)

      this.approveEvaluation(fields, this.evaluationId).then(({ data }) => {
        evaluation.isProcessing = false
        showNotification(this, 'success', 'Evaluation has been approved.')
        this.$emit('update: isShown', false)
        this.$emit('onApproved')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(evaluation, errors, this)
        evaluation.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
