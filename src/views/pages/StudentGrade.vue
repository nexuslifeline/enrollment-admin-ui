<template>
  <PageContent
    :title="`Student Grade (${$store.state.schoolYear.name})`"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadStudents()"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false"
    showBottomActions>
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        @update="loadStudents()"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <!--<v-select
        @input="loadSectionsOfPersonnel()"
        :options="$options.SchoolCategories.values"
        v-model="filters.student.schoolCategoryId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />-->
      <vSelectCategory
        @input="onCategoryFilterChange"
        v-model="filters.student.schoolCategoryItem"
        label="name"
        placeholder="School Category"
      />
      <v-select
        v-if="isCourseVisible"
        @input="onSemesterFilterChange"
        :options="$options.Semesters.values"
        v-model="filters.student.semesterItem"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <v-select
        @input="onSectionFilterChange"
        :options="options.sections.items"
        v-model="filters.student.sectionItem"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
      <v-select
        @input="onSubjectFilterChange"
        :options="options.subjects.items"
        v-model="filters.student.subjectItem"
        label="name"
        placeholder="Subject"
        class="mt-2"
      />
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
            <template v-slot:head(gradingPeriods)>
              <div class="cell-term__header">
                <div v-for="gradingPeriod in gradingPeriods" :key="gradingPeriod.id">
                  {{ gradingPeriod.name }}
                </div>
              </div>
            </template>
            <template v-slot:cell(gradingPeriods)="{ item }">
              <div class="cell-gradingPeriod" v-if="item.grades">
                <vue-autonumeric
                  v-for="gradingPeriod in gradingPeriods"
                  v-model="item.grades.find(d => d.id === gradingPeriod.id).pivot.grade"
                  :key="gradingPeriod.id"
                  class="form-control text-right cell-gradingPeriod-input"
                  :options="[
                    {
                      minimumValue: 0,
                      maximumValue: 100,
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
            <!-- <template v-slot:cell(action)="{item}">
              <b-btn
                @click="onFinalizeGrade(item)"
                :disabled="item.grades.some(d => d.pivot.grade === 0 || d.grade === null)"
                size="sm"
                variant="outline-primary">
                <v-icon v-if="!item.isFinalizing" name="check" />
                <v-icon v-else name="spinner" spin />
              </b-btn>
            </template> -->
          </b-table>
          <!-- <b-row>
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
          </b-row> -->
        </b-col>
      </b-row>
    </template>
    <template v-slot:bottom-actions>
      <b-button
        class="btn-save"
        :disabled="tables.students.items.length == 0"
        @click="onSaveStudentGrade()"
        variant="primary">
        <v-icon v-if="isProcessing" name="spinner" spin />
        Save
      </b-button>
      <b-button
        class="btn-save"
        :disabled="tables.students.items.length == 0"
        @click="onFinalizeGrade()"
        variant="primary">
        <v-icon v-if="isFinalizing" name="spinner" spin />
        Finalize
      </b-button>
    </template>
  </PageContent>
</template>
<script>
import PageContent from "../components/PageContainer/PageContent";
import { SchoolCategories, Semesters } from "../../helpers/enum"
import { SchoolYearApi, PersonnelApi, SubjectApi, StudentApi, GradingPeriodApi, AcademicRecordApi } from '../../mixins/api';
import { StudentColumn } from '../components/ColumnDetails';
import { showNotification } from '../../helpers/forms';
export default {
  name: 'StudentGrade',
  components: {
    PageContent,
    StudentColumn
  },
  mixins: [ SchoolYearApi, SubjectApi, PersonnelApi, StudentApi, GradingPeriodApi, AcademicRecordApi ],
  SchoolCategories, Semesters,
  data() {
    return {
      isFilterVisible: true,
      isProcessing: false,
      isFinalizing: false,
      gradingPeriods: [],
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
              key: 'gradingPeriods',
              label: '',
              tdClass: 'align-middle',
            },
            // {
            //   key: 'action',
            //   label: '',
            //   tdClass: 'align-middle',
            //   thStyle: { width: '40px' },
            // },
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
          schoolCategoryItem: null,
          schoolCategoryId: null,
          semesterItem: null,
          semesterId: null,
          sectionItem: null,
          sectionId: null,
          subjectItem: null,
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
    // this.loadSchoolYears()
  },
  methods: {
    loadStudents() {
      let { subjectId, sectionId, criteria } = this.filters.student
      const { student, student: { perPage, page } } = this.paginations
      const { students } = this.tables
      const params = { paginate: false, criteria }
      students.isBusy = true;
      subjectId = subjectId ?? 0
      sectionId = sectionId ?? 0
      this.getGradesOfAcademicRecords(subjectId, sectionId, params).then(({ data }) => {
        students.items = data;
        // student.from = data.meta.from;
        // student.to = data.meta.to;
        // student.totalRows = data.meta.total;
        students.isBusy = false;
      })
    },
    // loadSchoolYears() {
    //   const params = { paginate: false }
    //   const { schoolYears } = this.options
    //   const { student } = this.filters
    //   this.getSchoolYearList(params).then(({ data }) => {
    //     const activeSchoolYear = data.find(x => x.isActive)
    //     student.schoolYearId = activeSchoolYear.id ?? null
    //     schoolYears.items = data
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    loadSectionsOfPersonnel() {
      const { student, student: { schoolCategoryId } } = this.filters

      const { id: schoolYearId } = this.$store.state.schoolYear
      if(!this.isCourseVisible) {
        student.semesterId = null
      }
      student.sectionId = null
      if (schoolCategoryId && schoolYearId && (this.isCourseVisible ? student.semesterId : true)) {
        const params = { schoolCategoryId, schoolYearId, semesterId: student.semesterId }
        const { id } = this.$store.state.user.userable
        const { sections } = this.options
        this.getSectionsOfPersonnel(params, id).then(({ data }) => {
          sections.items = data
        }).catch(error => {
          console.log(error)
        })
        this.loadGradingPeriods();
      }
    },
    loadSubjectsOfSection() {
      const { sections, subjects } = this.options
      const { student, student: { sectionId } } = this.filters
      student.subjectId = null

      if(!sectionId) {
        subjects.items = []
        return
      }
      const section = sections.items.find(s => s.id === sectionId)
      subjects.items = section.subjects ?? []
    },
    loadGradingPeriods() {
      const { schoolCategoryId, semesterId } = this.filters.student
      const { id: schoolYearId } = this.$store.state.schoolYear
      const params = {
        paginate: false,
        schoolCategoryId,
        semesterId,
        schoolYearId,
      };

      this.getGradingPeriodList(params).then(({ data }) => {
        this.gradingPeriods = data
      });
    },
    onSaveStudentGrade() {
      this.isProcessing = true
      const { students } = this.tables

      const data = students.items.map(student => {
        return {
          id: student.id,
          sectionId: student.sectionId,
          subjectId: this.filters.student.subjectId,
          grades: student.grades.map(grade => {
            return {
              termId: grade.id,
              grade: grade.pivot.grade
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
    },
    onFinalizeGrade(item) {
      this.isFinalizing = true
      const { students } = this.tables
      const data = students.items.map(student => {
        return {
          id: student.id,
          sectionId: student.sectionId,
          subjectId: this.filters.student.subjectId,
          grades: student.grades.map(grade => {
            return {
              termId: grade.id,
              grade: grade.pivot.grade
            }
          })
        }
      })
      this.finalizeGrade(data)
      .then(({ data }) => {
        this.loadStudents()
        showNotification(this, 'success', 'Finalized successfully.');
        this.isFinalizing = false
      })
    },
    onCategoryFilterChange(item) {
      const { student } = this.filters;
      student.schoolCategoryId = item?.id || 0;
      student.schoolCategoryItem = item;
      this.loadSectionsOfPersonnel()
    },
    onSemesterFilterChange(item) {
      const { student } = this.filters;
      student.semesterId = item?.id || 0;
      student.semesterItem = item;
      this.loadSectionsOfPersonnel()
    },
    onSectionFilterChange(item) {
      const { student } = this.filters;
      student.sectionId = item?.id || 0;
      student.sectionItem = item;
      this.loadSubjectsOfSection()
    },
    onSubjectFilterChange(item) {
      const { student } = this.filters;
      student.subjectId = item?.id || 0;
      student.subjectItem = item;
      this.loadStudents()
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
  },
  watch: {
    '$store.state.schoolYear': function(newVal) {
      this.loadSectionsOfPersonnel();
    },
  },
};
</script>
<style lang="scss" scoped>
.cell-gradingPeriod {
  display: flex;
  width: 100%;
  .cell-gradingPeriod-input {
    margin: 0 5px;
  }
}
.cell-term__header {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.btn-save {
  width: 150px;
  margin-right: 5px;
}
</style>
