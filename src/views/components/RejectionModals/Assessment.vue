<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Reject Assesment"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.studentFee.states.disapprovalNotes"
        :invalid-feedback="forms.studentFee.errors.disapprovalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.studentFee.fields.disapprovalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Rejection"
        @onConfirm="onRejectAssessment"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.studentFee.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { AcademicRecordApi } from '../../../mixins/api';

const assessmentFields = {
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
    academicRecordId: {
      type: [Number, String]
    }
  },
  mixins: [ AcademicRecordApi ],
  components: {
    FooterAction
  },
  data() {
    return {
      forms: {
        studentFee: {
          isProcessing: false,
          fields: { ...assessmentFields },
          states: { ...assessmentFields },
          errors: { ...assessmentFields }
        }
      }
    }
  },
  created() {

  },
  methods: {
    onRejectAssessment() {
      const { studentFee, studentFee: { fields } } = this.forms
      studentFee.isProcessing = true

      reset(studentFee)

      this.rejectAssessment(this.academicRecordId, {...fields}).then(({ data }) => {
        studentFee.isProcessing = false
        showNotification(this, 'warning', 'Assesment has been reject.')
        this.$emit('onRejected')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(studentFee, errors, this)
        studentFee.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>