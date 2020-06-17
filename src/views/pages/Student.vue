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
								<b-form-radio-group @input="loadTranscript()" v-model="filters.student.transcriptStatusId">
									<b-form-radio :value="null">Show All</b-form-radio>
									<b-form-radio 
										v-for="status in transcriptStatuses.values" 
										:value="status.id" 
										:key="status.id">
										{{ status.name }}
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
							hover outlined small show-empty
							:fields="tables.students.fields"
							:items="tables.students.items"
							:busy="tables.students.isBusy"
							:filter="filters.student.criteria"
							:filter-included-fields="tables.students.filterIncludedFields"
						>
							<template v-slot:cell(name)="data">
								<b-media>
									<template v-slot:aside>
										<b-avatar rounded blank size="3rem" :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"></b-avatar>
										<!-- <b-img rounded blank blank-color="#ccc" width="64" alt="placeholder"></b-img> -->
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
									:variant="data.item.transcriptStatusId === transcriptStatuses.FINALIZED.id 
										? 'primary' 
										: 'warning'">
									{{ transcriptStatuses.getEnum(data.item.transcriptStatusId).name }}
								</b-badge>
							</template>
							<template v-slot:cell(action)="row">
								<b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
									<template v-slot:button-content>
										<b-icon-grip-horizontal></b-icon-grip-horizontal>
									</template>
									<b-dropdown-item 
                    v-if="row.item.transcriptStatusId === transcriptStatuses.DRAFT.id" 
                    @click="setApproval(row)">
                    Approve
                  </b-dropdown-item>
									<b-dropdown-item 
                    v-if="row.item.transcriptStatusId === transcriptStatuses.DRAFT.id" 
                    @click="setDisapproval(row)">
                    Reject
                  </b-dropdown-item>
									<b-dropdown-item @click="loadDetails(row)">{{ row.detailsShowing ? 'Hide' : 'View' }} Details</b-dropdown-item>
								</b-dropdown>
							</template>
							<template v-slot:row-details="data">
								<b-overlay :show="isLoading" rounded="sm">
									<b-row class="m-2">
										<b-col md="3">
											<h6>Level</h6>
											<h6>{{ getName(data.item, 'level') }}</h6>
										</b-col>
										<b-col md="4">
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
										<b-col md="3">
											<h6>School Year</h6>
											<h6>{{ getName(data.item, 'schoolYear') }}</h6>
										</b-col>
									</b-row>
									<b-card>
										<div v-if="data.item.subjects">
											<b-row class="mb-3">
                        <b-col md=6>
                          <h5 class="pt-2">SUBJECTS</h5>
                        </b-col>
                        <b-col md=6 v-if="data.item.transcriptStatusId === transcriptStatuses.DRAFT.id">
                          <b-button class="float-right" variant="outline-primary"
                            @click="onAddSubject(data.item.subjects)">
                            <b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT
                          </b-button>
                        </b-col>
                      </b-row>
											<b-table
												class="mb-4"
												hover outlined small responsive show-empty
												:fields="tables.subjects.fields"
												:items="data.item.subjects"
												:busy="tables.subjects.isBusy">
												<template v-slot:cell(action)="row">
													<b-button 
                            v-if="data.item.transcriptStatusId === transcriptStatuses.DRAFT.id"
														@click="removeSubject(data.item.subjects, row)" 
														size="sm" variant="danger">
														<b-icon-x></b-icon-x>
													</b-button>
												</template>
											</b-table>
										</div>
										<div v-if="data.item.admissionId">
											<h5>Files</h5>
											<b-table
												v-if="data.item.files"
												hover outlined small responsive show-empty
												:fields="tables.files.fields"
												:items="data.item.files"
												:busy="tables.files.isBusy">
												<template v-slot:cell(action)="row">
													<b-button 
														@click="previewFile(row)" 
														size="sm" variant="secondary">
														<b-icon-search></b-icon-search>
													</b-button>
												</template>
											</b-table>
										</div>
										
										<!-- <template v-slot:footer>
											<b-row>
												<b-col md=10>
													<h5 class="float-right font-weight-bold">TUITION FEE</h5>
												</b-col>
												<b-col md=2>
													<h5 class="float-right pr-2 font-weight-bold">P1,400.00</h5>
												</b-col>
											</b-row>
										</template> -->
									</b-card>
									<b-button
                    v-if="data.item.transcriptStatusId === transcriptStatuses.DRAFT.id"
                    @click="setApproval(data)"
                    class="float-right m-2" 
                    variant="outline-primary">Approve</b-button>
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
    <!-- Modal Preview -->
    <b-modal 
			v-model="showModalPreview"
			size="xl"
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Preview
			</div> <!-- modal title -->
			<b-row class="justify-content-md-center"> <!-- modal body -->
				<b-col md=12>
          <div v-if="file.src">
            <center>
              <b-img v-if="file.type.substr(0, file.type.indexOf('/')) == 'image'" :src="file.src" />
              <b-embed
                v-else
                type="iframe"
                aspect="16by9"
                allowfullscreen
                :src="file.src"
              ></b-embed>
            </center>
          </div>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          @click="showModalPreview=false">
          Close
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- Modal Preview -->
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
            v-model="forms.applicationAdmission.fields.ApprovalNotes"
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
          @click="onApproval()"
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
		<!-- Modal Reject --> 
		<b-modal 
			v-model="showModalRejection"
			centered
			header-bg-variant="danger"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Confirm Rejection
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Reason</label>
					<b-textarea
            v-model="forms.applicationAdmission.fields.disapprovalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalRejection=false">
          Cancel
        </b-button>
				<b-button 
          @click="onDisapproval()"
          class="float-right" variant="outline-primary">
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
    <!-- Modal Subject -->
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
						:busy="tables.subjects.isBusy">
						<template v-slot:cell(action)="row">
							<b-button 
                @click="addSubject(row)" 
                size="sm" variant="primary">
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
    <!-- Modal Subject -->
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, CourseApi, TranscriptApi, AdmissionFileApi, SubjectApi } from "../../mixins/api"
import { SchoolCategories, ApplicationStatuses, TranscriptStatuses, StudentFeeStatuses } from "../../helpers/enum"
import { showNotification } from "../../helpers/forms"

const transcriptFields = {
  transcriptStatusId: null
}

const studentFeeFields = {
  schoolYearId: null,
  semesterId: null,
  levelId: null,
  courseId: null,
  transcriptId: null,
  studentFeeStatusId: null
}

const applicationAdmissionFields = {
  approvalNotes: null,
  disapprovalNotes: null
}

export default {
	name: "Student",
	mixins: [StudentApi, CourseApi, TranscriptApi, AdmissionFileApi, SubjectApi],
	data() {
		return {
      showModalPreview: false,
			showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
			isLoading: false,
			transcriptStatuses: TranscriptStatuses,
      file: {
        type: null,
        src: null
      },
      forms: {
        transcript: {
          fields: { ...transcriptFields }
        },
        studentFee: {
          fields: { ...studentFeeFields}
        },
        applicationAdmission: {
          fields: { ...applicationAdmissionFields }
        },
        subjects: []
      },
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
						// {
						// 	key: "name",
						// 	label: "",
						// 	tdClass: "align-middle",
						// 	thStyle: { width: "45%" },
							
						// },
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
        files: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Filename",
							tdClass: "align-middle"
						},
						{
              key: "action",
              label: "",
							tdClass: "align-middle",
							thStyle: { width: "35px" }
            }
          ],
					items: []
				},
			},
			paginations: {
				student: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
        },
				subject: {
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
					transcriptStatusId: null
        },
        subject: {
          criteria: null
        }
			},
			options: {
				courses: {
					items: []
				},
				schoolCategories: SchoolCategories
      },
      isProcessing: false,
      studentSubjects: [],
      row: []
		}
	},
	created(){
		this.loadTranscript()
    this.loadCourseList()
    this.loadSubjects()
	},
	methods: {
    setApproval(row) {
      if (!row.item.subjects) {
        const { id: transcriptId } = row.item
        const params = { paginate: false }
        this.getSubjectsOfTranscript(transcriptId, params)
					.then(({ data }) => {
            this.$set(row.item, 'subjects', data)
            this.row = row.item
            this.showModalApproval = true
				})
      } else {
        this.row = row.item
        this.showModalApproval = true
      }
      
    },
    onApproval() {
      const { 
        id: transcriptId,
        applicationId,
        admissionId
      } = this.row

      const { 
        applicationAdmission: { fields: application },
        applicationAdmission: { fields: admission },
        transcript: { fields: transcript },
        studentFee: { fields: studentFee }
      } = this.forms

      const applicationAdmission = [
        { application },
        { admission }
      ]

      const index = applicationId ? 0 : 1

      let subjects = []

      this.row.subjects.forEach(subject => {
				subjects.push({
					subjectId: subject.id
				})
      })
      
      studentFee.schoolYearId = this.row.schoolYearId,
      studentFee.semesterId = this.row.semesterId,
      studentFee.levelId = this.row.levelId,
      studentFee.courseId = this.row.courseId,
      studentFee.studentFeeStatusId = StudentFeeStatuses.DRAFT.id
      studentFee.transcriptId = transcriptId

      transcript.transcriptStatusId = TranscriptStatuses.FINALIZED.id

      const data = {
        ...applicationAdmission[index],
        studentFee,
        ...transcript,
        subjects
      }

      this.isProcessing = true;
      this.updateTranscript(data, transcriptId).then(({ data }) => {
        this.row.transcriptStatusId = TranscriptStatuses.FINALIZED.id
        this.isProcessing = false
        this.showModalApproval = false
        showNotification(this, "success", "Approved Successfully.")
      }).catch((error) => {
        console.log(error)
        this.isProcessing = false;
      });
    },
    setDisapproval(row) {
      console.log(row)
      this.row = row.item
      this.showModalRejection = true
    },
    onDisapproval() {
      const { 
        id: transcriptId,
        applicationId,
        admissionId
      } = this.row

      const { 
        applicationAdmission: { fields: application },
        applicationAdmission: { fields: admission },
        transcript: { fields: transcript }
      } = this.forms

      const data = applicationId 
      ? { application: { 
            ...application,
            applicationStatusId: ApplicationStatuses.REJECTED.id,
            applicationStepId: this.row.application.applicationStepId - 1
          } 
        } 
        : { admission: { 
            ...admission,
            applicationStatusId: ApplicationStatuses.REJECTED.id,
            admissionStepId: this.row.admission.admissionStepId - 1
          }
        }

      this.isProcessing = true;
      this.updateTranscript(data, transcriptId).then(({ data }) => {
        this.loadTranscript()
        this.isProcessing = false
        this.showModalRejection = false
        showNotification(this, "success", "Rejected Successfully.")
      }).catch((error) => {
        console.log(error)
        this.isProcessing = false;
      });
    },
		loadTranscript(){
      const { students } = this.tables
      const { student, student: { perPage, page } } = this.paginations
      students.isBusy = true
      const { transcriptStatusId, schoolCategoryId, courseId } = this.filters.student
			const applicationStatusId = ApplicationStatuses.SUBMITTED.id
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
					admissionId
				} = row.item

				const params = { paginate: false }
				this.isLoading = true
				this.getSubjectsOfTranscript(transcriptId, params)
					.then(({ data }) => {
						this.$set(row.item, 'subjects', data)
						this.isLoading = false
				})
				if (admissionId) {
					this.isLoading = true
					this.getAdmissionFileList(admissionId, params)
						.then(({ data }) => {
							this.$set(row.item, 'files', data)
							this.isLoading = false
					})
				}
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
    previewFile(row) {
      const { admissionId, id } = row.item
      this.file.type = null
      this.file.src = null
      this.getAdmissionFilePreview(admissionId, id)
        .then(response => {
          this.file.type = response.headers.contentType
          const file = new Blob([response.data], { type: response.headers.contentType })
          const reader = new FileReader();
          
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
          this.showModalPreview = true
        })
    },
    loadSubjects(){
      const { subjects } = this.tables
      const { subject, subject: { perPage, page } } = this.paginations
      subjects.isBusy = true
			let params = { paginate: true, perPage, page }
			this.getSubjectList(params)
				.then(response => {
					const res = response.data
          subjects.items = res.data
          subject.from = res.meta.from
					subject.to = res.meta.to
					subject.totalRows = res.meta.total
					subjects.isBusy = false
				})
    },
    onAddSubject(subjects){
      this.studentSubjects = subjects
      this.showModalSubjects = true
    },
		addSubject(row){
			this.studentSubjects.push(row.item)
		},
		removeSubject(subjects, row){
			subjects.splice(row.index, 1)
		}
  },
}
</script>