<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<b-tabs pills>
									<b-tab @click="filters.student.schoolCategoryId = null, loadTranscript()" active title="All" />    						
									<b-tab v-for="schoolCategory in options.schoolCategories.values" 
										:key="schoolCategory.id"
										:title="schoolCategory.name"
                    @click="filters.student.schoolCategoryId = schoolCategory.id, loadTranscript()"/>
								</b-tabs>
							</b-col>
							<b-col md=3>
								<b-form-select @change="loadTranscript()" v-model="filters.student.courseId" class="float-right w-100">
									<template v-slot:first>
										<b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
									</template>
                  <b-form-select-option :value="null">None</b-form-select-option>
									<b-form-select-option 
										v-for="course in options.courses.items" 
										:key="course.id" 
										:value="course.id">
										{{course.name}}
									</b-form-select-option>
								</b-form-select>
							</b-col>
						</b-row>
						<hr>
						<b-row class="mb-2"> <!-- row button and search input -->
							<b-col md="8">
								<b-form-radio-group v-model="filters.student.applicationStatusId">
									<b-form-radio :value="null">Show All</b-form-radio>
									<b-form-radio 
										:value="applicationStatuses.APPROVED.id">
										Approved
									</b-form-radio>
									<b-form-radio 
										:value="applicationStatuses.DRAFT.id">
										Pending
									</b-form-radio>
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
										<b-avatar rounded blank size="3rem" :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"></b-avatar>										<!-- <b-img rounded blank blank-color="#ccc" width="64" alt="placeholder"></b-img> -->
									</template>
									<span>{{data.item.student.name}}</span><br>
									<small>{{data.item.student.address ? 
                    data.item.student.address.address + ", " 
                    + data.item.student.address.city + ", " 
                    + data.item.student.address.province + ", " 
                    + data.item.student.address.country : ""}}
                  </small>
								</b-media>
							</template>
							<template v-slot:cell(education)="data">
								<span>{{ getName(data.item, 'level') + " " 
                  + getName(data.item, 'semester') + " " 
                  + getName(data.item, 'studentType') }}</span><br>
                <small>{{ getName(data.item, 'course') }}</small>
							</template>
							<template v-slot:cell(action)="row">
								<b-icon-caret-down @click="loadDetails(row)"></b-icon-caret-down>
							</template>
							<template v-slot:row-details="data">
								<b-row class="m-2">
								  <b-col md="3">
                    <h6>Level</h6>
                    <h6>{{ getName(data.item, 'level') }}</h6>
                  </b-col>
                  <b-col md="3">
                    <div v-show="getName(data.item, 'course') != ''">
                      <h6>Course</h6>
                      <h6>{{ getName(data.item, 'course') }}</h6>
                    </div>
                  </b-col>
                  <b-col md="2">
                    <div v-show="getName(data.item, 'course') != ''">
                      <h6>Semester</h6>
                      <h6>{{ getName(data.item, 'semester') }}</h6>
                    </div>
                  </b-col>
                  <b-col md="2">
                    <h6>School Year</h6>
                    <h6>{{ getName(data.item, 'schoolYear') }}</h6>
                  </b-col>
									<b-col md="2">
										<h6>Student Type</h6>
										<h6>{{ getName(data.item, 'studentType') }}</h6>
									</b-col>
								</b-row>
								<b-card v-if="data.item.subjects">
									<b-row class="mb-3">
										<b-col md=6>
											<h5>SUBJECTS</h5>
										</b-col>
									</b-row>
									<b-table
										hover outlined small responsive show-empty
										:fields="tables.subjects.fields"
										:items="data.item.subjects"
										:busy="tables.subjects.isBusy">
									</b-table>
									<template v-slot:footer>
										<b-row>
											<b-col md=10>
												<h5 class="float-right font-weight-bold">TUITION FEE</h5>
											</b-col>
											<b-col md=2>
												<h5 class="float-right pr-2 font-weight-bold">{{ subjectTotalAmount(data.item.subjects) }}</h5>
											</b-col>
										</b-row>
									</template>
								</b-card>
								<b-card v-if="data.item.fees">
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
										:items="data.item.fees"
										:busy="tables.fees.isBusy">
										<template v-slot:cell(pivot.notes)="row">
                      <b-form-input v-model="row.item.pivot.notes" />
                    </template>
										<template v-slot:cell(pivot.amount)="row">
											<vue-autonumeric
												v-model="row.item.pivot.amount"
												class="form-control text-right" 
												:options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
											</vue-autonumeric>
										</template>
                    <template v-slot:cell(action)="row">
											<b-button @click="removeFee(row.item.fees, row)" size="sm" variant="danger"><b-icon-x></b-icon-x></b-button>
										</template>
									</b-table>
									<template v-slot:footer>
										<b-row>
											<b-col md=2>
												<h6 class="font-weight-bold pt-1">UPON ENROLLMENT FEE: </h6>
											</b-col>
											<b-col md=2>
												<vue-autonumeric
                          class="form-control text-right"
                          style="width: 70%"
                          :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                        </vue-autonumeric>
											</b-col>
											<b-col md=2>
												<h6 class="font-weight-bold pt-1">PREVIOUS BALANCE: </h6>
											</b-col>
											<b-col md=2>
												<vue-autonumeric
                          class="form-control text-right"
                          style="width: 70%"
                          :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                        </vue-autonumeric>
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
									@input="loadTranscript()"
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
import { StudentApi, CourseApi, TranscriptApi, RateSheetApi } from "../../mixins/api"
import { SchoolCategories, TranscriptStatuses, ApplicationStatuses } from "../../helpers/enum"
export default {
	name: "StudentFee",
	mixins: [StudentApi, CourseApi, TranscriptApi, RateSheetApi],
	data() {
		return {
			course: 0,
			applicationStatuses: ApplicationStatuses,
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
								if(!item.student.middleName){
									item.student.middleName = ""
								}
								item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
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
							label: "Code",
							tdClass: "align-middle",
							thStyle: {width: "8%"}
						},
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
						{
							key: "units",
							label: "UNITS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            {
							key: "amountPerUnit",
							label: "AMOUNT PER UNIT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "13%"}
						},
						{
							key: "labs",
							label: "LABS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            {
							key: "amountPerLab",
							label: "AMOUNT PER LAB",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "13%"}
            },
            {
							key: "totalAmount",
							label: "TOTAL AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "15%"}
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
							key: "pivot.notes",
							label: "NOTES",
							tdClass: "align-middle",
							thStyle: { width: "50%"}
						},
						{
							key: "pivot.amount",
							label: "AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: { width: "20%"}
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
					applicationStatusId: null
				}
			},
			options: {
				courses: {
					items: []
				},
				schoolCategories: SchoolCategories
			}
		}
	},
	created(){
		this.loadTranscript()
		this.loadCourseList()
	},
	methods: {
		loadTranscript(){
      this.tables.students.isBusy = true
      const { applicationStatusId, schoolCategoryId, courseId } = this.filters.student
			const { perPage, page } = this.paginations.student
			const transcriptStatusId = TranscriptStatuses.FINALIZED.id
			let params = { 
				paginate: true, 
				perPage, page, 
				transcriptStatusId, 
				schoolCategoryId, 
				courseId, 
				applicationStatusId }
			this.getTranscriptList(params)
				.then(response => {
					const res = response.data
					this.tables.students.items = res.data;
					this.paginations.student.from = res.meta.from
					this.paginations.student.to = res.meta.to
					this.paginations.student.totalRows = res.meta.total
					this.tables.students.isBusy = false
				})
		},
		loadCourseList(){
			var params = { paginate: false }
			this.getCourseList(params)
			.then(response => {
				const res = response.data
				this.options.courses.items = res
			})
		},
		loadDetails(row){
			if (!row.detailsShowing) {
				const { 
					id: transcriptId, 
					levelId,
					courseId,
					semesterId
				} = row.item

				const params = { paginate: false }
				this.isLoading = true
				this.getSubjectsOfTranscript(transcriptId, params)
					.then(({ data }) => {
						this.$set(row.item, 'subjects', data)
						this.isLoading = false
				})
				this.isLoading = true

				const rateSheetParams = { levelId, courseId, semesterId  }
      
				this.getRateSheetList(rateSheetParams)
					.then(({ data }) => {
						const res = data.data[0]
						console.log(res.fees)
						this.$set(row.item, 'fees', res.fees)
						// this.isLoading = false
					})
			}
			row.toggleDetails()
		},
    getName(item, child){
      if (item) {
        let value = item[child]
        if (value) {
          return value['name']
        }
      }
      return ''
		},
		addFee(fees, row){
      //console.log(row)
      fees.push({ 
        id: row.item.id,
        name : row.item.name,
        isIntegrated: row.item.isIntegrated,
        description: row.item.description,
        pivot:{ schoolFeeId: row.item.id, amount: 0.00, notes: "" }
      })
    },
		removeFee(fees, row){
			fees.splice(row.index, 1);
		},
  },
  computed: {
    subjectTotalAmount() {
      return subjects => {
        let amount = 0
        subjects.forEach(s => {
          console.log(s.totalAmount)
          amount += Number(s.totalAmount)
        })
        return amount.toFixed(2)
      }
    }
  }
}
</script>