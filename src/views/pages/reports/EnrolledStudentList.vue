<template>
  <!-- <div class="enrolled_main-container">
    <div class="c-page-content">
      <b-overlay :show="isLoading" rounded="sm">
        <Card title="Enrolled Student List">
          <div class="school-category-filter">
            <SchoolCategoryTabs
              :showAll="false"
              @loadSchoolCategoryId="
                (filters.academicRecord.schoolCategoryId = $event),
                  loadAcademicRecords()
              "
              @click="
                (filters.academicRecord.schoolCategoryId = $event),
                  (filters.academicRecord.courseId = null),
                  loadLevels(),
                  loadAcademicRecords()
              "
            />
          </div>
          <div class="search-filter-container">
            <div class="filters">
              <b-form-group class="filter-inputs" label="School Year">
                <b-form-select
                  @input="loadAcademicRecords()"
                  v-model="filters.academicRecord.schoolYearId"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null"
                      >-- All --</b-form-select-option
                    >
                  </template>
                  <b-form-select-option
                    v-for="schoolYear in options.schoolYears.items"
                    :key="schoolYear.id"
                    :value="schoolYear.id"
                  >
                    {{ schoolYear.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group class="filter-inputs" label="Level">
                <b-form-select
                  @input="loadAcademicRecords()"
                  v-model="filters.academicRecord.levelId"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null"
                      >-- All --</b-form-select-option
                    >
                  </template>
                  <b-form-select-option
                    v-for="level in options.levels.items"
                    :key="level.id"
                    :value="level.id"
                  >
                    {{ level.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group
                class="filter-inputs"
                label="Course"
                v-if="
                  filters.academicRecord.schoolCategoryId ===
                    SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.academicRecord.schoolCategoryId ===
                      SchoolCategories.COLLEGE.id ||
                    filters.academicRecord.schoolCategoryId ===
                      SchoolCategories.GRADUATE_SCHOOL.id
                "
              >
                <b-form-select
                  @input="loadAcademicRecords()"
                  v-model="filters.academicRecord.courseId"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null"
                      >-- All --</b-form-select-option
                    >
                  </template>
                  <b-form-select-option
                    v-for="course in options.courses.items"
                    :key="course.id"
                    :value="course.id"
                  >
                    {{ course.description }}
                    {{ course.major ? `(${course.major})` : '' }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group
                class="filter-inputs"
                label="Semester"
                v-if="
                  filters.academicRecord.schoolCategoryId ===
                    SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.academicRecord.schoolCategoryId ===
                      SchoolCategories.COLLEGE.id ||
                    filters.academicRecord.schoolCategoryId ===
                      SchoolCategories.GRADUATE_SCHOOL.id
                "
              >
                <b-form-select
                  @input="loadAcademicRecords()"
                  v-model="filters.academicRecord.semesterId"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null"
                      >-- All --</b-form-select-option
                    >
                  </template>
                  <b-form-select-option
                    v-for="semester in options.semesters.items"
                    :key="semester.id"
                    :value="semester.id"
                  >
                    {{ semester.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </div>
            <div class="print-button-container">
              <b-button
                variant="outline-primary"
                class="print-button"
                @click="onPreviewEnrolledList()"
                >Preview List</b-button
              >
            </div>
          </div>
          <div class="table-container">
            <b-table
              class="c-table"
              outlined
              small
              show-empty
              responsive
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
                  :callback="{ loadDetails: () => null }"
                />
              </template>
              <template v-slot:cell(education)="data">
                <EducationColumn :data="data.item" />
              </template>
            </b-table>
          </div>
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
                @input="loadAcademicRecords()"
              />
            </b-col>
          </b-row>
        </Card>
      </b-overlay>
      <FileViewer
        :show="showModalPreview"
        :file="file"
        :owner="file.owner"
        :isBusy="file.isLoading"
        @close="showModalPreview = false"
      />
    </div>
  
  </div> -->
  <ReportContent
    title="Enrolled List Report"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="onPreviewEnrolledList"
    :isBusy="isLoading"
    :showPlaceholder="!isFileReady"
    :filterVisible="isFilterVisible">
    <template v-slot:filters>
      <v-select
        :options="options.schoolYears.items"
        :value="filters.academicRecord.schoolYearItem"
        @input="onSchoolYearFilterChange"
        label="name"
        placeholder="School Year"
        class="mt-2"
        :clearable="false"
      />
      <!--<v-select
        :options="SchoolCategories.values"
        :value="filters.academicRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="true"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="false"
      />-->
       <vSelectCategory
        :value="filters.academicRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        :clearable="false"
      />
      <v-select
        :options="options.levels.items"
        :value="filters.academicRecord.levelItem"
        @input="onLevelFilterChange"
        label="name"
        placeholder="Level"
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
          v-if="isCourseVisible"
          :options="options.semesters.items"
          :value="filters.academicRecord.semesterItem"
          @input="onSemesterFilterChange"
          label="name"
          placeholder="Semester"
          class="mt-2"
          :clearable="false"
          :searchable="false"
        />
      <b-button
        class="mt-4"
        variant="outline-primary"
        size="sm"
        block
        @click="onPreviewEnrolledList"
        ><v-icon name="print" /> Preview</b-button>
    </template>
    <template v-slot:content>
      <ReportViewer v-if="isFileReady" :file="file" />
    </template>
  </ReportContent>
</template>

<script>
import SchoolCategoryTabs from '../../components/SchoolCategoryTabs';
import Card from '../../components/Card';
import FileViewer from '../../components/FileViewer';
import StudentColumn from '../../components/ColumnDetails/StudentColumn';
import EducationColumn from '../../components/ColumnDetails/EducationColumn';
import ReportContent from "../../components/PageContainer/ReportContainer";
import ReportViewer from "../../components/ReportViewer/ReportViewer";

import {
  AcademicRecordStatuses,
  SchoolCategories,
  Semesters,
} from '../../../helpers/enum';
import {
  AcademicRecordApi,
  CourseApi,
  LevelApi,
  ReportApi,
  SchoolYearApi,
} from '../../../mixins/api';
import Access from '../../../mixins/utils/Access';

export default {
  components: {
    SchoolCategoryTabs,
    Card,
    StudentColumn,
    EducationColumn,
    FileViewer,
    ReportContent,
    ReportViewer
  },
  mixins: [SchoolYearApi, LevelApi, CourseApi, AcademicRecordApi, ReportApi, Access],
  data() {
    return {
      isFilterVisible: true,
      isFileReady: false,
      isLoading: false,
      Semesters: Semesters,
      SchoolCategories: SchoolCategories,
      AcademicRecordStatuses: AcademicRecordStatuses,
      showModalPreview: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      tables: {
        academicRecords: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
          ],
          items: [],
        },
      },
      filters: {
        academicRecord: {
          schoolYearId: null,
          schoolYearItem: null,
          schoolCategoryId: SchoolCategories.PRE_SCHOOL.id,
          levelId: null,
          levelItem: null,
          courseId: null,
          courseItem: null,
          semesterId: null,
          semesterItem: null,
        },
      },
      options: {
        schoolYears: {
          items: [],
        },
        levels: {
          items: [],
          filteredLevels: [],
        },
        courses: {
          items: [],
        },
        semesters: {
          items: Semesters.values,
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
    };
  },
  async created() {
    this.isLoading = true;
    const params = { paginate: false };
    const { schoolYears, levels, courses, semesters } = this.options;
    const { schoolCategoryId } = this.filters.academicRecord;
    const { academicRecord } = this.filters

    academicRecord.schoolCategoryId =  this.checkIfSuperUser() ? this.SchoolCategories.PRE_SCHOOL.id : this.getDefaultSchoolCategory()?.id
    academicRecord.schoolCategoryItem =  this.checkIfSuperUser() ? this.SchoolCategories.PRE_SCHOOL : this.getDefaultSchoolCategory()

    await this.getSchoolYearList(params).then(({ data }) => {
      schoolYears.items = data;
      const activeSchoolYear = schoolYears.items.find(
        (e) => e.isActive == 1
      );
      academicRecord.schoolYearId = activeSchoolYear?.id
      academicRecord.schoolYearItem = activeSchoolYear
    });

    await this.getCourseList(params).then(({ data }) => {
      courses.items = data;
    });

    await this.loadLevels();

    await this.loadAcademicRecords();

    this.isLoading = false;
  },
  methods: {
    loadAcademicRecords() {
      const {
        schoolYearId,
        schoolCategoryId,
        levelId,
        courseId,
        semesterId,
      } = this.filters.academicRecord;
      const {
        academicRecord,
        academicRecord: { perPage, page },
      } = this.paginations;
      const params = {
        paginate: true,
        perPage,
        page,
        academicRecordStatusId: AcademicRecordStatuses.ENROLLED.id,
        schoolYearId,
        schoolCategoryId,
        levelId,
        courseId,
        semesterId,
      };
      const { academicRecords } = this.tables;

      academicRecords.isBusy = true;

      this.getAcademicRecordList(params).then(({ data }) => {
        //console.log(data)
        academicRecords.items = data.data;
        academicRecord.from = data.meta.from;
        academicRecord.to = data.meta.to;
        academicRecord.totalRows = data.meta.total;
        academicRecords.isBusy = false;
      });
    },
    loadLevels() {
      const { schoolCategoryId } = this.filters.academicRecord;
      const { levels } = this.options;
      const params = { paginate: false, schoolCategoryId };
      this.getLevelList(params).then(({ data }) => {
        levels.items = data;
        this.filters.academicRecord.levelId = null;
      });
    },
    onPreviewEnrolledList() {
      const {
        schoolYearId,
        schoolCategoryId,
        levelId,
        courseId,
        semesterId,
      } = this.filters.academicRecord;
      const params = {
        paginate: false,
        academicRecordStatusId: AcademicRecordStatuses.ENROLLED.id,
        schoolYearId,
        schoolCategoryId,
        levelId,
        courseId,
        semesterId,
      };
      this.file.type = null;
      this.file.src = null;
      this.file.notes = null;
      this.file.isLoading = true;
      this.file.owner = null;
      this.file.name = 'Enrolled Student List';
      this.isFileReady = false;

      this.showModalPreview = true;
      // const { dateFrom, dateTo, criteria } = this.filters.payment
      // const params = { dateFrom, dateTo, criteria, paymentStatusId: PaymentStatuses.APPROVED.id }
      this.previewEnrolledList(params).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
        this.isFileReady = true;
      });
    },
    onSchoolYearFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.schoolYearId = item?.id || 0;
      academicRecord.schoolYearItem = item;
    },
    onCategoryFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.schoolCategoryId = item?.id || 0;
      academicRecord.schoolCategoryItem = item;
      academicRecord.levelId = null,
      academicRecord.levelItem = null,
      academicRecord.courseId = null
      academicRecord.courseItem = null
      academicRecord.semesterId = null
      academicRecord.semesterItem = null
      this.loadLevels()
    },
    onLevelFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.levelId = item?.id || 0;
      academicRecord.levelItem = item;
    },
    onCourseFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.courseId = item?.id || 0;
      academicRecord.courseItem = item;
    },
    onSemesterFilterChange(item) {
      const { academicRecord } = this.filters;
      academicRecord.semesterId = item?.id || 0;
      academicRecord.semesterItem = item;
    },
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.academicRecord;
      return [
        this.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        this.SchoolCategories.COLLEGE.id,
        this.SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    }
  }

};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_shared.scss';

.enrolled_main-container {
  width: 100%;
  height: 100%;
}

.search-filter-container {
  display: flex;

  .filters {
    flex: 1;
    display: flex;
    .filter-inputs {
      margin-right: 10px;
      min-width: 150px;
      max-width: 230px;
    }
  }

  .print-button-container {
    width: auto;
    justify-self: flex-end;
    align-self: center;
  }

  @include for-size(phone-only) {
    flex-direction: column;
    margin-bottom: 10px;

    .filters {
      flex: 1;
      flex-direction: column;
      .filter-inputs {
        margin-right: 0;
        min-width: 100%;
        max-width: 100%;
      }
    }

    .print-button-container {
      width: 100%;
      justify-self: flex-start;
      align-self: center;

      .print-button {
        width: 100%;
      }
    }
  }
}</style
>>
