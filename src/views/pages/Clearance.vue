<template>
  <PageContent
    title="Clearance"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadClearances()"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.clearance.criteria"
        debounce="500"
        @update="loadClearances()"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <v-select
        :options="$options.SchoolCategories.values"
        @input="loadSchoolCategoryInfo(), loadSections(), loadClearances()"
        v-model="filters.clearance.schoolCategoryId"
        :reduce="item => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />
      <v-select
        :options="options.schoolYears.items"
        @input="loadSections(), loadClearances()"
        v-model="filters.clearance.schoolYearId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Year"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        @input="loadLevelsOfCourse($event), loadSections(), loadClearances()"
        :options="options.courses.items"
        v-model="filters.clearance.courseId"
        :reduce="(item) => item.id"
        placeholder="Course"
        class="mt-2"
        label="name"
      >
        <template v-slot:option="option">
          {{ `${option.description} ${option.major ? `- ${option.major}` : ''}` }}
        </template>
      </v-select>
      <v-select
        v-if="isCourseVisible"
        @input="loadSections(), loadClearances()"
        :options="$options.Semesters.values"
        v-model="filters.clearance.semesterId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <v-select
        @input="loadSections(), loadClearances()"
        :options="options.levels.items"
        v-model="filters.clearance.levelId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Level"
        class="mt-2"
      />
      <v-select
        @input="loadClearances()"
        :options="options.sections.items"
        v-model="filters.clearance.sectionId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
    </template>
    <template v-slot:extra-buttons>
      <div class="ml-1 drop-down__container" >
        <b-dropdown
          text="Create"
          variant="outline-primary"
          split-variant="outline-primary"
          class="clerance__drop-down"
          split>
          <b-dropdown-item
            @click="showBatchEntry=false">
            Create Clearance
          </b-dropdown-item>
          <b-dropdown-item @click="showEntry=false">
            Batch Create Clearance
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
    <template v-slot:content>
      <b-row>
        <b-col md="12">
          <b-table
            class="c-table"
            small
            hover
            outlined
            show-empty
            :fields="tables.clearances.fields"
            :busy="tables.clearances.isBusy"
            :items="tables.clearances.items"
            responsive
          >
            <template v-slot:cell(name)="data">
              <StudentColumn
                :data="{ student: data.item.student }"
                :callback="{
                  loadDetails: () => null,
                }"
              />
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(action)="row">
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.clearance.from }} to
              {{ paginations.clearance.to }} of
              {{ paginations.clearance.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                class="c-pagination"
                v-model="paginations.clearance.page"
                :total-rows="paginations.clearance.totalRows"
                :per-page="paginations.clearance.perPage"
                size="sm"
                align="end"
                @input="loadClearances()"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
  </PageContent>
</template>
<script>
import { SchoolCategories, Semesters } from '../../helpers/enum'
import { StudentColumn } from '../components/ColumnDetails';
import Access from '../../mixins/utils/Access'
import PageContent from "../components/PageContainer/PageContent";
import { CourseApi, LevelApi, SchoolYearApi, SectionApi, StudentClearanceApi } from '../../mixins/api';
export default {
  SchoolCategories,
  Semesters,
  mixins: [Access, SchoolYearApi, CourseApi, LevelApi, SectionApi, StudentClearanceApi],
  components: {
    PageContent,
    StudentColumn
  },
  data() {
    return { 
      isFilterVisible: true,
      tables: {
        clearances: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'terms',
              label: '',
              tdClass: 'align-middle',
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: []
        },
      },
      options: {
        schoolYears: {
          items: []
        },
        levels: {
          items: []
        },
        courses: {
          items: []
        },
        sections: {
          items: []
        }
      },
      paginations: {
        clearance: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        clearance: {
          criteria: null,
          schoolCategoryId: null,
          schoolYearId: null,
          courseId: null,
          semesterId: null,
          levelId: null,
          sectionId: null
        }
      }
    }
  },
  created() {
    this.loadSchoolYears()
    this.loadClearances()
  },
  methods: {
    loadClearances() {
      const {
        schoolCategoryId,
        criteria,
        schoolYearId,
        courseId,
        semesterId,
        levelId,
        sectionId,
      } = this.filters.clearance;
      const { clearances } = this.tables;
      const {
        clearance,
        clearance: { perPage, page },
      } = this.paginations;
      const orderBy = 'created_at';
      const sort = 'DESC';
      const params = {
        paginate: true,
        schoolCategoryId,
        criteria,
        schoolYearId,
        courseId,
        semesterId,
        levelId,
        sectionId,
        perPage,
        page,
        orderBy,
        sort,
      };

      clearances.isBusy = true;
      this.getStudentClearanceList(params).then(({ data }) => {
        clearances.items = data.data;
        clearance.from = data.meta.from;
        clearance.to = data.meta.to;
        clearance.totalRows = data.meta.total;
        clearances.isBusy = false;
      }); 
    },
    loadSchoolCategoryInfo() {
      const { clearance, clearance: { schoolCategoryId } } = this.filters
      clearance.courseId = null
      clearance.semesterId = null
      if (this.isCourseVisible) {
        this.loadCourses(schoolCategoryId)
        return
      }

      this.loadLevels(schoolCategoryId)
    },
    loadCourses(schoolCategoryId = null) {
      const params = { paginate: false, schoolCategoryId }
      const { courses } = this.options
      this.getCourseList(params).then(({ data }) => {
        courses.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadLevels(schoolCategoryId) {
      const params = { paginate: false, schoolCategoryId }
      const { levels } = this.options
      this.getLevelList(params).then(({ data }) => {
        levels.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadLevelsOfCourse(courseId) {
      const params = { paginate: false }
      const { levels } = this.options
      this.getLevelsOfCourse(courseId, params).then(({ data }) => {
        levels.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadSchoolYears() {
      const params = { paginate: false }
      const { schoolYears } = this.options
      const { clearance } = this.filters
      this.getSchoolYearList(params).then(({ data }) => {
        const activeSchoolYear = data.find(x => x.isActive)
        clearance.schoolYearId = activeSchoolYear.id ?? null
        schoolYears.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadSections() {
      const { schoolCategoryId, schoolYearId, courseId, semesterId, levelId } = this.filters.clearance
      const params = { paginate: false, schoolCategoryId, schoolYearId, courseId, semesterId, levelId }
      const { sections } = this.options
      this.getSectionList(params).then(({ data }) => {
        sections.items = data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.clearance;
      const { SchoolCategories } = this.$options;
      return [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
  }
}
</script>
<style lang="scss">
  .clerance__drop-down {
    height: 24px;

    .btn-outline-primary {
      display: flex;
      align-items: center;
    }
  }
</style>