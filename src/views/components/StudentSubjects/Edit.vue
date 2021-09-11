<template>
  <b-modal
    title="Edit Subject"
    :visible="show"
    @hidden="onClose"
    no-close-on-backdrop
    no-close-on-esc
    size="md"
    bodyClass="modal-body__container"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.subject.states.sectionId"
        :invalid-feedback="forms.subject.errors.sectionId">
        <label>Section</label>
          <SelectSubjectSection
            :value="forms.subject.fields.section"
            :subjectId="data.id"
            :schoolYearId="academicRecord.schoolYearId"
            @input="onSectionChanged"
            label="name"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.subject.errors.sectionId  }"
            appendToBody
          />
      </b-form-group>
      <InputGroup class="mt-2">
        <InputContainer>
          <InputInline>
            <Toggle :value="forms.subject.fields.isDropped" @input="onDroppedChanged"/>
            <span class="ml-2">Dropped</span>
          </InputInline>
        </InputContainer>
      </InputGroup>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onCancel="onClose"
        @onDelete="onDelete"
        :isConfirmBusy="isProcessing"
        :isDeleteBusy="isDeleting"
        showDelete
      />
    </template>
  </b-modal>
</template>

<script>

const subjectFields = {
  section: null,
  sectionId: null,
  isDropped: null,
}

import { AcademicRecordApi } from '../../../mixins/api'
import { copyValue } from '../../../helpers/extractor'
import { showNotification } from '../../../helpers/forms'
export default {
  mixins: [AcademicRecordApi],
  props: {
    show: {
      type: [Boolean],
      default: false
    },
    data: {
      type: [Object],
    },
    academicRecord: {
      type: [Object]
    },
  },
  data() {
    return {
      isProcessing: false,
      isDeleting: false,
      forms: {
        subject: {
          fields: { ...subjectFields },
          states: { ...subjectFields },
          errors: { ...subjectFields }
        }
      }
    }
  },
  created() {
    const { fields } = this.forms.subject
    const { section, pivot: { sectionId, isDropped } } = this.data
    fields.section = section
    fields.sectionId = sectionId
    fields.isDropped = isDropped
  },
  methods: {
    onSave() {
      const { id: subjectId } = this.data
      const { id: academicRecordId } = this.academicRecord
      const { subject, subject: { fields: {sectionId, isDropped }} } = this.forms

      this.isProcessing = true

      const payLoad = {
        sectionId,
        isDropped
      }

      this.updateAcademicRecordSubject(academicRecordId, subjectId, payLoad).then(({ data }) => {
        showNotification(this, 'success', 'Subject has been updated.')
        this.$emit('onSubjectUpdated', data)
        this.onClose()
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isProcessing = false
        console.log(errors)
      });
    },
    onSectionChanged(section) {
      const { fields } = this.forms.subject
      fields.section = section
      fields.sectionId = section?.id || null
    },
    onDroppedChanged(checked) {
      const { fields } = this.forms.subject
      fields.isDropped = checked
    },
    onClose() {
      this.$emit('update:show', false)
    },
    onDelete() {
      alert('on delete here')
      this.$emit('onSubjectDeleted', this.data)
    }
  }
}
</script>

<style>

</style>