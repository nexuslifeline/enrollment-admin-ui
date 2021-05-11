<template>
  <PageContent
    :title="`Student Grade (${$store.state.schoolYear.name})`"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadStudentGrades()"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.studentGrade.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <!--<v-select
        @input="loadStudentGrades()"
        :options="$options.SchoolCategories.values"
        v-model="filters.studentGrade.schoolCategoryId"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />-->
      <vSelectCategory
        @input="onCategoryFilterChange"
        v-model="filters.studentGrade.schoolCategoryItem"
        label="name"
        placeholder="School Category"
      />
      <v-select
        v-if="isCourseVisible"
        @input="onSemesterFilterChange"
        :options="$options.Semesters.values"
        v-model="filters.studentGrade.semesterItem"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <!-- <v-select
        @input="onSectionFilterChange"
        :options="options.studentGrades.items"
        v-model="filters.studentGrade.sectionItem"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
      <v-select
        @input="onSubjectFilterChange"
        :options="options.subjects.items"
        v-model="filters.studentGrade.subjectItem"
        label="name"
        placeholder="Subject"
        class="mt-2"
      /> -->
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
            :fields="tables.studentGrades.fields"
            :busy="tables.studentGrades.isBusy"
            :items="tables.studentGrades.items"
            responsive
          >
            <!-- <template v-slot:cell(student)="data">
              <StudentColumn
                :data="{ student: data.item.student }"
                :callback="{
                  loadDetails: () => data.toggleDetails(),
                }"
              />
            </template> -->
            <template v-slot:cell(personnel)="{ item, item : { personnel, section, subject }, ...row}">
              <div><b-link @click="loadStudents({item, ...row})">{{ personnel.name }}</b-link></div>
              <div>{{ section.name }}</div>
              <div>{{ subject.name }} {{ subject.description ? ` - ${subject.description}` : '' }}</div>
            </template>
            <template v-slot:cell(details)="{item, item : { section }}">
              <div>{{ section.schoolCategory.name }}</div>
              <div>{{ section.schoolYear.name }}</div>
              <div>Date Submitted: {{ item.submittedDate }}</div>
            </template>
            <template v-slot:row-details="{ item, item: { students, gradingPeriods } }">
              <b-table
                v-if="students"
                class="c-table"
                small
                hover
                outlined
                show-empty
                :fields="tables.students.fields"
                :busy="item.isBusy"
                :items="students"
                responsive
              >
                <template v-slot:cell(name)="{ item: { student } }">
                  <StudentColumn
                    :data="{ student }"
                    :callback="{
                      loadDetails: () => null,
                    }"
                  />
                </template>
                <template v-slot:head(gradingPeriods)>
                  <div v-if="gradingPeriods" class="cell-term__header">
                    <div v-for="gradingPeriod in gradingPeriods" :key="gradingPeriod.id">
                      {{ gradingPeriod.name }}
                    </div>
                  </div>
                </template>
                <template v-slot:cell(gradingPeriods)="{ item }">
                  <div v-if="gradingPeriods" class="cell-grading-period">
                    <div class="cell-grading-period-grade" v-for="gradingPeriod in gradingPeriods" :key="gradingPeriod.id">
                      {{ item.grades.find(d => d.id === gradingPeriod.id) ? item.grades.find(d => d.id === gradingPeriod.id).pivot.grade : '' }}
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
            </template>
            <template v-slot:cell(action)="row">
              <b-dropdown
                boundary="window"
                right
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template v-slot:button-content>
                  <v-icon name="ellipsis-v" />
                </template>
                <b-dropdown-item
                  @click="loadStudents(row)"
                >
                  {{ row.detailsShowing ? 'Hide Details' : 'View Details' }}
                </b-dropdown-item>
                <b-dropdown-item
                  @click="acceptGrades(row)"
                >
                  Accept
                </b-dropdown-item>
              </b-dropdown>
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
    </template>
  </PageContent>
</template>
<script>
import PageContent from "../components/PageContainer/PageContent";
import { SchoolCategories, Semesters, StudentGradeStatuses } from "../../helpers/enum"
import { StudentApi, GradingPeriodApi, StudentGradeApi, PersonnelApi } from '../../mixins/api';
import { StudentColumn } from '../components/ColumnDetails';
import { formatNumber, showNotification } from '../../helpers/forms';
export default {
  name: 'StudentGrade',
  components: {
    PageContent,
    StudentColumn
  },
  mixins: [ PersonnelApi, StudentApi, GradingPeriodApi, StudentGradeApi ],
  SchoolCategories, Semesters, StudentGradeStatuses,
  data() {
    return {
      isFilterVisible: true,
      isProcessing: false,
      isFinalizing: false,
      tables: {
        studentGrades: {
          isBusy: false,
          fields: [
            {
              key: 'personnel',
              label: 'PERSONNEL',
              tdClass: 'align-middle',
            },
            {
              key: 'details',
              label: 'DETAILS',
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
          ],
          items: []
        },
      },
      paginations: {
        studentGrade: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        studentGrade: {
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
        studentGrades: {
          items: []
        },
        subjects: {
          items: []
        }
      }
    }
  },
  created() {
    this.loadStudentGrades()
  },
  methods: {
    loadStudentGrades() {
      const params = { paginate: true, studentGradeStatusId: StudentGradeStatuses.SUBMITTED.id }
      const { studentGrades } = this.tables
      const { studentGrade } = this.paginations
      studentGrades.isBusy = true
      this.getStudentGradePersonnelList(params)
      .then(({ data }) => {
        studentGrades.items = data.data;
        studentGrade.from = data.meta.from;
        studentGrade.to = data.meta.to;
        studentGrade.totalRows = data.meta.total;
        studentGrades.isBusy = false;
      })
    },
    onCategoryFilterChange(item) {
      const { studentGrade } = this.filters;
      studentGrade.schoolCategoryId = item?.id || 0;
      studentGrade.schoolCategoryItem = item;
      this.loadStudentGrades()
    },
    onSemesterFilterChange(item) {
      const { studentGrade } = this.filters;
      studentGrade.semesterId = item?.id || 0;
      studentGrade.semesterItem = item;
      this.loadStudentGrades()
    },
    loadStudents(row) {
      const { personnelId, subjectId, sectionId, section } = row.item
      const params = { paginate: false, personnelId, subjectId, sectionId, studentGradeStatusId: StudentGradeStatuses.SUBMITTED.id }
      this.$set(row.item, 'isBusy', true)
      this.getStudentGradeList(params)
      .then(({ data }) => {
        this.$set(row.item, 'students', data)
        const { schoolCategoryId, semesterId, schoolYearId } = section
        const params = {
          paginate: false,
          schoolCategoryId,
          semesterId,
          schoolYearId,
        };

        this.getGradingPeriodList(params).then(({ data }) => {
          this.$set(row.item, 'gradingPeriods', data)
          row.item.isBusy = false
        });
        row.toggleDetails()
      })
      // return formatNumber(grades.reduce((total, grade) => Number(total) + Number(grade.pivot.grade), 0) / grades.length)
    },
    acceptGrades(row) {
      const { personnelId, sectionId, subjectId } = row.item
      this.acceptStudentGrade(personnelId, sectionId, subjectId)
      .then(({ data }) => {
        showNotification(this, 'success', 'Grade accepted successfully.')
        this.loadStudentGrades()
      })
    }
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.studentGrade;
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
      this.loadStudentGrades();
    },
  },
};
</script>
<style lang="scss">
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
.cell-grading-period {
  display: flex;
  width: 100%;
  justify-content: space-around;
  .cell-grading-period-grade {
    margin: 0 5px;
  }
}
.cell-term__header {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

</style>
