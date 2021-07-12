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
            :value="forms.academicRecord.fields.level"
            @input="onLevelChanged"
            label="name"
            placeholder="Level"
            class="mt-2"
            :clearable="false"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.levelId  }"
          />
      </b-form-group>
      <b-form-group
        :state="forms.academicRecord.states.courseId"
        :invalid-feedback="forms.academicRecord.errors.courseId">
        <label class="required">Course</label>
          <SelectCourse
            :value="forms.academicRecord.fields.course"
            :levelId="forms.academicRecord.fields.levelId"
            @input="onCourseChanged"
            label="name"
            placeholder="Course"
            class="mt-2"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.courseId  }"
          />
      </b-form-group>
      <b-form-group
        :state="forms.academicRecord.states.transcriptRecord"
        :invalid-feedback="forms.academicRecord.errors.transcriptRecord"
        v-if="showSelectCurriculum">
        <label class="required"> Curriculum</label>
          <!-- remove courseid to prevent filtered curr -->
          <SelectCurriculum
            :value="forms.academicRecord.fields.transcriptRecord.curriculum"
            @input="onCurriculumChanged"
            :schoolCategoryId="data.schoolCategoryId"
            :levelId="forms.academicRecord.fields.levelId"
            :courseId="forms.academicRecord.fields.courseId"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.transcriptRecord  }"
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
import SelectCourse from '../../components/Dropdowns/SelectCourse'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { AcademicRecordApi, TranscriptRecordApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';

const transcriptRecordFields = {
  curriculumId: null
}

const academicRecordFields = {
  level: null,
  levelId: null,
  course: null,
  courseId: null,
  transcriptRecord: {
    curriculum: null,
    curriculumId: null
  }
}

const academicErrorRecordFields = {
  levelId: null,
  courseId: null,
  transcriptRecord: null
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
    SelectLevel,
    SelectCourse
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        academicRecord: {
          fields: { ...academicRecordFields },
          states: { ...academicErrorRecordFields },
          errors: { ...academicErrorRecordFields }
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

    copyValue(this.data, this.forms.academicRecord.fields)
  },
  methods: {
    onSaveLevel() {
      const { id: academicRecordId, schoolCategoryId, transcriptRecord: { curriculumId } } = this.data
      const { academicRecord, academicRecord: { fields } } = this.forms
      this.isConfirmBusy = true
      reset(academicRecord)

      const payLoad = {
        levelId: fields.levelId,
        courseId: fields.courseId,
        schoolCategoryId,
        transcriptRecord: { curriculumId: fields.transcriptRecord.curriculumId }
      }

      //patch academic record
      this.updateAcademicRecord(payLoad, academicRecordId).then(({ data }) => {
          console.log(data)
        //patch transcript
        this.$emit('update:isShown', false)
        this.$emit('update:data', { ...data })
        this.isConfirmBusy = false;
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(academicRecord, errors)
      });

    },
    onLevelChanged(level) {
      const { fields } = this.forms.academicRecord
      fields.level = level
      fields.levelId = level?.id
    },
    onCourseChanged(course) {
      const { fields } = this.forms.academicRecord
      fields.course = course
      fields.courseId = course?.id
    },
    onCurriculumChanged(curriculum) {
      const { fields: { transcriptRecord } } = this.forms.academicRecord
      transcriptRecord.curriculum = curriculum
      transcriptRecord.curriculumId = curriculum?.id
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
