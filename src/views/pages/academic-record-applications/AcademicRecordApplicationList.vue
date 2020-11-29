<template>
  <div class="c-page-content">
    <Card v-if="!showEntry" title="Academic Record Applications">
      <div>
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
        />
        <div>
          <b-row class="mb-2">
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
                    step.id !== $options.ManualSteps.COMPLETED.id &&
                      step.id !== $options.ManualSteps.STUDENT_REGISTRATION.id
                  "
                >
                  {{ step.name }}
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <!-- row button and search input -->
            <b-col md="6">
              <b-btn variant="outline-primary" @click="setCreate()"
                >New Registration</b-btn
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
          </b-row>
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
          >
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(name)="data">
              <b-media>
                <template v-slot:aside>
                  <b-avatar
                    rounded
                    blank
                    size="64"
                    :text="
                      data.item.student.firstName.charAt(0) +
                        '' +
                        data.item.student.lastName.charAt(0)
                    "
                    :src="avatar(data.item.student)"
                  />
                </template>
                <span
                  ><b-link @click="setResume(data)">{{
                    data.item.student.name
                  }}</b-link></span
                ><br />
                <small
                  >Student no.:
                  {{
                    data.item.student.studentNo
                      ? data.item.student.studentNo
                      : 'Awaiting Confirmation'
                  }}</small
                ><br />
                <small
                  >Address :
                  {{
                    data.item.student.address
                      ? data.item.student.address.currentCompleteAddress
                      : ''
                  }}
                </small>
              </b-media>
            </template>
            <template v-slot:cell(contact)="data">
              Email : {{ data.item.student.email }} <br />
              <small>Phone : {{ data.item.student.phoneNo }}</small> <br />
              <small>Mobile : {{ data.item.student.mobileNo }}</small> <br />
            </template>
            <template v-slot:cell(education)="data">
              <span>{{
                getName(data.item, 'level') +
                  ' ' +
                  getName(data.item, 'semester') +
                  ' ' +
                  getName(data.item, 'studentType')
              }}</span
              ><br />
              <small v-if="data.item.course"
                >{{ data.item.course.description }}
                {{
                  data.item.course.major ? `(${data.item.course.major})` : ''
                }}</small
              >
            </template>
            <template v-slot:cell(step)="data">
              <b-badge
                :variant="
                  data.item.manualStepId === $options.ManualSteps.EVALUATION.id
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
      </div>
    </Card>
    <AcademicRecordApplicationEntry
      @onBack="showEntry = false"
      @onCompleted="onCompleted()"
      :entryMode="entryMode"
      :forms="forms"
      :showEntry="showEntry"
    />
  </div>
  <!-- main container -->
</template>
<script>
import SchoolCategoryTabs from '../../components/SchoolCategoryTabs';
import AcademicRecordApplicationEntry from '../../pages/academic-record-applications/AcademicRecordApplicationEntry';
import { ManualSteps, SchoolCategories } from '../../../helpers/enum';
import Card from '../../components/Card';
import { AcademicRecordApi, CourseApi } from '../../../mixins/api';
import { clearFields, showNotification } from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';

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
  },
  mixins: [AcademicRecordApi, CourseApi],
  ManualSteps,
  SchoolCategories,
  data() {
    return {
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
              // formatter: (value, key, item) => {
              // 	if(!item.student.middleName){
              // 		item.student.middleName = ""
              // 	}
              // 	item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
              // }
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
              label: 'Status',
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
          courseId: null,
          manualStepId: null,
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
        manualStepId,
        notManualStepId: this.$options.ManualSteps.COMPLETED.id,
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
      this.showEntry = true;
    },
    onCompleted() {
      this.showEntry = false;
      this.loadAcademicRecord();
      showNotification(this, 'success', 'Successfully Registered');
    },
  },
};
</script>
