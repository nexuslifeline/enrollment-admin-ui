<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Subjects <br>
          <small>List of all subjects of the student.</small>
        </span>
      </h5>
      <b-card-body>
        <b-table 
          details-td-class="table-secondary"
          hover outlined small show-empty
          :fields="tables.transcripts.fields"
          :items="tables.transcripts.items"
          :busy="tables.transcripts.isBusy">
          <template v-slot:cell(name)="{item: { student } }">
            <b-media>
              <template v-slot:aside>
                <b-avatar 
                  rounded 
                  blank 
                  size="64" 
                  :text="student.firstName.charAt(0) + '' + student.lastName.charAt(0)"
                  :src="avatar(student)" />
              </template>
              <span>{{ student.name }}</span><br>
              <small>Student no.: {{ student.studentNo ? student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ student.address ? 
                student.address.currentCompleteAddress : "" }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(contact)="{item: student}">
            Email : {{ student.email }} <br>
            <small>Phone : {{ student.phoneNo }}</small> <br>
            <small>Mobile : {{ student.mobileNo }}</small> <br>
          </template>
          <template v-slot:cell(education)="{ item }">
            <span>{{ getName(item, 'level') + " " 
              + getName(item, 'semester') + " " 
              + getName(item, 'studentType') }}</span><br>
            <small v-if="item.course">{{item.course.description}} {{item.course.major ? `(${item.course.major})` : ''}}</small>
          </template>
          <template v-slot:cell(status)>
            <b-badge
              variant='primary'>
              Enrolled
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <v-icon 
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'" 
              @click="loadDetails(row)" />
          </template>
          <template v-slot:row-details="data">
            <b-overlay :show="isLoading" rounded="sm">
              <b-row class="m-2">
                <b-col md="3">
                  <h6>Level</h6>
                  <h6>{{ getName(data.item, 'level') }}</h6>
                </b-col>
                <b-col md="4">
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
                <b-col md="3">
                  <h6>School Year</h6>
                  <h6>{{ getName(data.item, 'schoolYear') }}</h6>
                </b-col>
              </b-row>
              <b-card>
                <div v-if="data.item.subjects">
                  <b-row class="mb-3">
                    <b-col md=12>
                      <h5 class="pt-2">SUBJECTS</h5>
                    </b-col>
                  </b-row>
                  <div class="details__section-button-container">
                    <div class="section__container">
                      <label>Section</label>
                      <b-form-select
                        class="section-select"
                        v-model="data.item.sectionId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Section --</b-form-select-option>
                        </template>
                        <b-form-select-option 
                          v-for="section in filterSection(item)" 
                          :key="section.id" 
                          :value="section.id">
                          {{ section.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </div>
                    <button class="btn btn-outline-primary add-subject-button"
                      @click="onAddSubject(data.item)">
                      <v-icon name="plus-circle" /> ADD SUBJECT
                    </button>
                  </div>
                  <b-table
                    class="mb-4"
                    hover outlined small responsive show-empty
                    :fields="tables.subjects.fields"
                    :items="data.item.subjects"
                    :busy="tables.subjects.isBusy">
                    <template v-slot:cell(action)="row">
                      <b-button 
                        @click="removeSubject(data.item.subjects, row)" 
                        size="sm" variant="danger">
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                  </b-table>
                </div>
              </b-card>
              <b-button
                @click="loadDetails(data)"
                class="float-right my-2 mr-2" 
                variant="outline-danger">Cancel</b-button>
              <b-button
                @click="setApproval(data)"
                class="float-right m-2" 
                variant="outline-primary">Update</b-button>
            </b-overlay>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import { StudentApi, TranscriptApi } from '../../../mixins/api'
import { StudentCategories, TranscriptStatuses } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
export default {
  mixins: [ StudentApi, TranscriptApi ],
  components: {
    EvaluationEntry
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentTranscriptList()
  },
  data() {
    return {
      studentCategories: StudentCategories,
      transcriptStatuses: TranscriptStatuses,
      tables: {
        transcripts: {
					isBusy: false,
					filterIncludedFields: ["firstName", "lastName"],
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "30%"}
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
							label: "Status",
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
						// 	thStyle: {width: "6%"}
						// },
						{
							key: "name",
							label: "Subject Code",
							tdClass: "align-middle",
							thStyle: {width: "12%"}
						},
						{
							key: "description",
							label: "Description",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
						{
							key: "units",
							label: "Lec Units",
							tdClass: "align-middle text-center",
							thClass: "text-right text-center",
							thStyle: {width: "8%"}
            },
            // {
						// 	key: "amountPerUnit",
						// 	label: "Amount per Lec Unit",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
						// 	thStyle: {width: "16%"}
						// },
						{
							key: "labs",
							label: "Lab Units",
							tdClass: "align-middle text-center",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            // {
						// 	key: "amountPerLab",
						// 	label: "Amount per Lab",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
						// 	thStyle: {width: "13%"}
            // },
            {
							key: "totalUnits",
							label: "Total Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
              thStyle: {width: "12%"}
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
        },
        files: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Filename",
							tdClass: "align-middle",
              thStyle: { width: "40%" }
						},
            {
							key: "notes",
							label: "Notes",
							tdClass: "align-middle",
              thStyle: { width: "auto" }
						},
						{
              key: "action",
              label: "",
							tdClass: "align-middle",
							thStyle: { width: "35px" }
            }
          ],
					items: []
        }
      },
      options: {
        sections: {
          items: []
        }
      },
    }
  },
  methods: {
    loadStudentTranscriptList() {
      const transcriptStatusId = TranscriptStatuses.ENROLLED.id
      const params = { paginate: false, transcriptStatusId }
      const { transcripts } = this.tables
      transcripts.isBusy = true
      this.getTranscriptsOfStudent(this.studentId, params)
      .then(({ data }) => {
        transcripts.isBusy = false
        transcripts.items = data
      })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
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
    setUpdate(row) {
      this.forms.evaluation.fields = row.item
      this.showEntry = true
    },
    loadDetails(row){
      console.log(row)
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
        
				// if (admissionId) {
				// 	this.isLoading = true
				// 	this.getAdmissionFileList(admissionId, params)
				// 		.then(({ data }) => {
				// 			this.$set(row.item, 'files', data)
				// 			this.isLoading = false
				// 	})
        // }
			}
			row.toggleDetails()
    },
    filterSection(item) {
      const sect=
         this.options.sections.items.filter(s => 
          s.schoolYearId === item.schoolYearId 
              && s.levelId === item.levelId 
                  && s.courseId === item.courseId 
                    && s.semesterId === item.semesterId )
      return sect
    }
  }
}
</script>
<style scoped lang="scss">
	@import "../../../assets/scss/shared.scss";

	.details__section-button-container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .add-subject-button {
    width: 175px;

    @include for-size(phone-only) {
      width: 100%;
    }
  }

  .section__container {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 10px;
    
    label {
      margin-right: 10px;
    }

   .section-select {
      width: 200px;
   }

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
      margin-right: 0;
      margin-bottom: 10px;
      width: 100%;

      .section-select {
        width: 100%;
      }
      
    }
  }
</style>