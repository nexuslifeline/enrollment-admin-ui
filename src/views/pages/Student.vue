<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<b-tabs pills>
									<b-tab active title='All' />    						
									<b-tab v-for='schoolCategory in options.schoolCategories.items' :key='schoolCategory.id'
										:title='schoolCategory.name'/>
								</b-tabs>
							</b-col>
							<b-col md=3>
								<b-form-select v-model='filters.student.courseId' class='float-right w-100'>
									<template v-slot:first>
										<b-form-select-option :value='null' disabled>-- Course --</b-form-select-option>
									</template>
									<b-form-select-option v-for='course in options.courses.items' :key='course.id' :value='course.id'>
										{{course.name}}
									</b-form-select-option>
								</b-form-select>
							</b-col>
						</b-row>
						<hr>
						<b-row class='mb-2'> <!-- row button and search input -->
							<b-col md='8'>
								<b-form-radio-group v-model='filters.student.status'>
									<b-form-radio value='0'>Show All</b-form-radio>
									<b-form-radio value='1'>Approved</b-form-radio>
									<b-form-radio value='2'>Pending</b-form-radio>
								</b-form-radio-group>
							</b-col>

							<b-col md='4'>
								<b-form-input
									v-model='filters.student.criteria'
									type='text' 
									placeholder='Search'>
								</b-form-input>
							</b-col>
						</b-row> <!-- row button and search input -->
						<b-table 
							hover outlined small show-empty
							:fields='tables.students.fields'
							:items='tables.students.items'
							:busy='tables.students.isBusy'
							:filter='filters.student.criteria'
							:filter-included-fields="tables.students.filterIncludedFields"
						>
							<template v-slot:cell(name)='data'>
								<b-media>
									<template v-slot:aside>
										<b-avatar rounded blank size='3rem' :text='data.item.firstName.charAt(0) + "" + data.item.lastName.charAt(0)'></b-avatar>
										<!-- <b-img rounded blank blank-color='#ccc' width='64' alt='placeholder'></b-img> -->
									</template>
									<span>{{data.item.name}}</span><br>
									<small>{{data.item.address ? data.item.address.address + ', ' + data.item.address.city + ', ' + data.item.address.province + ', ' + data.item.address.country : ''}}</small>
								</b-media>
							</template>
							<template v-slot:cell(education)='data'>
								<span>Course</span><br>
								<small>Details</small>
							</template>
							<template v-slot:cell(action)='row'>
								<b-dropdown right variant='link' toggle-class='text-decoration-none' no-caret>
									<template v-slot:button-content>
										<b-icon-grip-horizontal></b-icon-grip-horizontal>
									</template>
									<b-dropdown-item @click='showModalApproval=true'>Approve</b-dropdown-item>
									<b-dropdown-item @click='showModalRejection=true'>Reject</b-dropdown-item>
									<b-dropdown-item @click='row.toggleDetails'>View Details</b-dropdown-item>
								</b-dropdown>
							</template>
							<template v-slot:row-details>
								<b-card>
									<b-row>
										<b-col md=12>
                      <b-row>
                        <b-col md=5>
                          <h6>Course</h6>
                          <h6>Bachelor of Science in Information Technology</h6>
                        </b-col>
                        <b-col md=2>
                          <h6>Level</h6>
                          <h6>First Year</h6>
                        </b-col>
                        <b-col md=2>
                          <h6>Semester</h6>
                          <h6>1st Semester</h6>
                        </b-col>
                        <b-col >
                          <h6>SY</h6>
                          <h6>2020-2021</h6>
                        </b-col>
                      </b-row>
                      <b-row class='mt-2'> 
                        <b-col md=12> 
                          <b-table
                            hover outlined small show-empty responsive
                            :fields='tables.subjects.fields'
                            :items='tables.subjects.items'
                            :busy='tables.subjects.isBusy'
                          >
                          </b-table>
                        </b-col>
                      </b-row>
                      <b-row >
                        <b-col md=12>
                          <b-row align-h='end'>
                            <b-col md=2>
                              <b-button block variant='outline-primary'>Update</b-button>
                            </b-col>
                          </b-row>
                        </b-col>
                      </b-row>
                    </b-col>
									</b-row>
								</b-card>
							</template>
						</b-table>
						<b-row>
							<b-col md=6>
								Showing {{paginations.student.from}} to {{paginations.student.to}} of {{paginations.student.totalRows}} records.
							</b-col>
							<b-col md=6>
								<b-pagination
									v-model='paginations.student.activePage'
									:total-rows='paginations.student.totalRows'
									:per-page='paginations.student.perPage'
									size='sm'
									align='end'
									@input='loadStudentList()'
								/>
							</b-col>
						</b-row>
					</b-card-body>
				</b-card>
      </b-col>
    </b-row>
		<!-- Modal Approval -->
		<b-modal 
			v-model='showModalApproval'
			centered
			header-bg-variant='success'
			header-text-variant='light'
			:noCloseOnEsc='true'
			:noCloseOnBackdrop='true'>
			<div slot='modal-title'> <!-- modal title -->
					Finalize Approval
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Notes</label>
					<b-textarea 
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot='modal-footer' class='w-100'><!-- modal footer buttons -->
				<b-button class='float-left' @click='showModalApproval=false'>Cancel</b-button>
				<b-button class='float-right' variant='outline-primary'>
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
		<!-- Modal Reject --> 
		<b-modal 
			v-model='showModalRejection'
			centered
			header-bg-variant='danger'
			header-text-variant='light'
			:noCloseOnEsc='true'
			:noCloseOnBackdrop='true'>
			<div slot='modal-title'> <!-- modal title -->
					Confirm Rejection
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Reason</label>
					<b-textarea
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot='modal-footer' class='w-100'><!-- modal footer buttons -->
				<b-button class='float-left' @click='showModalRejection=false'>Cancel</b-button>
				<b-button class='float-right' variant='outline-primary'>
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, SchoolCategoryApi, CourseApi } from '../../mixins/api'
export default {
	name: 'Student',
	mixins: [StudentApi, SchoolCategoryApi, CourseApi],
	data() {
		return {
			showModalApproval: false,
			showModalRejection: false,
			tables: {
				students: {
					isBusy: false,
					filterIncludedFields: ['firstName', 'lastName'],
					fields: [
						{
							key: 'name',
							label: 'Name',
							tdClass: 'align-middle',
							thStyle: { width: '49%'},
							formatter: (value, key, item) => {
								if(!item.middleName){
									item.middleName = ''
								}
								item.name = item.firstName + ' ' + item.middleName + ' ' + item.lastName
							} 
						},
						// {
						// 	key: 'name',
						// 	label: '',
						// 	tdClass: 'align-middle',
						// 	thStyle: { width: '45%' },
							
						// },
						{
							key: 'education',
							label: 'Education',
							tdClass: 'align-middle',
							thStyle: { width: '49%'}
						},
						{
							key: 'action',
							label: '',
							tdClass: 'align-middle',
							thStyle: { width: '40px'}
						},
					],
					items: []
        },
        subjects :{
          isBusy: false,
          fields: [
            {
							key: 'code',
							label: 'Code',
							tdClass: 'align-middle',
							thStyle: { width: '15%'}
            },
            {
							key: 'name',
							label: 'Subject',
							tdClass: 'align-middle',
							thStyle: { width: '30%'}
            },
            {
							key: 'description',
							label: 'Description',
							tdClass: 'align-middle',
							thStyle: { width: 'auto'}
            },
            {
							key: 'units',
							label: 'Units',
							tdClass: 'align-middle',
							thStyle: { width: '15%'}
            },
            {
							key: 'labs',
							label: 'Labs',
							tdClass: 'align-middle',
							thStyle: { width: '15%'}
						},
          ]
        },
        items: []
			},
			paginations: {
				student: {
					from: 0,
					to: 0,
					totalRows: 0,
					activePage: 1,
					perPage: 10,
				}
			},
			filters: {
				student: {
					criteria: null,
					schoolCategoryId: null,
					courseId: null,
					status: '0'
				}
			},
			options: {
				courses: {
					items: []
				},
				schoolCategories: {
					items: []
				},
			}
		}
	},
	created(){
		this.loadStudentList()
		this.loadSchoolCategoryList()
		this.loadCourseList()
	},
	methods: {
		loadStudentList(){
			this.tables.students.isBusy = true
			var params = { paginate: true, perPage: this.paginations.student.perPage, page: this.paginations.student.activePage }
			this.getStudentList(params)
				.then(response => {
					const res = response.data
					this.tables.students.items = res.data;
					this.paginations.student.from = res.meta.from
					this.paginations.student.to = res.meta.to
					this.paginations.student.totalRows = res.meta.total
					this.paginations.student.pages = res.meta.lastPage
					this.tables.students.isBusy = false
				})
		},
		loadSchoolCategoryList(){
			var params = { paginate: false }
			this.getSchoolCategoryList(params)
				.then(response => {
					const res = response.data
					this.options.schoolCategories.items = res
				})
		},
		loadCourseList(){
			var params = { paginate: false }
			this.getCourseList(params)
			.then(response => {
				const res = response.data
				this.options.courses.items = res
			})
		}
	}
}
</script>