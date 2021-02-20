<template>
  <PageContent
    title="Student Grade"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadStudents()"
    :filterVisible="isFilterVisible">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        @update="loadStudents()"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <v-select
        @input="loadSectionsOfPersonnel()"
        :options="$options.SchoolCategories.values"
        v-model="filters.student.schoolCategoryId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <v-select
        @input="loadSectionsOfPersonnel()"
        :options="options.schoolYears.items"
        v-model="filters.student.schoolYearId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Year"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        @input="loadSectionsOfPersonnel()"
        :options="$options.Semesters.values"
        v-model="filters.student.semesterId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <v-select
        @input="loadSubjectsOfSection()"
        :options="options.sections.items"
        v-model="filters.student.sectionId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
      <v-select
        @input="loadStudents()"
        :options="options.subjects.items"
        v-model="filters.student.subjectId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="Subject"
        class="mt-2"
      />
      <b-button 
        :disabled="tables.students.items.length == 0"
        block
        class="mt-5" @click="onSaveStudentGrade()" 
        variant="primary">
        <v-icon v-if="isProcessing" name="spinner" spin />
        Save
      </b-button>
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
            :fields="tables.students.fields"
            :busy="tables.students.isBusy"
            :items="tables.students.items"
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
            <template v-slot:head(terms)>
              <div class="cell-term__header">
                <div v-for="term in terms" :key="term.id">
                  {{ term.name }}
                </div>
              </div>
            </template>
            <template v-slot:cell(terms)="{ item }">
              <div class="cell-term" v-if="item.details">
                <vue-autonumeric
                  v-for="term in terms"
                  v-model="item.details.find(d => d.id === term.id).pivot.grade"
                  :key="term.id"
                  class="form-control text-right cell-term-input"
                  :options="[
                    {
                      minimumValue: 0,
                      maximumValue: 5,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0,
                    },
                  ]"
                />
              </div>
              
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
              Showing {{ paginations.student.from }} to
              {{ paginations.student.to }} of
              {{ paginations.student.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                class="c-pagination"
                v-model="paginations.student.page"
                :total-rows="paginations.student.totalRows"
                :per-page="paginations.student.perPage"
                size="sm"
                align="end"
                @input="loadStudents()"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
  </PageContent>
</template>
<script>
import PageContent from "../components/PageContainer/PageContent";
import { SchoolCategories, Semesters } from "../../helpers/enum"
import { SchoolYearApi, PersonnelApi, SubjectApi, StudentApi, TermApi, StudentGradeApi } from '../../mixins/api';
import { StudentColumn } from '../components/ColumnDetails';
import { showNotification } from '../../helpers/forms';
export default {
  name: 'StudentGrade',
  components: {
    PageContent,
    StudentColumn
  },
  mixins: [ SchoolYearApi, SubjectApi, PersonnelApi, StudentApi, TermApi, StudentGradeApi ],
  SchoolCategories, Semesters,
  data() {
    return {
      isFilterVisible: true,
      isProcessing: false,
      terms: [],
      tables: {
        students: {
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
      paginations: {
        student: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        student: {
          criteria: null,
          schoolCategoryId: null,
          schoolYearId: null,
          semesterId: null,
          sectionId: null,
          subjectId: null
        }
      },
      options: {
        schoolYears: {
          items: []
        },
        sections: {
          items: []
        },
        subjects: {
          items: []
        }
      }
    }
  },
  created() {
    this.loadSchoolYears()
  },
  methods: {
    loadStudents() {
      const { subjectId, sectionId, criteria } = this.filters.student
      const { student, student: { perPage, page } } = this.paginations
      const { students } = this.tables
      const params = { paginate: true, perPage, page, subjectId, sectionId, criteria }
      students.isBusy = true;
      this.getStudentGradeList(params).then(({ data }) => {
        students.items = data.data;
        student.from = data.meta.from;
        student.to = data.meta.to;
        student.totalRows = data.meta.total;
        students.isBusy = false;
      })
    },
    loadSchoolYears() {
      const params = { paginate: false }
      const { schoolYears } = this.options
      const { student } = this.filters
      this.getSchoolYearList(params).then(({ data }) => {
        const activeSchoolYear = data.find(x => x.isActive)
        student.schoolYearId = activeSchoolYear.id ?? null
        schoolYears.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadSectionsOfPersonnel() {
      const { student, student: { schoolCategoryId, schoolYearId } } = this.filters
      if(!this.isCourseVisible) {
        student.semesterId = null
      }
      student.sectionId = null
      if (schoolCategoryId && schoolYearId && (this.isCourseVisible ? student.semesterId : true)) {
        const params = { schoolCategoryId, schoolYearId, semesterId: student.semesterId }
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
      const { student, student: { sectionId } } = this.filters
      student.subjectId = null
      const section = sections.items.find(s => s.id === sectionId)
      subjects.items = section.subjects ?? []
    },
    loadTerms() {
      const { schoolCategoryId, schoolYearId, semesterId } = this.filters.student
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
    onSaveStudentGrade() {
      this.isProcessing = true
      const { students } = this.tables
      const { user } = this.$store.state
      const data = students.items.map(student => {
        return {
          id: student.id,
          studentId: student.studentId,
          sectionId: student.sectionId,
          subjectId: student.subjectId,
          details: student.details.map(detail => {
            return {
              termId: detail.id,
              personnelId: user.id,
              grade: detail.pivot.grade
            }
          })
        }
      })
      this.batchUpdateStudentGrade(data).then(({ data }) => {
        this.loadStudents();
        showNotification(this, 'success', 'Student Grade successfully updated.')
        this.isProcessing = false
      }).catch(error => {
        console.log(error)
      })
    }
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.student;
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
