<template>
	<div class="c-app">
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
                <b-tabs pills>
                  <SchoolCategoryTabs
                    :showAll="true" 
                    :schoolCategoryId="schoolCategoryId"
                    @clickAll="filters.student.schoolCategoryId = null, filters.student.courseId = null, loadTranscript()"
                    @click="filters.student.schoolCategoryId = $event, filters.student.courseId = null, loadTranscript()" />
                </b-tabs>
							</b-col>
							<b-col md=3>
							</b-col>
						</b-row>
						<hr>
						<b-row class="mb-2"> <!-- row button and search input -->
							<b-col md="6">
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
              <b-col md="3">
                <b-form-select
                  v-if="filters.student.schoolCategoryId === options.schoolCategories.SENIOR_HIGH_SCHOOL.id || 
                    filters.student.schoolCategoryId === options.schoolCategories.COLLEGE.id || 
                    filters.student.schoolCategoryId === options.schoolCategories.GRADUATE_SCHOOL.id" 
                  @change="loadTranscript()" 
                  v-model="filters.student.courseId" 
                  class="float-right">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                  </template>
                  <b-form-select-option :value="null">None</b-form-select-option>
                  <b-form-select-option 
                    v-for="course in options.courses.items" 
                    :key="course.id" 
                    :value="course.id">
                    {{course.description}} {{course.major ? `(${course.major})` : ''}}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
							<b-col md="3">
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
										<b-avatar 
                      rounded 
                      blank 
                      size="64" 
                      :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                      :src="avatar(data.item.student)" />										
									</template>
								  <span>{{ data.item.student.name }}</span><br>
                  <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
									<small>Address : {{ data.item.student.address ? 
                    data.item.student.address.currentCompleteAddress : "" }}
                  </small>
								</b-media>
							</template>
              <template v-slot:cell(contact)="data">
                Email : {{ data.item.student.email }} <br>
                <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
                <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
              </template>
							<template v-slot:cell(education)="data">
								<span>{{ getName(data.item, 'level') + " " 
                  + getName(data.item, 'semester') + " " 
                  + getName(data.item, 'studentType') }}</span><br>
                <small v-if="data.item.course">{{data.item.course.description}} {{data.item.course.major ? `(${data.item.course.major})` : ''}}</small>
							</template>
              <template v-slot:cell(status)="data">
								<b-badge
									:variant="(data.item.applicationId ? 
                  data.item.application.applicationStatusId === applicationStatuses.SUBMITTED.id : 
                  data.item.admission.applicationStatusId === applicationStatuses.SUBMITTED.id)
										? 'warning' 
										: 'primary'">
									{{ (data.item.applicationId ? 
                  data.item.application.applicationStatusId === applicationStatuses.SUBMITTED.id : 
                  data.item.admission.applicationStatusId === applicationStatuses.SUBMITTED.id) ? 'Pending' : 'Approved' }}
								</b-badge>
							</template>
							<template v-slot:cell(action)="row">
								<v-icon 
                  :name="row.detailsShowing ? 'caret-down' : 'caret-left'" 
                  @click="loadDetails(row)" />
							</template>
							<template v-slot:row-details="data">
                <b-overlay :show="data.item.isLoading" rounded="sm">
                  <b-row class="m-2">
                    <b-col md="2">
                      <h6>Level</h6>
                      <h6>{{ getName(data.item, 'level') }}</h6>
                    </b-col>
                    <b-col md="2">
                      <div v-if="getName(data.item, 'course') != ''">
                        <h6>Course</h6>
                        <h6>{{data.item.course.description}} {{data.item.course.major ? `(${data.item.course.major})` : ''}}</h6>
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
                      <h6>Section</h6>
                      <h6>{{ getName(data.item, 'section') }}</h6>
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
                      <b-col md=4>
                        <h5 class="pt-2">STUDENT FEES</h5>
                      </b-col>
                      <b-col md=4 class="text-center">
                        <span v-if="data.item.msg" class="text-danger font-weight-bold">{{ data.item.msg }}</span>
                      </b-col>
                      <b-col md=4>
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
                          :disabled="row.item.id === fees.TUITION_FEE.id && data.item.isComputedByUnits === 1"
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
                        @click="setApproveFees(data)"
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
    <!-- Modal Approval -->
		<b-modal 
			v-model="showModalApproval"
			centered
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Finalize Approval
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Notes</label>
					<b-textarea 
            v-model="approvalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalApproval=false">
          Cancel
        </b-button>
				<b-button 
          @click="approveFees()"
          class="float-right" 
          variant="outline-primary">
          <v-icon
            v-if="isProcessing"
            name="sync"
            class="mr-2"
            spin
          />
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, CourseApi, TranscriptApi, RateSheetApi, SchoolFeeApi } from "../../mixins/api"
import { SchoolCategories, TranscriptStatuses, ApplicationStatuses, StudentFeeStatuses, Fees, UserGroups, BillingTypes, BillingStatuses } from "../../helpers/enum"
import { showNotification, formatNumber } from "../../helpers/forms"
import SchoolCategoryTabs from "../components/SchoolCategoryTabs"
import Tables from "../../helpers/tables"
export default {
	name: "StudentFee",
  mixins: [StudentApi, CourseApi, TranscriptApi, RateSheetApi, SchoolFeeApi, Tables],
  components: {
    SchoolCategoryTabs
  },
	data() {
		return {
      showModalFees: false,
      showModalApproval: false,
      approvalNotes: null,
      applicationStatuses: ApplicationStatuses,
      fees: Fees,
      isProcessing: false,
			tables: {
				students: {
					isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "30%"},
							formatter: (value, key, item) => {
								if(!item.student.middleName){
									item.student.middleName = ""
								}
								item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
							} 
            },
            {
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "30%" },
							
						},
						{
							key: "education",
							label: "Education Level",
							tdClass: "align-middle",
							thStyle: { width: "25%"}
            },
            {
							key: "status",
							label: "Assessment Status",
              tdClass: "align-middle text-center",
              thClass: "text-center",
							thStyle: { width: "12%"}
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
            // {
						// 	key: "code",
						// 	label: "Code",
						// 	tdClass: "align-middle",
						// 	thStyle: {width: "8%"}
						// },
						{
							key: "name",
							label: "Subject Code",
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
              thStyle: {width: "13%"},
              formatter: (value) => {
                return formatNumber(value)
              }
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
              thStyle: {width: "13%"},
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
							key: "totalAmount",
							label: "TOTAL AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
              thStyle: {width: "15%"},
              formatter: (value) => {
                return formatNumber(value)
              }
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
      studentFees: [],
      row: []
		}
	},
	created(){
		this.checkRights()
    this.loadCourseList()
    this.loadFees()
	},
	methods: {
    setApproveFees(row) {
      this.approvalNotes = null
      this.row = row
      this.showModalApproval = true
    },
    approveFees() {
      const { 
        item,
        item: {
          id: transcriptId,
          applicationId,
          admissionId,
          enrollmentFee,
          previousBalance,
          student,
          isComputedByUnits
        }
      } = this.row

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

      item.fees.forEach(fee => {
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
          isComputedByUnits,
          enrollmentFee: enrollmentFee,
          approvalNotes: this.approvalNotes
        },
        id: transcriptId,
        fees,
        billing: {
          dueDate: '2020-08-24',
          totalAmount: enrollmentFee,
          studentId: student.id,
          billingTypeId: BillingTypes.INITIAL_FEE.id,
          billingStatusId: BillingStatuses.UNPAID.id,
          schoolYearId: item.schoolYearId,
          semesterId: item.semesterId,
          previousBalance
        },
        billingItem: {
          item: 'Registration Fee',
          amount: enrollmentFee
        }
      }

      this.isProcessing = true;
      this.updateTranscript(data, transcriptId).then(({ data }) => {
        const form = applicationId ? 'application' : 'admission'
        item[form].applicationStatusId = ApplicationStatuses.APPROVED.id
        this.isProcessing = false
        this.showModalApproval = false
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
          schoolCategoryId,
          application,
          admission
				} = row.item

				const params = { paginate: false }
				this.$set(row.item, 'isLoading', true)
				this.getSubjectsOfTranscript(transcriptId, params)
					.then(({ data }) => {
            this.$set(row.item, 'subjects', data)
            let applicationStatusId = null
            if (application) {
              applicationStatusId = application.applicationStatusId
            } else {
              applicationStatusId = admission.applicationStatusId
            }
            if (applicationStatusId === ApplicationStatuses.SUBMITTED.id) {
              const rateSheetParams = { levelId, courseId, semesterId  }
              this.getRateSheetList(rateSheetParams)
                .then(({ data }) => {
                  const res = data.data
                  this.$set(row.item, 'enrollmentFee', res[0] ? res[0].enrollmentFee : 0)
                  this.$set(row.item, 'previousBalance', 0)
                  this.$set(row.item, 'isComputedByUnits', res[0] ? res[0].isComputedByUnits : 0)
                  this.$set(row.item, 'fees', res[0] ? res[0].fees : [])
                  if (res.length > 0) {
                    if (res[0].isComputedByUnits) {
                      const tuitionFee = row.item.fees.find(fee => fee.id === Fees.TUITION_FEE.id)
                      let amount = 0
                      let notes = ""
                      
                      row.item.subjects.forEach(subject => {
                        amount += Number(subject.totalAmount)
                        notes += subject.name + ", "
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
                  } else {
                    this.$set(row.item, 'msg', 'No rate sheet fee is set.')
                  }
                  row.item.isLoading = false
                })
            } else {
              this.getStudentFeeOfTranscript(transcriptId)
                .then(({ data }) => {
                  this.$set(row.item, 'enrollmentFee', data.enrollmentFee)
                  this.$set(row.item, 'previousBalance', data.billings[0].previousBalance )
                  this.$set(row.item, 'fees', data.studentFeeItems)
                  this.$set(row.item, 'isComputedByUnits', data.isComputedByUnits)
                  row.item.isLoading = false
                })
              
            }
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
    
      // let result2
      // if ([Fees.TUITION_FEE_PER_UNIT.id, Fees.TUITION_FEE.id].includes(item.id)) {
      //   result2 = this.studentFees.find(fee => [Fees.TUITION_FEE_PER_UNIT.id, Fees.TUITION_FEE.id].includes(fee.id))
      // }

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
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
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
    },
  }
}
</script>