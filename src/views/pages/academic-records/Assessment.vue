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
          :fields="tables.studentFees.fields"
          :items="tables.studentFees.items"
          :busy="tables.studentFees.isBusy">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon
                name="spinner"
                spin
                class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
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
              <span><b-link @click="loadDetails(data)">{{ data.item.student.name }}</b-link></span><br>
              <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ data.item.student.address ?
                data.item.student.address.currentCompleteAddress : "" }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(contact)="{item: { student }}">
            Email : {{ student.email }} <br>
            <small>Phone : {{ student.phoneNo }}</small> <br>
            <small>Mobile : {{ student.mobileNo }}</small> <br>
          </template>
          <template v-slot:cell(education)="{ item }">
            <span>{{ getName(item, 'level') + " "
              + getName(item, 'semester') }}</span><br>
            <small v-if="item.course">{{item.course.description}} {{item.course.major ? `(${item.course.major})` : ''}}</small>
          </template>
          <template v-slot:cell(status)>
            <b-badge
              variant='primary'>
              Approved
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <v-icon
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'"
              @click="loadDetails(row)" />
          </template>
          <template v-slot:row-details="data">
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
                <b-col md="3">
                  <b-form-group>
                    <label>Status</label>
                    <b-form-select
                      disabled
                      v-model="data.item.studentFeeStatusId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Status --</b-form-select-option>
                      </template>
                      <b-form-select-option
                        v-for="status in studentFeeStatuses.values"
                        :key="status.id"
                        :value="status.id">
                        {{ status.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
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
              <b-card v-if="data.item.studentFeeItems">
                <b-row class="mb-3">
                  <b-col md=4>
                    <h5 class="pt-2">STUDENT FEES</h5>
                  </b-col>
                  <b-col md=4 class="text-center">
                  </b-col>
                  <b-col md=4>
                    <b-button
                      @click="onAddFees(data.item.studentFeeItems)"
                      variant="outline-primary"
                      class="float-right">
                      <v-icon name="plus-circle" /> New Item
                    </b-button>
                  </b-col>
                </b-row>
                <b-table
                  hover outlined small responsive show-empty
                  :fields="tables.studentFeeItems.fields"
                  :items="data.item.studentFeeItems"
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
                      @click="removeFee(data.item.studentFeeItems, row)"
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
                        label-cols="6">
                        <vue-autonumeric
                          class="form-control text-right"
                          v-model="data.item.enrollmentFee"
                          :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                        </vue-autonumeric>
                      </b-form-group>
                    </b-col>
                    <!-- <b-col md=4>
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
                    </b-col> -->
                    <b-col offset-md=4 md=2>
                      <h5 class="float-right font-weight-bold">Total</h5>
                    </b-col>
                    <b-col md=2>
                      <h5 class="float-right font-weight-bold">{{ feesTotalAmount(data.item, data.item.studentFeeItems) }}</h5>
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
                  @click="onUpdateStudentFees(data.item)"
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
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-modal
			v-model="showModalFees"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title">
					School Fees
			</div>
			<b-row>
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
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon
                  name="spinner"
                  spin
                  class="mr-2" />
                <strong>Loading...</strong>
              </div>
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
                @input="recordDetails(paginations.fee)"
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
  </div>
</template>
<script>
import { StudentApi, LevelApi, CourseApi, SchoolFeeApi, StudentFeeApi } from '../../../mixins/api'
import { StudentCategories, Semesters, SchoolCategories, Fees, StudentFeeStatuses } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import tables from '../../../helpers/tables'
import { showNotification, formatNumber } from '../../../helpers/forms'
export default {
  mixins: [ StudentApi, LevelApi, CourseApi, SchoolFeeApi, StudentFeeApi, tables ],
  components: {
    EvaluationEntry
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentFeesList()
    this.loadCourseList()
    this.loadLevelList()
    this.loadFees()
  },
  data() {
    return {
      fees: Fees,
      isProcessing: false,
      studentCategories: StudentCategories,
      studentFeeStatuses: StudentFeeStatuses,
      semesters: Semesters,
      studentFees: [],
      showModalFees: false,
      tables: {
        studentFees: {
					isBusy: false,
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
        studentFeeItems: {
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
      filters: {
        fee: {
          criteria: null
        }
      },
      paginations: {
        fee: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				},
      }
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
    loadStudentFeesList() {
      const studentFeeStatusId = StudentFeeStatuses.APPROVED.id
      const params = { paginate: false, studentFeeStatusId }
      const { studentFees } = this.tables
      studentFees.isBusy = true
      this.getStudentFeesOfStudent(this.studentId, params)
      .then(({ data }) => {
        studentFees.items = data
        studentFees.isBusy = false
      })
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
    loadDetails(row) {
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
    },
    onAddFees(fees) {
      this.studentFees = fees
      this.showModalFees = true
    },
		addFee(row) {
      const { item } = row
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
    onUpdateStudentFees(row) {
      const {
        id: studentFeeId,
        levelId,
        studentFeeStatusId,
        courseId,
        semesterId,
        studentFeeItems: rawFees
      } = row

      let studentFeeItems = rawFees.map(fee => {
        const { id: schoolFeeId, pivot: { amount, notes } } = fee
        // row.totalAmount += amount
				return { schoolFeeId, amount, notes }
      })

      const data = {
        levelId,
        studentFeeStatusId,
        courseId,
        semesterId,
        studentFeeItems
      }

      this.isProcessing = true;
      this.updateStudentFee(data, studentFeeId)
      .then(({ data }) => {
        this.isProcessing = false
        this.loadStudentFeesList()
        showNotification(this, "success", "Updated Successfully.")
      }).catch((error) => {
				const errors = error.response.data.errors
        this.isProcessing = false;
      });
    }
  },
  computed: {
    feesTotalAmount() {
      return (item, fees) => {
        let amount = 0
        fees.forEach(fee => {
          amount += Number(fee.pivot.amount)
        })
        item.totalAmount = amount
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
