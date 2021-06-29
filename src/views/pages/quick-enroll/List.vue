<template>
  <PageContent title="Quick Enroll"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadAcademicRecord"
    :filterVisible="isFilterVisible"
    :createButtonVisible="isAccessible($options.ManualEnrollmentPermissions.ADD.id) &&
      checkIfHasSchoolCategoryAccess()"
    @create="onAddNew">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.academicRecord.criteria"
        debounce="500"
        @update="loadAcademicRecord"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
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
      <v-select
        :options="$options.ManualSteps.values"
        :value="filters.academicRecord.manualStepItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div v-if="checkIfHasSchoolCategoryAccess()">
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
            <StudentColumn
              :data="data.item"
              :callback="{ loadDetails: () => $router.push({
                name: 'Academic Record Applications Detail',
                params: { academicRecordId: data.item.id }
              }) }"
            />
          </template>
          <template v-slot:cell(contact)="data">
            <ContactColumn :data="data.item" />
            <!-- Email : {{ data.item.student.email }} <br />
            <small>Phone : {{ data.item.student.phoneNo }}</small> <br />
            <small>Mobile : {{ data.item.student.mobileNo }}</small> <br /> -->
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" />
          </template>
          <template v-slot:cell(step)="data">
            <ManualStageColumn :data="data.item" />
            <!-- <b-badge
              :variant="
                data.item.manualStepId === $options.ManualSteps.SUBJECT_ENLISTMENT.id
                  ? 'warning'
                  : 'primary'
              "
            >
              {{ $options.ManualSteps.getEnum(data.item.manualStepId).name }}
            </b-badge> -->
          </template>
          <template v-slot:cell(action)="data">
            <!-- Rights to be added -->
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              v-if="isAccessible($options.ManualEnrollmentPermissions.ADD.id)"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click="$router.push({
                  name: 'Academic Record Applications Detail',
                  params: { academicRecordId: data.item.id }
                })">
                Continue
              </b-dropdown-item>
              <b-dropdown-item
                v-if="![AcademicRecordStatuses.ENROLLED.id, AcademicRecordStatuses.CLOSED.id].includes(data.item.academicRecordStatusId)"
                @click="$router.push({
                  name: 'Payment Add',
                  query: { studentId: data.item && data.item.student && data.item.student.id }
                })">
                Post Payment
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
      <StudentSelection
        :isShown.sync="isStudentShown"
        v-if="isStudentShown"
      />
      <router-view :previousRoute="{ name: 'Academic Record Applications' }" />
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import SchoolCategoryTabs from '../../components/SchoolCategoryTabs';
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
import { StudentColumn, EducationColumn, ContactColumn, ManualStageColumn } from "../../components/ColumnDetails";
import StudentSelection from './StudentSelection';
import { AcademicRecordStatuses } from '../../../helpers/enum';

export default {
  components: {
    SchoolCategoryTabs,
    Card,
    PageContent,
    NoAccess,
    StudentColumn,
    EducationColumn,
    ContactColumn,
    ManualStageColumn,
    StudentSelection
  },
  mixins: [AcademicRecordApi, CourseApi, Access],
  ManualSteps,
  SchoolCategories,
  ManualEnrollmentPermissions,
  data() {
    return {
      AcademicRecordStatuses,
      isStudentShown: false,
      isFilterVisible: true,
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
          manualStepId: null,
          manualStepItem: null,
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
        perPage,manualStepId, //disabled temprarily
        notManualStepId: this.$options.ManualSteps.ASSESSMENT.id,
        page,
        schoolCategoryId,
        courseId,
        orderBy,
        sort,
        
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
    },
    onAddNew() {
      this.isStudentShown = true;
    },
    onCompleted() {
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
