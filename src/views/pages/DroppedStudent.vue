<template>
  <PageContent
    title="Dropped Students"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadDroppedStudents"
    :filterVisible="isFilterVisible"
    @create="setAddDropped()">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.droppedStudent.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <SelectCategory
        @input="onCategoryFilterChange"
        v-model="filters.droppedStudent.schoolCategoryItem"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        @input="onSemesterFilterChange"
        :options="$options.Semesters.values"
        v-model="filters.droppedStudent.semesterItem"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
      <v-select
        @input="onSectionFilterChange"
        :options="options.sections.items"
        v-model="filters.droppedStudent.sectionItem"
        label="name"
        placeholder="Section"
        class="mt-2"
      />
      <v-select
        @input="onSubjectFilterChange($event), loadStudents()"
        :options="sectionSubjects"
        v-model="filters.droppedStudent.subjectItem"
        label="name"
        placeholder="Subject"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div>
        <b-row v-if="filters.droppedStudent.subjectId">
          <b-col md="12">
            <b-table
              class="c-table"
              small
              hover
              outlined
              show-empty
              :fields="tables.droppedStudents.fields"
              :busy="tables.droppedStudents.isBusy"
              :items="tables.droppedStudents.items"
              :current-page="paginations.droppedStudent.page"
              :per-page="paginations.droppedStudent.perPage"
              :filter="filters.droppedStudent.criteria"
              @filtered="onFiltered($event, paginations.droppedStudent)"
            >
              <!-- :filter="filters.droppedStudent.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(name)="data">
                <StudentColumn
                  :data="{ student: data.item }"
                  :callback="{
                    loadDetails: () => null,
                  }"
                />
              </template>
              <template v-slot:cell(education)="data">
                <EducationColumn
                  :data="data.item.latestAcademicRecord"
                  :callback="{
                    loadDetails: () => null,
                  }"
                />
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.droppedStudent.from }} to
                {{ paginations.droppedStudent.to }} of
                {{ paginations.droppedStudent.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.droppedStudent.page"
                  :total-rows="paginations.droppedStudent.totalRows"
                  :per-page="paginations.droppedStudent.perPage"
                  size="sm"
                  align="end"
                  @input="paginate(paginations.droppedStudent)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <div class="no-subject" v-else>
          Please select a subject.
        </div>
        <!-- end table -->
      </div>
      <b-modal
        v-model="showModalAddDropped"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Dropped Student - Add
        </div>
        <!-- modal title -->
        <!-- modal body -->
        <b-row>
          <b-col md="12">
            <SelectCategory
              @input="onCategoryFilterChange"
              v-model="filters.droppedStudent.schoolCategoryItem"
              label="name"
              placeholder="School Category"
            />
            <v-select
              v-if="isCourseVisible"
              @input="onSemesterFilterChange"
              :options="$options.Semesters.values"
              v-model="filters.droppedStudent.semesterItem"
              label="name"
              placeholder="Semester"
              class="mt-2"
            />
            <v-select
              @input="onSectionFilterChange"
              :options="options.sections.items"
              v-model="filters.droppedStudent.sectionItem"
              label="name"
              placeholder="Section"
              class="mt-2"
            />
            <v-select
              @input="onSubjectFilterChange($event), loadStudents()"
              :options="sectionSubjects"
              v-model="filters.droppedStudent.subjectItem"
              label="name"
              placeholder="Subject"
              class="mt-2"
            />
             <v-select
              @input="onStudentChange"
              :options="options.students.items"
              v-model="forms.droppedStudent.fields.studentId"
              label="name"
              placeholder="Student"
              class="mt-2 student-select"
            >
              <template v-slot:selected-option="data">
                <div class="select-option">
                  <div class="select-option__avatar">
                    <b-avatar v-if="data.name" variant="info" :src="getPhoto(data)" size="20px" />
                  </div>
                  <div class="d-flex w-100">
                    <span class="ml-2">{{ data.name }}</span>
                  </div>
                </div>
              </template>
              <template v-slot:option="data">
                <div class="select-option">
                  <div class="select-option__avatar">
                    <b-avatar variant="info" :src="getPhoto(data)"></b-avatar>
                  </div>
                  <div class="select-option__info">
                    <span>{{
                      data.studentNo ? data.studentNo : 'Awaiting Confirmation'
                    }}</span>
                    <span>{{ data.name }}</span>
                    <span>{{ data.email }}</span>
                  </div>
                </div>
              </template>
             </v-select>
          </b-col>
        </b-row>
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button
            variant="outline-danger"
            class="float-right btn-close ml-2"
            @click="showModalAddDropped = false"
          >
            Close
          </b-button>
          <b-button
            :disabled="forms.droppedStudent.isProcessing"
            variant="outline-primary"
            class="float-right btn-save"
            @click="onDroppedStudent()"
          >
            <v-icon
              v-if="forms.droppedStudent.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Add
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
    </template>
  </PageContent>
</template>
<script>

import {
  validate,
  reset,
  clearFields,
  showNotification,
} from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import Tables from '../../helpers/tables';
import Card from '../components/Card';
import PageContent from "../components/PageContainer/PageContent";
import Access from '../../mixins/utils/Access';
import { SchoolCategories, Semesters } from '../../helpers/enum'
import { AcademicRecordApi, PersonnelApi, StudentApi } from '../../mixins/api';
import { StudentColumn, EducationColumn } from '../components/ColumnDetails';

export default {
  name: 'droppedStudent',
  mixins: [ Tables, Access, PersonnelApi, StudentApi, AcademicRecordApi ],
  components: {
    Card,
    PageContent,
    StudentColumn,
    EducationColumn
  },
  SchoolCategories, Semesters,
  data() {
    return {
      isFilterVisible: true,
      entryMode: '',
      showModalAddDropped: false,
      forms: {
        droppedStudent: {
          isProcessing: false,
          fields: {
            studentId: null,
            academicRecordId: null
          }
        }
      }, 
      options: {
        subjects: {
          items: []
        },
        sections: {
          items: []
        },
        students: {
          items: []
        }
      },
      tables: {
        droppedStudents: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
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
      paginations: {
        droppedStudent: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        droppedStudent: {
          criteria: null,
          schoolCategoryItem: null,
          schoolCategoryId: null,
          semesterItem: null,
          semesterId: null,
          sectionItem: null,
          sectionId: null,
          subjectItem: null,
          subjectId: null
        },
      },
    };
  },
  created() {
    this.loadSectionsOfPersonnel();
  },
  methods: {
    loadSectionsOfPersonnel() {
      const { droppedStudent, droppedStudent: { schoolCategoryId, semesterId } } = this.filters
      const { sections } = this.options
      const { id: schoolYearId } = this.$store.state.schoolYear
      droppedStudent.sectionItem = null
      const params = { schoolCategoryId, schoolYearId, semesterId: semesterId }
      this.getSectionsOfPersonnel(params).then(({ data }) => {
        sections.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    onCategoryFilterChange(item) {
      const { droppedStudent } = this.filters;
      droppedStudent.schoolCategoryId = item?.id || 0;
      droppedStudent.schoolCategoryItem = item;
      this.loadSectionsOfPersonnel()
    },
    onSemesterFilterChange(item) {
      const { droppedStudent } = this.filters;
      droppedStudent.semesterId = item?.id || 0;
      droppedStudent.semesterItem = item;
      this.loadSectionsOfPersonnel()
    },
    onSectionFilterChange(item) {
      const { droppedStudent } = this.filters;
      droppedStudent.sectionId = item?.id || 0;
      droppedStudent.sectionItem = item;
      droppedStudent.subjectId = null
      droppedStudent.subjectItem = null
    },
    onSubjectFilterChange(item) {
      const { droppedStudent } = this.filters;
      droppedStudent.subjectId = item?.id || 0;
      droppedStudent.subjectItem = item;
      this.loadDroppedStudents()
    },
    loadDroppedStudents() {
      const { droppedStudents } = this.tables
      const { sectionId, subjectId, criteria } = this.filters.droppedStudent
      const {
        droppedStudent,
        droppedStudent: { perPage, page },
      } = this.paginations;
      const params = { subjectId, sectionId, withTheSubject: true, isDropped: 1, paginate: true, perPage, page, criteria, }
      droppedStudents.isBusy = true;
      this.getStudentList(params).then(({ data }) => {
        droppedStudents.items = data.data;
        droppedStudent.from = data.meta.from;
        droppedStudent.to = data.meta.to;
        droppedStudent.totalRows = data.meta.total;
        droppedStudents.isBusy = false;
      })
    },
    loadStudents() {
      const { students } = this.options
      const { sectionId, subjectId } = this.filters.droppedStudent
      const params = { subjectId, sectionId, withTheSubject: true, isDropped: 0, paginate: false, }
      this.getStudentList(params).then(({ data }) => {
        students.items = data;
      })
    },
    setAddDropped() {
      const { fields } = this.forms.droppedStudent
      fields.studentId = null
      this.showModalAddDropped = true
    },
    onStudentChange(item) {
      const { fields } = this.forms.droppedStudent
      fields.academicRecordId = item.latestAcademicRecord?.id
    },
    onDroppedStudent() {
      const { academicRecordId } = this.forms.droppedStudent.fields
      const { subjectId } = this.filters.droppedStudent
      const data = { isDropped: 1 }
      this.updateAcademicRecordSubject(academicRecordId, subjectId, data).then(({ data }) => {
        showNotification(this, 'success', 'Student dropped successfully')
        this.loadDroppedStudents()
        this.showModalAddDropped = false
        console.log(data)
      })
    },
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
  },
  computed: {
    sectionSubjects() {
      const { sectionItem } = this.filters.droppedStudent;
      return sectionItem?.subjects
    },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.droppedStudent;
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
<style scoped lang="scss">
@import '../../assets/scss/_shared.scss';
  .no-subject {
    width: 100;
    margin-top: 25px;
    text-align: center;
    font-size: 15pt;
  }
  .student-select {
      width: 100%;

      @include for-size(phone-only) {
        width: 100%;
      }
      .select-option {
        display: flex;
        justify-content: center;
        align-items: center;

        .select-option__avatar {
          width: auto;
        }

        .select-option__info {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
        }
      }
    }
</style>
