<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .bottom-space {
    margin-bottom: 0px;
    
    @include for-size(phone-only) {
      margin-bottom: 15px;
    }

  }
</style> 
<template>
  <div>
    <b-row>
      <b-col md=12>
        <b-card>
          <b-card-body>
            <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md=12>
                <b-row>
                  <b-col md=8 class="bottom-space">
                    <b-button variant="outline-primary" 
                      @click="onCreate()">
                      <v-icon name="plus-circle" /> ADD NEW SUBJECT
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.subject.criteria"
                      type="text" 
                      placeholder="Search">
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
									small hover outlined show-empty
									:fields="tables.subjects.fields"
                  :busy="tables.subjects.isBusy"
                  :items="tables.subjects.items" 
                  :current-page="paginations.subject.page"
                  :per-page="paginations.subject.perPage"
                  :filter="filters.subject.criteria"
                  @filtered="onFiltered($event, paginations.subject)">
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
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <v-icon name="ellipsis-v" />
                      </template>
                      <b-dropdown-item 
                        @click="setSubjectUpdate(row)" >
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.subject.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
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
                      v-model="paginations.subject.page"
                      :total-rows="paginations.subject.totalRows"
                      :per-page="paginations.subject.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.subject)" />
                    </b-col>
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <!-- Modal Entry -->
    <b-modal 
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Subjects - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
				<b-col md=6>
          <b-form-group >
            <label class="required">Code</label>
            <b-form-input 
              ref="code" 
              v-model="forms.subject.fields.code" 
              :state="forms.subject.states.code" />
            <b-form-invalid-feedback>
              {{forms.subject.errors.code}}
            </b-form-invalid-feedback>
          </b-form-group>
				</b-col>
        <b-col md=6>
          <b-form-group >
            <label class="required">Name</label>
            <b-form-input 
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
				<b-col md=6>
          <b-form-group >
            <label class="required">School Category</label>
            <b-form-select 
              v-model="forms.subject.fields.schoolCategoryId"
              :state="forms.subject.states.schoolCategoryId"
              @input="forms.subject.fields.departmentId=null">
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
        <b-col md=6>
          <b-form-group >
            <label class="required">Department</label>
            <b-form-select 
              v-model="forms.subject.fields.departmentId"
              :state="forms.subject.states.departmentId"
              :disabled="
                  forms.subject.fields.schoolCategoryId === null || 
                  forms.subject.fields.schoolCategoryId === options.schoolCategories.PRE_SCHOOL.id || 
                  forms.subject.fields.schoolCategoryId === options.schoolCategories.PRIMARY_SCHOOL.id || 
                  forms.subject.fields.schoolCategoryId === options.schoolCategories.JUNIOR_HIGH_SCHOOL.id"
              >
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
			</b-row>
      <b-row>
        <b-col md=6>
          <b-form-group label="Lecture Units">
            <vue-autonumeric
              @input="computeTotalAmount()"
              ref="units"
              :disabled="checkRights(1)"
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
              :disabled="checkRights(2)"
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
              :disabled="checkRights(1)"
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
              :disabled="checkRights(2)"
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
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import { UserGroups, SchoolCategories } from '../../helpers/enum'
import Tables from '../../helpers/tables'
export default {
	name: "Subject",
	mixins: [ SubjectApi, DepartmentApi, Tables ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        subject: {
          isProcessing: false,
          fields: { ...subjectFields },
          states: { ...subjectFields },
          errors: { ...subjectFields }
        }
      },
			tables: {
				subjects: {
          isBusy: false,
					fields: [
            {
							key: "code",
							label: "Code",
							tdClass: "align-middle",
							thStyle: {width: "6%"}
						},
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "12%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
            {
							key: "department.name",
							label: "DEPARTMENT",
							tdClass: "align-middle",
							thStyle: {width: "8%"}
            },
            {
							key: "schoolCategory.name",
							label: "SCHOOL CATEGORY",
							tdClass: "align-middle",
							thStyle: {width: "10%"}
						},
						{
							key: "units",
							label: "LEC UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "7%"}
            },
            {
							key: "amountPerUnit",
							label: "AMOUNT PER LEC",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "10%"}
						},
						{
							key: "labs",
							label: "LAB UNITS",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "7%"}
            },
            {
							key: "amountPerLab",
							label: "AMOUNT PER LAB",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "10%"}
            },
            {
							key: "totalAmount",
							label: "TOTAL AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "10%"}
            },
            {
              key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
            }
          ],
          items:[]
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
          criteria: null
        }
      },
      options: {
        schoolCategories: SchoolCategories,
        departments: {
          items: []
        }
      }
		}
	},
	created(){
    this.loadSubjects()
    this.loadDepartments()
	},
	methods: {
		loadSubjects(){
      const { subjects } = this.tables
      const { subject } = this.paginations

      subjects.isBusy = true

			let params = { paginate: false }
      this.getSubjectList(params)
        .then(({ data }) => {
          subjects.items = data
          subject.totalRows = data.length
          this.recordDetails(subject)
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
      copyValue(row.item, fields)
      reset(subject)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    computeTotalAmount(){
      const { fields } = this.forms.subject
      fields.totalUnits = fields.units + fields.labs
      fields.totalAmount = (fields.units * fields.amountPerUnit) + (fields.labs * fields.amountPerLab)
    },
    onCreate(){
      const { subject } = this.forms
      reset(subject)
      clearFields(subject.fields)
      subject.fields.units = 0
      subject.fields.amountPerUnit = 0
      subject.fields.labs = 0
      subject.fields.amountPerLab = 0
      subject.fields.departmentId = null
      subject.fields.schoolCategoryId = null
      this.entryMode='Add'
      this.showModalEntry = true
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
    }
	}
}
</script>