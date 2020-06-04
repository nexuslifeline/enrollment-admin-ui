<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<b-tabs pills>
									<b-tab active title="All" />    						
									<b-tab v-for="schoolCategory in options.schoolCategories.items" :key="schoolCategory.id" 
										:title="schoolCategory.name"/>
								</b-tabs>
							</b-col>
							<b-col md=3>
								<b-form-select v-model="filters.student.courseId" class="float-right w-100">
									<template v-slot:first>
										<b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
									</template>
									<b-form-select-option v-for="course in options.courses.items" :key="course.id" :value="course.id">
										{{course.name}}
									</b-form-select-option>
								</b-form-select>
							</b-col>
						</b-row>
						<hr>
						<b-row class="mb-2"> <!-- row button and search input -->
							<b-col md="8">
								<b-form-radio-group v-model="filters.student.status">
									<b-form-radio value="0">Show All</b-form-radio>
									<b-form-radio value="1">Approved</b-form-radio>
									<b-form-radio value="2">Pending</b-form-radio>
								</b-form-radio-group>
							</b-col>

							<b-col md="4">
								<b-form-input
									v-model="filters.student.criteria"
									type="text" 
									placeholder="Search">
								</b-form-input>
							</b-col>
						</b-row> <!-- row button and search input -->
						<b-table
							details-td-class="table-secondary"
							hover outlined small responsive show-empty
							:fields="tables.students.fields"
							:items="tables.students.items"
							:busy="tables.students.isBusy"
							:filter="filters.student.criteria"
							:filter-included-fields="tables.students.filterIncludedFields">
							<template v-slot:cell(name)="data">
								<b-media>
									<template v-slot:aside>
										<b-avatar rounded blank size="3rem" :text="data.item.firstName.charAt(0) + '' + data.item.lastName.charAt(0)"></b-avatar>
										<!-- <b-img rounded blank blank-color="#ccc" width="64" alt="placeholder"></b-img> -->
									</template>
									<span>{{data.item.name}}</span><br>
									<small>{{data.item.address ? 
                    data.item.address.address + ", " 
                    + data.item.address.city + ", " 
                    + data.item.address.province + ", " 
                    + data.item.address.country : ""}}
                  </small>
								</b-media>
							</template>
							<template v-slot:cell(education)="data">
								<span>Course</span><br>
								<small>Details</small>
							</template>
							<template v-slot:cell(action)="row">
								<b-icon-caret-down @click="row.toggleDetails"></b-icon-caret-down>
							</template>
							<template v-slot:row-details>
								<b-row>
									<b-col md="4">
										<h6>Course</h6>
										<h6>Bachelor of Science in Information Technology</h6>
									</b-col>
									<b-col md="2">
										<h6>Level</h6>
										<h6>First Year</h6>
									</b-col>
									<b-col md="2">
										<h6>Semester</h6>
										<h6>1st Semester</h6>
									</b-col>
									<b-col md="2">
										<h6>S.Y.</h6>
										<h6>2019-2020</h6>
									</b-col>
									<b-col md="2">
										<h6>Student Type</h6>
										<h6>Regular</h6>
									</b-col>
								</b-row>
								<b-card>
									<b-table
										hover outlined small responsive show-empty
										:fields="tables.subjects.fields"
										:items="tables.subjects.items"
										:busy="tables.subjects.isBusy">
									</b-table>
									<template v-slot:footer>
										<b-row>
											<b-col md=10>
												<h5 class="float-right font-weight-bold">TUITION FEE</h5>
											</b-col>
											<b-col md=2>
												<h5 class="float-right pr-2 font-weight-bold">P1,400.00</h5>
											</b-col>
										</b-row>
									</template>
								</b-card>
								<b-card>
									<b-row class="mb-3">
										<b-col md=6>
											<h5>STUDENT FEES</h5>
										</b-col>
										<b-col md=6>
											<b-button 
                        variant="outline-primary" 
                        class="float-right">
                        <b-icon-plus-circle></b-icon-plus-circle> New Item
                      </b-button>
										</b-col>
									</b-row>
									<b-table
										hover outlined small responsive show-empty
										:fields="tables.fees.fields"
										:items="tables.fees.items"
										:busy="tables.fees.isBusy">
									</b-table>
									<template v-slot:footer>
										<b-row>
											<b-col md=2>
												<h5 class="font-weight-bold pt-1">UPON ENROLLMENT FEE: </h5>
											</b-col>
											<b-col md=2>
												<b-form-input></b-form-input>
											</b-col>
											<b-col md=2>
												<h5 class="font-weight-bold pt-1">PREVIOUS BALANCE: </h5>
											</b-col>
											<b-col md=2>
												<b-form-input></b-form-input>
											</b-col>
											<b-col md=2>
												<h5 class="float-right font-weight-bold">Total</h5>
											</b-col>
											<b-col md=2>
												<h5 class="float-right font-weight-bold">P5,400.00</h5>
											</b-col>
										</b-row>
									</template>
								</b-card>
								<b-row class="mb-3">
									<b-col md=12>
										<b-button 
                      class="float-left ml-2">
                      Cancel
                    </b-button>
										<b-button 
                      class="float-right mr-2" 
                      variant="outline-primary">
                      Approve
                    </b-button>
									</b-col>
								</b-row>
							</template>
						</b-table>
						<b-row>
							<b-col md=6>
								Showing {{paginations.student.from}} to {{paginations.student.to}} of {{paginations.student.totalRows}} records.
							</b-col>
							<b-col md=6>
								<b-pagination
									v-model="paginations.student.page"
									:total-rows="paginations.student.totalRows"
									:per-page="paginations.student.perPage"
									size="sm"
									align="end"
									@input="loadStudentList()"
								/>
							</b-col>
						</b-row>
					</b-card-body>
				</b-card>
      </b-col>
    </b-row>
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, SchoolCategoryApi, CourseApi } from "../../mixins/api"
export default {
	name: "StudentFee",
	mixins: [StudentApi, SchoolCategoryApi, CourseApi],
	data() {
		return {
			course: 0,
			tables: {
				students: {
					isBusy: false,
					filterIncludedFields: ["firstName", "lastName"],
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "49%"},
							formatter: (value, key, item) => {
								if(!item.middleName){
									item.middleName = ""
								}
								item.name = item.firstName + " " + item.middleName + " " + item.lastName
							} 
						},
						{
							key: "education",
							label: "Education",
							tdClass: "align-middle",
							thStyle: { width: "49%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
					items: []
				},
				subjects: {
					isBusy: false,
					fields: [
						{
							key: "code",
							label: "CODE",
							tdClass: "align-middle",
							thStyle: { width: "10%"}
						},
						{
							key: "name",
							label: "SUBJECT",
							tdClass: "align-middle",
							thStyle: { width: "20%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: { width: "25%"}
						},
						{
							key: "units",
							label: "UNIT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: { width: "8%"}
						},
						{
							key: "amount_per_unit",
							label: "UNIT AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: { width: "15%"}
						},
						{
							key: "total_amount",
							label: "LINE TOTAL",
							tdClass: "align-middle text-right",
							thClass: "text-right"
						}
					],
					items: []
				},
				fees: {
					isBusy: false,
					fields: [
						{
							key: "name",
							label: "NAME",
							tdClass: "align-middle",
							thStyle: { width: "30%"}
						},
						{
							key: "notes",
							label: "NOTES",
							tdClass: "align-middle",
							thStyle: { width: "30%"}
						},
						{
							key: "amount",
							label: "AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: { width: "40%"}
						}
					],
					items: []
				}
			},
			paginations: {
				student: {
          from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
			},
			filters: {
				student: {
					criteria: null,
					schoolCategoryId: null,
					courseId: null,
					status: "0"
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
      const { perPage, page } = this.paginations.student
			var params = { paginate: true, perPage, page }
			this.getStudentList(params)
				.then(response => {
					const res = response.data
					this.tables.students.items = res.data;
					this.paginations.student.from = res.meta.from
					this.paginations.student.to = res.meta.to
					this.paginations.student.totalRows = res.meta.total
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