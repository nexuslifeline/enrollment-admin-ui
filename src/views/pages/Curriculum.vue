<template>
	<div>
		<b-overlay :show='isLoaded' rounded='sm'>
			<b-row>
				<b-col md=12>
					<b-card>
						<b-card-body>
							<b-row>
								<b-col md=12>
									<b-tabs pills> 						
										<b-tab v-for='schoolCategory in options.schoolCategories.items' :key='schoolCategory.id' 
											@click='loadLevelsOfSchoolCategoryList(schoolCategory.id)' 
											:title='schoolCategory.name'/>
									</b-tabs>
								</b-col>
							</b-row>
							<hr>
							<h4>Curriculum</h4>
							<p>Lorem ipsum dolor sit amet.</p>
							<b-row v-show='options.courses.items.length	> 0'>
								<b-col offset-md='2' md=10>
									<b-alert show>
										<b-row>
											<b-col md=3>
												<b-form-select v-model='forms.curriculum.fields.courseId'>
													<template v-slot:first>
														<b-form-select-option :value='null' disabled>-- Course --</b-form-select-option>
													</template>
													<b-form-select-option v-for='course in options.courses.items' :key='course.id' :value='course.id'>
														{{course.name}}
													</b-form-select-option>
												</b-form-select>
											</b-col>
											<b-col md=3>
												<b-form-select v-model='forms.curriculum.fields.semesterId'>
													<template v-slot:first>
														<b-form-select-option :value='null' disabled>-- Semester --</b-form-select-option>
													</template>
													<b-form-select-option v-for='semester in options.semesters.items' :key='semester.id' :value='semester.id'>
														{{semester.name}}
													</b-form-select-option>
												</b-form-select>
											</b-col>
										</b-row>
									</b-alert>
								</b-col>
							</b-row>
							<b-row class='mb-3'>
								<b-col md=6 offset-md='6'>
									<b-button class='float-right' variant='outline-primary'
										@click='showModalSubjects=true'>
										<b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT
									</b-button>
								</b-col>
							</b-row>
							<b-row>
								<b-col md=2>
									<b-tabs pills vertical v-model='levelIndex'>
										<b-tab v-for='level in options.levels.items' :key='level.id' 
											@click='loadCoursesOfLevelList(level.id)'
											:title='level.name'/>
									</b-tabs>
								</b-col>
								<b-col md=10>
									<b-table
										responsive small hover outlined show-empty
										:items.sync='forms.curriculum.fields.subjects'
										:fields='tables.subjects.fields'
										:busy='tables.subjects.isBusy'>
										<template v-slot:cell(action)='row'>
											<b-button @click='removeSubject(row)' size='sm' variant='danger'><b-icon-x></b-icon-x></b-button>
										</template>
									</b-table>
								</b-col>
							</b-row>						
						</b-card-body>
						<template v-slot:footer>
							<b-button class='float-right' @click='updateCurriculum()' variant='outline-primary'>Update</b-button>
						</template>
					</b-card>
				</b-col>
			</b-row>
		</b-overlay>
		<!-- MODAL SUBJECT -->
		<b-modal 
			v-model='showModalSubjects'
			:noCloseOnEsc='true'
			:noCloseOnBackdrop='true'
			size='xl'>
			<div slot='modal-title'> <!-- modal title -->
					Subjects
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
          <b-row class='mb-2'>
            <b-col offset-md='8' md='4'>
              <b-form-input
                v-model='filters.subject.criteria'
                type='text' 
                placeholder='Search'>
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync='tables.subjects.items'
						:fields='tables.subjects.fields'
            :filter='filters.subject.criteria'
						:busy='tables.subjects.isBusy2'>
						<template v-slot:cell(action)='row'>
							<b-button @click='addSubject(row)' size='sm' variant='success'><b-icon-plus></b-icon-plus></b-button>
						</template>
					</b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.subject.from}} to {{paginations.subject.to}} of {{paginations.subject.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model='paginations.subject.activePage'
                :total-rows='paginations.subject.totalRows'
                :per-page='paginations.subject.perPage'
                size='sm'
                align='end'
                @input='loadSubjects()'
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot='modal-footer' class='w-100'><!-- modal footer buttons -->
				<b-button class='float-left' @click='showModalSubjects=false'>Close</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
	</div> <!-- main container -->
</template>
<script>
import { SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi } from '../../mixins/api'
export default {
	name: 'Curriculum',
	mixins: [ SchoolCategoryApi, LevelApi, SemesterApi, CourseApi, SubjectApi ],
	data() {
		return {
			showModalSubjects: false,
			isLoaded: false,
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
							key: 'code',
							label: 'CODE',
							tdClass: 'align-middle',
							thStyle: {width: '15%'}
						},
						{
							key: 'name',
							label: 'SUBJECT',
							tdClass: 'align-middle',
							thStyle: {width: '25%'}
						},
						{
							key: 'description',
							label: 'DESCRIPTION',
							tdClass: 'align-middle',
							thStyle: {width: '35%'}
						},
						{
							key: 'units',
							label: 'UNITS',
							tdClass: 'align-middle text-right',
							thClass: 'text-right',
							thStyle: {width: '20%'}
						},
						{
							key: 'action',
							label: '',
							tdClass: 'align-middle text-center',
							thStyle: {width: '5%'}
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
					activePage: 1,
					perPage: 10,
				}
      },
      filters: {
        subject: {
          criteria: null
        }
      },
			options: {
				schoolCategories: {
					items: []
				},
				levels: {
					items: []
				},
				courses: {
					items: []
				},
				semesters: {
					items: []
				}
			},
			levelIndex: 0
		}
	},
	created(){
		this.loadSchoolCategoryList()
		this.loadSemesterList()
		this.loadSubjects()
	},
	methods: {
		loadSchoolCategoryList(){
			this.isLoaded = true
			var params = { paginate: false }
			this.getSchoolCategoryList(params)
				.then(response => {
					const res = response.data
					this.options.schoolCategories.items = res
					this.loadLevelsOfSchoolCategoryList(res[0].id)
					this.isLoaded = false
				})
				.catch(error => {
					console.log(error)
				})
		},
		loadLevelsOfSchoolCategoryList(id){
			this.isLoaded = true
			this.forms.curriculum.fields.schoolCategoryId = id
			var params = { paginate: false }
			this.getLevelsOfSchoolCategoryList(id, params)
				.then(response => {
					const res = response.data
					this.options.levels.items = res
					this.levelIndex = 0
					this.loadCoursesOfLevelList(res[0].id)
					this.isLoaded = false
				})
				.catch(error => {
					console.log(error)
				})
		},
		loadSubjectsOfLevelList(id){
			this.tables.subjects.isBusy = true
			var params = { courseId : this.forms.curriculum.fields.courseId, semesterId : this.forms.curriculum.fields.semesterId , paginate : false }
			this.getSubjectsOfLevelList(id, params)
				.then(response => {
					const res = response.data
					this.forms.curriculum.fields.subjects = res
					this.tables.subjects.isBusy = false
			});
		},
		loadCoursesOfLevelList(levelId){
			this.isLoaded = true
			this.forms.curriculum.fields.levelId = levelId
			var params = { paginate: false, schoolCategoryId: this.forms.curriculum.fields.schoolCategoryId }
			this.getCoursesOfLevelList(levelId, params)
				.then(response => {
					const res = response.data
					this.options.courses.items = res

					if(res.length > 0){
						this.forms.curriculum.fields.semesterId = this.options.semesters.items[0].id
						this.forms.curriculum.fields.courseId = this.options.courses.items[0].id
					}
					
					this.loadSubjectsOfLevelList(levelId)
					this.isLoaded = false
				})
		},
		loadSemesterList(){
			this.isLoaded = true
			var params = { paginate: false }
			this.getSemesterList(params)
				.then(response => {
					const res = response.data
					this.options.semesters.items = res
					this.isLoaded = false
				})
		},
		updateCurriculum(){
			var data = { subjects : [] }

			this.forms.curriculum.fields.subjects.forEach(s => {
				data.subjects.push({
					courseId: this.forms.curriculum.fields.courseId,
					semesterId: this.forms.curriculum.fields.semesterId,
					schoolCategoryId: this.forms.curriculum.fields.schoolCategoryId,
					subjectId: s.id
				})
			})

			this.updateSubjectsOfLevel(this.forms.curriculum.fields.levelId, data)
				.then(response => {
					console.log(response)
				})
		},
		loadSubjects(){
			this.tables.subjects.isBusy2 = true
			var params = { paginate: true, perPage: this.paginations.subject.perPage, page: this.paginations.subject.activePage }
			this.getSubjectList(params)
				.then(response => {
					const res = response.data
          this.tables.subjects.items = res.data
          this.paginations.subject.from = res.meta.from
					this.paginations.subject.to = res.meta.to
					this.paginations.subject.totalRows = res.meta.total
					this.paginations.subject.pages = res.meta.lastPage
					this.tables.subjects.isBusy2 = false
				})
		},
		addSubject(row){
			console.log(row)
			this.forms.curriculum.fields.subjects.push(row.item)
		},
		removeSubject(row){
			this.forms.curriculum.fields.subjects.splice(row.index, 1);
		}
	}
}
</script>