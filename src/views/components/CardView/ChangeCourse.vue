<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Course"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true"
    @shown="onShown()">
    <div class="modal-field-container overflow-visible">
      <b-alert v-model="showSelectCurriculum" variant="danger">
        Note: Changing Level of original request is required to re-select curriculum.
      </b-alert>
      <b-form-group
        :state="forms.academicRecord.states.courseId"
        :invalid-feedback="forms.academicRecord.errors.courseId">
        <label class="required">Course</label>
          <SelectCourse
            v-model="forms.academicRecord.fields.courseId"
            :reduce="option => option.id"
            label="name"
            placeholder="Course"
            class="mt-2"
            :clearable="false"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.courseId  }"
          />
      </b-form-group>
      <b-form-group
        :state="forms.transcriptRecord.states.curriculumId"
        :invalid-feedback="forms.transcriptRecord.errors.curriculumId"
        v-if="showSelectCurriculum">
        <label class="required"> Curriculum</label>
          <!-- remove courseid to prevent filtered curr -->
          <SelectCurriculum
            v-model="forms.transcriptRecord.fields.curriculumId"
            :reduce="option => option.id"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.transcriptRecord.errors.curriculumId  }"
          />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSaveLevel"
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
import SelectCourse from '../../components/Dropdowns/SelectCourse'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { AcademicRecordApi, TranscriptRecordApi } from '../../../mixins/api';

const transcriptRecordFields = {
  curriculumId: null
}

const academicRecordFields = {
  courseId: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
    // transcriptRecordId: {
    //   type: [Number, String]
    // },
    // curriculum: {
    //   type: [Object]
    // },
    // courseId: {
    //   type: [Number, String]
    // }
  },
  mixins: [ TranscriptRecordApi, AcademicRecordApi ],
  components: {
    FooterAction,
    SelectCurriculum,
    SelectCourse
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        academicRecord: {
          fields: { ...academicRecordFields },
          states: { ...academicRecordFields },
          errors: { ...academicRecordFields }
        },
        transcriptRecord: {
          fields: { ...transcriptRecordFields },
          states: { ...transcriptRecordFields },
          errors: { ...transcriptRecordFields }
        }
      }
    }
  },
  computed: {
    levelId() {
      return this.data?.levelId;
    },
    courseId() {
      return this.data?.courseId;
    },
    showSelectCurriculum() {
      const { fields } = this.forms.academicRecord
      if(!fields.courseId) {
        //prevent flicker of showing the alert
        return false
      }
      return fields.courseId !== this.courseId
    }
  },
  methods: {
    onSaveLevel() {
      const { id: academicRecordId, transcriptRecord: { id: transcriptRecordId } } = this.data
      const { academicRecord, transcriptRecord } = this.forms
      this.isConfirmBusy = true
      reset(academicRecord)
      reset(transcriptRecord)

      //patch academic record
      this.patchAcademicRecord(academicRecord.fields, academicRecordId).then(({ data: academicRecordData }) => {
        //patch transcript
        this.patchTranscriptRecord(transcriptRecordId, transcriptRecord.fields).then(({ data: transcriptRecordData }) => {
          academicRecordData.transcriptRecord = { ...transcriptRecordData }
          this.$emit('update:isShown', false)
          this.$emit('update:data', { ...academicRecordData })
          this.isConfirmBusy = false;
        })
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(academicRecord, errors)
      });

    },
    onShown() {
      const { academicRecord, transcriptRecord } = this.forms
      academicRecord.fields.courseId = this.data?.courseId
      transcriptRecord.fields.curriculumId = this.data?.transcriptRecord?.curriculumId
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
