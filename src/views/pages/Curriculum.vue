<template>
	<div>
		<b-overlay :show="isLoading" rounded="sm">
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
											@click="loadLevelsOfSchoolCategoryList(schoolCategory.id)" 
											:title="schoolCategory.name"/>
									</b-tabs>
								</b-col>
							</b-row>
							<hr>
							<h4>Curriculum</h4>
							<p>Details about the subjects comprising the Course or Program.</p>
							<b-row class="mb-3">
								<b-col md=8 offset-md="2">
                  <b-row v-show="options.courses.items.length	> 0">
                    <b-col md=3>
                      <b-form-select 
                        @change="loadSubjectsOfLevelList()" 
                        v-model="forms.curriculum.fields.courseId">
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
                    </b-col>
                    <b-col md=3>
                      <b-form-select 
                        @change="loadSubjectsOfLevelList()" 
                        v-model="forms.curriculum.fields.semesterId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
                        </template>
                        <b-form-select-option 
                          v-for="semester in options.semesters.values"
                          :key="semester.id" 
                          :value="semester.id">
                          {{semester.name}}
                        </b-form-select-option>
                      </b-form-select>
                    </b-col>
                  </b-row>
								</b-col>
								<b-col md=2>
									<b-button class="float-right" variant="outline-primary"
										@click="showModalSubjects=true, filters.subject.departmentId=null">
										<v-icon name="plus-circle" /> ADD NEW SUBJECT
									</b-button>
								</b-col>
							</b-row>
							<b-row>
								<b-col md=2>
									<b-tabs pills vertical v-model="levelIndex">
										<b-tab v-for="level in options.levels.items" :key="level.id" 
											@click="loadCoursesOfLevelList(level.id)"
											:title="level.name"/>
									</b-tabs>
								</b-col>
								<b-col md=10>
									<b-table
										responsive small hover outlined show-empty
										:items.sync="forms.curriculum.fields.subjects"
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
						</b-card-body>
						<template v-slot:footer>
							<b-button 
								:disabled="forms.curriculum.isProcessing"
                class="float-right btn-save" 
                @click="updateCurriculum()" 
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
		</b-overlay>
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
                v-if="
                  forms.curriculum.fields.schoolCategoryId === options.schoolCategories.SENIOR_HIGH_SCHOOL.id || 
                  forms.curriculum.fields.schoolCategoryId === options.schoolCategories.COLLEGE.id || 
                  forms.curriculum.fields.schoolCategoryId === options.schoolCategories.GRADUATE_SCHOOL.id"
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
	</div> <!-- main container -->
</template>
<script>
import { SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi, DepartmentApi } from "../../mixins/api"
import { SchoolCategories, Semesters, UserGroups } from "../../helpers/enum"
import { showNotification } from '../../helpers/forms'
import Tables from '../../helpers/tables'
export default {
	name: "Curriculum",
	mixins: [ SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi, DepartmentApi, Tables ],
	data() {
		return {
			showModalSubjects: false,
			isLoading: false,
			forms: {
				curriculum: {
					isProcessing: false,
					fields: {
						schoolCategoryId: null,
						levelId: null,
						courseId: null,
						semesterId: null,
						subjects: []
					},
				}
			},
			tables: {
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
				}
      },
      filters: {
        subject: {
          criteria: null,
          departmentId: null
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
			levelIndex: 0,
      schoolCategoryId: null,
      userGroupId: null
		}
	},
	created(){
    this.checkRights()
    this.loadDepartments()
	},
	methods: {
		loadLevelsOfSchoolCategoryList(id){
			this.isLoading = true
			this.options.courses.items = []
			this.forms.curriculum.fields.schoolCategoryId = id
      let params = { paginate: false }
			this.getLevelsOfSchoolCategoryList(id, params)
				.then(({ data }) => {
          this.loadSubjects(id)
					this.options.levels.items = data
					this.levelIndex = 0
					if (data.length > 0) {
						this.loadCoursesOfLevelList(data[0].id)
					} else {
						this.forms.curriculum.fields.subjects = []
					}
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
		loadCoursesOfLevelList(levelId){
			this.isLoading = true
      this.forms.curriculum.fields.levelId = levelId
      const { schoolCategoryId } = this.forms.curriculum.fields
			let params = { paginate: false, schoolCategoryId }
			this.getCoursesOfLevelList(levelId, params)
				.then(({ data }) => {
          const { courses, semesters } = this.options
					courses.items = data

					if(data.length > 0){
						this.forms.curriculum.fields.semesterId = semesters.getEnum(1).id
						this.forms.curriculum.fields.courseId = courses.items[0].id
					}
					
					this.loadSubjectsOfLevelList()
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
		updateCurriculum(){
      const { curriculum, curriculum: { fields } } = this.forms
      
      let data = { 
        subjects : [], 					
        courseId: fields.courseId,
        semesterId: fields.semesterId,
        schoolCategoryId: fields.schoolCategoryId, 
      }
			
			curriculum.isProcessing = true

			fields.subjects.forEach(s => {
				data.subjects.push({
					subjectId: s.id
				})
			})

			this.updateSubjectsOfLevel(fields.levelId, data)
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
    loadSubjects(schoolCategoryId){
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
		addSubject(row){ 
      const { fields } = this.forms.curriculum
      const { item } = row
      // check if subject exist in the table
      const result = fields.subjects.find(subject => subject.id === item.id)
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.')
        return
      }
			fields.subjects.push(item)
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
      this.loadLevelsOfSchoolCategoryList(this.schoolCategoryId)
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
    }
	}
}
</script>