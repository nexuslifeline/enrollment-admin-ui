<template>
  <b-modal
    :visible="isShown"
    size="lg"
    title="Change Curriculum"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-alert variant="primary" show>
        No curriculum added with the current course. You can change the course to select a curriculum.
      </b-alert>
      <b-form-group
        :state="forms.transcriptRecord.states.curriculumId"
        :invalid-feedback="forms.transcriptRecord.errors.curriculumId">
        <label class="required"> Curriculum</label>
          <SelectCurriculum
            :value="forms.transcriptRecord.fields.curriculum"
            @input="onCurriculumChanged"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :courseId="courseId"
            :class=" { 'is-invalid' : !!forms.transcriptRecord.errors.curriculumId  }"
            appendToBody
          />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSaveCurriculum"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
//import { AcademicRecordApi } from '../../../mixins/api';
import FooterAction from '../ModalFooter/ActionBar';
import SelectCurriculum from '../../components/Dropdowns/SelectCurriculum'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { TranscriptRecordApi } from '../../../mixins/api';

const transcriptRecordFields = {
  curriculumId: null,
  curriculum: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
    courseId: {
      type: [Number, String]
    }
  },
  mixins: [ TranscriptRecordApi ],
  components: {
    FooterAction,
    SelectCurriculum
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        transcriptRecord: {
          fields: { ...transcriptRecordFields },
          states: { ...transcriptRecordFields },
          errors: { ...transcriptRecordFields }
        }
      }
    }
  },
  created() {
    this.forms.transcriptRecord.fields.curriculum = this.data.curriculum
    this.forms.transcriptRecord.fields.curriculumId = this.data.curriculumId
  },
  computed: {
    levelId() {
      return this.data?.levelId;
    }
  },
  methods: {
    onSaveCurriculum() {
      const { id: transcripRecordId } = this.data
      this.isConfirmBusy = true;
      const { transcriptRecord, transcriptRecord: { fields: { curriculumId } } } = this.forms
      reset(transcriptRecord)
      this.patchTranscriptRecord(transcripRecordId, { curriculumId }).then(({ data }) => {
        this.$emit('update:isShown', false)
        this.$emit('update:data', { ...data })
        this.isConfirmBusy = false;
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(transcriptRecord, errors, this)
      });
    },
    onCurriculumChanged(curriculum) {
      const { fields } = this.forms.transcriptRecord
      fields.curriculum = curriculum
      fields.curriculumId = curriculum?.id
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
