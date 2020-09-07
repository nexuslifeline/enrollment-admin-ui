<template>
  <div class="c-app">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">Section and Schedule Management</h4>
      </div>
      <SchoolCategoryTabs
        :showAll="true"
        :schoolCategoryId="null"
        @clickAll="filters.section.schoolCategoryId = null"
        @click="filters.section.schoolCategoryId = $event"
      />
      <div v-show="!showEntry">
        <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="2">
                <b-button variant="primary" @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD SECTION
                </b-button>
              </b-col>
              <b-col md="3">
                <b-form-select
                  v-model="filters.section.courseId"
                  class="float-right">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                  </template>
                  <b-form-select-option :value="null">None</b-form-select-option>
                  <b-form-select-option
                    v-for="course in options.courses.fixItems"
                    :key="course.id"
                    :value="course.id">
                    {{course.description}} {{course.major ? `(${course.major})` : ''}}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col md=5>
                <b-row>
                  <b-col md="4">
                    <b-form-select
                      v-model="filters.section.semesterId"
                      class="float-right">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="semester in options.semesters.values"
                        :key="semester.id"
                        :value="semester.id">
                        {{semester.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-select
                      v-model="filters.section.levelId"
                      class="float-right">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Level --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="level in options.levels.fixItems"
                        :key="level.id"
                        :value="level.id">
                        {{level.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-col>
                  <b-col md="4">
                    <b-form-select
                      v-model="filters.section.schoolYearId"
                      class="float-right">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- School Year --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="schoolYear in options.schoolYears.items"
                        :key="schoolYear.id"
                        :value="schoolYear.id">
                        {{schoolYear.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="2">
                <b-form-input
                  v-model="filters.section.criteria"
                  type="text"
                  placeholder="Search"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end add button and search -->
        <!-- table -->
        <b-row>
          <b-col md="12">
            <b-table
              small
              hover
              outlined
              show-empty
              :fields="tables.sections.fields"
              :busy="tables.sections.isBusy"
              :items="filteredSection"
              :current-page="paginations.section.page"
              :per-page="paginations.section.perPage"
              :filter="filters.section.criteria"
              @filtered="onFiltered($event, paginations.section)"
            >
              <!-- :filter="filters.section.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                >
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item @click="loadSchedules(row)">
                    {{ !row.detailsShowing ? 'View' : 'Hide' }} Schedule
                  </b-dropdown-item>
                  <b-dropdown-item @click="setUpdate(row, 0)"
                    :disabled="showEntry" >
                    Edit
                  </b-dropdown-item>
                  <b-dropdown-item @click="setUpdate(row, 1)"
                    :disabled="showEntry">
                    Setup Schedule
                  </b-dropdown-item>
                  <b-dropdown-item
                    @click="
                      (forms.section.fields.id = row.item.id),
                        (showModalConfirmation = true)
                    "
                    :disabled="showModalConfirmation"
                  >
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:row-details="data">
                <b-overlay :show="data.item.isLoading" rounded="sm">
                  <b-card>
                    <Schedule
                      :isEntry="false"
                      class="mt-2"
                      :isShown="true"
                      :subjects="options.subjects.items"
                      :scheduleItems="data.item.schedules"/>
                  </b-card>
                </b-overlay>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.section.from }} to
                {{ paginations.section.to }} of
                {{ paginations.section.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  v-model="paginations.section.page"
                  :total-rows="paginations.section.totalRows"
                  :per-page="paginations.section.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.section)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </div>

    <div v-show="showEntry">
      <b-overlay :show="forms.section.isLoading" rounded="sm">
        <b-row>
          <b-col md=12>
            <b-card>
              <h5 slot="header">
                <span>
                  Section - {{entryMode}} <br>
                  <small>Details about the section and its schedule.</small>
                </span>
              </h5>
              <b-card-body>
                <b-tabs v-model="entryTabIndex">
                  <b-tab title="Details">
                    <b-row class="mt-4">
                      <b-col md=6>
                        <b-form-group>
                          <label class="required">Name</label>
                          <b-form-input
                            ref="name"
                            @input="loadSectionDetails()"
                            v-model="forms.section.fields.name"
                            :state="forms.section.states.name"
                          />
                          <b-form-invalid-feedback>
                            {{ forms.section.errors.name }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group>
                          <label class="required">Description</label>
                          <b-form-textarea
                            ref="description"
                            v-model="forms.section.fields.description"
                            :state="forms.section.states.description"
                          />
                          <b-form-invalid-feedback>
                            {{ forms.section.errors.description }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group >
                          <label class="required">School Year</label>
                          <b-form-select
                            @change="loadSectionDetails()"
                            v-model="forms.section.fields.schoolYearId"
                            :state="forms.section.states.schoolYearId"
                            >
                            <template v-slot:first>
                              <b-form-select-option :value="null" disabled>-- School Year --</b-form-select-option>
                            </template>
                            <b-form-select-option
                              v-for="schoolYear in options.schoolYears.items"
                              :key="schoolYear.id"
                              :value="schoolYear.id">
                              {{schoolYear.name}}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{forms.section.errors.schoolYearId}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md=6>
                        <b-form-group >
                          <label class="required">School Category</label>
                          <b-form-select
                            v-model="forms.section.fields.schoolCategoryId"
                            :state="forms.section.states.schoolCategoryId"
                            @change="loadLevelsOfSchoolCategoryList()"
                            >
                            <template v-slot:first>
                              <b-form-select-option :value="null" disabled>-- School Category --</b-form-select-option>
                            </template>
                            <b-form-select-option
                              v-for="schoolCategory in options.schoolCategories.values"
                              :key="schoolCategory.id"
                              :value="schoolCategory.id">
                              {{ schoolCategory.name }}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{forms.section.errors.schoolCategoryId}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group >
                          <label class="required">
                            Level
                            <v-icon
                              v-if="options.levels.isLoading"
                              name="spinner"
                              spin />
                          </label>
                          <b-form-select
                            v-model="forms.section.fields.levelId"
                            :state="forms.section.states.levelId"
                            @change="loadCoursesOfLevelList(), loadSubjectsOfCurriculum()"
                            >
                            <template v-slot:first>
                              <b-form-select-option :value="null" disabled>-- Level --</b-form-select-option>
                            </template>
                            <b-form-select-option
                              v-for="level in options.levels.items"
                              :key="level.id"
                              :value="level.id">
                              {{level.name}}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{ forms.section.errors.levelId }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group >
                          <label>
                            Course
                            <v-icon
                              v-if="options.courses.isLoading"
                              name="spinner"
                              spin />
                          </label>
                          <b-form-select
                            v-model="forms.section.fields.courseId"
                            :state="forms.section.states.courseId"
                            :disabled="
                                forms.section.fields.schoolCategoryId === null ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.PRE_SCHOOL.id ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.PRIMARY_SCHOOL.id ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.JUNIOR_HIGH_SCHOOL.id"
                            @change="loadSubjectsOfCurriculum()"
                            >
                            <template v-slot:first>
                              <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                            </template>
                            <b-form-select-option
                              v-for="course in options.courses.items"
                              :key="course.id"
                              :value="course.id">
                              {{course.description}} {{course.major ? `(${course.major})` : ''}}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{ forms.section.errors.courseId }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group >
                          <label>Semester</label>
                          <b-form-select
                            v-model="forms.section.fields.semesterId"
                            :state="forms.section.states.semesterId"
                            :disabled="
                                forms.section.fields.schoolCategoryId === null ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.PRE_SCHOOL.id ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.PRIMARY_SCHOOL.id ||
                                forms.section.fields.schoolCategoryId === options.schoolCategories.JUNIOR_HIGH_SCHOOL.id"
                            @change="loadSubjectsOfCurriculum()"
                            >
                            <template v-slot:first>
                              <b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
                            </template>
                            <b-form-select-option
                              v-for="semester in options.semesters.values"
                              :key="semester.id"
                              :value="semester.id">
                              {{ semester.name }}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{ forms.section.errors.semesterId }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Schedule">
                    <Schedule
                      class="mt-2"
                      :isEntry="true"
                      :isShown="showEntry"
                      :details="scheduleDetails"
                      :subjects="options.subjects.items"
                      :scheduleItems="forms.section.fields.schedules"
                      :scheduleStates="forms.section.states.schedules"/>
                  </b-tab>
                </b-tabs>
              </b-card-body>
              <template v-slot:footer>
                <b-button
                  class="float-right btn-save ml-2"
                  @click="showEntry = false"
                  variant="outline-danger">
                  Close
                </b-button>
                <b-button
                  :disabled="forms.section.isProcessing"
                  class="float-right btn-save"
                  @click="onSectionEntry()"
                  variant="outline-primary">
                  <v-icon
                    v-if="forms.section.isProcessing"
                    name="sync"
                    spin
                    class="mr-2" />
                  Save
                </b-button>
              </template>
            </b-card>
          </b-col>
        </b-row>
      </b-overlay>
    </div>
    <!-- Modal Entry -->
    <!-- <b-modal
      v-model="showModalEntry"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    > -->
      <!-- <div slot="modal-title"> -->
        <!-- modal title -->
        <!-- Sections - {{ entryMode }} -->
      <!-- </div> -->
      <!-- modal title -->
      <!-- modal body -->
      <!-- <b-row>
        <b-col md="12">

        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">



        </b-col>
      </b-row> -->

      <!-- end modal body -->
      <!-- <div slot="modal-footer" class="w-100"> -->
        <!-- modal footer buttons -->
        <!-- <b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry = false"
        >
          Close
        </b-button>
        <b-button
          :disabled="forms.section.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onSectionEntry()"
        >
          <v-icon
            v-if="forms.section.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Save
        </b-button>
      </div> -->
      <!-- modal footer buttons -->
    <!-- </b-modal> -->
    <!-- End Modal Entry -->

    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Delete Section
      </div>
      Are you sure you want to delete this Section ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.section.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSectionDelete()"
        >
          <v-icon
            v-if="forms.section.isProcessing"
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
    <!-- End Modal Confirmation -->
  </div>
</template>
<script>
const sectionFields = {
  id: null,
  name: null,
  description: null,
  schoolYearId: null,
  schoolCategoryId: null,
  levelId: null,
  courseId: null,
  semesterId: null,
  schedules: null
};

import { SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, CourseApi, CurriculumApi } from "../../mixins/api";
import { validate, reset, clearFields, showNotification, } from "../../helpers/forms";
import { copyValue } from "../../helpers/extractor";
import { SchoolCategories, Semesters } from '../../helpers/enum'
import Tables from '../../helpers/tables'
import SchoolYear from '../../mixins/api/SchoolYear';
import Schedule from '../components/Schedule'
import SchoolCategoryTabs from '../components/SchoolCategoryTabs'
export default {
  name: "ClassSection",
  mixins: [SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, CourseApi, Tables],
  components: {
    Schedule,
    SchoolCategoryTabs
  },
  data() {
    return {
      entryTabIndex: 0,
      showModalEntry: false,
      showEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      Semesters: Semesters,
      SchoolCategories: SchoolCategories,
      forms: {
        section: {
          isProcessing: false,
          isLoading: false,
          fields: { ...sectionFields },
          states: { ...sectionFields },
          errors: { ...sectionFields },
        },
      },
      tables: {
        sections: {
          isBusy: false,
          fields: [
            {
              key: "name",
              label: "Name",
              tdClass: "align-middle",
              thStyle: { width: "20%" },
            },
            {
              key: "description",
              label: "DESCRIPTION",
              tdClass: "align-middle",
              thStyle: { width: "auto" },
            },
            {
              key: "schoolYear.name",
              label: "School Year",
              tdClass: "align-middle",
              thStyle: { width: "auto" },
            },
            {
              key: "schoolCategory.name",
              label: "Category",
              tdClass: "align-middle",
              thStyle: { width: "auto" },
            },
            {
              key: "level.name",
              label: "Level",
              tdClass: "align-middle",
              thStyle: { width: "auto" },
            },
            {
              key: "course.description",
              label: "Course",
              tdClass: "align-middle"
            },
            {
              key: "semester.name",
              label: "Semester",
              tdClass: "align-middle",
              thStyle: { width: "auto" },
            },
            {
              key: "action",
              label: "",
              tdClass: "align-middle",
              thStyle: { width: "40px" },
            },
          ],
          items: [],
        },
      },
      paginations: {
        section: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        section: {
          criteria: null,
          schoolCategoryId: null,
          levelId: null,
          courseId: null,
          schoolYearId: null,
          semesterId: null
        },
      },
      options: {
        levels: {
          isLoading: false,
          items: [],
          fixItems: []
        },
        courses: {
          isLoading: false,
          items: [],
          fixItems: []
        },
        schoolYears: {
          items: []
        },
        subjects: {
          items: []
        },
        semesters: Semesters,
        schoolCategories: SchoolCategories
      },
      scheduleDetails: ''
    };
  },
  created() {
    this.loadSections();
    this.loadSchoolYears();
    this.loadCourses();
    this.loadLevels();
  },
  methods: {
    loadSections() {
      const { sections } = this.tables;
      const { section } = this.paginations;
      sections.isBusy = true;

      let params = { paginate: false };
      this.getSectionList(params).then(({ data }) => {
        sections.items = data;
        section.totalRows = data.length;
        this.recordDetails(section);
        sections.isBusy = false;
      });
    },
    loadSchoolYears() {
      const { schoolYears } = this.options;
      let params = { paginate: false };
      this.getSchoolYearList(params).then(({ data }) => {
        schoolYears.items = data;
      });
    },
    loadLevelsOfSchoolCategoryList(){
      this.forms.section.fields.semesterId = null
      this.forms.section.fields.courseId = null
      this.forms.section.fields.levelId = null
      const { levels, courses } = this.options
			courses.items = []
      let params = { paginate: false }
      levels.isLoading = true
			this.getLevelsOfSchoolCategoryList(this.forms.section.fields.schoolCategoryId, params)
				.then(({ data }) => {
          levels.isLoading = false
          levels.items = data
				})
				.catch(error => {
					console.log(error)
        })

    },
    loadCoursesOfLevelList(){
      const { schoolCategoryId, levelId } = this.forms.section.fields
			let params = { paginate: false, schoolCategoryId }
      const { courses } = this.options
      courses.isLoading = true
			this.getCoursesOfLevelList(levelId, params)
				.then(({ data }) => {
          courses.isLoading = false
          courses.items = data
        })
		},
    onSectionEntry() {
      const {
        section,
        section: { fields: { schedules, ...fields }, },
      } = this.forms;
      const { sections } = this.tables;

      const newSchedules = schedules.map(s => {
        const{ personnel, subject, ...schedule } = s
        return schedule
      })

      // console.log(newSchedules)
      // return

      const data = {
        ...fields,
        schedules: newSchedules
      }

      section.isProcessing = true;
      reset(section);
      if (this.entryMode == "Add") {
        this.addSection(data)
          .then(({ data }) => {
            this.addRow(sections, this.paginations.section, data);
            section.isProcessing = false;
            showNotification(
              this,
              "success",
              "Section created successfully."
            );
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            section.isProcessing = false;
            this.validateSchedules(section, errors)
            validate(section, errors);
          });
      } else {
        this.updateSection(data, fields.id)
          .then(({ data }) => {
            this.updateRow(sections, data);
            section.isProcessing = false;
            showNotification(
              this,
              "success",
              "Section updated successfully."
            );
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            section.isProcessing = false;
            this.validateSchedules(section, errors)
            validate(section, errors);
          });
      }
    },
    validateSchedules(section, errors) {
      // NOTE to be refactor
      section.states.schedules = {}
      const errorKeys = Object.keys(errors);
        if (errorKeys && errorKeys.length > 0) {
          this.entryTabIndex = errorKeys.includes('name') ||
            errorKeys.includes('description') ||
              errorKeys.includes('school_year_id') ||
                errorKeys.includes('school_category_id') ||
                  errorKeys.includes('level_id') ||
                    errorKeys.includes('course_id') ||
                      errorKeys.includes('semester_id')
            ? 0
            : 1;
        }
      const schedules = errorKeys.filter(e => e.includes('schedules'))
      if(schedules) {
        schedules.forEach(schedule => {
          let index = schedule.substring(10, 11)
          let key = schedule.substring(11).charAt(0).toLowerCase() + schedule.substring(12)
          this.$set(section.states.schedules, `${key}${index}`, false)
        })
      }
    },
    onSectionDelete() {
      const {
        section,
        section: {
          fields: { id },
        },
      } = this.forms;
      const { sections } = this.tables;
      section.isProcessing = true;
      this.deleteSection(id).then(({ data }) => {
        this.deleteRow(sections, this.paginations.section, id);
        section.isProcessing = false;
        showNotification(this, "success", "Section deleted successfully.");
        this.showModalConfirmation = false;
      });
    },
    setUpdate(row, tabIndex) {
      this.showEntry = true;
      this.entryTabIndex = tabIndex
      const {
        section,
        section: { fields },
      } = this.forms;
      section.isLoading = true
      this.getSection(row.item.id)
      .then( async ({ data }) => {
        fields.id = data.id
        fields.name = data.name
        fields.description = data.description
        fields.schoolYearId = data.schoolYearId
        fields.schoolCategoryId = data.schoolCategoryId
        await this.loadLevelsOfSchoolCategoryList()
        fields.levelId = data.levelId
        await this.loadCoursesOfLevelList()
        fields.courseId = data.courseId
        fields.semesterId = data.semesterId
        await this.loadSubjectsOfCurriculum()
        fields.schedules = data.schedules
        reset(section);
        this.entryMode = "Edit";
        section.isLoading = false
      })
    },
    setCreate() {
      this.entryTabIndex = 0
      const { section } = this.forms;
      this.showEntry = true
      section.isLoading = true
      reset(section);
      clearFields(section.fields);
      section.fields.schoolCategoryId = null
      section.fields.schoolYearId = null
      section.fields.levelId = null
      section.fields.courseId = null
      section.fields.semesterId = null
      section.fields.schedules = []
      this.entryMode = "Add";
      section.isLoading = false
    },
    loadSubjectsOfCurriculum() {
      const { fields, fields: { levelId, courseId, semesterId } } = this.forms.section
      const { subjects } = this.options
      const params = {
        paginate: false,
        levelId,
        courseId,
        semesterId
      }
      if (fields.schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id || fields.schoolCategoryId === SchoolCategories.COLLEGE.id) {
        if (courseId === null || semesterId === null) {
          return
        }
      }

      this.getSubjectsOfLevelList(levelId, params)
      .then(({ data }) => {
        subjects.items = data
      })

      // this.loadSectionDetails()
    },
    loadSectionDetails() {
      let details = ''
      const { fields } = this.forms.section
      const { schoolYears, levels, courses, semesters } = this.options
      if (fields.schoolYearId !== null && fields.levelId !== null && (fields.name !== null && fields.name !== '')) {
        const level = levels.items.find(l => l.id === fields.levelId)
        const schoolYear = schoolYears.items.find(y => y.id === fields.schoolYearId)
        if (fields.schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id || fields.schoolCategoryId === SchoolCategories.COLLEGE.id) {
          if (fields.courseId !== null && fields.semesterId !== null) {
            const course = courses.items.find(c => c.id === fields.courseId)
            const semester = semesters.values.find(s => s.id === fields.semesterId)

            details = `${fields.name} - ${level.name}/${course.description} ${course.major ? `(${course.major})` : ''} - ${schoolYear.name}/${semester.name}`
          }
        }
        else {
          details = `${fields.name} - ${level.name}/${schoolYear.name}`
        }
      }
      this.scheduleDetails = details
    },
    loadSchedules(row) {
      this.$set(row.item, 'isLoading', true)
      if (!row.detailsShowing) {
        this.getSection(row.item.id)
        .then(({ data }) => {
          this.$set(row.item, 'schedules', data.schedules)
          row.item.isLoading = false
        })
      }
      row.toggleDetails()
    },
    loadCourses() {
      const params = { paginate: false }
      const { courses } = this.options
      this.getCourseList(params)
      .then(({ data }) => {
        courses.fixItems = data
      })
    },
    loadLevels() {
      const params = { paginate: false }
      const { levels } = this.options
      this.getLevelList(params)
      .then(({ data }) => {
        levels.fixItems = data
      })
    }
  },
  computed: {
    filteredSection() {
      const { sections } = this.tables
      const { section: filter } = this.filters
      const { section: paginate } = this.paginations
      const filteredSection = sections.items.filter(s =>
        (filter.schoolCategoryId ? s.schoolCategoryId === filter.schoolCategoryId : true) &&
        (filter.courseId ? s.courseId === filter.courseId : true) &&
        (filter.levelId ? s.levelId === filter.levelId : true) &&
        (filter.semesterId ? s.semesterId === filter.semesterId : true) &&
        (filter.schoolYearId ? s.schoolYearId === filter.schoolYearId : true)
      )
      paginate.totalRows = filteredSection.length;
      this.recordDetails(paginate);
      return filteredSection
    }
  }
};
</script>
