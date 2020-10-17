<template>
  <div class="c-page-content">
    <Card title="Section and Schedule Management">
      <div v-show="!showEntry">
        <SchoolCategoryTabs
          :showAll="true"
          @loadSchoolCategoryId="filters.section.schoolCategoryId = $event, loadSections()"
          @clickAll="filters.section.schoolCategoryId = null, loadSections()"
          @click="filters.section.schoolCategoryId = $event, loadSections()"
        />
        <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="2">
                <b-button
                  v-if="isAccessible($options.SectionAndSchedulePermissions.ADD.id)"
                  variant="primary"
                  @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD SECTION
                </b-button>
              </b-col>
              <b-col md="3">
                <b-form-select
                  @input="loadSections()"
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
                      @input="loadSections()"
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
                      @input="loadSections()"
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
                      @input="loadSections()"
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
                  debounce="500"
                  @update="loadSections()"
                  type="text"
                  placeholder="Search" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end add button and search -->
        <!-- table -->
        <b-row>
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
            >
                          <!-- :current-page="paginations.section.page"
              :per-page="paginations.section.perPage"
              :filter="filters.section.criteria"
              @filtered="onFiltered($event, paginations.section)" -->
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
                  no-caret>
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    @click="loadSchedules(row)">
                    {{ !row.detailsShowing ? 'View' : 'Hide' }} Schedule
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.SectionAndSchedulePermissions.EDIT.id)"
                    @click="setUpdate(row, 0)"
                    :disabled="showEntry" >
                    Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.SectionAndSchedulePermissions.EDIT.id)"
                    @click="setUpdate(row, 1)"
                    :disabled="showEntry">
                    Setup Schedule
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.SectionAndSchedulePermissions.DELETE.id)"
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
              <template v-slot:row-details="{ item }">
                <b-overlay :show="item.isLoading" rounded="sm">
                  <b-card>
                    <h5 class="text-center">
                      {{item.name}}<br>
                      <span>{{item.level.name}} - {{item.schoolYear.name}}</span><br>
                      <span v-if="item.course">{{item.course.name}} - {{ item.semester.name}}</span>
                    </h5><br>
                    <ScheduleViewer
                      v-if="item.schedules"
                      :selectedItems="item.schedules"
                      :showExtendedTime="false"
                    />
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
              <b-col md=6>
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.section.page"
                  :total-rows="paginations.section.totalRows"
                  :per-page="paginations.section.perPage"
                  size="sm"
                  align="end"
                  @input="loadSections()"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </Card>

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
                    <!-- <b-row>
                      <b-col md=8>
                      </b-col>
                      <b-col md=4>
                        <b-button
                          variant="outline-primary"
                          class="float-right"
                          @click="setAddSchedule(null)">
                          <v-icon name="plus-circle" /> ADD SCHEDULE
                        </b-button>
                      </b-col>
                    </b-row> -->
                    <!-- <Schedule
                      class="mt-2"
                      :isEntry="true"
                      :isShown="showEntry"
                      :details="scheduleDetails"
                      :subjects="options.subjects.items"
                      :scheduleItems="forms.section.fields.schedules"
                      :scheduleStates="forms.section.states.schedules"/> -->
                      <h5 class="pt-2 text-center">
                        {{forms.section.fields.name}}<br>
                        <span>{{getOptionName(forms.section.fields.levelId, 'levels')}} - {{getOptionName(forms.section.fields.schoolYearId, 'schoolYears')}}</span><br>
                        <span v-if="forms.section.fields.courseId">{{getOptionName(forms.section.fields.courseId, 'courses')}} -
                          <span v-if="forms.section.fields.semesterId">{{ options.semesters.getEnum(forms.section.fields.semesterId).name}}</span>
                        </span>
                      </h5><br>
                      <ScheduleViewer
                        v-if="showEntry"
                        @onMultipleCellSelect="setAddSchedule"
                        @onCellItemDblClick="setAddSchedule"
                        :selectedItems="forms.section.fields.schedules"
                        :showExtendedTime="false"
                        :options="[{
                          label: 'Edit Schedule',
                          callback: onEditSchedule
                        },
                        {
                          label: 'Delete Schedule',
                          callback: onDeleteSchedule
                        }]"
                      />
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
    <!-- Modal Add Schedule -->
    <b-modal
			v-model="showModalSchedule"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
				Schedule - {{ selectedSchedule ? 'Edit' : 'Add' }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.schedule.isLoading" rounded="sm">
        <b-row>
          <b-col md="12">
            <b-form-group >
              <label class="required">Day</label>
              <v-select
                v-model="forms.schedule.fields.dayIds"
                :reduce="item => item.id"
                multiple
                label="name"
                :options="$options.Days.values" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group>
              <label class="required">Start</label>
              <b-form-input
                type="time"
                v-model="forms.schedule.fields.start" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group >
              <label class="required">End</label>
              <b-form-input
                type="time"
                v-model="forms.schedule.fields.end" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">Subject</label>
              <b-form-select
                v-model="forms.schedule.fields.subjectId" >
                <template v-slot:first>
                  <b-form-select-option :value="null">-- Select Subject --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="subject in options.subjects.items"
                  :key="subject.id"
                  :value="subject.id">
                  {{ subject.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">Instructor</label>
              <b-form-select
                v-model="forms.schedule.fields.personnelId" >
                <template v-slot:first>
                  <b-form-select-option :value="null">-- Select Instructor --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="instructor in options.instructors.items"
                  :key="instructor.id"
                  :value="instructor.id">
                  {{ instructor.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <b-form-checkbox
                v-model="forms.schedule.fields.isLab"
                :value="1"
                :unchecked-value="0">
                Laboratory
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label>Remarks</label>
              <b-form-textarea
                v-model="forms.schedule.fields.remarks"
                rows=2 />
            </b-form-group>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- end modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalSchedule=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.schedule.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="addSchedule()">
          <v-icon
            v-if="forms.schedule.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
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
const scheduleFields= {
  dayIds: null,
  start: null,
  end: null,
  subjectId: null,
  personnelId: null,
  isLab: null,
  remarks: null
}

import { SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, CourseApi, CurriculumApi, PersonnelApi } from "../../mixins/api";
import { validate, reset, clearFields, showNotification, } from "../../helpers/forms";
import { copyValue } from "../../helpers/extractor";
import { SchoolCategories, Semesters, SectionAndSchedulePermissions, Days, UserGroups } from '../../helpers/enum'
import Tables from '../../helpers/tables'
import SchoolYear from '../../mixins/api/SchoolYear';
import Schedule from '../components/Schedule'
import ScheduleViewer from '../components/ScheduleViewer'
import SchoolCategoryTabs from '../components/SchoolCategoryTabs'
import Access from '../../mixins/utils/Access';
import Card from '../components/Card'

export default {
  name: "ClassSection",
  mixins: [SectionApi, SchoolYearApi, SchoolCategoryApi, LevelApi, CourseApi, Tables, PersonnelApi, Access],
  components: {
    Schedule,
    ScheduleViewer,
    SchoolCategoryTabs,
    Card
  },
  SectionAndSchedulePermissions,
  Days,
  UserGroups,
  data() {
    return {
      entryTabIndex: 0,
      showModalEntry: false,
      showModalSchedule: false,
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
        schedule: {
          isProcessing: false,
          isLoading: false,
          fields: { ...scheduleFields },
        }
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
            // {
            //   key: "description",
            //   label: "DESCRIPTION",
            //   tdClass: "align-middle",
            //   thStyle: { width: "auto" },
            // },
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
          filteredItems: []
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
        instructors: {
          items: []
        },
        semesters: Semesters,
        schoolCategories: SchoolCategories
      },
      scheduleDetails: '',
      selectedSchedule: null
    };
  },
  created() {
    // this.loadSections();
    this.loadSchoolYears();
    this.loadCourses();
    this.loadLevels();
    this.loadPersonnel();
  },
  methods: {
    loadSections() {
      const { sections } = this.tables;
      const { section, section: { perPage, page } } = this.paginations
      sections.isBusy = true;
      const { schoolCategoryId, courseId, levelId, semesterId, schoolYearId, criteria } = this.filters.section
      let params = {
        paginate: true,
        perPage,
        page,
        schoolCategoryId,
        courseId,
        levelId,
        semesterId,
        schoolYearId,
        criteria
      };
      this.getSectionList(params)
      .then(({ data }) => {
        sections.items = data.data
        section.from = data.meta.from
        section.to = data.meta.to
        section.totalRows = data.meta.total
        sections.isBusy = false
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
        return {
          dayId: Number(s.dayIndex) + 1,
          subjectId: s.subjectId,
          personnelId: s.personnelId,
          startTime: s.start,
          endTime: s.end,
          isLab: s.isLab,
          remarks: s.remarks
        }
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
      fields.schedules = []
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
        fields.schedules = data.schedules.map(s => {
          const { subjects, instructors } = this.options
          return {
            dayIndex: s.dayId - 1,
            start: s.startTime,
            end: s.endTime,
            subjectId: s.subjectId,
            personnelId: s.personnelId,
            isLab: s.isLab,
            remarks: s.remarks,
            data: {
              id: s.subjectId,
              title: `${s.subject?.name}`,
              description: `${s.personnel?.name} | ${data.name} ${s.isLab ? '| Laboratory' : ''} ${s.remarks ? `| ${s.remarks}` : ''}`
            }
          }
        })
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
          const schedules = data.schedules.map(s => {
            const { subjects, instructors } = this.options
            return {
              dayIndex: s.dayId - 1,
              start: s.startTime,
              end: s.endTime,
              subjectId: s.subjectId,
              personnelId: s.personnelId,
              isLab: s.isLab,
              remarks: s.remarks,
              data: {
                id: s.subjectId,
                title: `${s.subject?.name}`,
                description: `${s.personnel?.name} | ${data.name} ${s.isLab ? '| Laboratory' : ''} ${s.remarks ? `| ${s.remarks}` : ''}`
              }
            }
          })
          this.$set(row.item, 'schedules', schedules)
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
    },
    // loadSections() {
    //   const { sections } = this.tables
    //   const { section: filter } = this.filters
    //   const { section: paginate } = this.paginations
    //   sections.filteredItems = sections.items.filter(s =>
    //     (filter.schoolCategoryId ? s.schoolCategoryId === filter.schoolCategoryId : true) &&
    //     (filter.courseId ? s.courseId === filter.courseId : true) &&
    //     (filter.levelId ? s.levelId === filter.levelId : true) &&
    //     (filter.semesterId ? s.semesterId === filter.semesterId : true) &&
    //     (filter.schoolYearId ? s.schoolYearId === filter.schoolYearId : true)
    //   )
    //   paginate.totalRows = sections.filteredItems.length;
    //   this.recordDetails(paginate);
    // },
    addSchedule() {
      const { schedule: { fields }, section: { fields: { schedules, name } } } = this.forms
      const { subjects, instructors } = this.options
      const subject = subjects.items.find(subject => subject.id === fields.subjectId)
      const instructor = instructors.items.find(instructor => instructor.id === fields.personnelId)

      // check if there is overlapping schedule
      if (!this.checkSchedule()) {
        return
      }

      if (this.selectedSchedule) {
        this.onDeleteSchedule(this.selectedSchedule)
        this.selectedSchedule = null
      }

      fields.dayIds.forEach(day => {
        schedules.push({
          dayIndex: Number(day) - 1,
          start: fields.start,
          end: fields.end,
          subjectId: fields.subjectId,
          personnelId: fields.personnelId,
          isLab: fields.isLab,
          remarks: fields.remarks,
          data: {
            id: fields.subjectId,
            title: `${subject?.name}`,
            description: `${instructor?.name} | ${name} ${fields.isLab ? '| Laboratory' : ''} ${fields.remarks ? `| ${fields.remarks}` : ''}`
          }
        })
      })
      this.showModalSchedule = false
    },
    computeTimeByHour(time, num) {
      const newTime = time.split(':')
      const condition = num < 0 ? [0, 23] : [23, 0]
      const hour = String(Number(newTime[0]) === condition[0] ? condition[1] : Number(newTime[0]) + Number(num))
      const minute = String(newTime[1])
      return `${hour.length === 1 ? `0${hour}` : hour}:${minute.length === 1 ? `0${minute}` : minute}`
    },
    loadPersonnel() {
      const params = { paginate: false, userGroupId: this.$options.UserGroups.INSTRUCTOR.id }
      const { instructors } = this.options
      this.getPersonnelList(params)
      .then(({ data }) => {
        instructors.items = data
      })
    },
    setAddSchedule(dayTime) {
      // console.log(dayTime)
      const { fields } = this.forms.schedule
      clearFields(fields)
      fields.subjectId = null
      fields.personnelId = null
      if (dayTime) {
        let startTime = null
        let endTime = null

        if (dayTime.startTime && dayTime.endTime) {
          startTime = dayTime.startTime.length === 4 ? `0${dayTime.startTime}` : dayTime.startTime
          endTime = dayTime.endTime.length === 4 ? `0${dayTime.endTime}` : dayTime.endTime
        } else {
          startTime = dayTime.time.length === 4 ? `0${dayTime.time}` : dayTime.time
          endTime = this.computeTimeByHour(startTime, 1)
        }

        fields.start = startTime
        fields.end = endTime
        fields.dayIds = [Number(dayTime.dayIndex) + 1]
      }
      this.showModalSchedule = true
    },
    onEditSchedule(item) {
      const { fields } = this.forms.schedule
      fields.dayIds = [Number(item.dayIndex) + 1]
      fields.start = item.start
      fields.end = item.end
      fields.subjectId = item.subjectId
      fields.personnelId = item.personnelId
      fields.isLab = item.isLab
      fields.remarks = item.remarks
      this.selectedSchedule = item
      this.showModalSchedule = true
    },
    onDeleteSchedule(item) {
      const { schedules } = this.forms.section.fields
        const index = schedules.findIndex(s =>
          s.dayIndex === item.dayIndex &&
          s.start === item.start &&
          s.end === item.end &&
          s.subjectId === item.subjectId &&
          s.personnelId === item.personnelId &&
          s.isLab === item.isLab &&
          s.remarks === item.remarks
        )
        schedules.splice(index, 1)
    },
    getOptionName(id, optionName) {
      const option = this.options[optionName].items.find(i => i.id === id)
      return option?.name
    },
    formatTo4digit24hr(time){
      const newTime = time.split(':')
      return `${newTime[0]}:${newTime[1]}`
    },
    checkSchedule() {
      const { schedule: { fields }, section: { fields: { schedules } } } = this.forms
      const sched = schedules.find(s =>
        fields.dayIds.includes(Number(s.dayIndex) + 1) &&
        (
          (this.formatTo4digit24hr(s.start) < this.formatTo4digit24hr(fields.start) &&
          this.formatTo4digit24hr(s.end) > this.formatTo4digit24hr(fields.start)) ||
          (this.formatTo4digit24hr(s.start) < this.formatTo4digit24hr(fields.end) &&
          this.formatTo4digit24hr(s.end) > this.formatTo4digit24hr(fields.end))
        )
      )
      if (sched) {
        showNotification(this, 'danger', 'There is a conflict in your schedule, please remove or update the schedules.')
        return false
      }

      if (!fields.subjectId) {
        showNotification(this, 'danger', 'Please select a Subject before continuing.')
        return false
      }

      if (!fields.personnelId) {
        showNotification(this, 'danger', 'Please select an Instructor before continuing.')
        return false
      }

      return true
    }
  },
};
</script>
