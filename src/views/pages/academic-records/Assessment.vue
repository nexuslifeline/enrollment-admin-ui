<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Assessment <br>
          <small>List of all assessment of the student.</small>
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
              Finalized
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <v-icon
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'"
              @click="loadDetails(row)" />
          </template>
          <template v-slot:row-details="data">
            <b-overlay :show="isLoading" rounded="sm">
              <b-card>
                <b-row>
                  <b-col md="3">
                    <b-form-group>
                      <label>Level</label>
                      <b-form-select
                        @change="checkSchoolCategory(data)"
                        v-model="data.item.levelId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Level --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="level in options.levels.items"
                          :key="level.id"
                          :value="level.id">
                          {{ level.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <!-- <b-col md="3">
                    <b-form-group>
                      <label>Assessment Status</label>
                      <b-form-select
                        v-model="data.item.applicationStatusId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Status --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="status in transcriptStatuses.values"
                          :key="status.id"
                          :value="status.id">
                          {{ status.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col> -->
                  <b-col md="3">
                    <b-form-group>
                      <label>School Year</label>
                      <b-form-input
                        v-model="data.item.schoolYear.name"
                        readonly />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.courseId">
                  <b-col md="5">
                    <b-form-group>
                      <label>Course</label>
                      <b-form-select
                        v-model="data.item.courseId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="course in options.courses.items"
                          :key="course.id"
                          :value="course.id">
                          {{`${course.description} ${(course.major ? course.major : '')}`}}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>Semester</label>
                      <b-form-select
                        v-model="data.item.semesterId">
                        <b-form-select-option
                          v-for="semester in semesters.values"
                          :key="semester.id"
                          :value="semester.id">
                          {{semester.name}}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <hr>
                <b-card v-if="data.item.fees">
                    <b-row class="mb-3">
                      <b-col md=4>
                        <h5 class="pt-2">STUDENT FEES</h5>
                      </b-col>
                      <b-col md=4 class="text-center">
                        <!-- <span v-if="data.item.msg" class="text-danger font-weight-bold">{{ data.item.msg }}</span> -->
                      </b-col>
                      <b-col md=4>
                        <b-button
                          @click="onAddFees(data.item.fees)"
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
                        <b-form-input
                          v-model="row.item.pivot.notes" />
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
                          v-if="row.item.id !== fees.TUITION_FEE.id"
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
                <template v-slot:footer>
                  <b-button
                    @click="loadDetails(data)"
                    class="float-right my-2 mr-2"
                    variant="outline-danger">Cancel</b-button>
                  <b-button
                    :disabled="isProcessing"
                    @click="onUpdateSubjects(data.item)"
                    class="float-right m-2"
                    variant="outline-primary">
                    <v-icon
                      v-if="isProcessing"
                      name="sync"
                      spin />
                    Update
                  </b-button>
                </template>
              </b-card>
            </b-overlay>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import { StudentApi, TranscriptApi, LevelApi, CourseApi } from '../../../mixins/api'
import { StudentCategories, TranscriptStatuses, Semesters, SchoolCategories, Fees } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import tables from '../../../helpers/tables'
import { showNotification, formatNumber } from '../../../helpers/forms'
export default {
  mixins: [ StudentApi, TranscriptApi, LevelApi, CourseApi, tables ],
  components: {
    EvaluationEntry
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentTranscriptList()
    this.loadCourseList()
    this.loadLevelList()
  },
  data() {
    return {
      fees: Fees,
      isProcessing: false,
      studentCategories: StudentCategories,
      transcriptStatuses: TranscriptStatuses,
      semesters: Semesters,
      showModalSubjects: false,
      studentSubjects: [],
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
      options: {
        courses: {
          items: []
        },
        levels: {
          items: []
        }
      },
    }
  },
  methods: {
    loadLevelList() {
      const { levels } = this.options
      const params = { paginate: false }
      this.getLevelList(params)
      .then(({ data }) => {
        levels.items = data
      })
    },
    loadCourseList() {
      const { courses } = this.options
      const params = { paginate: false }
      this.getCourseList(params)
      .then(({ data }) => {
        courses.items = data
      })
    },
    loadStudentTranscriptList() {
      const transcriptStatusId = TranscriptStatuses.FINALIZED.id
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
    loadDetails(row){
			if (!row.detailsShowing) {
				const {
					id: transcriptId,
					admissionId
				} = row.item
        const params = { paginate: false }

				this.isLoading = true
				this.getStudentFeeOfTranscript(transcriptId)
        .then(({ data }) => {
          this.$set(row.item, 'enrollmentFee', data.enrollmentFee)
          this.$set(row.item, 'previousBalance', data.billings[0].previousBalance )
          this.$set(row.item, 'fees', data.studentFeeItems)
          this.$set(row.item, 'isComputedByUnits', data.isComputedByUnits)
          this.isLoading = false
        })
			}
			row.toggleDetails()
    },
    checkSchoolCategory(row) {
      const categories = [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id,
        SchoolCategories.VOCATIONAL.id
      ]
      const { item } = row
      const { items } = this.options.levels

      const level = items.find(level => level.id === item.levelId)
      const schoolCategoryId = level.schoolCategoryId;

      if (!categories.includes(schoolCategoryId)) {
        item.courseId = null
        item.semesterId = null
      }
    }
  },
  computed: {
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