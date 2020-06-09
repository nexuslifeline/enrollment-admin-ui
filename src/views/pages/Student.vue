<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<b-tabs pills>
									<b-tab @click="filters.student.schoolCategoryId = null, loadStudentList()" active title="All" />    						
									<b-tab v-for="schoolCategory in options.schoolCategories.values" 
										:key="schoolCategory.id"
										:title="schoolCategory.name"
                    @click="filters.student.schoolCategoryId = schoolCategory.id, loadStudentList()"/>
								</b-tabs>
							</b-col>
							<b-col md=3>
								<b-form-select @change="loadStudentList()" v-model="filters.student.courseId" class="float-right w-100">
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
									<b-form-radio :value=1>Approved</b-form-radio>
									<b-form-radio :value=2>Pending</b-form-radio>
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
										<b-avatar rounded blank size="3rem" :text="data.item.firstName.charAt(0) + '' + data.item.lastName.charAt(0)"></b-avatar>
										<!-- <b-img rounded blank blank-color="#ccc" width="64" alt="placeholder"></b-img> -->
									</template>
									<span>{{ data.item.name }}</span><br>
									<small>{{ data.item.address ? 
                    data.item.address.address + ", " 
                    + data.item.address.city + ", " 
                    + data.item.address.province + ", " 
                    + data.item.address.country : "" }}
                  </small>
								</b-media>
							</template>
							<template v-slot:cell(education)="data">
								<span>{{ getName(data.item.transcript, 'level') + " " 
                  + getName(data.item.transcript, 'semester') + " " 
                  + getName(data.item.transcript, 'studentType') }}</span><br>
                <small>{{ getName(data.item.transcript, 'course') }}</small>
							</template>
							<template v-slot:cell(action)="row">
								<b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
									<template v-slot:button-content>
										<b-icon-grip-horizontal></b-icon-grip-horizontal>
									</template>
									<b-dropdown-item @click="showModalApproval=true">Approve</b-dropdown-item>
									<b-dropdown-item @click="showModalRejection=true">Reject</b-dropdown-item>
									<b-dropdown-item @click="row.toggleDetails()">View Details</b-dropdown-item>
								</b-dropdown>
							</template>
							<template v-slot:row-details="data">
                <b-row class="m-2">
                  <b-col md="3">
                    <h6>Level</h6>
                    <h6>{{ getName(data.item.transcript, 'level') }}</h6>
                  </b-col>
                  <b-col md="4">
                    <div v-show="getName(data.item.transcript, 'course') != ''">
                      <h6>Course</h6>
                      <h6>{{ getName(data.item.transcript, 'course') }}</h6>
                    </div>
                  </b-col>
                  <b-col md="2">
                    <div v-show="getName(data.item.transcript, 'course') != ''">
                      <h6>Semester</h6>
                      <h6>{{ getName(data.item.transcript, 'semester') }}</h6>
                    </div>
                  </b-col>
                  <b-col md="3">
                    <h6>School Year</h6>
                    <h6>{{ getName(data.item.transcript, 'schoolYear') }}</h6>
                  </b-col>
                </b-row>
                <b-card>
                  <div v-if="data.item.transcript">
                    <h5>Subjects</h5>
                    <b-table
                      class="mb-4"
                      hover outlined small responsive show-empty
                      :fields="tables.subjects.fields"
                      :items="data.item.transcript.subjects"
                      :busy="tables.subjects.isBusy">
                    </b-table>
                  </div>
                  <div v-if="data.item.activeAdmission">
                    <h5>Files</h5>
                    <b-table
                      v-if="data.item.activeAdmission.files.length > 0"
                      hover outlined small responsive show-empty
                      :fields="tables.files.fields"
                      :items="data.item.activeAdmission.files"
                      :busy="tables.files.isBusy">
                      <template v-slot:cell(action)="row">
                        <b-button 
                          @click="previewFile(row)" 
                          size="sm" variant="secondary">
                          <b-icon-x></b-icon-x>
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
                <b-button class="float-right m-2" variant="outline-primary">Approve</b-button>
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
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalApproval=false">
          Cancel
        </b-button>
				<b-button class="float-right" variant="outline-primary">
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
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalRejection=false">
          Cancel
        </b-button>
				<b-button class="float-right" variant="outline-primary">
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
	</div> <!-- main container -->
</template>
<script>
import { StudentApi, CourseApi, TranscriptApi, AdmissionFileApi } from "../../mixins/api"
import { SchoolCategories } from "../../helpers/enum"
export default {
	name: "Student",
	mixins: [StudentApi, CourseApi, TranscriptApi, AdmissionFileApi],
	data() {
		return {
      showModalPreview: false,
			showModalApproval: false,
      showModalRejection: false,
      file: {
        type: null,
        src: null
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
							thStyle: { width: "49%"},
							formatter: (value, key, item) => {
								if(!item.middleName){
									item.middleName = ""
								}
								item.name = item.firstName + " " + item.middleName + " " + item.lastName
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
              thStyle: { width: "49%"},
              formatter: (value, key, item) => {
								if (item.active_application) {
                  const { transcript } = item.active_application
                  return transcript.course.name
                } else {
                  // item.transcript = item.active_admission.transcript
                }
							} 
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
              tdClass: "align-middle"
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
		this.loadStudentList()
		this.loadCourseList()
	},
	methods: {
		loadStudentList(){
      this.tables.students.isBusy = true
      const { applicationStatusId, schoolCategoryId, courseId } = this.filters.student
      const { perPage, page } = this.paginations.student
			let params = { paginate: true, perPage, page, applicationStatusId, schoolCategoryId, courseId }
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
		loadCourseList(){
			let params = { paginate: false }
			this.getCourseList(params)
			.then(response => {
				const res = response.data
				this.options.courses.items = res
			})
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
    }
  },
}
</script>