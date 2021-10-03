<template>
  <PageContent title="Manual Enrollment"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadAcademicRecord"
    :filterVisible="isFilterVisible"
    :createButtonVisible="isAccessible($options.ManualEnrollmentPermissions.ADD.id) && checkIfHasSchoolCategoryAccess()"
    @create="setCreate()">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.academicRecord.criteria"
        debounce="500"
        @update="loadAcademicRecord()"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <!--<v-select
        :options="$options.SchoolCategories.values"
        :value="filters.academicRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />-->
      <SelectCategory
        :value="filters.academicRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        :options="options.courses.items"
        :value="filters.academicRecord.courseItem"
        @input="onCourseFilterChange"
        label="name"
        placeholder="Course"
        class="mt-2"
      />
      <!-- disabled temporary -->
      <!-- <v-select
        :options="$options.ManualSteps.values"
        :value="filters.academicRecord.manualStepItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      /> -->
    </template>
    <template v-slot:content>
      <!-- <div>
        <SchoolCategoryTabs
          :showAll="true"
          @loadSchoolCategoryId="
            (filters.academicRecord.schoolCategoryId = $event),
              loadAcademicRecord()
          "
          @clickAll="
            (filters.academicRecord.schoolCategoryId = null),
              (filters.academicRecord.courseId = null),
              loadAcademicRecord()
          "
          @click="
            (filters.academicRecord.schoolCategoryId = $event),
              (filters.academicRecord.courseId = null),
              loadAcademicRecord()
          "
        /> -->
      <div v-if="!showEntry && checkIfHasSchoolCategoryAccess()">
        <!-- <b-row class="mb-2">
          <b-col md="6">
            <b-form-radio-group
              @input="loadAcademicRecord()"
              v-model="filters.academicRecord.manualStepId"
            >
              <b-form-radio :value="null">Show All</b-form-radio>
              <b-form-radio
                v-for="step in $options.ManualSteps.values"
                :value="step.id"
                :key="step.id"
                v-if="
                  step.id !== $options.ManualSteps.ASSESSMENT.id &&
                    step.id !== $options.ManualSteps.PROFILE_AND_ACCOUNT.id
                "
              >
                {{ step.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="6">
            <b-btn
              variant="primary"
              @click="setCreate()"
              v-if="isAccessible($options.ManualEnrollmentPermissions.ADD.id)"
              >Add New Record</b-btn
            >
          </b-col>
          <b-col md="3">
            <b-form-select
              v-if="
                filters.academicRecord.schoolCategoryId ===
                  $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                  filters.academicRecord.schoolCategoryId ===
                    $options.SchoolCategories.COLLEGE.id ||
                  filters.academicRecord.schoolCategoryId ===
                    $options.SchoolCategories.GRADUATE_SCHOOL.id
              "
              @change="loadAcademicRecord()"
              v-model="filters.academicRecord.courseId"
              class="float-right"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Course --</b-form-select-option
                >
              </template>
              <b-form-select-option :value="null">None</b-form-select-option>
              <b-form-select-option
                v-for="course in options.courses.items"
                :key="course.id"
                :value="course.id"
              >
                {{ course.description }}
                {{ course.major ? `(${course.major})` : '' }}
              </b-form-select-option>
            </b-form-select>
          </b-col>
          <b-col md="3">
            <b-form-input
              v-model="filters.academicRecord.criteria"
              debounce="500"
              @update="loadAcademicRecord()"
              type="text"
              placeholder="Search"
            >
            </b-form-input>
          </b-col>
        </b-row> -->
        <!-- row button and search input -->
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.academicRecords.fields"
          :items="tables.academicRecords.items"
          :busy="tables.academicRecords.isBusy"
          responsive
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(name)="data">
            <StudentColumn
              :data="data.item"
              :callback="{ loadDetails: () => setResume(data) }"
            />
          </template>
          <template v-slot:cell(contact)="data">
            Email : {{ data.item.student.email }} <br />
            <small>Phone : {{ data.item.student.phoneNo }}</small> <br />
            <small>Mobile : {{ data.item.student.mobileNo }}</small> <br />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" />
          </template>
          <template v-slot:cell(step)="data">
            <b-badge
              :variant="
                data.item.manualStepId === $options.ManualSteps.SUBJECT_ENLISTMENT.id
                  ? 'warning'
                  : 'primary'
              "
            >
              {{ $options.ManualSteps.getEnum(data.item.manualStepId).name }}
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <!-- Rights to be added -->
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              v-if="isAccessible($options.ManualEnrollmentPermissions.ADD.id)"
              boundary="window"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click="setResume(row)">
                Resume
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <b-row>
          <b-col md="6">
            Showing {{ paginations.academicRecord.from }} to
            {{ paginations.academicRecord.to }} of
            {{ paginations.academicRecord.totalRows }} records.
          </b-col>
          <b-col md="6">
            <b-pagination
              class="c-pagination"
              v-model="paginations.academicRecord.page"
              :total-rows="paginations.academicRecord.totalRows"
              :per-page="paginations.academicRecord.perPage"
              size="sm"
              align="end"
              @input="loadAcademicRecord()"
            />
          </b-col>
        </b-row>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>

      <AcademicRecordApplicationEntry
        @onBack="showEntry = false"
        @onCompleted="onCompleted()"
        :entryMode="entryMode"
        :forms="forms"
        :showEntry="showEntry"
      />
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import SchoolCategoryTabs from '../../components/SchoolCategoryTabs';
import AcademicRecordApplicationEntry from '../../pages/academic-record-applications/AcademicRecordApplicationEntry';
import {
  ManualSteps,
  SchoolCategories,
  ManualEnrollmentPermissions,
} from '../../../helpers/enum';
import Card from '../../components/Card';
import { AcademicRecordApi, CourseApi } from '../../../mixins/api';
import { clearFields, showNotification } from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';
import Access from '../../../mixins/utils/Access';
import PageContent from '../../components/PageContainer/PageContent'
import NoAccess from '../../components/NoAccess'
import { StudentColumn, EducationColumn } from "../../components/ColumnDetails";

const studentFields = {
  id: null,
  studentNo: null,
  name: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  civilStatusId: null,
  birthDate: null,
  email: null,
};

const userFields = {
  id: null,
  username: null,
  password: null,
  passwordConfirmation: null,
};

const userStatesAndErrors = {
  userUsername: null,
  userPassword: null,
};

const academicRecordFields = {
  id: null,
  levelId: null,
  schoolCategoryId: null,
  schoolYearId: null,
  semesterId: null,
  courseId: null,
  manualStepId: null,
  studentCategoryId: null,
  subjects: null,
  sectionId: null,
};

const academicRecordStatesAndErrors = {
  academicRecordLevelId: null,
  academicRecordSchoolYearId: null,
  academicRecordCourseId: null,
  academicRecordSemesterId: null,
  academicRecordSubjects: null,
};

const evaluationFields = {
  id: null,
  levelId: null,
  schoolCategoryId: null,
  schoolYearId: null,
  semesterId: null,
  courseId: null,
  studentCategoryId: null,
  lastSchoolAttended: null,
  lastSchoolLevelId: null,
  lastSchoolYearFrom: null,
  lastSchoolYearTo: null,
  studentCurriculumId: null,
  curriculumId: null,
};

const transcriptRecordFields = {
  id: null,
  levelId: null,
  schoolCategoryId: null,
  courseId: null,
  studentCurriculumId: null,
  curriculumId: null,
  subjects: null,
};

export default {
  components: {
    SchoolCategoryTabs,
    AcademicRecordApplicationEntry,
    Card,
    PageContent,
    NoAccess,
    StudentColumn,
    EducationColumn
  },
  mixins: [AcademicRecordApi, CourseApi, Access],
  ManualSteps,
  SchoolCategories,
  ManualEnrollmentPermissions,
  data() {
    return {
      isFilterVisible: true,
      showEntry: false,
      entryMode: 'Add',
      forms: {
        student: {
          fields: { ...studentFields },
          states: { ...studentFields },
          errors: { ...studentFields },
        },
        user: {
          fields: { ...userFields },
          states: { ...userStatesAndErrors },
          errors: { ...userStatesAndErrors },
        },
        academicRecord: {
          fields: { ...academicRecordFields },
          states: { ...academicRecordStatesAndErrors },
          errors: { ...academicRecordStatesAndErrors },
        },
        evaluation: {
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields },
        },
        transcriptRecord: {
          fields: { ...transcriptRecordFields },
          states: { ...transcriptRecordFields },
          errors: { ...transcriptRecordFields },
        },
      },
      tables: {
        academicRecords: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'contact',
              label: 'Contact',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'step',
              label: 'Stage',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        academicRecord: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        academicRecord: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          courseId: null,
          courseItem: null,
          manualStepId: this.$options.ManualSteps.SUBJECT_ENLISTMENT.id,
          manualStepItem: this.$options.ManualSteps.EVALUATION,
        },
      },
      options: {
        courses: {
          items: [],
        },
      },
    };
  },
  created() {
    const { academicRecord } = this.filters
    if (!this.checkIfSuperUser()) {
      academicRecord.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      academicRecord.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadAcademicRecord();
    this.loadCourses();
  },
  methods: {
    loadAcademicRecord() {
      const { academicRecords } = this.tables;
      const {
        academicRecord,
        academicRecord: { perPage, page },
      } = this.paginations;
      academicRecords.isBusy = true;
      const {
        manualStepId,
        schoolCategoryId,
        courseId,
        criteria,
      } = this.filters.academicRecord;
      const isManual = 1;
      const orderBy = 'created_at';
      const sort = 'DESC';
      let params = {
        paginate: true,
        perPage,
        page,
        schoolCategoryId,
        courseId,
        orderBy,
        sort,
        // manualStepId, //disabled temporarily
        // notManualStepId: this.$options.ManualSteps.ASSESSMENT.id,
        isManual,
        criteria,
      };
      this.getAcademicRecordList(params).then((response) => {
        const res = response.data;
        academicRecords.items = res.data;
        academicRecord.from = res.meta.from;
        academicRecord.to = res.meta.to;
        academicRecord.totalRows = res.meta.total;
        academicRecords.isBusy = false;
      });
    },
    loadCourses() {
      const { courses } = this.options;
      const params = { paginate: false };
      this.getCourseList(params).then(({ data }) => {
        courses.items = data;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    getName(item, child) {
      if (item) {
        let value = item[child];
        if (value) {
          return value['name'];
        }
      }
      return '';
    },
    setResume(row) {
      const { item } = row;
      this.forms.academicRecord.fields.id = item.id;
      this.showEntry = true;
      this.entryMode = 'Edit';
    },
    setCreate() {
      this.entryMode = 'Add'
      this.showEntry = true;
    },
    onCompleted() {
      this.showEntry = false;
      this.loadAcademicRecord();
      showNotification(this, 'success', 'Successfully Registered');
    },
    onCategoryFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.schoolCategoryId = item?.id || 0;
      academicRecord.schoolCategoryItem = item;
      this.loadAcademicRecord();
    },
    onStatusFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.manualStepId = item?.id || 0;
      academicRecord.manualStepItem = item;
      this.loadAcademicRecord();
    },
    onCourseFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.courseId = item?.id || 0;
      academicRecord.courseItem = item;
      this.loadAcademicRecord();
    },
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.academicRecord;
      const { SchoolCategories } = this.$options;
      return [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
  }
};
</script>
