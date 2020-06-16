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
											@click="loadLevelsOfSchoolCategoryList(schoolCategory.id)" 
											:title="schoolCategory.name"/>
									</b-tabs>
								</b-col>
							</b-row>
							<hr>
							<h4>Curriculum</h4>
							<p>Lorem ipsum dolor sit amet.</p>
							<b-row v-show="options.courses.items.length	> 0">
								<b-col offset-md="2" md=10>
									<b-alert show>
										<b-row>
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
									</b-alert>
								</b-col>
							</b-row>
							<b-row class="mb-3">
								<b-col md=6 offset-md="6">
									<b-button class="float-right" variant="outline-primary"
										@click="showModalSubjects=true">
										<b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT
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
										<template v-slot:cell(action)="row">
											<b-button 
                        @click="removeSubject(row)" 
                        size="sm" variant="danger">
                        <b-icon-x></b-icon-x>
                      </b-button>
										</template>
									</b-table>
								</b-col>
							</b-row>						
						</b-card-body>
						<template v-slot:footer>
							<b-button 
                class="float-right" 
                @click="updateCurriculum()" 
                variant="outline-primary">
                Update
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
            <b-col offset-md="8" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text" 
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.subjects.items"
						:fields="tables.subjects.fields"
            :filter="filters.subject.criteria"
						:busy="tables.subjects.isBusy2">
						<template v-slot:cell(action)="row">
							<b-button 
                @click="addSubject(row)" 
                size="sm" variant="success">
                <b-icon-plus></b-icon-plus>
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
                @input="loadSubjects()"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button class="float-left" @click="showModalSubjects=false">Close</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
	</div> <!-- main container -->
</template>
<script>
import { SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi } from "../../mixins/api"
import { SchoolCategories, Semesters } from "../../helpers/enum"
import { showNotification } from '../../helpers/forms'
export default {
	name: "Curriculum",
	mixins: [ SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi ],
	data() {
		return {
			showModalSubjects: false,
			isLoading: false,
			forms: {
				curriculum: {
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
						{
							key: "code",
							label: "CODE",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "name",
							label: "SUBJECT",
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
							label: "UNITS",
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
					items: []
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
				semesters: Semesters
			},
			levelIndex: 0
		}
	},
	created(){
		this.loadLevelsOfSchoolCategoryList(this.options.schoolCategories.getEnum(1).id)
		this.loadSubjects()
	},
	methods: {
		loadLevelsOfSchoolCategoryList(id){
			this.isLoading = true
			this.options.courses.items = []
			this.forms.curriculum.fields.schoolCategoryId = id
			let params = { paginate: false }
			this.getLevelsOfSchoolCategoryList(id, params)
				.then(response => {
					const res = response.data
					this.options.levels.items = res
					this.levelIndex = 0
					if (res.length > 0) {
						this.loadCoursesOfLevelList(res[0].id)
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
				.then(response => {
					const res = response.data
					fields.subjects = res
					subjects.isBusy = false
			});
		},
		loadCoursesOfLevelList(levelId){
			this.isLoading = true
      this.forms.curriculum.fields.levelId = levelId
      const { schoolCategoryId } = this.forms.curriculum.fields
			let params = { paginate: false, schoolCategoryId }
			this.getCoursesOfLevelList(levelId, params)
				.then(response => {
          const res = response.data
          const { courses, semesters } = this.options
					courses.items = res

					if(res.length > 0){
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
				.then(response => {
					const res = response.data
					this.options.semesters.items = res
					this.isLoading = false
				})
		},
		updateCurriculum(){
			let data = { subjects : [] }

			this.forms.curriculum.fields.subjects.forEach(s => {
				data.subjects.push({
					courseId: this.forms.curriculum.fields.courseId,
					semesterId: this.forms.curriculum.fields.semesterId,
					schoolCategoryId: this.forms.curriculum.fields.schoolCategoryId,
					subjectId: s.id
				})
			})
      const { levelId } = this.forms.curriculum.fields
			this.updateSubjectsOfLevel(levelId, data)
				.then(response => {
					showNotification(this, 'success', 'Curriculum is updated.')
          //console.log(res)
        })
        .catch(error => {
          showNotification(this, 'danger', 'Error in updating curriculum.')
        })
    },
    loadSubjects(){
      const { subjects } = this.tables
      const { subject, subject: { perPage, page } } = this.paginations
      subjects.isBusy2 = true
			let params = { paginate: true, perPage, page }
			this.getSubjectList(params)
				.then(response => {
					const res = response.data
          subjects.items = res.data
          subject.from = res.meta.from
					subject.to = res.meta.to
					subject.totalRows = res.meta.total
					subjects.isBusy2 = false
				})
    },
		addSubject(row){
			this.forms.curriculum.fields.subjects.push(row.item)
		},
		removeSubject(row){
			this.forms.curriculum.fields.subjects.splice(row.index, 1);
		}
	}
}
</script>