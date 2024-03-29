<template>
  <PageContent
    :title="`Clearance`"
    description="If all relevant requirements were settled, you can clear a particular student."
    :searchKeyword="filters.clearance.criteria"
    :pageFrom="paginations.clearance.from"
    :pageTo="paginations.clearance.to"
    :pageTotal="paginations.clearance.totalRows"
    :perPage="paginations.clearance.perPage"
    :currentPage.sync="paginations.clearance.page"
    @onPageChange="loadClearances"
    @onRefresh="loadClearances"
    :createButtonVisible="false"
    :badges="[{ text: $store.state.schoolYear.name }]"
    showBottomActions>
    <template v-slot:filters>
      <b-form-input
        v-model="filters.clearance.criteria"
        @update="loadClearances()"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <SelectCategory
        @input="onCategoryFilterChange"
        v-model="filters.clearance.schoolCategoryItem"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <!-- <v-select
        @input="loadSections()"
        :options="options.schoolYears.items"
        v-model="filters.clearance.schoolYearId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Year"
        class="mt-2"
      /> -->
      <v-select
        v-if="isCourseVisible"
        @input="onCourseFilterChange"
        :options="options.courses.items"
        v-model="filters.clearance.courseItem"
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
        @input="onSemesterFilterChange"
        :options="$options.Semesters.values"
        v-model="filters.clearance.semesterItem"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <v-select
        @input="onLevelFilterChange"
        :options="options.levels.items"
        v-model="filters.clearance.levelItem"
        label="name"
        placeholder="Level"
        class="mt-2"
      />
      <v-select
        @input="onSectionFilterChange"
        :options="options.sections.items"
        v-model="filters.clearance.sectionItem"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div>
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
          <template v-slot:cell(name)="{ item }">
            <StudentColumn
              :data="{ student: item.studentClearance.student }"
              :callback="{
                loadDetails: () => null,
              }"
            />
          </template>
          <template v-slot:cell(education)="{ item }">
            <EducationColumn :data="item.studentClearance.academicRecord" />
          </template>
          <template v-slot:cell(isCleared)="{ item }">
            <!-- <b-form-checkbox
              :value=1
              :unchecked-value=0
              v-model="item.isCleared" /> -->
              <Toggle
                :value="item.isCleared ? true : false"
                @input="item.isCleared = $event" />
          </template>
          <template v-slot:cell(remarks)="{ item }">
            <b-form-input
              v-model="item.remarks" />
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
        <!-- <div class="d-flex">
          <div>
            Showing {{ paginations.clearance.from }} to
            {{ paginations.clearance.to }} of
            {{ paginations.clearance.totalRows }} records.
          </div>
          <div class="ml-auto">
            <b-pagination
              class="c-pagination"
              v-model="paginations.clearance.page"
              :total-rows="paginations.clearance.totalRows"
              :per-page="paginations.clearance.perPage"
              size="sm"
              align="end"
              @input="onSaveClearance()"
            />
          </div>
        </div> -->
      </div>
    </template>
    <template v-slot:extra-buttons>
       <b-button
        :disabled="tables.clearances.items.length == 0"
         @click="onSaveClearance()"
        variant="primary">
        <v-icon v-if="isProcessing" name="spinner" spin />
        Save Changes
      </b-button>
    </template>
  </PageContent>
</template>
<script>
import PageContent from "../components/PageContainer/PageContent";
import { SchoolCategories, Semesters } from "../../helpers/enum"
import { SchoolYearApi, StudentClearanceApi, CourseApi, LevelApi, SectionApi } from '../../mixins/api';
import { StudentColumn, EducationColumn } from '../components/ColumnDetails';
import { showNotification } from '../../helpers/forms';
import Toggle from "../components/Form/Toggle";
export default {
  name: 'StudentGrade',
  components: {
    PageContent,
    StudentColumn,
    EducationColumn,
    Toggle
  },
  mixins: [ SchoolYearApi, StudentClearanceApi, CourseApi, LevelApi, SectionApi ],
  SchoolCategories, Semesters,
  data() {
    return {
      isFilterVisible: true,
      isProcessing: false,
      terms: [],
      tables: {
        clearances: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
            },
            {
              key: 'isCleared',
              label: 'Is Cleared?',
              tdClass: 'align-middle text-center',
              thClass: 'text-center'
            },
            {
              key: 'remarks',
              label: 'REMARKS',
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
          schoolCategoryItem: null,
          schoolCategoryId: null,
          schoolYearId: null,
          courseItem: null,
          courseId: null,
          levelItem: null,
          levelId: null,
          semesterItem: null,
          semesterId: null,
          sectionItem: null,
          sectionId: null,
        }
      },
      options: {
        sections: {
          items: []
        },
        levels: {
          items: []
        },
        courses: {
          items: []
        },
      }
    }
  },
  created() {
    this.loadClearances()
  },
  methods: {
    loadClearances() {
      const { schoolCategoryId, sectionId, schoolYearId, courseId, semesterId, levelId, criteria } = this.filters.clearance
      const { clearance, clearance: { perPage, page } } = this.paginations
      const { clearances } = this.tables
      const personnelId = this.$store.state.user.userable.id
      const params = { paginate: true, perPage, page, criteria, personnelId, schoolCategoryId, schoolYearId, sectionId, courseId, semesterId, levelId }
      clearances.isBusy = true;
      this.getSignatoryList(params).then(({ data }) => {
        clearances.items = data.data;
        clearance.from = data.meta.from;
        clearance.to = data.meta.to;
        clearance.totalRows = data.meta.total;
        clearances.isBusy = false;
      })
    },
    loadCourses() {
      const { schoolCategoryId } = this.filters.clearance
      if (this.isCourseVisible) {
        const params = { paginate: false, schoolCategoryId }
        const { courses } = this.options
        this.getCourseList(params).then(({ data }) => {
          courses.items = data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    loadLevels() {
      const { clearance, clearance: { schoolCategoryId } } = this.filters
      clearance.levelId = null
      if (!this.isCourseVisible) {
        const params = { paginate: false, schoolCategoryId }
        const { levels } = this.options
        this.getLevelList(params).then(({ data }) => {
          levels.items = data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    loadLevelsOfCourse() {
      const { clearance, clearance: { courseId } } = this.filters
      const params = { paginate: false }
      const { levels } = this.options
      clearance.levelId = null
      this.getLevelsOfCourse(courseId, params).then(({ data }) => {
        levels.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadSectionsOfPersonnel() {
      const { clearance, clearance: { schoolCategoryId } } = this.filters
      const { id: schoolYearId } = this.$store.state.schoolYear
      if(!this.isCourseVisible) {
        clearance.semesterId = null
      }
      clearance.sectionId = null
      if (schoolCategoryId && schoolYearId && (this.isCourseVisible ? clearance.semesterId : true)) {
        const params = { schoolCategoryId, schoolYearId, semesterId: clearance.semesterId }
        const { id } = this.$store.state.user
        const { sections } = this.options
        this.getSectionsOfPersonnel(params, id).then(({ data }) => {
          sections.items = data
        }).catch(error => {
          console.log(error)
        })
        this.loadTerms();
      }
    },
    loadSubjectsOfSection() {
      const { sections, subjects } = this.options
      const { clearance, clearance: { sectionId } } = this.filters
      clearance.subjectId = null
      const section = sections.items.find(s => s.id === sectionId)
      subjects.items = section.subjects ?? []
    },
    loadTerms() {
      const { schoolCategoryId, semesterId } = this.filters.clearance
      const { id: schoolYearId } = this.$store.state.schoolYear
      const params = {
        paginate: false,
        schoolCategoryId,
        semesterId,
        schoolYearId,
      };
      this.getTermList(params).then(({ data }) => {
        this.terms = data
      });
    },
    onSaveClearance() {
      this.isProcessing = true
      const { clearances } = this.tables
      const data = clearances.items.map(clearance => {
        return {
          id: clearance.id,
          isCleared: Number(clearance.isCleared),
          remarks: clearance.remarks
        }
      })
      this.batchUpdateSignatories(data).then(({ data }) => {
        this.loadClearances();
        showNotification(this, 'success', 'Clearance successfully updated.')
        this.isProcessing = false
      }).catch(error => {
        console.log(error)
      })
    },
    loadSections() {
      const { schoolCategoryId, courseId, semesterId, levelId } = this.filters.clearance
      const { id: schoolYearId } = this.$store.state.schoolYear
      const params = { paginate: false, schoolCategoryId, schoolYearId, courseId, semesterId, levelId }
      const { sections } = this.options
      this.getSectionList(params).then(({ data }) => {
        sections.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    onCategoryFilterChange(item) {
      const { clearance } = this.filters;
      clearance.schoolCategoryId = item?.id || 0;
      clearance.schoolCategoryItem = item;
      this.loadClearances()
      this.loadCourses()
      this.loadLevels()
    },
    onSemesterFilterChange(item) {
      const { clearance } = this.filters;
      clearance.semesterId = item?.id || 0;
      clearance.semesterItem = item;
      this.loadSections()
      this.loadClearances()
    },
    onCourseFilterChange(item) {
      const { clearance } = this.filters;
      clearance.courseId = item?.id || 0;
      clearance.courseItem = item;
      this.loadLevelsOfCourse()
      this.loadSections()
      this.loadClearances()
    },
    onLevelFilterChange(item) {
      const { clearance } = this.filters;
      clearance.levelId = item?.id || 0;
      clearance.levelItem = item;
      this.loadSections()
      this.loadClearances()
    },
    onSectionFilterChange(item) {
      const { clearance } = this.filters;
      clearance.sectionId = item?.id || 0;
      clearance.sectionItem = item;
      this.loadClearances()
    },
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
  },
  watch: {
    '$store.state.schoolYear': function(newVal) {
      this.loadSections()
    },
  },
};
</script>
<style lang="scss" scoped>
.cell-term {
  display: flex;
  width: 100%;
  .cell-term-input {
    margin: 0 5px;
  }
}
.cell-term__header {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
</style>
