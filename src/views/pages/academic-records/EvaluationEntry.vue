<template>
  <div>
    <b-overlay :show="isLoading">
      <b-card>
        <h5 slot="header">
          <span>
            Student Evaluation - Update <br>
            <!-- <small></small> -->
          </span>
        </h5>
        <b-card>
          <b-row>
            <b-col md="12">
              <b-row class="mb-2">
                <b-col md=12>
                  <span class="font-weight-bold">Student Information</span>
                  <hr class="bg-light mt-1 mb-0">
                </b-col>
              </b-row>
              <b-row class="pb-1">
                <b-col md=6>
                  Student Number : <span class="font-weight-bold">{{ form.student.studentNo ? form.student.studentNo : 'Awaiting Confirmation' }}</span>
                </b-col>
                <b-col md=6>
                  Name : <span class="font-weight-bold">{{ form.student.name }}</span>
                </b-col>
              </b-row>
              <b-row class="pb-1">
                <b-col md=6>
                  Student Category :
                  <b-badge
                    :variant="form.studentCategoryId === studentCategories.NEW.id
                      ? 'success'
                      : form.studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
                    {{ form.studentCategory ? form.studentCategory.name : "" }}
                  </b-badge>
                </b-col>
                <b-col md=6>
                  Contact Number : <span class="font-weight-bold">{{ form.student.mobileNo }}</span>
                </b-col>
              </b-row>
              <b-row class="pb-1">
                <b-col md=6>
                  Email : <span class="font-weight-bold">{{ form.student.email }}</span>
                </b-col>
                <b-col md=6>
                  Address :
                  <span class="font-weight-bold">
                    {{ form.student.address ? form.student.address.currentCompleteAddress : "" }}
                  </span>
                </b-col>
              </b-row>
              <b-row class="my-2 pb-1">
                <b-col md=12>
                  <span class="font-weight-bold">Previous Educational Background</span>
                  <hr class="bg-light mt-1 mb-0">
                </b-col>
              </b-row>
              <b-row class="pb-1">
                <b-col md=3>
                  <b-form-group>
                    <label>Last School Attended</label>
                    <b-form-input
                      v-model="form.lastSchoolAttended"
                      debounce="500" />
                  </b-form-group>
                </b-col>
                <b-col md=3>
                  <b-form-group>
                    <label>Last School Level</label>
                    <b-form-select
                      v-model='form.lastSchoolLevelId'>
                      <template v-slot:first>
                        <b-form-select-option :value='null' disabled>-- School Level --</b-form-select-option>
                      </template>
                      <b-form-select-option v-for='level in options.levels.items' :key='level.id' :value='level.id'>
                        {{level.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md=3>
                  <b-form-group>
                    <label>From</label>
                    <b-form-input
                      v-model="form.lastSchoolYearFrom"
                      debounce="500" />
                  </b-form-group>
                </b-col>
                <b-col md=3>
                  <b-form-group>
                    <label>To</label>
                    <b-form-input
                      v-model="form.lastSchoolYearTo"
                      debounce="500" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="my-2 pb-1 ">
                <b-col md=12>
                  <span class="font-weight-bold">Applying for Academic Record</span>
                  <hr class="bg-light mt-1 mb-0">
                </b-col>
              </b-row>
              <b-row class="pb-1">
                <b-col md=6>
                  <b-form-group>
                    <label>Curriculum</label>
                    <b-form-select
                      v-model="form.studentCurriculumId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Curriculum --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="curriculum in options.curriculums.items"
                        :key="curriculum.id"
                        :value="curriculum.id">
                        {{curriculum.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md=3>
                  <b-form-group>
                    <label>Level</label>
                    <b-form-select
                      v-model="form.levelId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Level --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="level in options.levels.items"
                        :key="level.id"
                        :value="level.id">
                        {{level.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md=3>
                  <b-form-group>
                    <label>Status</label>
                    <b-form-select
                      v-model="form.evaluationStatusId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Status --</b-form-select-option>
                      </template>
                      <b-form-select-option
                        v-for="status in evaluationStatuses.values"
                        :key="status.id"
                        :value="status.id">
                        {{status.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row v-if="form.course">
                <b-col md="6">
                  <b-form-group>
                    <label>Course</label>
                    <b-form-select
                      @change="$event === null ? form.semesterId = null : ''"
                      v-model="form.courseId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option
                        v-for="course in options.courses.items"
                        :key="course.id"
                        :value="course.id">
                        {{`${course.description} ${course.major ? course.major : ``}`}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group>
                    <label>Semester</label>
                    <b-form-select
                      v-model="form.semesterId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
                      </template>
                      <b-form-select-option
                        v-for="semester in semesters.values"
                        :key="semester.id"
                        :value="semester.id">
                        {{semester.name}}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
        <b-card>
          <b-overlay :show="isLoadingCurriculum">
            <b-row class="mb-3 text-center">
              <b-col md=12>
                <h5>Evaluation Form</h5>
                <b-form-select
                  class="w-50"
                  v-model="form.curriculumId">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- Curriculum --</b-form-select-option>
                  </template>
                  <b-form-select-option
                    v-for="curriculum in options.curriculums.items"
                    :key="curriculum.id"
                    :value="curriculum.id">
                    {{ curriculum.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
            </b-row>
            <div v-if="form.subjects">
              <b-row v-if="form.courseId === null">
                <b-col md=12>
                  <b-row>
                    <b-col md=6>
                      <h5>{{ form.level ? form.level.name : "" }}</h5>
                    </b-col>
                    <b-col md=3 offset-md=9>
                      <b-button class="float-right mb-2" variant="outline-primary"
                        @click="onAddSubject(form.levelId)">
                        <v-icon name="plus-circle" /> ADD SUBJECT
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-table
                    class="mb-4"
                    hover outlined small responsive show-empty
                    :fields="tables.subjects.fields"
                    :items="form.subjects"
                    :busy="tables.subjects.isBusy">
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="removeSubject(row)"
                        size="sm" variant="danger">
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                    <template v-slot:head(pivot.isTaken)>
                      <b-form-checkbox
                        @input="toggleCheckAll(form.subjects, $event)"
                        v-model="isTakenAll">
                        Credited
                      </b-form-checkbox>
                    </template>
                    <template v-slot:cell(pivot.isTaken)="row">
                      <b-form-checkbox
                        :value=1
                        :unchecked-value=0
                        v-model="row.item.pivot.isTaken" />
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon
                          name="spinner"
                          spin
                          class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                    <template v-slot:cell(pivot.grade)="row">
                      <vue-autonumeric
                        v-model="row.item.pivot.grade"
                        class="form-control text-right"
                        :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
                      </vue-autonumeric>
                    </template>
                    <template v-slot:cell(pivot.notes)="row">
                      <b-form-input
                        debounce="500"
                        v-model="row.item.pivot.notes">
                      </b-form-input>
                    </template>
                    <template v-slot:cell(labs)="row">
                      {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.labs }}
                    </template>
                    <template v-slot:cell(units)="row">
                      {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.units }}
                    </template>
                    <template v-slot:custom-foot>
                      <b-tr class="font-weight-bold">
                        <b-td colspan=5 class="text-right">
                          <span class="text-danger">Total Units </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                              totalUnits(form.subjects, 'units') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                              totalUnits(form.subjects, 'labs') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                              totalUnits(form.subjects, 'totalUnits') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                        </b-td>
                      </b-tr>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col md=12>
                  <b-list-group>
                    <b-list-group-item
                      v-for="level in options.courseLevels.items"
                      :key="level.id">
                      <div v-b-toggle="'level' + level.id" class="d-flex justify-content-between align-items-center">
                        <h5>{{ level.name }}</h5>
                        <span class="when-open">
                          <v-icon name="caret-down" />
                        </span>
                        <span class="when-closed">
                          <v-icon name="caret-left" />
                        </span>
                      </div>
                      <b-collapse :id="'level' + level.id" class="mt-2" role="tabpanel">
                        <b-form-checkbox class="mb-2" @input="getSemesters(level, $event)">
                          Show All Semesters
                        </b-form-checkbox>
                        <b-card
                          v-for="semester in filterSemester(form.subjects, level)"
                          :key="semester.id">
                          <b-row>
                            <b-col md=6>
                              <h6>{{semester.name}}</h6>
                            </b-col>
                            <b-col md=6>
                              <b-button class="float-right mb-2" variant="outline-primary"
                                @click="onAddSubject(level.id, semester.id)">
                                <v-icon name="plus-circle" /> ADD SUBJECT
                              </b-button>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col md=12>
                              <b-table
                                responsive small hover outlined show-empty
                                :items="filterSubjects(form.subjects, level.id, semester.id).items"
                                :fields="tables.subjects.fields"
                                :busy="tables.subjects.isBusy">
                                <template v-slot:cell(action)="row">
                                  <b-button
                                    @click="removeSubject(row)"
                                    size="sm" variant="danger">
                                    <v-icon name="trash" />
                                  </b-button>
                                </template>
                                <template v-slot:table-busy>
                                  <div class="text-center my-2">
                                    <v-icon
                                      name="spinner"
                                      spin
                                      class="mr-2" />
                                    <strong>Loading...</strong>
                                  </div>
                                </template>
                                <template v-slot:cell(pivot.grade)="row">
                                  <vue-autonumeric
                                    v-model="row.item.pivot.grade"
                                    class="form-control text-right"
                                    :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
                                  </vue-autonumeric>
                                </template>
                                <template v-slot:cell(pivot.notes)="row">
                                  <b-form-input
                                    debounce="500"
                                    v-model="row.item.pivot.notes">
                                  </b-form-input>
                                </template>
                                <template v-slot:cell(labs)="row">
                                  {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.labs }}
                                </template>
                                <template v-slot:cell(units)="row">
                                  {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.units }}
                                </template>
                                <template v-slot:custom-foot>
                                  <b-tr class="font-weight-bold">
                                    <b-td colspan=5 class="text-right">
                                      <span class="text-danger">Total Units </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                                          totalUnits(filterSubjects(form.subjects, level.id, semester.id).items, 'units') }}
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                                          totalUnits(filterSubjects(form.subjects, level.id, semester.id).items, 'labs') }}
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{ form.schoolCategoryId === schoolCategories.VOCATIONAL.id ? 'N/A' :
                                          totalUnits(filterSubjects(form.subjects, level.id, semester.id).items, 'totalUnits') }}
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                    </b-td>
                                  </b-tr>
                                </template>
                                <template v-slot:head(pivot.isTaken)>
                                  <b-form-checkbox
                                    @input="toggleCheckAll(filterSubjects(form.subjects, level.id, semester.id).items, $event)"
                                    v-model="filterSubjects(form.subjects, level.id, semester.id).isTakenAll">
                                    Credited
                                  </b-form-checkbox>
                                </template>
                                <template v-slot:cell(pivot.isTaken)="row">
                                  <b-form-checkbox
                                    :value=1
                                    :unchecked-value=0
                                    v-model="row.item.pivot.isTaken" />
                                </template>
                              </b-table>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-collapse>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </div>
          </b-overlay>
        </b-card>
        <template v-slot:footer>
          <b-button
            class="float-right btn-save ml-2"
            @click="$emit('close')"
            variant="outline-danger">
            Close
          </b-button>
          <b-button
            :disabled="isProcessing"
            class="float-right btn-save"
            @click="$emit('save')"
            variant="outline-primary">
            <v-icon
              v-if="isProcessing"
              name="sync"
              spin
              class="mr-2" />
            Save
          </b-button>
        </template>
      </b-card>
    </b-overlay>
    <b-modal
			v-model="showModalSubjects"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title">
					Subjects
			</div>
			<b-row>
				<b-col md=12>
          <b-row class="mb-2">
            <b-col md="4">
            </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.addSubject.criteria"
                type="text"
                debounce="500"
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.addSubjects.items"
						:fields="tables.addSubjects.fields"
            :filter="filters.addSubject.criteria"
						:busy="tables.addSubjects.isBusy"
            :current-page="paginations.addSubject.page"
            :per-page="paginations.addSubject.perPage"
            @filtered="onFiltered($event, paginations.addSubject)">
						<template v-slot:cell(action)="row">
							<b-button
                @click="addSubject(row)"
                size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
						</template>
					</b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.addSubject.from}} to {{paginations.addSubject.to}} of {{paginations.addSubject.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.addSubject.page"
                :total-rows="paginations.addSubject.totalRows"
                :per-page="paginations.addSubject.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.addSubject)"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row>
			<div slot="modal-footer" class="w-100">
				<b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalSubjects=false">
          Close
        </b-button>
			</div>
		</b-modal>
  </div>
</template>
<script>
import { StudentCategories, EvaluationStatuses, Semesters, SchoolCategories } from '../../../helpers/enum'
import { LevelApi, CourseApi, CurriculumApi, SubjectApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { showNotification } from '../../../helpers/forms'
export default {
  mixins: [LevelApi, CourseApi, CurriculumApi, SubjectApi, tables],
  props: {
    form: Object,
    isProcessing: false,
    isLoading: false
  },
  data() {
    return {
      isLoadingCurriculum: false,
      isTakenAll: false,
      schoolCategories: SchoolCategories,
      evaluationStatuses: EvaluationStatuses,
      studentCategories: StudentCategories,
      semesters: Semesters,
      levelId: null,
      semesterId: null,
      showModalSubjects: false,
      options: {
        courseLevels : {
          items: []
        },
        levels: {
          items: []
        },
        curriculums: {
          items: []
        },
        courses: {
          items: []
        }
      },
      tables: {
        subjects: {
					isBusy: false,
					fields: [
            {
							key: "pivot.isTaken",
							label: "Credited",
              tdClass: "align-middle text-center",
              thClass: "text-center",
							thStyle: {width: "110px"}
            },
            {
							key: "pivot.grade",
							label: "Grade",
							tdClass: "align-middle",
							thStyle: {width: "10%", minWidth: "100px"}
            },
            {
							key: "pivot.notes",
							label: "Remarks",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "name",
							label: "Subject Code",
							tdClass: "align-middle",
							thStyle: {width: "12%"}
						},
						{
							key: "description",
							label: "Description",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
						{
							key: "units",
							label: "Lec Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "6%", minWidth: "100px"}
            },
						{
							key: "labs",
							label: "Lab Units",
							tdClass: "align-middle text-center",
							thClass: "text-right",
							thStyle: {width: "6%", minWidth: "100px"}
            },
            {
							key: "totalUnits",
							label: "Total Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
              thStyle: {width: "10%"}
            },
            {
							key: "totalUnits",
							label: "Total Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
              thStyle: {width: "10%"}
            },
            {
              key: "action",
              label: "",
              tdClass: "align-middle text-center",
              thStyle: {width: "75px"}
            }
          ],
          items: [],
        },
        addSubjects: {
					isBusy: false,
          fields: [
						{
							key: "name",
							label: "SUBJECT CODE",
							tdClass: "align-middle",
							thStyle: {width: "18%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
            {
							key: "labs",
							label: "LAB UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "10%"}
						},
						{
							key: "units",
							label: "LEC UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "10%"}
            },
            {
							key: "totalUnits",
							label: "TOTAL UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "10%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: {width: "5%"}
						}
					],
          items: [],
        },
      },
      paginations: {
				addSubject: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        addSubject: {
          criteria: null,
          departmentId: null
				}
      },
    }
  },
  created(){
    this.loadLevelList()
    this.loadCourseList()
    this.loadCurriculumList()
  },
  methods: {
    loadSubjects(){
			const { schoolCategoryId } = this.form
      const { addSubjects } = this.tables
      const { addSubject } = this.paginations
      addSubjects.isBusy = true
      let params = { paginate: false, schoolCategoryId }
      this.isLoadingCurriculum = true
			this.getSubjectList(params)
				.then(({ data }) => {
          addSubjects.items = data
          addSubject.totalRows = data.length
          this.recordDetails(addSubject)
          addSubjects.isBusy = false
          this.isLoadingCurriculum = false
				})
		},
    loadLevelList() {
      const params = { paginate: false }
      const { levels } = this.options
      this.getLevelList(params)
      .then(({ data }) => {
        levels.items = data
      })
    },
    loadCourseList() {
      const params = { paginate: false }
      const { courses } = this.options
      this.getCourseList(params)
      .then(({ data }) => {
        courses.items = data
      })
    },
    loadCurriculumList() {
      const params = { paginate: false }
      const { curriculums } = this.options
      this.getCurriculumList(params)
      .then(({ data }) => {
        curriculums.items = data
      })
    },
    loadLevelsOfCourse() {
      const { courseLevels: levels } = this.options
      let params = { paginate: false }
      this.isLoadingCurriculum = true
      this.getLevelsOfCourse(this.form.courseId, params)
        .then(({ data }) => {
          levels.items = data
          this.isLoadingCurriculum = false
        })
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event)
    },
    filterSemester(subjects, level) {
      let defaultSemesters = this.semesters.values.slice(0, 2)
      if (level.isShowAll) {
        return this.semesters.values
      } else {
        let filteredSubjects = subjects.filter(subject =>
          subject.pivot.levelId === level.id
        )
        let distinctSemesters = [...new Set(filteredSubjects.map(x => x.pivot.semesterId))]
        distinctSemesters.forEach(d => {
          if (d) {
            if (!defaultSemesters.map(x => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d))
            }
          }
        })
        return defaultSemesters
      }
    },
    filterSubjects(subjects, levelId, semesterId = null) {
			let filteredSubjects = subjects.filter(subject =>
				(subject.pivot.levelId === levelId && subject.pivot.semesterId === semesterId)
      )
      const data = { items: filteredSubjects, isTakenAll: false }
			return data
    },
    loadCurriculum(id, row) {
      const { subjects } = this.tables
      subjects.isBusy = true
      this.getCurriculum(id)
      .then(({ data }) => {
        row.item.curriculum = data
        const newSubjects = data.subjects.map(obj => ({ ...obj, pivot: { ...obj.pivot, isTaken: 0, grade: 0, notes: '' } }))
        this.$set(row.item, 'isTakenAll', false)
        this.$set(row.item, 'subjects', newSubjects)
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row)
        } else {
          row.item.isLoading = false
        }
        subjects.isBusy = false
      });
    },
    toggleCheckAll(subjects, value) {
      subjects.forEach(subject => {
        subject.pivot.isTaken = value ? 1 : 0
      })
    },
    onAddSubject(levelId, semesterId = null) {
			this.levelId = levelId
			this.semesterId = semesterId
			this.showModalSubjects = true
    },
    addSubject(row){
      const { subjects } = this.form
      const { item } = row
      // check if subject exist in the table
      const result = subjects.find(subject => subject.id === item.id)
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.')
        return
      }
			subjects.push({
        ...item,
				pivot: {
					levelId: this.levelId,
          semesterId: this.semesterId,
          isTaken: 0,
          notes: '',
          grade: 0,
				}
			})
		},
		removeSubject(row){
      const { subjects } = this.form
      const index = subjects.findIndex(i => i.id === row.item.id)
			subjects.splice(index, 1);
    },
  },
  watch: {
    'form.courseId': function (newVal, oldVal){
      if (oldVal === null || oldVal === 0) {
        this.loadLevelsOfCourse()
      }
    },
    'form.schoolCategoryId': function (newVal, oldVal){
      if (oldVal === null || oldVal === 0) {
        this.loadSubjects()
      }
    },
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0
        subjects.forEach(s => {
          units += Number(s[field])
        })
        return units
      }
    },
  }
}
</script>
<style scoped>
  .collapsed .when-open,
	.not-collapsed .when-closed {
		display: none;
	}
  .evaluation__form-details-first {
    width: 25%;
  }
  .evaluation__form-details-second {
    width: 30%;
  }
</style>