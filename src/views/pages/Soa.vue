<template>
  <div class="c-page-content">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">Statement of Account</h4>
      </div>
      <div>
         <SchoolCategoryTabs
          :showAll="true"
          @loadSchoolCategoryId="filters.billing.schoolCategoryId = $event, loadBillings()"
          @clickAll="filters.billing.schoolCategoryId = null, loadBillings()"
          @click="filters.billing.schoolCategoryId = $event, loadBillings()"
        />
      </div>
      <div>
        <b-row class="mb-2"> <!-- row button and search input -->
          <b-col md="8">
            <b-form-radio-group @input="loadBillings()" v-model="filters.billing.billingStatusId">
              <b-form-radio :value="null">Show All</b-form-radio>
              <b-form-radio
                v-for="status in $options.BillingStatuses.values"
                :value="status.id"
                :key="status.id">
              {{ status.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
          <b-col md="4">
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="8">
            <b-button variant="primary"
              @click="setCreateSoa()">
              <v-icon name="plus-circle" /> Generate Soa
            </b-button>
            <b-button variant="primary"
              class="ml-2"
              @click="setCreateBatchSoa()">
              <v-icon name="plus-circle" /> Batch Generate Soa
            </b-button>
          </b-col>
          <b-col md="4">
            <b-form-input
              v-model="filters.billing.criteria"
              debounce="500"
              @update="loadBillings()"
              type="text"
              placeholder="Search">
            </b-form-input>
          </b-col>
        </b-row>
        <b-table
          details-td-class="table-secondary"
          hover outlined small show-empty
          :fields="tables.billings.fields"
          :items="tables.billings.items"
          :busy="tables.billings.isBusy">
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
                <small>Address : {{ data.item.student.address ? data.item.student.currentAddress ? data.item.student.currentAddress :  data.item.student.address.currentCompleteAddress : '' }} </small>
              </b-media>
            </template>
            <template v-slot:cell(contact)="data">
              Email : {{ data.item.student.email }} <br>
              <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
              <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
            </template>
            <template v-slot:cell(billingStatusId)="{ value }">
              <b-badge :variant="value === $options.BillingStatuses.UNPAID.id ? 'danger' : 'success'">
                {{ $options.BillingStatuses.getEnum(value).name }}
              </b-badge>
            </template>
        </b-table>
        <b-row>
          <b-col md=6>
            Showing {{paginations.billing.from}} to {{paginations.billing.to}} of {{paginations.billing.totalRows}} records.
          </b-col>
          <b-col md=6>
            <b-pagination
              v-model="paginations.billing.page"
              :total-rows="paginations.billing.totalRows"
              :per-page="paginations.billing.perPage"
              size="sm"
              align="end"
              @input="loadBillings()"
            />
          </b-col>
        </b-row>
      </div>
    </div>
    <!-- MODAL ENTRY -->
    <b-modal
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
      size="lg">
			<div slot="modal-title">
        Generate SOA
			</div>
      <b-row>
        <b-col md="6">
          <b-form-group>
            <label class="required">Student</label>
            <vue-bootstrap-typeahead
              v-model="forms.billing.studentQuery"
              :serializer="s => { return `${s.studentNo ? s.studentNo : 'N/A'} - ${s.name}` }"
              :data="options.students.items"
              placeholder="Input student number or name"
              @hit="getStudentInfo($event)"
            >
              <template slot="suggestion" slot-scope="{ data }">
                <span>{{ `${data.studentNo ? data.studentNo : "N/A"} - ${data.name}` }}</span>
              </template>
            </vue-bootstrap-typeahead>
          </b-form-group>
          <b-form-group>
            <label>Student No.</label>
            <b-form-input
              disabled
              v-model="forms.billing.fields.student.studentNo" />
          </b-form-group>
          <b-form-group>
            <label>Name</label>
            <b-form-input
              disabled
              v-model="forms.billing.fields.student.name" />
          </b-form-group>
          <b-form-group>
            <label>Level</label>
            <b-form-input
              disabled
              v-model="forms.billing.fields.student.levelName" />
          </b-form-group>
          <b-form-group v-if="forms.billing.fields.student.courseName">
            <label>Course</label>
            <b-form-input
              disabled
              v-model="forms.billing.fields.student.courseName" />
          </b-form-group>
          <b-form-group v-if="forms.billing.fields.student.semesterName">
            <label>Semester</label>
            <b-form-input
              disabled
              v-model="forms.billing.fields.student.semesterName" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group>
            <label class="required">
              Terms
              <v-icon
                v-if="options.terms.isLoading"
                name="spinner"
                spin />
            </label>
            <b-form-select
              @input="getTermInfo()"
              :disabled="options.terms.isLoading"
              :state="forms.billing.states.termId"
              v-model="forms.billing.fields.termId">
              <template v-slot:first>
                <b-form-select-option :value="null">-- Select Term --</b-form-select-option>
              </template>
              <b-form-select-option
                v-for="term in options.terms.items"
                :key="term.id"
                :disabled="term.pivot ? term.pivot.isBilled === 1 : false"
                :value="term.id">
                {{ `${term.name} ${term.pivot ? term.pivot.isBilled === 1 ? '- Billed' : '' : ''}` }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{ forms.billing.errors.termId }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label>Previous Balance</label>
            <vue-autonumeric
              disabled
              v-model="forms.billing.fields.previousBalance"
              class="form-control text-right"
              :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
            </vue-autonumeric>
          </b-form-group>
          <b-form-group>
            <label>Amount</label>
            <vue-autonumeric
              disabled
              v-model="forms.billing.fields.totalAmount"
              class="form-control text-right"
              :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
            </vue-autonumeric>
          </b-form-group>
          <b-form-group>
            <label class="required">Due Date</label>
            <b-form-datepicker
              :state="forms.billing.states.dueDate"
              v-model="forms.billing.fields.dueDate" />
            <b-form-invalid-feedback>
              {{ forms.billing.errors.dueDate }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.billing.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onCreateSoa()">
          <v-icon
            v-if="forms.billing.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- MODAL BATCH -->
    <b-modal
			v-model="showModalBatch"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title">
        Generate Batch SOA
			</div>
      <b-form-group>
        <label class="required">School Category</label>
        <b-form-select
          @input="loadTerms(), forms.batchBilling.fields.levelId = null"
          v-model="forms.batchBilling.fields.schoolCategoryId" >
          <template v-slot:first>
            <b-form-select-option :value="null">-- Select School Category --</b-form-select-option>
          </template>
          <b-form-select-option
            v-for="schoolCategory in $options.SchoolCategories.values"
            :key="schoolCategory.id"
            :value="schoolCategory.id">
            {{ schoolCategory.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <b-form-group>
        <label class="required">Level</label>
        <b-form-select
          v-model="forms.batchBilling.fields.levelId" >
          <template v-slot:first>
            <b-form-select-option :value="null">-- ALL --</b-form-select-option>
          </template>
          <b-form-select-option
            v-for="level in options.levels.items.filter(l => l.schoolCategoryId === forms.batchBilling.fields.schoolCategoryId)"
            :key="level.id"
            :value="level.id">
            {{ level.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        v-if="[
          $options.SchoolCategories.COLLEGE.id,
          $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
          $options.SchoolCategories.VOCATIONAL.id
        ].includes(forms.batchBilling.fields.schoolCategoryId)">
        <label class="required">Semester</label>
        <b-form-select
          @input="loadTerms()"
          v-model="forms.batchBilling.fields.semesterId" >
          <template v-slot:first>
            <b-form-select-option :value="null">-- Select Semester --</b-form-select-option>
          </template>
          <b-form-select-option
            v-for="semester in $options.Semesters.values"
            :key="semester.id"
            :value="semester.id">
            {{ semester.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <b-form-group>
        <label class="required">
          Terms
          <v-icon
            v-if="options.terms.isLoading"
            name="spinner"
            spin />
        </label>
        <b-form-select
          :disabled="options.terms.isLoading"
          v-model="forms.batchBilling.fields.termId"
          :state="forms.batchBilling.states.termId">
          <template v-slot:first>
            <b-form-select-option :value="null">-- Select Term --</b-form-select-option>
          </template>
          <b-form-select-option
            v-for="term in options.terms.items"
            :key="term.id"
            :value="term.id">
            {{ term.name }}
          </b-form-select-option>
        </b-form-select>
        <b-form-invalid-feedback>
          {{ forms.batchBilling.errors.termId }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Due Date</label>
        <b-form-input
          type="date"
          v-model="forms.batchBilling.fields.dueDate"
          :state="forms.batchBilling.states.dueDate"/>
        <b-form-invalid-feedback>
          {{ forms.batchBilling.errors.dueDate }}
        </b-form-invalid-feedback>
      </b-form-group>
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalBatch=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.batchBilling.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onBatchCreateSoa()">
          <v-icon
            v-if="forms.batchBilling.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
  </div>
</template>
<script>
import SchoolCategoryTabs from '../components/SchoolCategoryTabs'
import { SchoolCategories, Semesters, BillingStatuses, BillingTypes } from '../../helpers/enum'
import { TermApi, BillingApi, LevelApi, StudentApi, SchoolYearApi, AcademicRecordApi } from '../../mixins/api'
import { clearFields, formatNumber, reset, showNotification, validate } from '../../helpers/forms'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'lodash'

const billingFields = {
  student: {
    studentNo: null,
    name: null,
    levelName: null,
    courseName: null,
    semesterName: null
  },
  semesterId: null,
  studentId: null,
  studentFeeId: null,
  termId: null,
  previousBalance: null,
  totalAmount: null,
  dueDate: null
}

const batchBillingFields = {
  schoolCategoryId: null,
  semesterId: null,
  dueDate: null,
  levelId: null,
  termId: null
}

export default {
  components: { SchoolCategoryTabs, VueBootstrapTypeahead },
  mixins: [ TermApi, BillingApi, LevelApi, StudentApi, SchoolYearApi, AcademicRecordApi ],
  SchoolCategories,
  Semesters,
  BillingStatuses,
  data() {
    return {
      showModalBatch: false,
      showModalEntry: false,
      tables: {
        billings: {
          isBusy: false,
          fields: [
            {
							key: "name",
							label: "Student",
							tdClass: "align-middle",
              thStyle: { width: "20%" },
            },
            {
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "20%" },
						},
            {
							key: "dueDate",
							label: "Due Date",
							tdClass: "align-middle",
              thStyle: { width: "130px"}
						},
						{
							key: "billingNo",
							label: "Billing No.",
							tdClass: "align-middle",
							thStyle: { width: "15%"}
            },
            	{
							key: "previousBalance",
							label: "Prev Balance",
              tdClass: "align-middle text-right",
              thClass: "text-right",
              thStyle: { width: "auto"},
              formatter: (value) => {
                return formatNumber(value)
              }
            },
						{
							key: "totalAmount",
							label: "Amount",
              tdClass: "align-middle text-right",
              thClass: "text-right",
              thStyle: { width: "auto"},
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
							key: "billingStatusId",
							label: "Status",
              tdClass: "align-middle text-center",
              thClass: "text-center",
              thStyle: { width: "10%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: { width: "40px"}
						},
          ],
          items: []
        }
      },
      forms: {
        batchBilling: {
          isProcessing: null,
          fields: { ...batchBillingFields },
          states: { ...batchBillingFields },
          errors: { ...batchBillingFields }
        },
        billing: {
          isProcessing: null,
          studentQuery: null,
          fields: { ...billingFields },
          states: { ...billingFields },
          errors: { ...billingFields }
        }
      },
      paginations: {
        billing: {
          from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
        }
      },
      filters: {
        billing: {
          criteria: null,
          schoolCategoryId: null,
          billingStatusId: null
        }
      },
      options: {
        terms: {
          isLoading: false,
          items: []
        },
        levels: {
          items: []
        },
        students: {
          isLoading: false,
          items: []
        }
      },
      activeSchoolYear: []
    }
  },
  created() {
    this.loadBillings()
    this.loadLevels()
    this.loadActiveSchoolYear()
  },
  methods: {
    loadBillings() {
      const { schoolCategoryId, criteria, billingStatusId } = this.filters.billing
      const { billings } = this.tables
      const { billing, billing: { perPage, page } } = this.paginations
      const orderBy = 'created_at'
      const sort = 'DESC'
      const params = {
        paginate: true,
        schoolCategoryId,
        criteria,
        perPage,
        page,
        billingStatusId,
        billingTypeId: BillingTypes.SOA.id,
        orderBy,
        sort
      }

      billings.isBusy = true
      this.getBillingList(params)
      .then(({ data }) => {
        billings.items = data.data
        billing.from = data.meta.from
        billing.to = data.meta.to
        billing.totalRows = data.meta.total
        billings.isBusy = false
      })
    },
    loadLevels() {
      const { levels } = this.options
      this.getLevelList({ paginate: false })
      .then(({ data }) => {
        levels.items = data
      })
    },
    loadTerms() {
      const { schoolCategoryId, semesterId } = this.forms.batchBilling.fields
      const { COLLEGE, SENIOR_HIGH_SCHOOL, VOCATIONAL } = this.$options.SchoolCategories
      if ([COLLEGE.id,
        SENIOR_HIGH_SCHOOL.id,
        VOCATIONAL.id].includes(schoolCategoryId) && !semesterId) {
        return
      }
      const { terms } = this.options
      const params = {
        paginate: false,
        schoolCategoryId,
        semesterId,
        activeSchoolYear: true
      }
      terms.isLoading = true
      this.getTermList(params)
      .then(({ data }) => {
        terms.items = data
        terms.isLoading = false
      })
    },
    loadStudents() {
      const { students } = this.options
      const { studentQuery } = this.forms.billing
      const params = {
        paginate: false,
        criteria: studentQuery
      }
      this.getStudentList(params)
      .then(({ data }) => {
        students.items = data
      })
    },
    loadActiveSchoolYear() {
      const params = {
        paginate: false,
        isActive: 1
      }
      this.getSchoolYearList(params)
      .then(({ data }) => {
        if (data) {
          this.activeSchoolYear = data[0]
        }
      })
    },
    loadStudentFeeTerms() {
      const { studentId, semesterId } = this.forms.billing.fields
      const { terms } = this.options
      const params = {
        schoolYearId: this.activeSchoolYear.id,
        semesterId,
        paginate: false
      }
      terms.isLoading = true
      this.getStudentFeeTermsOfStudent(studentId, params)
      .then(({ data }) => {
        terms.items = data
        terms.isLoading = false
      })
    },
    onBatchCreateSoa() {
      const { batchBilling, batchBilling: { fields, fields: { dueDate, termId, levelId }  } } = this.forms
      batchBilling.isProcessing = true
      reset(batchBilling)
      this.batchSoaBilling({ termId, dueDate, levelId })
      .then(({ data }) => {
        batchBilling.isProcessing = false
        this.loadBillings()
        this.showModalBatch = false
      }).catch(error => {
        const errors = error.response.data.errors
        batchBilling.isProcessing = false
        validate(batchBilling, errors)
      })
    },
    onCreateSoa() {
      const { billing, billing: { fields: { student, ...fields } } } = this.forms
      billing.isProcessing = true
      const data = {
        ...fields,
        schoolYearId: this.activeSchoolYear.id,
        billingStatusId: BillingStatuses.UNPAID.id,
        billingTypeId: BillingTypes.SOA.id
      }
      reset(billing)
      this.addBilling(data)
      .then(({ data }) => {
        billing.isProcessing = false
        this.loadBillings()
        this.showModalEntry = false
      }).catch(error => {
        const errors = error.response.data.errors
        billing.isProcessing = false
        validate(billing, errors)
      })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    getStudentInfo(student) {
      console.log(student)
      const { billing, billing: { fields } } = this.forms
      fields.studentId = student.id
      fields.student.studentNo = student.studentNo
      fields.student.name = student.name
      fields.semesterId = student.latestAcademicRecord?.semesterId
      billing.studentQuery = null
      this.loadStudentFeeTerms()
      if (student.latestAcademicRecord) {
        this.getAcademicRecord(student.latestAcademicRecord.id)
        .then(({ data }) => {
          fields.student.levelName = data.level.name
          fields.student.courseName = data.course.name
          fields.student.semesterName = data.semester.name
        })
      }
    },
    getTermInfo() {
      const { fields, fields: { termId } } = this.forms.billing
      const { terms } = this.options
      const term = terms.items.find(t => t.id === termId)
      if (term) {
        fields.previousBalance = term.previousBalance
        fields.totalAmount = term.pivot.amount
        fields.studentFeeId = term.pivot.studentFeeId
      }
    },
    setCreateSoa() {
      const { billing, billing: { fields } } = this.forms
      reset(billing)
      clearFields(fields)
      fields.termId = null
      this.showModalEntry = true
    },
    setCreateBatchSoa() {
      const { batchBilling, batchBilling: { fields } } = this.forms
      reset(batchBilling)
      clearFields(fields)
      fields.semesterId = null
      fields.levelId = null
      fields.schoolCategoryId = null
      fields.termId = null
      this.showModalBatch = true
    }
  },
  watch: {
    'forms.billing.studentQuery': _.debounce(function() { this.loadStudents() }, 500)
  }
}
</script>