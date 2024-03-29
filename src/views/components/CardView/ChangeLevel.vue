<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Level"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-alert v-model="showSelectCurriculum" variant="danger">
        Note: Changing Level of original request is required to re-select curriculum.
      </b-alert>
      <b-form-group
        :state="forms.academicRecord.states.levelId"
        :invalid-feedback="forms.academicRecord.errors.levelId">
        <label class="required">Level</label>
          <SelectLevel
            :value="data.level"
            @input="onLevelChanged"
            :schoolCategoryId="data.schoolCategoryId"
            label="name"
            placeholder="Level"
            class="mt-2"
            :clearable="false"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.levelId  }"
          />
      </b-form-group>
      <b-form-group
        :state="forms.transcriptRecord.states.curriculumId"
        :invalid-feedback="forms.transcriptRecord.errors.curriculumId"
        v-if="showSelectCurriculum">
        <label class="required"> Curriculum</label>
          <!-- remove courseid to prevent filtered curr -->
          <SelectCurriculum
            :value="data.transcriptRecord.curriculum"
            @input="onCurriculumChanged"
            :schoolCategoryId="data.schoolCategoryId"
            :levelId="data.levelId"
            :courseId="data.courseId"
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
import SelectLevel from '../../components/Dropdowns/SelectLevel'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { AcademicRecordApi, TranscriptRecordApi } from '../../../mixins/api';

const transcriptRecordFields = {
  curriculumId: null
}

const academicRecordFields = {
  levelId: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
  },
  mixins: [ TranscriptRecordApi, AcademicRecordApi ],
  components: {
    FooterAction,
    SelectCurriculum,
    SelectLevel
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        academicRecord: {
          states: { ...academicRecordFields },
          errors: { ...academicRecordFields }
        },
        transcriptRecord: {
          states: { ...transcriptRecordFields },
          errors: { ...transcriptRecordFields }
        },
      },
      originalLevelId: null
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
      if(!this.originalLevelId) {
        //prevent flicker of showing the alert
        return false
      }
      return this.originalLevelId !== this.levelId
    }
  },
  created() {
    this.originalLevelId = this.data.levelId
  },
  methods: {
    onSaveLevel() {
      const { id: academicRecordId, levelId,  transcriptRecord: { curriculumId } } = this.data
      const { academicRecord, transcriptRecord } = this.forms
      this.isConfirmBusy = true
      reset(academicRecord)
      reset(transcriptRecord)

      const data = {
        levelId,
        transcriptRecord: { curriculumId }
      }

      //patch academic record
      this.updateAcademicRecord(data, academicRecordId).then(({ data: academicRecordData }) => {
        //patch transcript
        this.$emit('update:isShown', false)
        this.$emit('update:data', { ...academicRecordData })
        this.isConfirmBusy = false;
        // this.patchTranscriptRecord(transcriptRecordId, transcriptRecord.fields).then(({ data: transcriptRecordData }) => {
        //   academicRecordData.transcriptRecord = { ...transcriptRecordData }
          
        // })
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(academicRecord, errors, this)
      });

    },
    onLevelChanged(level) {
      this.data.level = level
      this.data.levelId = level?.id
    },
    onCurriculumChanged(curriculum) {
      this.data.transcriptRecord.curriculum = curriculum
      this.data.transcriptRecord.curriculumId = curriculum?.id
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
