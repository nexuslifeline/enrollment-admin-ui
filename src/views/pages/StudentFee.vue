<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<b-tabs pills>
									<b-tab 
										@click="filters.student.schoolCategoryId = null, loadTranscript()"
										active
										title="All" />
									<b-tab v-for="schoolCategory in options.schoolCategories.values" 
										:key="schoolCategory.id"
										:title="schoolCategory.name"
										:active="schoolCategoryId == schoolCategory.id"
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
								<b-form-radio-group @input="loadTranscript()" v-model="filters.student.applicationStatusId">
									<b-form-radio :value="null">Show All</b-form-radio>
									<b-form-radio 
										:value="applicationStatuses.APPROVED.id">
										Approved
									</b-form-radio>
									<b-form-radio 
										:value="applicationStatuses.SUBMITTED.id">
										Pending
									</b-form-radio>
								</b-form-radio-group>
							</b-col>

							<b-col md="4">
								<b-form-input
									v-model="filters.student.criteria"
                  debounce="500"
                  @update="loadTranscript()"
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
							:busy="tables.students.isBusy">
							<template v-slot:cell(name)="data">
								<b-media>
									<template v-slot:aside>
										<b-avatar rounded blank size="3rem" :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"></b-avatar>										<!-- <b-img rounded blank blank-color="#ccc" width="64" alt="placeholder"></b-img> -->
									</template>
								  <span>{{ data.item.student.name }}</span><br>
                  <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
									<small>Address : {{ data.item.student.address ? 
                    data.item.student.address.currentCompleteAddress : "" }}
                  </small>
								</b-media>
							</template>
							<template v-slot:cell(education)="data">
								<span>{{ getName(data.item, 'level') + " " 
                  + getName(data.item, 'semester') + " " 
                  + getName(data.item, 'studentType') }}</span><br>
                <small>{{ getName(data.item, 'course') }}</small>
							</template>
              <template v-slot:cell(status)="data">
								<b-badge
									:variant="(data.item.applicationId ? 
                  data.item.application.applicationStatusId === applicationStatuses.APPROVED.id : 
                  data.item.admission.applicationStatusId === applicationStatuses.APPROVED.id)
										? 'primary' 
										: 'warning'">
									{{ applicationStatuses.getEnum(data.item.applicationId ? 
                    data.item.application.applicationStatusId : 
                    data.item.admission.applicationStatusId).name }}
								</b-badge>
							</template>
							<template v-slot:cell(action)="row">
								<v-icon name="caret-down" @click="loadDetails(row)" />
							</template>
							<template v-slot:row-details="data">
                <b-overlay :show="isLoading" rounded="sm">
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
                          <h5 class="float-right pr-2 font-weight-bold">{{ subjectsTotalAmount(data.item.subjects) }}</h5>
                        </b-col>
                      </b-row>
                    </template>
                  </b-card>
                  <b-card v-if="data.item.fees">
                    <b-row class="mb-3">
                      <b-col md=6>
                        <h5 class="pt-2">STUDENT FEES</h5>
                      </b-col>
                      <b-col md=6>
                        <b-button 
                          @click="onAddFees(data.item.fees)"
                          v-if="data.item.applicationId ? 
                            data.item.application.applicationStatusId === applicationStatuses.SUBMITTED.id : 
                            data.item.admission.applicationStatusId === applicationStatuses.SUBMITTED.id" 
                          variant="outline-primary" 
                          class="float-right">
                          <v-icon name="plus-circle" /> New Item
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-table
                      hover outlined small responsive show-empty
                      :fields="tables.studentFees.fields"
                      :items="data.item.fees"
                      :busy="tables.studentFees.isBusy">
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
                        <b-button
                          v-if="(data.item.applicationId ? 
                              data.item.application.applicationStatusId === applicationStatuses.SUBMITTED.id : 
                              data.item.admission.applicationStatusId === applicationStatuses.SUBMITTED.id) 
                              && row.item.id !== fees.TUITION_FEE.id"
                          @click="removeFee(data.item.fees, row)" 
                          size="sm" variant="danger">
                          <v-icon name="trash" />
                        </b-button>
                      </template>
                    </b-table>
                    <template v-slot:footer>
                      <b-row>
                        <b-col md=4>
                          <b-form-group
                            label="INITIAL FEE TOTAL :"
                            label-for="enrollmentFee"
                            label-class="font-weight-bold"
                            label-cols="4">
                            <vue-autonumeric
                              class="form-control text-right"
                              v-model="data.item.enrollmentFee"
                              :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                            </vue-autonumeric>
                          </b-form-group>
                        </b-col>
                        <b-col md=4>
                          <b-form-group
                            label="PREVIOUS BALANCE :"
                            label-for="enrollmentFee"
                            label-class="font-weight-bold"
                            label-cols="4">
                            <vue-autonumeric
                              class="form-control text-right"
                              v-model="data.item.previousBalance"
                              :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                            </vue-autonumeric>
                          </b-form-group>
                        </b-col>
                        <b-col md=2>
                          <h5 class="float-right font-weight-bold">Total</h5>
                        </b-col>
                        <b-col md=2>
                          <h5 class="float-right font-weight-bold">{{ feesTotalAmount(data.item.fees) }}</h5>
                        </b-col>
                      </b-row>
                    </template>
                  </b-card>
                  <b-row class="mb-3">
                    <b-col md=12>
                      <b-button 
                        v-if="data.item.applicationId ? 
                          data.item.application.applicationStatusId === applicationStatuses.SUBMITTED.id : 
                          data.item.admission.applicationStatusId === applicationStatuses.SUBMITTED.id" 
                        @click="approveFees(data)"
                        class="float-right mr-2"
                        variant="outline-primary">
                        <v-icon
                          v-if="isProcessing"
                          name="sync"
                          class="mr-2"
                          spin
                        />
                        Approve
                      </b-button>
                    </b-col>
                  </b-row>
                </b-overlay>
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
    <!-- MODAL FEES -->
		<b-modal 
			v-model="showModalFees"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title"> <!-- modal title -->
					School Fees
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
          <b-row class="mb-2">
            <b-col offset-md="8" md="4">
              <b-form-input
                v-model="filters.fee.criteria"
                type="text" 
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.fees.items"
						:fields="tables.fees.fields"
            :filter="filters.fee.criteria"
						:busy="tables.fees.isBusy2"
            :current-page="paginations.fee.page"
            :per-page="paginations.fee.perPage"
            @filtered="onFiltered($event, paginations.fee)">
						<template v-slot:cell(action)="row">
							<b-button 
                @click="addFee(row)" 
                size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
						</template>
					</b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.fee.from}} to {{paginations.fee.to}} of {{paginations.fee.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.fee.page"
                :total-rows="paginations.fee.totalRows"
                :per-page="paginations.fee.perPage"
                size="sm"
                align="end"
                @input="recordDetails()"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-right"
          variant="outline-danger"
          @click="showModalFees=false">
          Close
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, CourseApi, TranscriptApi, RateSheetApi, SchoolFeeApi } from "../../mixins/api"
import { SchoolCategories, TranscriptStatuses, ApplicationStatuses, StudentFeeStatuses, Fees, UserGroups } from "../../helpers/enum"
import { showNotification, formatNumber } from "../../helpers/forms"
import Tables from "../../helpers/tables"
export default {
	name: "StudentFee",
	mixins: [StudentApi, CourseApi, TranscriptApi, RateSheetApi, SchoolFeeApi, Tables],
	data() {
		return {
			showModalFees: false,
      applicationStatuses: ApplicationStatuses,
      fees: Fees,
      isProcessing: false,
			tables: {
				students: {
					isBusy: false,
					filterIncludedFields: ["firstName", "lastName"],
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "45%"},
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
							thStyle: { width: "45%"}
            },
            {
							key: "status",
							label: "Status",
							tdClass: "align-middle",
							thStyle: { width: "8%"}
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
							label: "LEC UNITS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            {
							key: "amountPerUnit",
							label: "AMOUNT PER LEC UNIT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "13%"}
						},
						{
							key: "labs",
							label: "LAB UNITS",
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
				studentFees: {
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
            },
            {
							key: "action",
							label: "",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "5px"}
						}
					],
					items: []
        },
        fees: {
          fields: [
            {
							key: "name",
							label: "NAME",
							tdClass: "align-middle",
							thStyle: {width: "30%"}
						},
						{
							key: "description",
							label: "Description",
							tdClass: "align-middle",
							thStyle: {width: "40%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "30%"}
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
        },
        fee: {
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
        },
        fee: {
          criteria: null
        }
			},
			options: {
				courses: {
					items: []
				},
				schoolCategories: SchoolCategories
      },
      schoolCategoryId: null,
      studentFees: []
		}
	},
	created(){
		this.checkRights()
    this.loadCourseList()
    this.loadFees()
	},
	methods: {
    approveFees(row) {
      const { 
        id: transcriptId,
        applicationId,
        admissionId,
        enrollmentFee
      } = row.item

      const applicationAdmission = [
        { application: {
            applicationStatusId: ApplicationStatuses.APPROVED.id
          } 
        },
        { admission: {
            applicationStatusId: ApplicationStatuses.APPROVED.id
          } 
        }
      ]

      const index = applicationId ? 0 : 1

      let fees = []
      let totalAmount = 0

      row.item.fees.forEach(fee => {
				fees.push({ 
          schoolFeeId: fee.id, 
          amount: fee.pivot.amount, 
          notes: fee.pivot.notes 
        })
        totalAmount += fee.pivot.amount
      })

      const data = {
        ...applicationAdmission[index],
        studentFee: {
          studentFeeStatusId: StudentFeeStatuses.APPROVED.id,
          totalAmount,
          enrollmentFee: enrollmentFee
        },
        id: transcriptId,
        fees
      }

      this.isProcessing = true;
      this.updateTranscript(data, transcriptId).then(({ data }) => {
        const form = applicationId ? 'application' : 'admission'
        row.item[form].applicationStatusId = ApplicationStatuses.APPROVED.id
        this.isProcessing = false
        showNotification(this, "success", "Approved Successfully.")
      }).catch((error) => {
        console.log(error)
        this.isProcessing = false;
      });
    },
		loadTranscript(){
      const { students } = this.tables
      const { student, student: { perPage, page } } = this.paginations
      students.isBusy = true
      const { applicationStatusId, schoolCategoryId, courseId, criteria } = this.filters.student
			const transcriptStatusId = TranscriptStatuses.FINALIZED.id
			let params = { 
				paginate: true, 
				perPage, page, 
				transcriptStatusId, 
				schoolCategoryId, 
				courseId, 
        applicationStatusId,
        criteria }
			this.getTranscriptList(params)
				.then(response => {
					const res = response.data
					students.items = res.data;
					student.from = res.meta.from
					student.to = res.meta.to
					student.totalRows = res.meta.total
					students.isBusy = false
				})
		},
		loadCourseList(){
			let params = { paginate: false }
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
          semesterId,
          schoolCategoryId
				} = row.item

				const params = { paginate: false }
				this.isLoading = true
				this.getSubjectsOfTranscript(transcriptId, params)
					.then(({ data }) => {
						this.$set(row.item, 'subjects', data)
            const rateSheetParams = { levelId, courseId, semesterId  }
            this.getRateSheetList(rateSheetParams)
              .then(({ data }) => {
                const res = data.data
                this.$set(row.item, 'enrollmentFee', res[0] ? res[0].enrollmentFee : 0)
                this.$set(row.item, 'previousBalance', 0)
                this.$set(row.item, 'fees', res[0] ? res[0].fees : [])
              
                const schoolCategories = [
                  SchoolCategories.SENIOR_HIGH_SCHOOL.id,
                  SchoolCategories.COLLEGE.id,
                  SchoolCategories.GRADUATE_SCHOOL.id
                ]

                if (schoolCategories.indexOf(schoolCategoryId) !== -1) {
                  const tuitionFee = row.item.fees.find(fee => fee.id === Fees.TUITION_FEE.id)
                  let amount = 0
                  let notes = ""
                  
                  row.item.subjects.forEach(subject => {
                    amount += Number(subject.totalAmount)
                    notes += subject.code + ", "
                  })

                  if(tuitionFee) {
                    tuitionFee.pivot.amount = amount
                    tuitionFee.pivot.notes = notes.replace(/,\s*$/, "");
                  } else {
                    row.item.fees.unshift({
                      id: Fees.TUITION_FEE.id,
                      name : Fees.TUITION_FEE.name,
                      pivot:{ amount: amount, notes: notes }
                    })
                  }
                }
                this.isLoading = false
              })
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
    onAddFees(fees) {
      this.studentFees = fees
      this.showModalFees = true
    },
		addFee(row) {
      const { item } = row
      // check if rate sheet exist in the table
      const result = this.studentFees.find(fee => fee.id === item.id)
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.')
        return
      }
      this.studentFees.push({ 
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
    loadFees(){
      const { fees } = this.tables
      const { fee } = this.paginations
      const params = { paginate: false }
      fees.isBusy = true
      this.getSchoolFeeList(params)
        .then(({ data }) => {
          fees.items = data
          fee.totalRows = data.length
          this.recordDetails(fee)
          fees.isBusy = false
      })
    },
    checkRights(){
			const userGroupId = localStorage.getItem('userGroupId')
			const userGroup = UserGroups.getEnum(Number(userGroupId))
			let result = false
			if (userGroup) {
				this.filters.student.schoolCategoryId = userGroup.schoolCategoryId
				this.schoolCategoryId = userGroup.schoolCategoryId
			}
			this.loadTranscript()
    }
  },
  computed: {
    subjectsTotalAmount() {
      return subjects => {
        let amount = 0
        subjects.forEach(s => {
          amount += Number(s.totalAmount)
        })
        return formatNumber(amount)
      }
    },
    feesTotalAmount() {
      return fees => {
        let amount = 0
        fees.forEach(fee => {
          amount += Number(fee.pivot.amount)
        })
        return formatNumber(amount)
      }
    }
  }
}
</script>