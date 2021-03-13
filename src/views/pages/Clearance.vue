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
          class="clearance_drop-down">
          <!-- <b-dropdown-item
            @click="showBatchEntry=false">
            Create Clearance
          </b-dropdown-item> -->
          <b-dropdown-item @click="setBatchCreateClearance()">
            Batch Create Clearance
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
    <template v-slot:content>
      <b-row v-if="!showEntry && !showBatchEntry">
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
            <template v-slot:cell(education)="data">
              <EducationColumn :data="data.item.academicRecord" />
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(action)="{ item: { id } }">
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
                  @click="setUpdateClearance(id)"
                >
                  <v-icon name="pen" /> Edit
                </b-dropdown-item>
                <b-dropdown-item
                  @click="
                    (forms.clearance.fields.id = id), (showModalConfirmation = true)
                  "
                >
                  <v-icon name="trash" /> Delete
                </b-dropdown-item>
              </b-dropdown>
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
      <Card v-if="showBatchEntry" title="Clearance - Batch Create">
        <b-row class="mb-3">
          <b-col md="6">
            <v-select
              @input="loadFormSchoolCategoryInfo(), loadFormSections()"
              append-to-body
              :options="$options.SchoolCategories.values"
              v-model="forms.batchClearance.fields.schoolCategoryId"
              :reduce="item => item.id"
              label="name"
              placeholder="School Category"
              class="mt-2"
            />
            <v-select
              @input="loadFormSections()"
              append-to-body
              :options="options.schoolYears.items"
              v-model="forms.batchClearance.fields.schoolYearId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="School Year"
              class="mt-2"
            />
            <v-select
              v-if="isFormCourseVisible"
              @input="loadLevelsOfCourse($event, true), loadFormSections()"
              append-to-body
              :options="options.courses.formItems"
              v-model="forms.batchClearance.fields.courseId"
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
              v-if="isFormCourseVisible"
              @input="loadFormSections()"
              append-to-body
              :options="$options.Semesters.values"
              v-model="forms.batchClearance.fields.semesterId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="Semester"
              class="mt-2"
            />
             <b-form-checkbox v-model="forms.batchClearance.fields.includeInstructor" class="mt-2">Include Instructors?</b-form-checkbox>
          </b-col>
          <b-col md="6">
            <v-select
              @input="loadFormSections()"
              append-to-body
              :options="options.levels.formItems"
              v-model="forms.batchClearance.fields.levelId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="Level"
              class="mt-2"
            />
            <v-select
              append-to-body
              :options="options.sections.formItems"
              v-model="forms.batchClearance.fields.sectionId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="Section"
              class="mt-2"
            />
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="4">
            <h5 class="pt-2">SIGNATORIES</h5>
          </b-col>
          <b-col md="4">
          </b-col>
          <b-col md="4">
            <b-button
              @click="addSignatory()"
              variant="outline-primary"
              class="float-right"
            >
              <v-icon name="plus-circle" /> New Signatory
            </b-button>
          </b-col>
        </b-row>
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.signatories.fields"
          :items="forms.batchClearance.fields.signatories"
          :busy="tables.signatories.isBusy"
        >
          <template v-slot:cell(personnel)="data">
            <v-select
              append-to-body
              :options="options.personnels.items"
              v-model="data.item.personnelId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="Personnel"
            />
          </template>
          <template v-slot:cell(pivot.description)="data">
            <b-form-input 
              debounce="500"
              v-model="data.item.pivot.description" />
          </template>
          <template v-slot:cell(action)="{ index }">
            <b-button 
              @click="removeSignatory(index)"
              size="sm"
              variant="outline-danger">
              <v-icon name="trash" />
            </b-button>
          </template>
        </b-table>
        <hr />
      <b-row>
        <b-col md="12">
          <b-button
            class="float-right btn-save ml-2"
            @click="showBatchEntry = false"
            variant="outline-danger"
          >
            Close
          </b-button>
          <b-button
            :disabled="forms.batchClearance.isProcessing"
            class="float-right btn-save"
            @click="onBatchCreateClearance()"
            variant="outline-primary"
          >
            <v-icon
              v-if="forms.batchClearance.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Save
          </b-button>
        </b-col>
      </b-row>
      </Card>
      <Card v-if="showEntry" title="Clearance - Edit">
        <b-row class="mb-3">
          <b-col md="6">
            <b-form-group>
              <label>Student No.</label>
              <b-form-input
                disabled
                v-model="forms.clearance.fields.student.studentNo"
              />
            </b-form-group>
            <b-form-group>
              <label>Student Name</label>
              <b-form-input
                disabled
                v-model="forms.clearance.fields.student.name"
              />
            </b-form-group>
            <b-form-group>
              <label>Level</label>
              <b-form-input
                disabled
                v-model="forms.clearance.fields.academicRecord.level.name"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group v-if="forms.clearance.fields.academicRecord.course">
              <label>Course</label>
              <b-form-input
                disabled
                :value="`${forms.clearance.fields.academicRecord.course.description} ${forms.clearance.fields.academicRecord.course.major ? forms.clearance.fields.academicRecord.course.major : ''}`"
              />
            </b-form-group>
            <b-form-group v-if="forms.clearance.fields.academicRecord.course">
              <label>Semester</label>
              <b-form-input
                disabled
                v-model="forms.clearance.fields.academicRecord.semester.name"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="4">
            <h5 class="pt-2">SIGNATORIES</h5>
          </b-col>
          <b-col md="4">
          </b-col>
          <b-col md="4">
            <b-button
              @click="addSignatory(false)"
              variant="outline-primary"
              class="float-right"
            >
              <v-icon name="plus-circle" /> New Signatory
            </b-button>
          </b-col>
        </b-row>
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.signatories.fields"
          :items="forms.clearance.fields.signatories"
          :busy="tables.signatories.isBusy"
        >
          <template v-slot:cell(personnel)="data">
            <v-select
              append-to-body
              :options="options.personnels.items"
              v-model="data.item.pivot.personnelId"
              :reduce="(item) => item.id"
              label="name"
              placeholder="Personnel"
            />
          </template>
          <template v-slot:cell(pivot.description)="data">
            <b-form-input 
              debounce="500"
              v-model="data.item.pivot.description" />
          </template>
          <template v-slot:cell(action)="{ index }">
            <b-button 
              @click="removeSignatory(index, false)"
              size="sm"
              variant="outline-danger">
              <v-icon name="trash" />
            </b-button>
          </template>
        </b-table>
        <hr />
      <b-row>
        <b-col md="12">
          <b-button
            class="float-right btn-save ml-2"
            @click="showEntry = false"
            variant="outline-danger"
          >
            Close
          </b-button>
          <b-button
            :disabled="forms.batchClearance.isProcessing"
            class="float-right btn-save"
            @click="onClearanceEntry()"
            variant="outline-primary"
          >
            <v-icon
              v-if="forms.batchClearance.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Save
          </b-button>
        </b-col>
      </b-row>
      </Card>
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Clearance
        </div>
        Are you sure you want to delete this Clearance?
        <div slot="modal-footer">
          <b-button
            :disabled="forms.clearance.isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onDeleteClearance()"
          >
            <v-icon
              v-if="forms.clearance.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Yes
          </b-button>
          <b-button
            variant="outline-danger"
            class="btn-close"
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
    </template>
  </PageContent>
</template>
<script>
const batchClearanceFields = {
  schoolCategoryId: null,
  schoolYearId: null,
  levelId: null,
  courseId: null,
  semesterId: null,
  sectionId: null,
  includeInstructor: null,
  signatories: null
}

const clearanceFields = {
  id: null,
  studentId: null,
  academicRecordId: null,
  student: null,
  academicRecord: {
    schoolYear: null,
    course: null,
    schoolCategory: null,
    semester: null,
    section: null
  },
  signatories: null
}
import { SchoolCategories, Semesters } from '../../helpers/enum'
import { StudentColumn, EducationColumn } from '../components/ColumnDetails';
import Access from '../../mixins/utils/Access'
import PageContent from "../components/PageContainer/PageContent";
import { CourseApi, LevelApi, PersonnelApi, SchoolYearApi, SectionApi, StudentClearanceApi } from '../../mixins/api';
import Card from '../components/Card';
import { clearFields, reset, showNotification, validate } from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
// import SelectPaginated from '../components/SelectPaginated';
export default {
  SchoolCategories,
  Semesters,
  mixins: [Access, SchoolYearApi, CourseApi, LevelApi, SectionApi, StudentClearanceApi, PersonnelApi],
  components: {
    PageContent,
    StudentColumn,
    EducationColumn,
    Card,
    // SelectPaginated
  },
  data() {
    return { 
      isFilterVisible: true,
      showEntry: false,
      showBatchEntry: false,
      showModalConfirmation: false,
      forms: {
        batchClearance: {
          isProcessing: false,
          fields: {...batchClearanceFields},
          states: {...batchClearanceFields},
          errors: {...batchClearanceFields},
        },
        clearance: {
          isProcessing: false,
          fields: {...clearanceFields},
          states: {...clearanceFields},
          errors: {...clearanceFields},
        }
      },
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
              key: 'education',
              label: 'Education',
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
        signatories: {
          isBusy: false,
          fields: [
            {
              key: 'personnel',
              label: 'Personnel',
              tdClass: 'align-middle',
              thStyle: { width: '30%' }
            },
            {
              key: 'pivot.description',
              label: 'Description',
              tdClass: 'align-middle'
            },
            {
              key: 'action',
              label: '',
              thStyle: { width: '75px' },
              tdClass: 'align-middle text-center'
            }
          ],
          items: []
        }
      },
      options: {
        schoolYears: {
          items: [],
        },
        levels: {
          items: [],
          formItems: []
        },
        courses: {
          items: [],
          formItems: []
        },
        sections: {
          items: [],
          formItems: []
        },
        personnels: {
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
    this.loadPersonnels()
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
    loadPersonnels() {
      const params = { paginate: false }
      const { personnels } = this.options
      this.getPersonnelList(params).then(({ data }) => {
        personnels.items = data
      }).catch(error => {
        console.log(error)
      })

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
    loadFormSchoolCategoryInfo() {
      const { fields, fields: { schoolCategoryId } } = this.forms.batchClearance
      fields.courseId = null
      fields.semesterId = null
      if (this.isFormCourseVisible) {
        this.loadCourses(schoolCategoryId, true)
        return
      }

      this.loadLevels(schoolCategoryId, true)
    },
    loadCourses(schoolCategoryId = null, isFromForm = false) {
      const params = { paginate: false, schoolCategoryId }
      const { courses } = this.options
      this.getCourseList(params).then(({ data }) => {
        if (isFromForm) {
          courses.formItems = data
          return
        }
        courses.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadLevels(schoolCategoryId, isFromForm = false) {
      const params = { paginate: false, schoolCategoryId }
      const { levels } = this.options
      this.getLevelList(params).then(({ data }) => {
        if (isFromForm) {
          levels.formItems = data
          return
        }
        levels.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    loadLevelsOfCourse(courseId, isFromForm = false) {
      const params = { paginate: false }
      const { levels } = this.options
      this.getLevelsOfCourse(courseId, params).then(({ data }) => {
        if (isFromForm) {
          levels.formItems = data
          return
        }
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
    loadFormSections() {
      const { schoolCategoryId, schoolYearId, courseId, semesterId, levelId } = this.forms.batchClearance.fields
      const params = { paginate: false, schoolCategoryId, schoolYearId, courseId, semesterId, levelId }
      const { sections } = this.options
      this.getSectionList(params).then(({ data }) => {
        sections.formItems = data
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
    },
    setBatchCreateClearance() {
      this.entryMode = 'Add';
      const {
        batchClearance,
        batchClearance: { fields },
      } = this.forms;
      reset(batchClearance);
      clearFields(fields);
      fields.signatories = [];
      this.showBatchEntry = true;
    },
    addSignatory(isBatch = true) {
      if (isBatch) {
        const { fields } = this.forms.batchClearance
        fields.signatories.push({
          personnelId: null,
          pivot: {
            description: null
          }
        })
        return
      }

      const { fields } = this.forms.clearance
      fields.signatories.push({
        pivot: {
          personnelId: null,
          description: null
        }
      })
    },
    removeSignatory(index, isBatch = true) {
      if (isBatch) {
        const { fields } = this.forms.batchClearance
        fields.signatories.splice(index, 1);
        return
      }
      const { fields } = this.forms.clearance
      fields.signatories.splice(index, 1);
    },
    onBatchCreateClearance() {
      const { batchClearance, batchClearance: { fields: { signatories, ...fields } } } = this.forms
      const signatoriesData = signatories.map(s => {
        return {
          personnelId: s.personnelId,
          description: s.pivot.description
        }
      })

      const data = {
        ...fields,
        signatories: signatoriesData
      }
      batchClearance.isProcessing = true;
      this.batchCreateStudentClearance(data)
      .then(({ data }) => {
        showNotification(this, 'success', 'Student clearances created successfully.')
        batchClearance.isProcessing = false;
        this.showBatchEntry = false
        this.loadClearances()
      }).catch((error) => {
        const errors = error.response.data.errors;
        batchClearance.isProcessing = false;
        showNotification(this, 'danger', 'Please select section before proceeding.')
        // validate(batchClearance, errors);
      });
    },
    setUpdateClearance(id) {
      const { clearance } = this.forms
      this.getStudentClearance(id)
      .then(({ data }) => {
        copyValue(data, clearance.fields)
        this.showEntry = true
      })
    },
    onClearanceEntry() {
      const { clearance, clearance: { fields: { signatories, student, academicRecord, ...fields } } } = this.forms
      const signatoriesData = signatories.map(s => {
        return {
          personnelId: s.pivot.personnelId,
          description: s.pivot.description,
          subjectId: s.pivot.subjectId
        }
      })

      const data = {
        ...fields,
        signatories: signatoriesData
      }
      clearance.isProcessing = true;
      this.updateStudentClearance(data, fields.id)
      .then(({ data }) => {
        showNotification(this, 'success', 'Student clearance updated successfully.')
        this.showEntry = false
        this.loadClearances()
        clearance.isProcessing = false;
      }).catch((error) => {
        const errors = error.response.data.errors;
        console.log(errors)
        // batchClearance.isProcessing = false;
        // showNotification(this, 'danger', 'Please select section before proceeding.')
        // validate(batchClearance, errors);
      });
    },
    onDeleteClearance() {
      const {
        clearance,
        clearance: {
          fields: { id },
        },
      } = this.forms;
      clearance.isProcessing = true;
      this.deleteStudentClearance(id).then(({ data }) => {
        clearance.isProcessing = false;
        this.loadClearances();
        showNotification(this, 'success', 'Clearance deleted successfully.');
        this.showModalConfirmation = false;
      });
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
    isFormCourseVisible() {
      const { schoolCategoryId } = this.forms.batchClearance.fields;
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
  .clearance_drop-down {
    height: 24px;

    .btn-outline-primary {
      display: flex;
      align-items: center;
    }
  }
</style>