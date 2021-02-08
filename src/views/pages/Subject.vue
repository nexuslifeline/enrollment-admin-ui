<template>
  <div class="c-page-content">
    <Card title="Subject Management">
      <div>
        <!-- add button and search -->
        <b-row class="mb-3">
          <b-col md=12>
            <b-row>
              <b-col md=6 class="bottom-space">
                <b-button
                  v-if="isAccessible($options.SubjectPermissions.ADD.id)"
                  variant="primary"
                  @click="onCreate()">
                  <v-icon name="plus-circle" /> ADD NEW SUBJECT
                </b-button>
              </b-col>
              <b-col md=3>
                <b-form-select
                  @input="loadSubjects()"
                  v-model="filters.subject.schoolCategoryId"
                  class="float-right">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- School Category --</b-form-select-option>
                  </template>
                  <b-form-select-option :value="null">None</b-form-select-option>
                  <b-form-select-option
                    v-for="category in options.schoolCategories.values"
                    :key="category.id"
                    :value="category.id">
                    {{category.name}}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col md=3>
                <b-form-input
                  v-model="filters.subject.criteria"
                  type="text"
                  placeholder="Search"
                  @update="loadSubjects()"
                  debounce="500">
                </b-form-input>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end add button and search -->
        <!-- table -->
        <b-row >
          <b-col md=12>
            <b-table
              class="c-table"
              small hover outlined show-empty responsive
              :fields="tables.subjects.fields"
              :busy="tables.subjects.isBusy"
              :items="tables.subjects.items">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon
                    name="spinner"
                    spin
                    class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  v-if="isAccessible([
                    $options.SubjectPermissions.EDIT.id,
                    $options.SubjectPermissions.EDIT_PRICE.id,
                    $options.SubjectPermissions.DELETE.id
                  ])"
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret>
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    v-if="isAccessible([
                      $options.SubjectPermissions.EDIT.id,
                      $options.SubjectPermissions.EDIT_PRICE.id
                    ])"
                    @click="setSubjectUpdate(row)"
                    :disabled="showModalEntry">
                    <v-icon name="pen" class="mr-1"/> Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.SubjectPermissions.DELETE.id)"
                    @click="forms.subject.fields.id = row.item.id, showModalConfirmation = true"
                    :disabled="showModalConfirmation">
                    <v-icon name="trash" class="mr-1"/> Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md=6>
                Showing {{ paginations.subject.from }} to {{ paginations.subject.to }} of {{ paginations.subject.totalRows }} records.
                </b-col>
              <b-col md=6>
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.subject.page"
                  :total-rows="paginations.subject.totalRows"
                  :per-page="paginations.subject.perPage"
                  size="sm"
                  align="end"
                  @input="loadSubjects()" />
                </b-col>
              </b-row>
          </b-col>
        </b-row>
      </div>
    </Card>
    <!-- Modal Entry -->
    <b-modal
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Subjects - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.subject.isLoading" rounded="sm">
        <b-row>
          <b-col md=12>
            <b-row>
              <b-col md=12>
                <b-form-group >
                  <label class="required">Subject Code</label>
                  <b-form-input
                    :disabled="!isAccessible([
                      $options.SubjectPermissions.ADD.id,
                      $options.SubjectPermissions.EDIT.id
                    ])"
                    ref="name"
                    v-model="forms.subject.fields.name"
                    :state="forms.subject.states.name" />
                  <b-form-invalid-feedback>
                    {{forms.subject.errors.name}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=12>
                <b-form-group>
                  <label class="required">Description</label>
                  <b-form-textarea
                    :disabled="!isAccessible([
                      $options.SubjectPermissions.ADD.id,
                      $options.SubjectPermissions.EDIT.id
                    ])"
                    ref="description"
                    v-model="forms.subject.fields.description"
                    :state="forms.subject.states.description" />
                  <b-form-invalid-feedback>
                    {{forms.subject.errors.description}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=12>
                <b-form-group >
                  <label class="required">School Category</label>
                  <b-form-select
                    :disabled="!isAccessible([
                      $options.SubjectPermissions.ADD.id,
                      $options.SubjectPermissions.EDIT.id
                    ])"
                    v-model="forms.subject.fields.schoolCategoryId"
                    :state="forms.subject.states.schoolCategoryId"
                    @change="loadSubjectPrerequisite()">
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled>-- School Category --</b-form-select-option>
                    </template>
                    <b-form-select-option
                      v-for="schoolCategory in options.schoolCategories.values"
                      :key="schoolCategory.id"
                      :value="schoolCategory.id">
                      {{schoolCategory.name}}
                    </b-form-select-option>
                  </b-form-select>
                  <b-form-invalid-feedback>
                    {{forms.subject.errors.schoolCategoryId}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- <b-row>
              <b-col md=12>
                <b-form-group >
                  <label class="required">Department</label>
                  <b-form-select
                    v-model="forms.subject.fields.departmentId"
                    :state="forms.subject.states.departmentId">
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled>-- Department --</b-form-select-option>
                    </template>
                    <b-form-select-option
                      v-for="department in options.departments.items"
                      :key="department.id"
                      :value="department.id">
                      {{department.name}}
                    </b-form-select-option>
                  </b-form-select>
                  <b-form-invalid-feedback>
                    {{forms.subject.errors.departmentId}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row> -->
            <!-- <b-row>
              <b-col md=12>
                <b-form-group >
                  <label>Prerequisites
                    <v-icon
                      v-if="isLoading"
                      class="ml-2"
                      name="spinner"
                      spin/>
                  </label>
                  <Select2
                    multiple
                    :disabled="isLoading"
                    v-model="forms.subject.fields.prerequisites"
                    :allowClear="false">
                    <option
                      v-for="subject in options.subjects.items"
                      :key="subject.id"
                      :value="subject.id">
                      {{subject.name}}
                    </option>
                  </Select2>
                </b-form-group>
              </b-col>
            </b-row> -->
            <b-row>
              <b-col md=6>
                <b-form-group label="Lecture Units">
                  <vue-autonumeric
                    @input="computeTotalAmount()"
                    ref="units"
                    :disabled="!isAccessible([
                      $options.SubjectPermissions.ADD.id,
                      $options.SubjectPermissions.EDIT.id
                    ])"
                    v-model='forms.subject.fields.units'
                    :class="'form-control text-right'"
                    :options="[{
                      decimalPlaces: 0,
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
              <b-col md=6>
                <b-form-group label="Amount per Lecture Units">
                  <vue-autonumeric
                    @input="computeTotalAmount()"
                    ref="amountPerUnit"
                    :disabled="!isAccessible($options.SubjectPermissions.EDIT_PRICE.id)"
                    v-model='forms.subject.fields.amountPerUnit'
                    :class="'form-control text-right'"
                    :options="[{
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=6>
                <b-form-group label="Lab Units">
                  <vue-autonumeric
                    @input="computeTotalAmount()"
                    ref="labs"
                    :disabled="!isAccessible([
                      $options.SubjectPermissions.ADD.id,
                      $options.SubjectPermissions.EDIT.id
                    ])"
                    v-model='forms.subject.fields.labs'
                    :class="'form-control text-right'"
                    :options="[{
                      decimalPlaces: 0,
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
              <b-col md=6>
                <b-form-group label="Amount per Lab Units">
                  <vue-autonumeric
                    @input="computeTotalAmount()"
                    ref="amountPerLab"
                    :disabled="!isAccessible($options.SubjectPermissions.EDIT_PRICE.id)"
                    v-model='forms.subject.fields.amountPerLab'
                    :class="'form-control text-right'"
                    :options="[{
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=6>
                <b-form-group label="Total Units">
                  <vue-autonumeric
                    :disabled="true"
                    ref="totalUnits"
                    v-model='forms.subject.fields.totalUnits'
                    :class="'form-control text-right'"
                    :options="[{
                      decimalPlaces: 0,
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
              <b-col md=6>
                <b-form-group label="Total Amount">
                  <vue-autonumeric
                    :disabled="true"
                    ref="totalAmount"
                    v-model='forms.subject.fields.totalAmount'
                    :class="'form-control text-right'"
                    :options="[{
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0 }]">
                  </vue-autonumeric>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.subject.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onSubjectEntry()">
          <v-icon
            v-if="forms.subject.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- End Modal Entry -->
    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Delete Subject
      </div>
      Are you sure you want to delete this subject?
      <div slot="modal-footer">
        <b-button
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSubjectDelete()">
          <v-icon
            v-if="forms.subject.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Yes
        </b-button>
        <b-button
          class="btn-close"
          variant="outline-danger"
          @click="showModalConfirmation=false">
          No
        </b-button>
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
  </div>
</template>
<script>

const subjectFields = {
  id: null,
  code: null,
  name: null,
  description: null,
  schoolCategoryId: null,
  departmentId: null,
  units: null,
  amountPerUnit: null,
  labs: null,
  amountPerLab: null,
  totalUnits: null,
  totalAmount: null
}

import { SubjectApi, DepartmentApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification, formatNumber } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import { UserGroups, SchoolCategories, SubjectPermissions } from '../../helpers/enum'
// import Select2 from '../components/Select2'
import Tables from '../../helpers/tables'
import Access from '../../mixins/utils/Access'
import Card from '../components/Card'

export default {
  name: "Subject",
  components: {
    Card
  },
  mixins: [ SubjectApi, DepartmentApi, Tables, Access ],
  // components: { Select2 },
  SubjectPermissions,
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        subject: {
          isProcessing: false,
          isLoading: false,
          fields: { ...subjectFields },
          states: { ...subjectFields },
          errors: { ...subjectFields }
        }
      },
			tables: {
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
							label: "SUBJECT CODE",
							tdClass: "align-middle",
							thStyle: {width: "10%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
            // {
						// 	key: "department.name",
						// 	label: "DEPARTMENT",
						// 	tdClass: "align-middle",
						// 	thStyle: {width: "8%"}
            // },
            {
							key: "schoolCategory.name",
							label: "SCHOOL CATEGORY",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
            },
            // {
						// 	key: "prerequisites",
						// 	label: "PREREQUISITE",
						// 	tdClass: "align-middle",
            //   thStyle: {width: "10%"},
            //   formatter: (value, key, item) => {
            //      if (value.length > 0) {
            //        return value.map(subject => { return subject.name; }).join(", ");
            //      }
            //      return ''
            //   }
						// },
						{
							key: "units",
							label: "LEC UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "7%"}
            },
            // {
						// 	key: "amountPerUnit",
						// 	label: "AMT PER LEC",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
            //   thStyle: {width: "10%"},
            //   formatter: (value) => {
            //     return formatNumber(value)
            //   }
						// },
						{
							key: "labs",
							label: "LAB UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "7%"}
            },
            // {
						// 	key: "amountPerLab",
						// 	label: "AMT PER LAB",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
            //   thStyle: {width: "10%"},
            //   formatter: (value) => {
            //     return formatNumber(value)
            //   }
            // },
            // {
						// 	key: "totalAmount",
						// 	label: "TOTAL AMT",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
            //   thStyle: {width: "10%"},
            //   formatter: (value) => {
            //     return formatNumber(value)
            //   }
            // },
            {
              key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
            }
          ],
          items: [],
          filteredItems: []
				}
      },
      paginations: {
				subject: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        subject: {
          criteria: null,
          schoolCategoryId: null
        }
      },
      options: {
        schoolCategories: SchoolCategories,
        departments: {
          items: []
        },
        subjects: {
          items: []
        }
      },
      isLoading: false
		}
	},
	created(){
    this.loadSubjects()
    // this.loadDepartments()
	},
	methods: {
		loadSubjects(){
      const { subjects } = this.tables
      const { criteria, schoolCategoryId } = this.filters.subject
      const { subject, subject: { perPage, page }} = this.paginations

      subjects.isBusy = true

			const params = { paginate: true, perPage, page, criteria, schoolCategoryId }
      this.getSubjectList(params)
        .then(({ data }) => {
          subjects.items = data.data
          subject.from = data.meta.from
          subject.to = data.meta.to
          subject.totalRows = data.meta.total
          subjects.isBusy = false
        })
    },
    loadDepartments(){
      let params = { paginate: false }
      const { departments } = this.options
      this.getDepartmentList(params)
        .then(({ data }) => {
          departments.items = data
        })
    },
    onSubjectEntry(){
      const { subject, subject: { fields } } = this.forms
      const { subjects } = this.tables

      subject.isProcessing = true
      reset(subject)
      if(this.entryMode == "Add"){
        this.addSubject(fields)
          .then(({ data }) => {
            this.addRow(subjects, this.paginations.subject, data)
            subject.isProcessing = false
            showNotification(this, "success", "Subject created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            subject.isProcessing = false
            validate(subject, errors)
          })
      }
      else {
        const { fields } = this.forms.subject
        this.updateSubject(fields, fields.id)
          .then(({ data }) => {
            subject.isProcessing = false
            this.updateRow(subjects, data)
            showNotification(this, "success", "Subject updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            subject.isProcessing = false
            validate(subject, errors)
          })
      }
    },
    onSubjectDelete(){
      const { subject, subject: { fields: { id } } } = this.forms
      const { subjects } = this.tables
      subject.isProcessing = true
      this.deleteSubject(id)
        .then(({ data }) => {
          subject.isProcessing = false
          this.deleteRow(subjects, this.paginations.subject, id)
          showNotification(this, "success", "Subject deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setSubjectUpdate(row){
      const { subject, subject: { fields } } = this.forms
      this.showModalEntry = true
      subject.isLoading = true
      copyValue(row.item, fields)
      reset(subject)
      this.entryMode = "Edit"
      subject.isLoading = false
    },
    computeTotalAmount(){
      const { fields } = this.forms.subject
      fields.totalUnits = fields.units + fields.labs
      fields.totalAmount = (fields.units * fields.amountPerUnit) + (fields.labs * fields.amountPerLab)
    },
    onCreate(){
      const { subject, subject: { fields } } = this.forms
      this.showModalEntry = true
      subject.isLoading = true
      reset(subject)
      clearFields(fields)
      fields.units = 0
      fields.amountPerUnit = 0
      fields.labs = 0
      fields.amountPerLab = 0
      fields.departmentId = null
      fields.schoolCategoryId = null
      // fields.prerequisites = []
      this.entryMode='Add'
      subject.isLoading = false
    },
    checkRights(userType) {
      const userGroupId = localStorage.getItem('userGroupId')
      const userGroup = UserGroups.getEnum(Number(userGroupId))
      let result = true
			if (userGroup) {
				if (userGroup.userType == userType) {
          result = false
        }
      }

      if (UserGroups.SUPER_USER.id == userGroup.id) {
				result = false
      }

			return result
    },
    loadSubjectPrerequisite(){
      this.isLoading = true
      const { schoolCategoryId } = this.forms.subject.fields
      const { subjects } = this.options
      let params = { paginate: false, schoolCategoryId }
      this.getSubjectList(params)
        .then(({ data }) => {
          subjects.items = data
          this.isLoading = false
        })
    },
    filterBySchoolCategory() {
      const { subjects } = this.tables
      const { subject } = this.paginations
      const { schoolCategoryId } = this.filters.subject
      if (schoolCategoryId) {
        subjects.filteredItems = subjects.items.filter(s => s.schoolCategoryId === schoolCategoryId)
      }
      else {
        subjects.filteredItems = subjects.items
      }
      this.onFiltered(subjects.filteredItems, subject)
    },
	}
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .bottom-space {
    margin-bottom: 0px;

    @include for-size(phone-only) {
      margin-bottom: 15px;
    }

  }
</style>
