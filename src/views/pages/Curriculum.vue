<template>
	<div>
		<div v-if="!showEntry">
			<b-row>
				<b-col md=12>
					<b-card>
						<b-card-body>
							<b-row>
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
							<hr>
							<!-- add button and search -->
							<b-row class="mb-3">
								<b-col md=12>
									<b-row>
										<b-col md=6 class="bottom-space">
											<b-button variant="outline-primary" 
												@click="showEntry = true, forms.curriculum.fields.subjects = []">
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
										:items="tables.curriculums.filteredItems" 
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
													>
													Edit
												</b-dropdown-item>
												<b-dropdown-item 
													>
													Delete
												</b-dropdown-item>
											</b-dropdown>
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
		<div v-else>	
			<b-row>
				<b-col md=12>
					<b-card>
						<b-card-header>
							<h4>Curriculum</h4>
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
										<label class="required">Major</label>
										<b-form-input
											v-model="forms.curriculum.fields.major"
											:state="forms.curriculum.states.major">
										</b-form-input>
										<b-form-invalid-feedback>
											{{ forms.curriculum.errors.major }}
										</b-form-invalid-feedback>
									</b-form-group>
								</b-col>
								<b-col md=6>
									<b-row>
										<b-col md=6>
											<b-form-group>
												<label class="required">School Category</label>
												<b-form-select
													@input="loadLevelsOfSchoolCategoryList()" 
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
												<label>Course</label>
												<b-form-select
													@change="loadLevelsOfCourse()"
													:disabled="!checkSchoolCategory()"
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
													v-model="forms.curriculum.fields.effectiveYear"
													:state="forms.curriculum.states.effectiveYear">
												</b-form-input>
												<b-form-invalid-feedback>
													{{ forms.curriculum.errors.effectiveYear }}
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
												v-for="level in options.levels.items" 
												:key="level.id">
												<div class="d-flex justify-content-between align-items-center">
													<h5>{{ level.name }}</h5>
													<div v-b-toggle="'level' + level.id">
														<span class="when-open">
															<v-icon name="caret-down" />
														</span>
														<span class="when-closed">
															<v-icon name="caret-left" />
														</span>
													</div>
												</div>
												<b-collapse visible :id="'level' + level.id" class="mt-2" role="tabpanel">
													<div v-if="checkSchoolCategory()">
														<b-card
															v-for="semester in options.semesters.values"
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
								class="float-right btn-save" 
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
	</div>
</template>
<script>
import { SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, 
	SubjectApi, DepartmentApi, CurriculumApi } from "../../mixins/api"
import { SchoolCategories, Semesters, UserGroups } from "../../helpers/enum"
import { showNotification } from '../../helpers/forms'
import Tables from '../../helpers/tables'

const curriculumFields = {
	name: null,
	major: null,
	schoolCategoryId: null,
	courseId: null,
	effectiveYear: null,
	subjects: null
}

export default {
	name: "Curriculum",
	mixins: [ SchoolCategoryApi, LevelApi, SemesterApi, CourseApi,
		SubjectApi, DepartmentApi, CurriculumApi, Tables ],
	data() {
		return {
			showModalSubjects: false,
			showEntry: false,
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
							key: "schoolCategoryId",
							label: "School Category",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "courseId",
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
							thStyle: {width: "30%"}
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
					items: []
				},
				courses: {
					items: []
				},
        semesters: Semesters,
        departments: {
          items: []
        }
			},
			levelId: null,
			semester: null,
      schoolCategoryId: null,
      userGroupId: null
		}
	},
	created(){
    this.checkRights()
    this.loadDepartments()
	},
	methods: {
		loadLevelsOfSchoolCategoryList() {
			this.loadSubjects()
			const { fields, fields: { schoolCategoryId } } = this.forms.curriculum
			const { levels } = this.options
			fields.courseId = null
			fields.subjects = []
			levels.items = []
			if (this.checkSchoolCategory()) {
				this.loadCoursesOfSchoolCategoryList()
				return		
			}
			this.isLoading = true
      let params = { paginate: false }
			this.getLevelsOfSchoolCategoryList(schoolCategoryId, params)
				.then(({ data }) => {
					this.options.levels.items = data
					this.isLoading = false
				})
				.catch(error => {
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
			let params = { paginate: false }
			this.getCoursesOfSchoolCategoryList(schoolCategoryId, params)
				.then(({ data }) => {
          const { courses } = this.options
					courses.items = data
				})
		},
		loadLevelsOfCourse() {
			this.isLoading = true
			const { courseId } = this.forms.curriculum.fields
			let params = { paginate: false }
			this.getLevelsOfCourse(courseId, params)
				.then(({ data }) => {
          const { levels } = this.options
					levels.items = data
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
		onCurriculumEntry(){
			const { 
				curriculum, 
				curriculum: { 
					fields: { 
						subjects, 
						...fields } 
					} 
				} = this.forms
			
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

			this.addCurriculum(data)
				.then(({ data }) => {
					curriculum.isProcessing = false
					showNotification(this, 'success', 'Curriculum is updated.')
          //console.log(res)
        })
        .catch(error => {
          curriculum.isProcessing = false
          if (error.response.data.errors.subjects) {
            showNotification(this, 'danger', error.response.data.errors.subjects)
            return
          }
          showNotification(this, 'danger', 'Error in updating curriculum.')
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
			this.forms.curriculum.fields.subjects.splice(row.index, 1);
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
										schoolCategoryId === schoolCategories.COLLEGE.id || 
											schoolCategoryId === schoolCategories.GRADUATE_SCHOOL.id)
			return result
		},
		filterSubjects(levelId, semesterId = null) {
			console.log(levelId)
			console.log(semesterId)
			const { subjects } = this.forms.curriculum.fields
			let filteredSubjects = subjects.filter(subject =>
				(subject.pivot.levelId === levelId && subject.pivot.semesterId === semesterId)
			)
			console.log(filteredSubjects)
			return filteredSubjects
		}
	}
}
</script>
<style>
	.collapsed .when-open,
	.not-collapsed .when-closed {
		display: none;
	}
</style>