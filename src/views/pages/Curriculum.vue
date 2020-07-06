<template>
	<div>
		<div v-show="!showEntry">
			<b-row>
				<b-col md=12>
					<b-card>
						<b-card-body>
							<!-- <b-row>
								<b-col md=12>
									<b-tabs pills>
										<b-tab 
											v-for="schoolCategory in options.schoolCategories.values" 
											:key="schoolCategory.id" 
											:disabled="userGroupId ? false : schoolCategoryId !== schoolCategory.id"
											:active="schoolCategoryId === schoolCategory.id"
											:title="schoolCategory.name"/>
									</b-tabs>
								</b-col>
							</b-row>
							<hr> -->
							<!-- add button and search -->
							<b-row class="mb-3">
								<b-col md=12>
									<b-row>
										<b-col md=6 class="bottom-space">
											<b-button variant="outline-primary" 
												@click="setCreate()">
												<v-icon name="plus-circle" /> ADD NEW CURRICULUM
											</b-button>
										</b-col>
										<b-col md=3>
										</b-col>
										<b-col md=3>
											<b-form-input
												v-model="filters.curriculum.criteria"
												type="text" 
												placeholder="Search">
											</b-form-input>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<!-- end add button and search -->
							<!-- table -->
							<b-row >
								<b-col md=12>
									<b-table
										small hover outlined show-empty responsive
										:fields="tables.curriculums.fields"
										:busy="tables.curriculums.isBusy"
										:items.sync="tables.curriculums.items" 
										:current-page="paginations.curriculum.page"
										:per-page="paginations.curriculum.perPage"
										:filter="filters.curriculum.criteria"
										@filtered="onFiltered($event, paginations.curriculum)">
										<template v-slot:table-busy>
											<div class="text-center my-2">
												<v-icon 
													name="spinner" 
													spin
													class="mr-2" />
												<strong>Loading...</strong>
											</div>
										</template>
										<template v-slot:cell(action)="row">
											<b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
												<template v-slot:button-content>
													<v-icon name="ellipsis-v" />
												</template>
                        <b-dropdown-item
                          @click="setViewDetails(row)"
													>
													View Details
												</b-dropdown-item>
												<b-dropdown-item
                          @click="setUpdate(row.item.id)"
													>
													Edit
												</b-dropdown-item>
												<b-dropdown-item 
                          @click="forms.curriculum.fields.id = row.item.id, showModalConfirmation = true">
													Delete
												</b-dropdown-item>
											</b-dropdown>
										</template>
                    <template v-slot:row-details="data">
                      <b-card>
                        <b-row>
                          <b-col md=12>
                            <h6>{{ data.item.course ? `Course : ${data.item.course.name}` : `Level : ${data.item.level.name}` }}</h6>
                            <h6>Curriculum Name : {{data.item.name}}</h6>
                          </b-col>
                        </b-row>
                      </b-card>
                    </template>
									</b-table>
									<b-row>
										<b-col md=6>
											Showing {{ paginations.curriculum.from }} to {{ paginations.curriculum.to }} of {{ paginations.curriculum.totalRows }} records.
											</b-col>
										<b-col md=6>
											<b-pagination
												v-model="paginations.curriculum.page"
												:total-rows="paginations.curriculum.totalRows"
												:per-page="paginations.curriculum.perPage"
												size="sm"
												align="end"
												@input="recordDetails(paginations.curriculum)" />
											</b-col>
										</b-row>
								</b-col>
							</b-row>
							<!-- end table -->
						</b-card-body>
					</b-card>
				</b-col>
			</b-row>
		</div>
		<div v-show="showEntry">	
			<b-row>
				<b-col md=12>
					<b-card>
						<b-card-header>
							<h4>Curriculum - {{entryMode}}</h4>
							<p>Details about the subjects comprising the Course or Program.</p>
						</b-card-header>
						<b-card-body>
							<b-row>
								<b-col md=6>
									<b-form-group>
										<label class="required">Name</label>
										<b-form-input
											v-model="forms.curriculum.fields.name"
											:state="forms.curriculum.states.name">
										</b-form-input>
										<b-form-invalid-feedback>
											{{ forms.curriculum.errors.name }}
										</b-form-invalid-feedback>
									</b-form-group>
									<b-form-group>
										<label>Major</label>
										<b-form-input
											v-model="forms.curriculum.fields.major"
											:state="forms.curriculum.states.major">
										</b-form-input>
										<b-form-invalid-feedback>
											{{ forms.curriculum.errors.major }}
										</b-form-invalid-feedback>
									</b-form-group>
                  <b-form-group>
										<label>Notes</label>
										<b-form-textarea
                      cols=3
											v-model="forms.curriculum.fields.notes"
											:state="forms.curriculum.states.notes">
										</b-form-textarea>
										<b-form-invalid-feedback>
											{{ forms.curriculum.errors.notes }}
										</b-form-invalid-feedback>
									</b-form-group>
								</b-col>
								<b-col md=6>
									<b-row>
										<b-col md=6>
											<b-form-group>
												<label class="required">School Category</label>
												<b-form-select
													@change="loadLevelsOfSchoolCategoryList()" 
													v-model="forms.curriculum.fields.schoolCategoryId"
													:state="forms.curriculum.states.schoolCategoryId">
													<template v-slot:first>
														<b-form-select-option :value="null" disabled>-- School Category --</b-form-select-option>
													</template>
													<b-form-select-option 
														v-for="category in options.schoolCategories.values" 
														:key="category.id" 
														:value="category.id">
														{{category.name}}
													</b-form-select-option>
												</b-form-select>
												<b-form-invalid-feedback>
													{{ forms.curriculum.errors.schoolCategoryId }}
												</b-form-invalid-feedback>
											</b-form-group>
											<b-form-group>
												<label>
                          Course 
                          <v-icon
                            v-if="options.courses.isLoading"
                            name="spinner"
                            spin />
                        </label>
												<b-form-select
                          :disabled="(!checkSchoolCategory() || forms.curriculum.fields.schoolCategoryId == null) 
                            || options.courses.isLoading"
													@change="loadLevelsOfCourse()"
													v-model="forms.curriculum.fields.courseId"
													:state="forms.curriculum.states.courseId">
													<template v-slot:first>
														<b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
													</template>
													<b-form-select-option 
														v-for="course in options.courses.items" 
														:key="course.id" 
														:value="course.id">
														{{course.name}}
													</b-form-select-option>
												</b-form-select>
												<b-form-invalid-feedback>
													{{ forms.curriculum.errors.courseId }}
												</b-form-invalid-feedback>
											</b-form-group>
										</b-col>
										<b-col md=6>
											<b-form-group>
												<label class="required">Effective Year</label>
												<b-form-input
                          type="number"
													v-model="forms.curriculum.fields.effectiveYear"
													:state="forms.curriculum.states.effectiveYear">
												</b-form-input>
												<b-form-invalid-feedback>
													{{ forms.curriculum.errors.effectiveYear }}
												</b-form-invalid-feedback>
											</b-form-group>
                      <b-form-group>
												<label>
                          Level
                          <v-icon
                            v-if="options.levels.isLoading"
                            name="spinner"
                            spin />
                        </label>
												<b-form-select
                          :disabled="(checkSchoolCategory() || forms.curriculum.fields.schoolCategoryId == null)
                            || options.levels.isLoading"
													@change="getSelectedLevel()"
													v-model="forms.curriculum.fields.levelId">
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
													{{ forms.curriculum.errors.courseId }}
												</b-form-invalid-feedback>
											</b-form-group>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<b-overlay :show="isLoading" rounded="sm">
								<b-row>
									<b-col md=12>
										<b-list-group>				
											<b-list-group-item										
												v-for="level in levels" 
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
													<div v-if="checkSchoolCategory() && forms.curriculum.fields.courseId !== null">
                            <b-form-checkbox class="mb-2" @input="getSemesters(level, $event)">
                              Show All Semesters
                            </b-form-checkbox>
														<b-card
															v-for="semester in filterSemester(level)"
															:key="semester.id">
															<b-row>
																<b-col md=9>
																	<h6>{{semester.name}}</h6>
																</b-col>
																<b-col md=3>
																	<b-button class="float-right mb-2" variant="outline-primary"
																		@click="onAddSubject(level.id, semester.id)">
																		<v-icon name="plus-circle" /> ADD NEW SUBJECT
																	</b-button>
																</b-col>
															</b-row>
															<b-row>
																<b-col md=12>
																	<b-table
																		responsive small hover outlined show-empty
																		:items="filterSubjects(level.id, semester.id)"
																		:fields="tables.subjects.fields"
																		:busy="tables.subjects.isBusy">
																		<template v-slot:table-busy>
																			<div class="text-center my-2">
																				<v-icon 
																					name="spinner" 
																					spin
																					class="mr-2" />
																				<strong>Loading...</strong>
																			</div>
																		</template>
																		<template v-slot:cell(action)="row">
																			<b-button 
																				@click="removeSubject(row)" 
																				size="sm" variant="danger">
																				<v-icon name="trash" />
																			</b-button>
																		</template>
																	</b-table>
																</b-col>
															</b-row>
														</b-card>
													</div>
													<b-card
														v-else>
														<b-row>
															<b-col md=3 offset-md=9>
																<b-button class="float-right mb-2" variant="outline-primary"
																	@click="onAddSubject(level.id)">
																	<v-icon name="plus-circle" /> ADD NEW SUBJECT
																</b-button>
															</b-col>
														</b-row>
														<b-row>
															<b-col md=12>
																<b-table
																	responsive small hover outlined show-empty
																	:items="filterSubjects(level.id)"
																	:fields="tables.subjects.fields"
																	:busy="tables.subjects.isBusy">
																	<template v-slot:table-busy>
																		<div class="text-center my-2">
																			<v-icon 
																				name="spinner" 
																				spin
																				class="mr-2" />
																			<strong>Loading...</strong>
																		</div>
																	</template>
																	<template v-slot:cell(action)="row">
																		<b-button 
																			@click="removeSubject(row)" 
																			size="sm" variant="danger">
																			<v-icon name="trash" />
																		</b-button>
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
							</b-overlay>				
						</b-card-body>
						<template v-slot:footer>
							<b-button 
								class="float-right btn-save ml-2" 
								@click="showEntry = false" 
								variant="outline-danger">
								Close
							</b-button>
							<b-button 
								:disabled="forms.curriculum.isProcessing"
								class="float-right btn-save" 
								@click="onCurriculumEntry()" 
								variant="outline-primary">
								<v-icon 
									v-if="forms.curriculum.isProcessing"
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
		<!-- MODAL SUBJECT -->
		<b-modal 
			v-model="showModalSubjects"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title"> <!-- modal title -->
					Subjects
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
          <b-row class="mb-2">
            <b-col md="4">
              <b-form-select
                v-if="checkSchoolCategory()"
                @change="filterByDepartment()"
                v-model="filters.subject.departmentId">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Department --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="department in options.departments.items" 
                  :key="department.id" 
                  :value="department.id">
                  {{department.name}}
                </b-form-select-option>
              </b-form-select>
            </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text" 
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.subjects.filteredItems"
						:fields="tables.subjects.fields"
            :filter="filters.subject.criteria"
						:busy="tables.subjects.isBusy2"
            :current-page="paginations.subject.page"
            :per-page="paginations.subject.perPage"
            @filtered="onFiltered($event, paginations.subject)">
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
              Showing {{paginations.subject.from}} to {{paginations.subject.to}} of {{paginations.subject.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.subject)"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-right" 
          variant="outline-danger" 
          @click="showModalSubjects=false">
          Close
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
     <!-- Modal Confirmation -->
    <b-modal 
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Delete Curriculum
      </div>
      Are you sure you want to delete this curriculum?
      <div slot="modal-footer">
        <b-button 
          variant="outline-primary" 
          class="mr-2 btn-save" 
          @click="onCurriculumDelete()">
          <v-icon 
            v-if="forms.curriculum.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Yes
        </b-button>
        <b-button 
          class="btn-close"
          variant="outline-danger" 
          @click="showModalConfirmation=false">
          No
        </b-button>            
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
	</div>
</template>
<script>
import { SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, 
	SubjectApi, DepartmentApi, CurriculumApi } from "../../mixins/api"
import { SchoolCategories, Semesters, UserGroups } from "../../helpers/enum"
import { showNotification, validate, clearFields, reset } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'

const curriculumFields = {
  id: null,
	name: null,
	major: null,
	schoolCategoryId: null,
  courseId: null,
  levelId: null,
  effectiveYear: null,
  notes: null,
	subjects: null
}

export default {
	name: "Curriculum",
	mixins: [ SchoolCategoryApi, LevelApi, SemesterApi, CourseApi,
		SubjectApi, DepartmentApi, CurriculumApi, Tables ],
	data() {
		return {
      showModalSubjects: false,
      showModalConfirmation: false,
      showEntry: false,
      entryMode: "Add",
			isLoading: false,
			forms: {
				curriculum: {
					isProcessing: false,
					fields: {...curriculumFields},
					states: {...curriculumFields},
					errors: {...curriculumFields}
				}
			},
			tables: {
				curriculums: {
					isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
						},
						{
							key: "major",
							label: "Major",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
            },
            {
							key: "effectiveYear",
							label: "Effective Year",
							tdClass: "align-middle",
							thStyle: {width: "10%"}
						},
						{
							key: "schoolCategory.name",
							label: "School Category",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "course.name",
							label: "Course",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "notes",
							label: "Notes",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: {width: "5%"}
						}
					],
					items: []
				},
				subjects: {
					isBusy: false,
					isBusy2: false,
					fields: [
						// {
						// 	key: "code",
						// 	label: "CODE",
						// 	tdClass: "align-middle",
						// 	thStyle: {width: "15%"}
						// },
						{
							key: "name",
							label: "SUBJECT CODE",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
            {
							key: "prerequisites",
							label: "PREREQUISITES",
							tdClass: "align-middle",
              thStyle: {width: "15%"},
              formatter: (value, key, item) => {

                if (value.length > 0) {
                   return value.map(subject => { return subject.name; }).join(", ");
                }
                return ''
              }
            },
            {
							key: "labs",
							label: "LAB UNITS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "15%"}
						},
						{
							key: "units",
							label: "LEC UNITS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "15%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: {width: "5%"}
						}
					],
          items: [],
          filteredItems: []
				}
			},
      paginations: {
				subject: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				},
				curriculum: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        subject: {
          criteria: null,
          departmentId: null
				},
				curriculum: {
					criteria: null
				}
      },
			options: {
				schoolCategories: SchoolCategories,
				levels: {
          isLoading: false,
					items: []
				},
				courses: {
          isLoading: false,
					items: []
				},
        semesters: Semesters,
        departments: {
          items: []
        }
			},
			levelId: null,
      schoolCategoryId: null,
      userGroupId: null,
      semesters: [],
      levels: []
		}
	},
	created(){
    this.loadCurriculums()
    this.checkRights()
    this.loadDepartments()
	},
	methods: {
    loadCurriculums() {
      const { curriculums } = this.tables
      const { curriculum } = this.paginations

      curriculums.isBusy = true

			let params = { paginate: false }
      this.getCurriculumList(params)
        .then(({ data }) => {
          curriculums.items = data
          curriculum.totalRows = data.length
          this.recordDetails(curriculum)
          curriculums.isBusy = false
        })
    },
		loadLevelsOfSchoolCategoryList(getSelectedLevel = false) {
			this.loadSubjects()
			const { fields, fields: { schoolCategoryId } } = this.forms.curriculum
      this.levels = []
      
      if (this.entryMode === "Add") {
        
        fields.subjects = []
      }

      if (this.checkSchoolCategory()) {
        fields.levelId = null
        this.loadCoursesOfSchoolCategoryList()
        return		
      }
      fields.courseId = null
      let params = { paginate: false }
      const { levels } = this.options
      levels.isLoading = true
			this.getLevelsOfSchoolCategoryList(schoolCategoryId, params)
				.then(({ data }) => {
          levels.items = data
          levels.isLoading = false
          if (getSelectedLevel) {
            this.getSelectedLevel()
            return
          }
          fields.levelId = null
				})
				.catch(error => {
          levels.isLoading = false
					console.log(error)
				})
		},
		loadSubjectsOfLevelList(){
      const { subjects } = this.tables
      subjects.isBusy = true
      const { fields, fields: { levelId, courseId, semesterId } } = this.forms.curriculum
			let params = { courseId, semesterId , paginate : false }
			this.getSubjectsOfLevelList(levelId, params)
				.then(({ data }) => {
					fields.subjects = data
					subjects.isBusy = false
			});
		},
		loadCoursesOfSchoolCategoryList() {
      const { schoolCategoryId } = this.forms.curriculum.fields
      const { courses } = this.options
      let params = { paginate: false }
      courses.isLoading = true
			this.getCoursesOfSchoolCategoryList(schoolCategoryId, params)
				.then(({ data }) => {
          courses.items = data
          courses.isLoading = false
				})
		},
		loadLevelsOfCourse() {
			this.isLoading = true
      const { fields, fields: { courseId } } = this.forms.curriculum
      const { items } = this.options.courses
      if (items.length > 0) {
        fields.major = items.find(i => i.id === courseId).major
      }
			let params = { paginate: false }
			this.getLevelsOfCourse(courseId, params)
				.then(({ data }) => {
					this.levels = data
					this.isLoading = false
				})
		},
		loadSemesterList(){
			this.isLoading = true
			let params = { paginate: false }
			this.getSemesterList(params)
				.then(({ data }) => {
					this.options.semesters.items = data
					this.isLoading = false
				})
    },
    setCreate() {
      const { curriculum, curriculum: { fields } } = this.forms
      reset(curriculum)
      clearFields(fields)
      this.entryMode = "Add"
      this.showEntry = true
      fields.schoolCategoryId = null
      fields.courseId = null
      fields.subjects = []
      this.levels = []
      
    },
    setUpdate(id) {
      this.entryMode = "Edit"
      const { curriculum, curriculum: { fields } } = this.forms
      this.getCurriculum(id)
        .then(({ data }) => {
          copyValue(data, fields)
          reset(curriculum)
          let getSelectedLevel = false
          if (this.checkSchoolCategory()) {
            this.loadLevelsOfCourse()
          } else {
            if (data.subjects.length > 0) {
              getSelectedLevel = true
            }
          }
          this.loadLevelsOfSchoolCategoryList(getSelectedLevel)
          this.showEntry = true
        })
    },
		onCurriculumEntry(){
			const { 
				curriculum, 
				curriculum: { 
					fields: { 
						subjects, 
						...fields } 
					} 
        } = this.forms
      
      const { curriculums } = this.tables
			
      let data = { 
        subjects : [], 					
        ...fields
      }
			
			curriculum.isProcessing = true

			subjects.forEach(s => {
				data.subjects.push({
					subjectId: s.id,
					levelId: s.pivot.levelId,
					semesterId: s.pivot.semesterId,
				})
			})

      reset(curriculum)
      if(this.entryMode === "Add") {
        this.addCurriculum(data)
          .then(({ data }) => {
            this.addRow(curriculums, this.paginations.curriculum, data)
            curriculum.isProcessing = false
            showNotification(this, "success", "Curriculum created successfully.")
            this.showEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            curriculum.isProcessing = false
            validate(curriculum, errors)
          })
      } else {
        this.updateCurriculum(data, fields.id)
          .then(({ data }) => {
            curriculum.isProcessing = false
            this.updateRow(curriculums, data)
            showNotification(this, "success", "Curriculum updated successfully.")
            this.showEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            curriculum.isProcessing = false
            validate(curriculum, errors)
          })
      }
    },
    onCurriculumDelete(){
      const { curriculum, curriculum: { fields: { id } } } = this.forms
      const { curriculums } = this.tables
      curriculum.isProcessing = true
      this.deleteCurriculum(id)
        .then(({ data }) => {
          curriculum.isProcessing = false
          this.deleteRow(curriculums, this.paginations.curriculum, id)
          showNotification(this, "success", "Curriculum deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    loadSubjects(){
			const { schoolCategoryId } = this.forms.curriculum.fields
      const { subjects } = this.tables
      const { subject } = this.paginations
      subjects.isBusy2 = true
			let params = { paginate: false, schoolCategoryId }
			this.getSubjectList(params)
				.then(({ data }) => {
          subjects.items = data
          subjects.filteredItems = data
          subject.totalRows = data.length
          this.recordDetails(subject)
					subjects.isBusy2 = false
				})
		},
		onAddSubject(levelId, semesterId = null) {
			this.levelId = levelId
			this.semesterId = semesterId
			this.showModalSubjects = true
			this.filters.subject.departmentId = null
		},
		addSubject(row){ 
      const { fields } = this.forms.curriculum
      const { item } = row
      // check if subject exist in the table
      const result = fields.subjects.find(subject => subject.id === item.id)
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.')
        return
      }
			fields.subjects.push({
				...item,
				pivot: { 
					levelId: this.levelId,
					semesterId: this.semesterId
				} 
			})
		},
		removeSubject(row){
      const { subjects } = this.forms.curriculum.fields
      const index = subjects.findIndex(i => i.id === row.item.id)
			subjects.splice(index, 1);
		},
		checkRights(){
			const userGroupId = localStorage.getItem('userGroupId')
			const userGroup = UserGroups.getEnum(Number(userGroupId))
			let result = false
			if (userGroup) {
				// this.filters.student.schoolCategoryId = userGroup.schoolCategoryId
				this.schoolCategoryId = userGroup.schoolCategoryId
			}

			if (UserGroups.SUPER_USER.id == userGroup.id) {
        this.schoolCategoryId = SchoolCategories.getEnum(1).id
        this.userGroupId = UserGroups.SUPER_USER.id
			}
      // this.loadLevelsOfSchoolCategoryList()
    },
    loadDepartments(){
      let params = { paginate: false }
      const { departments } = this.options
      this.getDepartmentList(params)
        .then(({ data }) => {
          departments.items = data
        })
    },
    filterByDepartment() {
      const { subjects } = this.tables
      const { subject } = this.paginations
      const { departmentId } = this.filters.subject
      if (departmentId) {
        subjects.filteredItems = subjects.items.filter(s => s.departmentId === departmentId)
      }
      else {
        subjects.filteredItems = subjects.items
      }
      this.onFiltered(subjects.filteredItems, subject)
		},
		checkSchoolCategory() {
			const { schoolCategoryId } = this.forms.curriculum.fields
			const { schoolCategories } = this.options
			let result = (schoolCategoryId === schoolCategories.SENIOR_HIGH_SCHOOL.id || 
										schoolCategoryId === schoolCategories.COLLEGE.id)
			return result
		},
		filterSubjects(levelId, semesterId = null) {
			const { subjects } = this.forms.curriculum.fields
			let filteredSubjects = subjects.filter(subject =>
				(subject.pivot.levelId === levelId && subject.pivot.semesterId === semesterId)
			)
			return filteredSubjects
    },
    getSelectedLevel() {
      this.isLoading = true
      this.levels = [this.options.levels.items.find(level => level.id === this.forms.curriculum.fields.levelId)]
      this.isLoading = false
      // console.log(this.levels)
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event)
    },
    filterSemester(level) {
      let defaultSemesters = this.options.semesters.values.slice(0, 2)
      // return defaultSemesters
      if (level.isShowAll) {
        return this.options.semesters.values
      } else {
        if (this.entryMode === "Add") {
          return defaultSemesters
        } else {
          const { subjects } = this.forms.curriculum.fields
          let filteredSubjects = subjects.filter(subject =>
            subject.pivot.levelId === level.id
          )
          let distinctSemesters = [...new Set(filteredSubjects.map(x => x.pivot.semesterId))]
          distinctSemesters.forEach(d => {
            if (!defaultSemesters.map(x => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d))
            }
          })
          return defaultSemesters
        }
      }
    },
    setViewDetails(row) {
      if (!row.detailsShowing) {

      }
      row.toggleDetails()
    }
  },
}
</script>
<style>
	.collapsed .when-open,
	.not-collapsed .when-closed {
		display: none;
	}
</style>