<template>
  <div class="c-app">
    <b-row>
      <b-col md=12>
        <b-card>
          <b-card-body>
            <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md=12>
                <b-row>
                  <b-col md=8>
                    <b-button variant="outline-primary" 
                      @click="setCreate()">
                      <v-icon name="plus-circle" /> ADD NEW DEPARTMENT
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.department.criteria"
                      type="text" 
                      placeholder="Search" >
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
									:fields="tables.departments.fields"
                  :busy="tables.departments.isBusy"
                  :items="tables.departments.items"
                  :current-page="paginations.department.page"
                  :per-page="paginations.department.perPage"
                  :filter="filters.department.criteria"
                  @filtered="onFiltered($event, paginations.department)">
                  <!-- :filter="filters.department.criteria> -->
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
                        @click="setUpdate(row)" >
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.department.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.department.from }} to {{ paginations.department.to }} of {{ paginations.department.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.department.page"
                      :total-rows="paginations.department.totalRows"
                      :per-page="paginations.department.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.department)" />
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
        Department - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
        <b-col md=12>
          <b-form-group >
            <label class="required">Name</label>
            <b-form-input 
              ref="name" 
              v-model="forms.department.fields.name"
              :state="forms.department.states.name" />
            <b-form-invalid-feedback>
              {{forms.department.errors.name}}
            </b-form-invalid-feedback>
          </b-form-group>
				</b-col>
			</b-row>
      <b-row>
        <b-col md=12>
           <b-form-group >
              <label class="required">Description</label>
              <b-form-textarea 
                ref="description" 
                v-model="forms.department.fields.description" 
                :state="forms.department.states.description"/>
              <b-form-invalid-feedback>
                {{forms.department.errors.description}}
              </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
     
      <!-- end modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          variant="outline-danger" 
          class="float-left btn-close" 
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button 
          :disabled="forms.department.isProcessing"
          variant="outline-primary" 
          class="float-right btn-save" 
          @click="onDepartmentEntry()">
          <v-icon 
            v-if="forms.department.isProcessing"
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
          Delete Department
      </div>
      Are you sure you want to delete this Department ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.department.isProcessing"
          variant="outline-primary" 
          class="mr-2 btn-save" 
          @click="onDepartmentDelete()">
          <v-icon 
            v-if="forms.department.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Yes
        </b-button>
        <b-button 
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation=false">
          No
        </b-button>            
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
  </div>
</template>
<script>

const departmentFields = {
  id: null,
  name: null,
  description: null,
}

import { DepartmentApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'
export default {
	name: "department",
	mixins: [ DepartmentApi, Tables ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        department: {
          isProcessing: false,
          fields: { ...departmentFields },
          states: { ...departmentFields },
          errors: { ...departmentFields }
        }
      },
			tables: {
				departments: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "30%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
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
				department: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        department: {
          criteria: null
        }
      }
		}
	},
	created(){
		this.loadDepartments()
	},
	methods: {
		loadDepartments(){
      const { departments } = this.tables
      const { department } = this.paginations
      departments.isBusy = true

			var params = { paginate: false }
      this.getDepartmentList(params).then(({ data }) =>{
        departments.items = data
        department.totalRows = data.length
        this.recordDetails(department)
        departments.isBusy = false
      })
    },
    onDepartmentEntry(){
      const { department, department: { fields } } = this.forms
      const { departments } = this.tables
      department.isProcessing = true
      reset(department)
      if(this.entryMode == "Add"){
        this.addDepartment(fields)
          .then(({ data }) => {
            this.addRow(departments, this.paginations.department, data)
            department.isProcessing = false
            showNotification(this, "success", "Department created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            department.isProcessing = false
            validate(department, errors)
          })
      }
      else {
        const { fields } = this.forms.department
        this.updateDepartment(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(departments, data)
            department.isProcessing = false
            showNotification(this, "success", "Department updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            department.isProcessing = false
            validate(department, errors)
          })
      }
    },
    onDepartmentDelete(){
      const { department, department: { fields: { id } } } = this.forms
      const { departments } = this.tables
      department.isProcessing = true
      this.deleteDepartment(id)
        .then(({ data }) => {
          this.deleteRow(departments, this.paginations.department, id)
          department.isProcessing = false
          showNotification(this, "success", "Department deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { department, department: { fields } } = this.forms
      copyValue(row.item, fields)
      reset(department)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    setCreate(){
      const { department } = this.forms
      reset(department)
      clearFields(department.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    },
	}
}
</script>