<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Curriculum"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true"
    @shown="onShown()">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.academicRecord.states.curriculumId"
        :invalid-feedback="forms.academicRecord.errors.curriculumId">
        <label class="required"> Curriculum</label>
          <SelectCurriculum
            v-model="forms.academicRecord.fields.curriculumId"
            :reduce="option => option.id"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :courseId="courseId"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.curriculumId  }"
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
import { AcademicRecordApi } from '../../../mixins/api';
import FooterAction from '../ModalFooter/ActionBar';
import SelectCurriculum from '../../components/Dropdowns/SelectCurriculum'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';

const acadmicRecordFields = {
  curriculumId: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
    // academicRecordId: {
    //   type: [Number, String]
    // },
    // curriculum: {
    //   type: [Object]
    // },
    // courseId: {
    //   type: [Number, String]
    // }
  },
  mixins: [AcademicRecordApi],
  components: {
    FooterAction,
    SelectCurriculum
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        academicRecord: {
          fields: { ...acadmicRecordFields },
          states: { ...acadmicRecordFields },
          errors: { ...acadmicRecordFields }
        }
      }
    }
  },
  computed: {
    courseId() {
      return this.data?.courseId;
    },
    levelId() {
      return this.data?.levelId;
    }
  },
  methods: {
    // onChangeCurriculum() {
    //   //update academic record here
    //   this.isConfirmBusy = true

    //  const { academicRecord, academicRecord: { fields } } = this.forms

    //   reset(academicRecord)
    //   this.patchAcademicRecord(fields, this.academicRecordId).then(({ data }) => {
    //     this.data.curriculum = data.curriculum
    //     this.$emit('onCancel')
    //     this.isConfirmBusy = false
    //   }).catch((error) => {
    //     this.isConfirmBusy = false;
    //     const errors = error.response.data.errors;
    //     console.log(errors)
    //     validate(academicRecord, errors)
    //   });
    // },
    onSaveCurriculum() {
      const { academicRecord } = this.data;
      const hasActiveTranscript = academicRecord?.transcript?.transcriptRecordStatusId === TranscriptRecordStatus.DRAFT.id;
      if (hasActiveTranscript) {
        // just patch transcript here PATCH /transcript-records/:id
        // we can just sync outside source data here by this.$emit('update:data', { ...this.data, transcriptRecord: { ...response.data } })
        // response.data is the response from the endpoint which is a transcript record model
      } else {
        // attach to academic record POST /academic-records/:id/attach-active-transcript -> response is academic record with updated transcript
        // this will just basically update academic record table with the existing active transcript,
        // if no active transcript is found then new active transcript will be created and will be link to academic record
        // we can just sync outside source data here by this.$emit('update:data', { ...response.data })
        // response.data is the response from the endpoint which is a academic record model with transcript record, level, course
      }
    },
    onShown() {
      // alert('ss')
      //const { fields } = this.forms.academicRecord
      //fields.curriculumId = this.curriculum?.id
      // alert(fields.curriculumId)
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
