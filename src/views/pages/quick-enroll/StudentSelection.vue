<template>
  <b-modal
    :visible="isShown"
    :size="isShownExistingStudent || isShownAcademic ? 'lg' : 'md'"
    title="Select Student"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @show="isShownExistingStudent = false"
    @hidden="$emit('update:isShown', false)">
    <div class="selection__container">
      <template v-if="isShownExistingStudent">
        <!-- <template 
          v-if="selectedStudent && selectedStudent.latestAcademicRecord.academicRecordStatusId === $options.AcademicRecordStatuses.ENROLLED.id">

        </template> -->
        <template v-if="selectedStudent && selectedStudent.hasOpenAcademicRecord">
          <template v-if="selectedStudent.latestAcademicRecord.isManual">
            <b-alert
              show
              variant="warning">
              <h5>Existing Record Found!</h5>
              The Student has an existing manually entered Academic Record.
              Click 
              <b-link
              @click.prevent="$emit('update:isShown', false)"
              :to="{
                name: 'Academic Record Applications Detail', params: { academicRecordId: selectedStudent.latestAcademicRecord.id }
              }">here</b-link> 
              to review and continue.
            </b-alert>
          </template>
          <template v-else>
            <b-alert
              show
              variant="warning">
              <h5>Existing Record Found!</h5>
              The Student has an existing Open Academic Record.
              You may ask your System Administrator to see the status of this record.
            </b-alert>
          </template>
        </template>

        <b-form-group
          label="Student"
          labelClass="required"
          :state="forms.academicRecord.states.studentId"
          :invalid-feedback="forms.academicRecord.errors.studentId">
          <SelectStudent v-model="selectedStudent" emptyNameText="New Student" />
        </b-form-group>
      </template>
      <template v-if="isShownAcademic">
        <template >
          <InputGroup>
            <InputContainer>
              <b-form-group
                label="School Year"
                labelClass="required"
                :state="forms.academicRecord.states.schoolYearId"
                :invalid-feedback="forms.academicRecord.errors.schoolYearId">
              <SelectSchoolYear
                v-model="schoolYearId"
                :reduce="option => option.id"
                label="name"
                :clearable="false"
              />
            </b-form-group>
            </InputContainer>
            <InputContainer>
              <b-form-group
                label="School Category"
                labelClass="required"
                :state="forms.academicRecord.states.schoolCategoryId"
                :invalid-feedback="forms.academicRecord.errors.schoolCategoryId">
                <SelectCategory
                  v-model="schoolCategoryId"
                  :reduce="option => option.id"
                  label="name"
                  :clearable="false"
                />
              </b-form-group>
            </InputContainer>
          </InputGroup>
          <InputGroup v-if="!!schoolCategoryId">
            <InputContainer>
              <b-form-group
                label="Level"
                labelClass="required"
                :state="forms.academicRecord.states.levelId"
                :invalid-feedback="forms.academicRecord.errors.levelId">
                <SelectLevel
                  v-model="levelId"
                  label="name"
                  :schoolCategoryId="schoolCategoryId"
                  :reduce="option => option.id"
                  :clearable="false"
                />
              </b-form-group>
            </InputContainer>
            <InputContainer v-if="$options.SchoolCategories.getEnum(schoolCategoryId).hasSemester">
              <b-form-group
                label="Semester"
                labelClass="required"
                :state="forms.academicRecord.states.semesterId"
                :invalid-feedback="forms.academicRecord.errors.semesterId">
                <SelectSemester
                  v-model="semesterId"
                  label="description"
                  :schoolCategoryId="schoolCategoryId"
                  :reduce="option => option.id"
                  :clearable="false"
                />
              </b-form-group>
            </InputContainer>
          </InputGroup>
          <InputGroup v-if="schoolCategoryId && levelId && $options.SchoolCategories.getEnum(schoolCategoryId).hasCourse">
            <InputContainer>
              <b-form-group
                label="Course"
                labelClass="required"
                :state="forms.academicRecord.states.courseId"
                :invalid-feedback="forms.academicRecord.errors.courseId">
                <SelectLevelCourses
                  v-model="courseId"
                  label="description"
                  :levelId="levelId"
                  :reduce="option => option.id"
                />
              </b-form-group>
            </InputContainer>
          </InputGroup>
        </template>
       </template>
      <template v-else>
        <TileMenu
          @onSelect="onSelectMenu"
          :selectedIndex="selectedIndex"
          :busyIndexes="busyIndexes"
          :options="menus"
        />
      </template>
    </div>
    <template v-slot:modal-footer>
      <template v-if="isShownExistingStudent">
        <FooterAction
          @onConfirm="onProceed"
          @onCancel="resetState"
          :isConfirmBusy="isConfirmBusy"
          :isDisabledConfirm="!selectedStudent || selectedStudent.hasOpenAcademicRecord"
          confirmText="Proceed"
          :showConfirm="isShownAcademic"
        />
      </template>
      <template v-else>
        <FooterAction
          @onConfirm="onProceed"
          @onCancel="resetState"
          :isConfirmBusy="isConfirmBusy"
          confirmText="Proceed"
          :showConfirm="isShownAcademic"
        />
      </template>
  </template>
  </b-modal>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { AcademicRecordStatuses, SchoolCategories } from '../../../helpers/enum';
import { AcademicRecordApi, StudentApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import TileMenu from '../../components/TileSelector/List';
import SelectSchoolYear from '../../components/Dropdowns/SelectSchoolYear'
import SelectCategory from '../../components/Dropdowns/SelectCategory'
import SelectPaginated  from '../../components/SelectPaginated.vue'
import { reset, showNotification, validate } from '../../../helpers/forms';

const academicRecordErrorFields = {
  schoolYearId: null,
  studentId: null,
  schoolCategoryId: null,
  levelId: null,
  semesterId: null,
  courseId: null
}

export default {
  AcademicRecordStatuses,
  SchoolCategories,
  props: {
    previousRoute: {
      type: Object
    },
    isShown: {
      type: Boolean
    }
  },
  components: {
    FooterAction,
    TileMenu,
    SelectSchoolYear,
    SelectCategory,
    SelectPaginated
  },
  mixins: [ StudentApi, AcademicRecordApi],
  data() {
    return {
      selectedIndex: null,
      busyIndexes: [],
      isShownExistingStudent: false,
      isShownAcademic: false,
      isConfirmBusy: false,
      schoolYearId: null,
      schoolCategoryId: null,
      levelId: null,
      semesterId: null,
      courseId: null,
      selectedStudent: null,
      menus: [
        { label: 'Select Existing Student' },
        { label: 'Register New Student' }
      ],
      forms: {
        academicRecord: {
          states: { ...academicRecordErrorFields },
          errors: { ...academicRecordErrorFields }
        }
      }
      // academicRecordId: 1 // added hardcoded id for testing only
    }
  },
  watch: {
    schoolCategoryId: function() {
      this.levelId = null;
      this.semesterId = null;
      this.courseId = null;
    },
    levelId: function() {
      this.semesterId = null;
      this.courseId = null;
    }
  },
  methods: {
    onProceed() {
      const { academicRecord } = this.forms
      reset(academicRecord)
      if (this.selectedIndex === 0) {
        //existing student

        if(!this.selectedStudent) {
          showNotification(this, 'danger', 'Student is required.')
          return
        }

        this.isConfirmBusy = true
        const studentId = this.selectedStudent?.id
        const payload = {
          schoolYearId: this.schoolYearId,
          schoolCategoryId: this.schoolCategoryId,
          levelId: this.levelId,
          semesterId: this.semesterId,
          courseId: this.courseId
        };

        this.quickEnroll(studentId, payload).then(({ data }) => {
          const academicRecordId = data.id
          this.isConfirmBusy = false
          this.$router.push({
            name: 'Academic Record Applications Detail',
            params: { academicRecordId, studentId }
          });
          this.$emit('update:isShown', false);
        }).catch((error) => {
          const errors = error.response.data.errors;
          this.isConfirmBusy = false
          validate(academicRecord, errors, this)
          console.log(errors)
        });
      }  else if (this.selectedIndex === 1) {
        this.isConfirmBusy = true
        this.addStudent({}).then(({ data }) => {
          const studentId = data.id
          this.selectedStudent = data
          this.quickEnroll(studentId, { schoolYearId: this.schoolYearId, schoolCategoryId: this.schoolCategoryId }).then(({ data }) => {
            const academicRecordId = data.id
            this.isConfirmBusy = false
            this.$router.push({
              name: 'Academic Record Applications Detail',
              params: { academicRecordId, studentId }
            });
            this.$emit('update:isShown', false);
          }).catch((error) => {
            const errors = error.response.data.errors;
            this.isConfirmBusy = false
            validate(academicRecord, errors, this)
            this.selectedIndex = 0
            this.isShownExistingStudent = true
          });
        })
      }
    },
    resetState() {
      this.selectedIndex = null;
      this.busyIndexes = [];
      this.$emit('update:isShown', false);
      this.isShownExistingStudent = false;
      this.isShownAcademic = false;
      this.isConfirmBusy = false;
    },
    onSelectMenu(item) {
      this.busyIndexes = [item.index];
      this.selectedIndex = item.index;
      setTimeout(() => {
        if (item.index === 0) {
          this.isShownExistingStudent = true;
        }
        this.isShownAcademic = true;
        this.busyIndexes = [];
      }, 500);
    },
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
    getStudentInfo(student) {
      this.selectedStudent = student;
    },
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .selection__container {
    padding: 20px;
  }

  .select-paginated {
    width: 100%;

    @include for-size(phone-only) {
      width: 100%;
    }
    .select-option {
      display: flex;
      justify-content: center;
      align-items: center;

      .select-option__avatar {
        width: auto;
      }

      .select-option__info {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
      }
    }
  }

</style>
