<template>
  <PageContent
    :title="`Student Grade (${$store.state.schoolYear.name})`"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadSectionsOfPersonnel()"
    :filterVisible="isFilterVisible && !showGradeSheet"
    :createButtonVisible="false"
    :showBottomActions="showGradeSheet">
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
      <!-- <v-select
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
      /> -->
    </template>
    <template v-slot:content>
      <b-row v-if="!showGradeSheet">
        <b-col md="12">
          <b-table
            class="c-table"
            small
            hover
            outlined
            show-empty
            :fields="tables.sections.fields"
            :busy="tables.sections.isBusy"
            :items="tables.sections.items"
            responsive
          >
            <template v-slot:cell(name)="row">
              <b-link @click="row.toggleDetails()">{{ row.item.name }}</b-link>
            </template>
            <template v-slot:cell(details)="data">
              <EducationColumn
                :data="data.item"
                :callback="{
                  loadDetails: () => null,
                }"
              />
            </template>
            <template v-slot:row-details="data">
              <div class="section__subjects">
                <h6>Subjects</h6>
                <div 
                  class="subjects" 
                  v-for="subject in data.item.subjects" :key="subject.id" 
                  @click="setGradeSheet(data.item, subject)">
                  <li>{{ `${subject.code} - ${subject.name} ${subject.description}` }}</li>
                </div>
              </div>
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <GradeSheet 
        v-else
        :section="section"
        :subject="subject"
        :students="tables.students"
        :gradingPeriods="gradingPeriods"
      />
    </template>
    <template v-slot:bottom-actions>
      <b-button
        class="btn-save"
        @click="onSaveStudentGrade()"
        variant="primary">
        <v-icon v-if="isProcessing" name="spinner" spin />
        Save
      </b-button>
      <b-button
        class="btn-save"
        @click="onSaveStudentGrade(true)"
        variant="primary">
        <v-icon v-if="isFinalizing" name="spinner" spin />
        Finalize
      </b-button>
      <b-button
        class="btn-save"
        @click="showGradeSheet = false"
        variant="outline-danger">
        Cancel
      </b-button>
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
import { SchoolCategories, Semesters, StudentGradeStatuses } from "../../helpers/enum"
import { StudentApi, GradingPeriodApi, StudentGradeApi, PersonnelApi } from '../../mixins/api';
import { EducationColumn } from '../components/ColumnDetails';
import { showNotification } from '../../helpers/forms';
import GradeSheet from "../pages/GradeSheet"
export default {
  name: 'StudentGrade',
  components: {
    PageContent,
    EducationColumn,
    GradeSheet
  },
  mixins: [ PersonnelApi, StudentApi, GradingPeriodApi, StudentGradeApi ],
  SchoolCategories, Semesters, StudentGradeStatuses,
  data() {
    return {
      isFilterVisible: true,
      isProcessing: false,
      isFinalizing: false,
      showGradeSheet: false,
      section: [],
      subject: [],
      gradingPeriods: [],
      tables: {
        sections: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Section',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'details',
              label: 'DETAILS',
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
        students: {
          isBusy: false,
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
    this.loadSectionsOfPersonnel()
  },
  methods: {
    loadSectionsOfPersonnel() {
      const { student, student: { schoolCategoryId } } = this.filters
      const { sections } = this.tables
      const { id: schoolYearId } = this.$store.state.schoolYear
      student.sectionId = null
      const params = { schoolCategoryId, schoolYearId, semesterId: student.semesterId }
      this.getSectionsOfPersonnel(params).then(({ data }) => {
        sections.items = data
      }).catch(error => {
        console.log(error)
      })
      
    },
    onSaveStudentGrade(isFinalized = false) {
      this.isProcessing = true
      const { students } = this.tables
      const { id: sectionId, schoolYearId, courseId, levelId, semesterId } = this.section
      const { id: subjectId } = this.subject 
      const { StudentGradeStatuses } = this.$options
      const data = students.items.map(student => {
        return {
          studentGradeId: student.studentGradeId,
          studentId: student.id,
          sectionId,
          schoolYearId,
          courseId,
          levelId,
          semesterId,
          subjectId,
          notes: null,
          grades: student.grades.map(grade => {
            return {
              gradingPeriodId: grade.id,
              grade: grade.pivot.grade
            }
          }),
          studentGradeStatusId: isFinalized ? StudentGradeStatuses.SUBMITTED.id : StudentGradeStatuses.PENDING.id
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
    setGradeSheet(section, subject) {
      const { subjects, ...data } = section
      this.subject = subject
      this.section = data
      this.loadStudents()
      this.loadGradingPeriods()
      this.showGradeSheet = true
    },
    loadStudents() {
      const { students } = this.tables
      const { id: sectionId, schoolYearId, courseId, levelId, semesterId } = this.section
      const { id: subjectId } = this.subject
      const params = { subjectId, sectionId, paginate: false }
      const studentGradeParams = { subjectId, sectionId, schoolYearId, courseId, levelId, semesterId, filterByUser: true, paginate: false }
      students.isBusy = true;
      this.getStudentList(params).then(({ data }) => {
        const studentData = data;
        this.getStudentGradeList(studentGradeParams).then(({ data }) => {
          students.items = studentData.map(student => {
            const studentGrade = data.find(s => s.studentId === student.id)
            const grades = this.gradingPeriods.map(g => {
              const studentGradePeriod = studentGrade ? studentGrade.grades.find(sg => sg.id === g.id) : null
              const grade = studentGradePeriod ? studentGradePeriod.pivot.grade : 0
              return {
                id: g.id,
                pivot: {
                  grade
                }
              }
            })
            const studentGradeId = studentGrade ? studentGrade.id : null
            const studentGradeStatusId = studentGrade ? studentGrade.studentGradeStatusId : null
            this.$set(student, 'studentGradeId', studentGradeId)
            this.$set(student, 'grades', grades)
            this.$set(student, 'studentGradeStatusId', studentGradeStatusId)
            return student
          })
          this.$set(studentData, 'grades', )
          students.isBusy = false;
        })
      })
    },
    loadGradingPeriods() {
      const { schoolCategoryId, semesterId } = this.section
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
.btn-submit {
  width: 200px;
  margin-right: 5px;
}
.section__subjects {
  width: 100%;
  text-align: center;
}
.subjects {
  &:hover {
    cursor: pointer;
    color: blue;
  }
}
</style>
