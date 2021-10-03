<template>
  <PageContent
    title="Quick Enroll"
    description="Manually add student profile, academic record and assessment record without requiring the student to signup in the Student Application/Portal."
    :searchKeyword="filters.academicRecord.criteria"
    :pageFrom="paginations.academicRecord.from"
    :pageTo="paginations.academicRecord.to"
    :pageTotal="paginations.academicRecord.totalRows"
    :perPage="paginations.academicRecord.perPage"
    :currentPage.sync="paginations.academicRecord.page"
    @onPageChange="loadAcademicRecord"
    @onRefresh="loadAcademicRecord"
    :createButtonVisible="isAccessible($options.ManualEnrollmentPermissions.ADD.id)"
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
        :options="$options.ManualStageFilter.values"
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
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="onSortChanged"
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
              boundary="window"
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
                v-if="![AcademicRecordStatuses.ENROLLED.id, AcademicRecordStatuses.CLOSED.id].includes(data.item.academicRecordStatusId)
                  && data.item.academicRecordStatusId === AcademicRecordStatuses.ASSESSMENT_APPROVED.id"
                @click="$router.push({
                  name: 'Payment Add',
                  query: { studentId: data.item && data.item.student && data.item.student.id }
                })">
                Post Payment
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <!-- <b-row>
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
        </b-row> -->
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
      <StudentSelection
        :isShown.sync="isStudentShown"
        v-if="isStudentShown"
      />
      <router-view :previousRoute="{ name: 'Academic Record Applications' }" @onAssessmentRequested="onAssessmentRequested"/>
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  ManualSteps,
  SchoolCategories,
  ManualEnrollmentPermissions,
  ManualStageFilter
} from '../../../helpers/enum';
import { AcademicRecordApi, CourseApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Access from '../../../mixins/utils/Access';
import PageContent from '../../components/PageContainer/PageContent'
import NoAccess from '../../components/NoAccess'
import { StudentColumn, EducationColumn, ContactColumn, ManualStageColumn } from "../../components/ColumnDetails";
import StudentSelection from './StudentSelection';
import { AcademicRecordStatuses } from '../../../helpers/enum';
import { camelToSnakeCase } from '../../../helpers/utils';

export default {
  camelToSnakeCase,
  components: {
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
  ManualStageFilter,
  SchoolCategories,
  ManualEnrollmentPermissions,
  data() {
    return {
      sortBy: 'name',
      sortDesc: true,
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
              sortable: true
            },
            {
              key: 'contact',
              label: 'Contact',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
              sortable: true
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
              sortable: true
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
        manualStepItem
      } = this.filters.academicRecord;
      const isManual = 1;

      const params = {
        paginate: true,
        perPage,
        manualStepId, //disabled temprarily
        page,
        schoolCategoryId,
        courseId,
        isManual,
        criteria,
        academicRecordStatusId: manualStepItem?.academicRecordStatusId,
        ordering: this.getOrdering(this.sortBy, this.sortDesc)
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
      academicRecord.manualStepId = item?.manualStepId || 0;
      academicRecord.manualStepItem = item;
      this.loadAcademicRecord();
    },
    onCourseFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.courseId = item?.id || 0;
      academicRecord.courseItem = item;
      this.loadAcademicRecord();
    },
    onAssessmentRequested(){
      this.loadAcademicRecord()
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadAcademicRecord();
    },
    getOrdering(sortBy, sortDesc = false) {
      if (!sortBy) return;
      const orderBy = this.mapOrdering(sortBy);
      if (!orderBy) return;
      return `${sortDesc ? '-' : ''}${orderBy}`;
    },
    mapOrdering(sortBy) {
      return ({
        name: 'first_name',
        address: 'complete_address',
        education: 'level_name',
        contact: 'email'
      })?.[sortBy] || this.$options.camelToSnakeCase(sortBy);
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
