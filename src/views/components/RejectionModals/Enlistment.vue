<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Reject Enlistment"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.application.states.disapprovalNotes"
        :invalid-feedback="forms.application.errors.disapprovalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.application.fields.disapprovalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Rejection"
        @onConfirm="onRejectEvaluation"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.application.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { AcademicRecordApi } from '../../../mixins/api';

const applicationFields = {
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
        application: {
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
    onRejectEvaluation() {
      const { application, application: { fields } } = this.forms
      application.isProcessing = true

      reset(application)

      this.rejectEnlistment(this.academicRecordId, {...fields}).then(({ data }) => {
        application.isProcessing = false
        showNotification(this, 'warning', 'Enlistment has been reject.')
        this.$emit('onRejected')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(application, errors, this)
        application.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>