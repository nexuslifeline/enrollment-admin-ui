<template>
  <div class="c-app">
    <b-row v-show="!showEntry">
      <b-col md="12">
        <b-card>
          <b-card-body>
            <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md="12">
                <b-row>
                  <b-col md="8">
                    <b-button variant="outline-primary" @click="setCreate()">
                      <v-icon name="plus-circle" /> ADD NEW SECTION
                    </b-button>
                  </b-col>
                  <b-col md="4">
                    <b-form-input
                      v-model="filters.section.criteria"
                      type="text"
                      placeholder="Search"
                    >
                    </b-form-input>
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
                  :items="tables.sections.items"
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
                      <b-dropdown-item @click="setUpdate(row)">
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click="
                          (forms.section.fields.id = row.item.id),
                            (showModalConfirmation = true)
                        "
                      >
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
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
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <div v-show="showEntry">
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
              <b-tabs>
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
                    :isShown="showEntry"
                    :details="scheduleDetails"
                    :subjects="options.subjects.items"
                    :scheduleItems="forms.section.fields.schedules"/>
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
  schedules: []
};

import { SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, CurriculumApi } from "../../mixins/api";
import { validate, reset, clearFields, showNotification, } from "../../helpers/forms";
import { copyValue } from "../../helpers/extractor";
import { SchoolCategories, Semesters } from '../../helpers/enum'
import Tables from '../../helpers/tables'
import SchoolYear from '../../mixins/api/SchoolYear';
import Schedule from '../components/Schedule'
export default {
  name: "ClassSection",
  mixins: [SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, Tables],
  components: {
    Schedule
  },
  data() {
    return {
      showModalEntry: false,
      showEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      Semesters: Semesters,
      SchoolCategories: SchoolCategories,
      forms: {
        section: {
          isProcessing: false,
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
        },
      },
      options: {
        levels: {
          isLoading: false,
          items: []
        },
        courses: {
          isLoading: false,
          items: []
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
        section: { fields },
      } = this.forms;
      const { sections } = this.tables;


      section.isProcessing = true;
      reset(section);
      if (this.entryMode == "Add") {
        this.addSection(fields)
          .then(({ data }) => {
            this.addRow(sections, this.paginations.section, data);
            section.isProcessing = false;
            showNotification(
              this,
              "success",
              "Section created successfully."
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            section.isProcessing = false;
            validate(section, errors);
          });
      } else {
        this.updateSection(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(sections, data);
            section.isProcessing = false;
            showNotification(
              this,
              "success",
              "Section updated successfully."
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            section.isProcessing = false;
            validate(section, errors);
          });
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
    setUpdate(row) {
      const {
        section,
        section: { fields },
      } = this.forms;

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
        this.showEntry = true;
      })
    },
    setCreate() {
      const { section } = this.forms;
      reset(section);
      clearFields(section.fields);
      section.fields.schoolCategoryId = null
      section.fields.schoolYearId = null
      section.fields.levelId = null
      section.fields.courseId = null
      section.fields.semesterId = null
      section.fields.schedules = []
      this.entryMode = "Add";
      this.showEntry = true
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
    }
  },
};
</script>
