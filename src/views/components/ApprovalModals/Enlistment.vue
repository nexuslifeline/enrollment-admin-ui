<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Approve Enlistment"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.application.states.approvalNotes"
        :invalid-feedback="forms.application.errors.approvalNotes">
          <label> Notes</label>
          <b-textarea
            v-model="forms.application.fields.approvalNotes"
            rows="7" />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Approval"
        @onConfirm="onApproveEnlistment"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="forms.application.isProcessing"
      />
    </template>
  </b-modal>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { EnlistmentStatuses } from '../../../helpers/enum'
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
    subjects: {
      type: [Array]
    }
  },
  mixins: [ AcademicRecordApi, StudentApi ],
  EnlistmentStatuses,
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
    onApproveEnlistment() {

      const { application, application: { fields } } = this.forms
      application.isProcessing = true

      const subjects = this.subjects.map((subject) => {
        const {
          id: subjectId,
          pivot: { sectionId },
        } = subject;
        return { subjectId, sectionId };
      });

      const data = {
        ...fields,
        subjects,
      }


      reset(application)
      this.approveEnlistment(this.academicRecordId, data).then(({ data }) => {
          application.isProcessing = false
          showNotification(this, 'success', 'Enlistment has been approved.')
          this.$emit('update: isShown', false)
          this.$emit('onApproved')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(application, errors)
        application.isProcessing = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
