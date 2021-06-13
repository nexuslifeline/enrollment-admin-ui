<template>
  <Card
    title="Academic Record"
    titleSize="m"
    :hasFooter="true">
    <CardNote v-if="showNotes">
      It is recommended to complete the <b>Academic Record</b> section first before
      adding Subject to be able to find the right subjects for the Student.
    </CardNote>
    <InputGroup>
      <InputContainer>
        <label class="required">School Category</label>
        <SelectCategory
          :value="data.schoolCategoryId"
          :reduce="option => option.id"
          label="name"
          @input="data.schoolCategoryId = $event"
          :clearable="false"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">School Year</label>
        <SelectSchoolYear
          :value="data.schoolYearId"
          :reduce="option => option.id"
          label="name"
          @input="data.schoolYearId = $event"
          :clearable="false"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
       <InputContainer>
        <label class="required">Level</label>
        <SelectLevel
          :value="data.levelId"
          :reduce="option => option.id"
          label="name"
          @input="data.levelId = $event"
          :schoolCategoryId="data.schoolCategoryId"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <label class="required">Course</label>
         <SelectCourseLevel
          :value="data.courseId"
          :reduce="option => option.id"
          label="description"
          @input="data.courseId = $event"
          :levelId="data.levelId"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">Semester</label>
        <SelectSemester
          :value="data.semesterId"
          :reduce="option => option.id"
          label="description"
          @input="data.semesterId = $event"
          :schoolCategoryId="data.schoolCategoryId"
        />
      </InputContainer>
    </InputGroup>
     <InputGroup>
       <InputContainer>
        <label class="required">Curriculum</label>
        <SelectCurriculum
          :value="data.transcriptRecord.curriculumId"
          :courseId="data.courseId"
          :reduce="option => option.id"
          label="name"
          @input="data.transcriptRecord.curriculumId = $event"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <label class="required">Student Type</label>
        <SelectStudentType
          :value="data.studentTypeId"
          :reduce="option => option.id"
          label="name"
          @input="data.studentTypeId = $event"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">Section</label>
        <SelectSection
          :value="data.sectionId"
          :reduce="option => option.id"
          label="name"
          @input="data.sectionId = $event"
        />
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
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

const academicRecordFields = {
  schoolCategoryId: null,
  schoolYearId: null,
  levelId: null,
  courseId: null,
  semesterId: null,
  studentTypeId: null,
  sectionId: null
}

  export default {
    props: {
      data: {
        type: [Object]
      },
      showNotes: {
        type: Boolean,
        default: true
      }
    },
    mixins: [ AcademicRecordApi, TranscriptRecordApi ],
    components: { SelectCategory, SelectSchoolYear, SelectLevel, SelectCourseLevel, SelectSemester, SelectCurriculum, SelectStudentType, SelectSection },
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
    methods: {
      onSave() {
        console.log('PUT academic record here /academic-records/:id')
        const { id: academicRecordId, schoolCategoryId, schoolYearId, levelId, courseId, semesterId, studentTypeId, sectionId, transcriptRecordId, transcriptRecord: { curriculumId } } = this.data
        const { academicRecord } = this.forms
        const academicRecordData = {
          schoolCategoryId,
          schoolYearId,
          levelId,
          courseId,
          semesterId,
          studentTypeId,
          sectionId,
        }
        reset(academicRecord)
        this.isProcessing = true
        this.updateAcademicRecord(academicRecordData, academicRecordId).then(({ data }) => {
          //need to call transript record own update for the observer to run in backend
          this.updateTranscriptRecord(transcriptRecordId, { curriculumId }).then(({ data }) => {
            showNotification(this, 'success', 'Academic Record Saved!.')
            this.isProcessing = false
          })
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isProcessing = false;
        validate(academicRecord, errors);
      });
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>