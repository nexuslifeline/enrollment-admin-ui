<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Academic Record"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-alert v-model="isShownCurriculum" variant="warning">
        Please ensure that the <b>Curriculum</b> is align to the SchoolCategory, Level, Course and Semester.
      </b-alert>
      <b-form-group
        :state="forms.academicRecord.states.schoolCategoryId"
        :invalid-feedback="forms.academicRecord.errors.schoolCategoryId">
        <label class="required">School Category</label>
          <SelectCategory
            :value="forms.academicRecord.fields.schoolCategory"
            @input="onSchoolCategoryChanged"
            label="name"
            :clearable="false"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.schoolCategoryId  }"
            appendToBody
          />
      </b-form-group>
      <b-form-group
        :state="forms.academicRecord.states.levelId"
        :invalid-feedback="forms.academicRecord.errors.levelId">
        <label class="required">Level</label>
          <SelectLevel
            :value="forms.academicRecord.fields.level"
            :schoolCategoryId="forms.academicRecord.fields.schoolCategoryId"
            @input="onLevelChanged"
            label="name"
            :clearable="false"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.levelId  }"
            appendToBody
          />
      </b-form-group>
      <b-form-group
        v-if="$options.SchoolCategories.getEnum(selectedSchoolCategoryId).hasCourse"
        :state="forms.academicRecord.states.courseId"
        :invalid-feedback="forms.academicRecord.errors.courseId">
        <label class="required">Course</label>
          <SelectCourse
            :value="forms.academicRecord.fields.course"
            :levelId="forms.academicRecord.fields.levelId"
            :schoolCategoryId="forms.academicRecord.fields.schoolCategoryId"
            @input="onCourseChanged"
            label="name"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.courseId  }"
            appendToBody
          />
      </b-form-group>
      <b-form-group
        v-if="$options.SchoolCategories.getEnum(selectedSchoolCategoryId).hasSemester"
        :state="forms.academicRecord.states.semesterId"
        :invalid-feedback="forms.academicRecord.errors.semesterId">
        <label class="required">Semester</label>
          <SelectSemester
            :value="forms.academicRecord.fields.semester"
            :levelId="forms.academicRecord.fields.levelId"
            :schoolCategoryId="forms.academicRecord.fields.schoolCategoryId"
            @input="onSemesterChanged"
            label="name"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.semesterId  }"
            appendToBody
          />
      </b-form-group>
      <b-form-group
        :state="forms.academicRecord.states.transcriptRecord"
        :invalid-feedback="forms.academicRecord.errors.transcriptRecord"
        v-if="isShownCurriculum">
        <label class="required">Curriculum</label>
          <!-- remove courseid to prevent filtered curr -->
          <SelectCurriculum
            :value="forms.academicRecord.fields.transcriptRecord.curriculum"
            @input="onCurriculumChanged"
            :schoolCategoryId="forms.academicRecord.fields.schoolCategoryId"
            :levelId="forms.academicRecord.fields.levelId"
            :courseId="forms.academicRecord.fields.courseId"
            label="name"
            :clearable="true"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.transcriptRecord  }"
            appendToBody
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
import SelectCategory from '../../components/Dropdowns/SelectCategory'
import SelectSemester from '../../components/Dropdowns/SelectSemester'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { AcademicRecordApi, TranscriptRecordApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { SchoolCategories } from '../../../helpers/enum';

const transcriptRecordFields = {
  curriculumId: null
}

const academicRecordFields = {
  schoolCategory: null,
  schoolCategoryId: null,
  level: null,
  levelId: null,
  course: null,
  courseId: null,
  semester: null,
  semesterId: null,
  transcriptRecord: {
    curriculum: null,
    curriculumId: null
  }
}

const academicErrorRecordFields = {
  levelId: null,
  courseId: null,
  transcriptRecord: null,
  semesterId: null,
  schoolCategoryId: null
}

export default {
  SchoolCategories,
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
    SelectCourse,
    SelectCategory,
    SelectSemester
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
    semesterId() {
      return this.data?.semesterId
    },
    schoolCategoryId() {
      return this.data?.schoolCategoryId
    },
    selectedSchoolCategoryId() {
      return this.forms?.academicRecord?.fields?.schoolCategory?.id;
    },
    isShownCurriculum() {
      const { schoolCategoryId, levelId, courseId, semesterId } = this.forms.academicRecord.fields
      if(this.schoolCategoryId !== schoolCategoryId || this.levelId !== levelId || this.courseId !== courseId || this.semesterId !== semesterId) {
        return true
      }

      return  false
    }
  },
  created() {
    this.originalLevelId = this.data.levelId
    copyValue(this.data, this.forms.academicRecord.fields)
  },
  methods: {
    onSaveLevel() {
      const { id: academicRecordId } = this.data
      const { academicRecord, academicRecord: { fields } } = this.forms
      this.isConfirmBusy = true
      reset(academicRecord)

      const payLoad = {
        levelId: fields.levelId,
        courseId: fields.courseId,
        schoolCategoryId: fields.schoolCategoryId,
        semesterId: fields.semesterId,
        // only include curriculum in the payload if the field is visible
        ...(this.isShownCurriculum && {
          transcriptRecord: { curriculumId: fields.transcriptRecord.curriculumId }
        })
      }

      this.updateAcademicRecord(payLoad, academicRecordId).then(({ data }) => {
        const item = { ...this.data, ...data, transcriptRecord: { ...this.data?.transcriptRecord } };
        this.$emit('update:data', item);
        this.$emit('update:isShown', false)
        this.isConfirmBusy = false;
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(academicRecord, errors)
      });

    },
    onSchoolCategoryChanged(schoolCategory) {
      const { fields } = this.forms.academicRecord
      fields.schoolCategory = schoolCategory
      fields.schoolCategoryId = schoolCategory?.id

      fields.level = null
      fields.levelId = null
      fields.course = null
      fields.courseId = null
      fields.semester = null
      fields.semesterId = null
    },
    onLevelChanged(level) {
      const { fields } = this.forms.academicRecord
      fields.level = level
      fields.levelId = level?.id

      fields.course = null
      fields.courseId = null
      fields.semester = null
      fields.semesterId = null
    },
    onCourseChanged(course) {
      const { fields } = this.forms.academicRecord
      fields.course = course
      fields.courseId = course?.id

      fields.semester = null
      fields.semesterId = null
    },
    onSemesterChanged(semester) {
      const { fields } = this.forms.academicRecord
      fields.semester = semester
      fields.semesterId = semester?.id
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
