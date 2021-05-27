<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Reject Evaluation"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.evaluation.states.disapprovalNotes"
        :invalid-feedback="forms.evaluation.errors.disapprovalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.evaluation.fields.disapprovalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Rejection"
        @onConfirm="onRejectEvaluation"
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
  disapprovalNotes: null,
  evaluationStatusId: null
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
    onRejectEvaluation() {
      const { evaluation, evaluation: { fields } } = this.forms
      evaluation.isProcessing = true

      reset(evaluation)

      fields.evaluationStatusId  = this.$options.EvaluationStatuses.REJECTED.id

      this.updateEvaluation(fields, this.evaluationId).then(({ data }) => {
        evaluation.isProcessing = false
        showNotification(this, 'warning', 'Evaluation has been reject.')
        this.$emit('onRejected')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(evaluation, errors)
        evaluation.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>