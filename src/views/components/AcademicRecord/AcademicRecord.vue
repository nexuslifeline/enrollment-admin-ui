<template>
  <Card
    :title="title"
    titleSize="m"
    :hasFooter="true">
    <CardNote v-if="showNotes">
      <template v-if="!!notes">
        {{ notes }}
      </template>
      <template v-else>
        It is recommended to complete the <b>Academic Record</b> section first before
        adding Subject to be able to find the right subjects for the Student.
      </template>
    </CardNote>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="School Category"
          labelClass="required"
          :state="forms.academicRecord.states.schoolCategoryId"
          :invalid-feedback="forms.academicRecord.errors.schoolCategoryId">
          <SelectCategory
            :value="data.schoolCategory"
            label="name"
            @input="onSchoolCategoryChanged"
            :clearable="false"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group
          label="School Year"
          labelClass="required"
          :state="forms.academicRecord.states.schoolYearId"
          :invalid-feedback="forms.academicRecord.errors.schoolYearId">
          <SelectSchoolYear
            :value="data.schoolYear"
            label="name"
            @input="onSchoolYearChanged"
            :clearable="false"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Level"
          labelClass="required"
          :state="forms.academicRecord.states.levelId"
          :invalid-feedback="forms.academicRecord.errors.levelId">
          <SelectLevel
            :value="data.level"
            label="name"
            @input="onLevelChanged"
            :schoolCategoryId="data.schoolCategoryId"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group
          label="Student Categroy"
          labelClass="required"
          :state="forms.academicRecord.states.studentCategoryId"
          :invalid-feedback="forms.academicRecord.errors.studentCategoryId">
          <SelectStudentCategory
            :value="data.studentCategoryId"
            :reduce="option => option.id"
            label="name"
            @input="data.studentCategoryId = $event"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Course"
          labelClass="required"
          :state="forms.academicRecord.states.courseId"
          :invalid-feedback="forms.academicRecord.errors.courseId">
          <SelectCourseLevel
            :value="data.course"
            label="description"
            @input="onCourseChanged"
            :levelId="data.levelId"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group
          label="Semester"
          labelClass="required"
          :state="forms.academicRecord.states.semesterId"
          :invalid-feedback="forms.academicRecord.errors.semesterId">
          <SelectSemester
            :value="data.semester"
            label="description"
            @input="onSemesterChanged"
            :schoolCategoryId="data.schoolCategoryId"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
     <InputGroup>
       <InputContainer>
        <b-form-group
          label="Curriculum"
          labelClass="required"
          :state="forms.academicRecord.states.transcriptRecord"
          :invalid-feedback="forms.academicRecord.errors.transcriptRecord">
          <SelectCurriculum
            :value="data.transcriptRecord.curriculum"
            :courseId="data.courseId"
            :schoolCategoryId="data.schoolCategoryId"
            label="name"
            @input="onCurriculumChanged"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Student Type"
          labelClass="required"
          :state="forms.academicRecord.states.studentTypeId"
          :invalid-feedback="forms.academicRecord.errors.studentTypeId">
          <SelectStudentType
            :value="data.studentTypeId"
            :reduce="option => option.id"
            label="name"
            @input="data.studentTypeId = $event"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <label>Section</label>
        <SelectSection
          :value="data.section"
          label="name"
          @input="onSectionChanged"
          :disabled="isReadOnly"
          :schoolYearId="data.schoolYearId"
          :schoolCategoryId="data.schoolCategoryId"
          :levelId="data.levelId"
          :courseId="data.courseId"
          :semesterId="data.semesterId"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup v-if="allowChangeStatus">
      <InputContainer>
        <label>Status</label>
        <SelectAcademicStatus
          :value="data.academicRecordStatusId"
          @input="data.academicRecordStatusId = $event"
          :reduce="option => option.id"
          label="name"
          :disabled="isReadOnly"
        />
      </InputContainer>
      <InputContainer />
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button v-if="!isReadOnly" variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>

<script>
import SelectCategory from '../Dropdowns/SelectCategory'
import SelectSchoolYear from '../Dropdowns/SelectSchoolYear'
import SelectLevel from '../Dropdowns/SelectLevel'
import SelectCourseLevel from '../Dropdowns/SelectCourseLevel'
import SelectSemester from '../Dropdowns/SelectSemester'
import SelectCurriculum from '../Dropdowns/SelectCurriculum'
import SelectStudentType from '../Dropdowns/SelectStudentType'
import SelectSection from '../Dropdowns/SelectSection'
import { reset, showNotification, validate } from '../../../helpers/forms'
import { AcademicRecordApi, TranscriptRecordApi } from '../../../mixins/api'
import debounce from 'lodash/debounce';

const academicRecordFields = {
  schoolCategoryId: null,
  schoolYearId: null,
  levelId: null,
  courseId: null,
  semesterId: null,
  studentTypeId: null,
  sectionId: null,
  studentCaregoryId: null,
  transcriptRecord: null
}

  export default {
    props: {
      data: {
        type: [Object]
      },
      showNotes: {
        type: Boolean,
        default: false
      },
      allowChangeStatus: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Academic Record'
      },
      notes: {
        type: String
      },
      isReadOnly: {
        type: Boolean,
        default: false
      },
    },
    mixins: [AcademicRecordApi, TranscriptRecordApi],
    components: {
      SelectCategory,
      SelectSchoolYear,
      SelectLevel,
      SelectCourseLevel,
      SelectSemester,
      SelectCurriculum,
      SelectStudentType,
      SelectSection
    },
    data() {
      return {
        isProcessing: false,
        forms: {
          academicRecord: {
            states: { ...academicRecordFields },
            errors: { ...academicRecordFields }
          }
        }
      }
    },
    created() {
      this.$watch('data', this.autoSave, { deep: true, immediate: false });
    },
    methods: {
      autoSave: debounce(function() { this.onSave() }, 4000),
      onSave() {
        const {
          id: academicRecordId,
          schoolCategoryId,
          schoolYearId,
          levelId,
          courseId,
          semesterId,
          studentTypeId,
          sectionId,
          transcriptRecordId,
          academicRecordStatusId,
          studentCategoryId,
          transcriptRecord: { curriculumId }
        } = this.data
        const { academicRecord, transcriptRecord } = this.forms
        const academicRecordData = {
          schoolCategoryId,
          schoolYearId,
          levelId,
          courseId,
          semesterId,
          studentTypeId,
          sectionId,
          studentCategoryId,
          ...(this.allowChangeStatus && { academicRecordStatusId }), // if allow status change, add academic record status to payload
          transcriptRecord: { curriculumId }
        }
        reset(academicRecord)
        this.isProcessing = true
        this.updateAcademicRecord(academicRecordData, academicRecordId).then(({ data }) => {
          //need to call transript record own update for the observer to run in backend
          showNotification(this, 'success', 'Academic Record Saved!.')
          this.isProcessing = false
          // this.updateTranscriptRecord(transcriptRecordId, { curriculumId }).then(({ data }) => {
            
          //   })
        }).catch((error) => {
          const errors = error.response.data.errors;
          console.log(error)
          this.isProcessing = false;
          validate(academicRecord, errors);
        });
        // Promise.all([
        //   this.updateAcademicRecord(academicRecordData, academicRecordId),
        //   this.updateTranscriptRecord(transcriptRecordId, { curriculumId })
        // ]).then(([{ data }, { data: transcriptRecord  }]) => {
        //   showNotification(this, 'success', 'Academic Record Saved!.')
        //   this.isProcessing = false
        // }).catch((error) => {
        //   const errors = error.response.data.errors;
        //   this.isProcessing = false;
        //   validate(academicRecord, errors);
        //   validate(transcriptRecord, errors);
        // });
      },
      onSchoolYearChanged(schoolYear) {
        this.data.schoolYearId = schoolYear?.id
        this.data.schoolYear = schoolYear
      },
      onSchoolCategoryChanged(schoolCategory) {
        this.data.schoolCategoryId = schoolCategory?.id
        this.data.schoolCategory = schoolCategory

        //reset data fields
        this.data.levelId = null
        this.data.level = null

        this.data.courseId = null
        this.data.course = null

        this.data.semesterId = null
        this.data.semester = null

        this.data.sectionId = null
        this.data.section = null

        this.data.transcriptRecord.curriculum = null
        this.data.transcriptRecord.curriculumId = null
      },
      onLevelChanged(level) {
        this.data.levelId = level?.id
        this.data.level = level

        //reset data fields
        this.data.courseId = null
        this.data.course = null

        this.data.semesterId = null
        this.data.semester = null

        this.data.sectionId = null
        this.data.section = null

        this.data.transcriptRecord.curriculum = null
        this.data.transcriptRecord.curriculumId = null
      },
      onCourseChanged(course) {
        this.data.courseId = course?.id
        this.data.course = course

        //reset data fields
        this.data.semesterId = null
        this.data.semester = null

        this.data.sectionId = null
        this.data.section = null

        this.data.transcriptRecord.curriculum = null
        this.data.transcriptRecord.curriculumId = null
      },
      onSemesterChanged(semester) {
        this.data.semesterId = semester?.id
        this.data.semester = semester

        this.data.sectionId = null
        this.data.section = null
      },
      onSectionChanged(section) {
        this.data.sectionId = section?.id
        this.data.section = section
      },
      onCurriculumChanged(curriculum) {
        this.data.transcriptRecord.curriculumId = curriculum?.id
        this.data.transcriptRecord.curriculum = curriculum
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>