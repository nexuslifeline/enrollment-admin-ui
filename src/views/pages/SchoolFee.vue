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
                  <b-col md=8>
                    <b-button variant="outline-primary" 
                      @click="setCreate()">
                      <b-icon-plus-circle></b-icon-plus-circle> ADD NEW SCHOOL FEE
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.schoolFee.criteria"
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
									:fields="tables.schoolFees.fields"
                  :busy="tables.schoolFees.isBusy"
                  :items="tables.schoolFees.items" 
                  :filter="filters.schoolFee.criteria">
                  <template v-slot:cell(action)="row">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <b-icon-grip-horizontal></b-icon-grip-horizontal>
                      </template>
                      <b-dropdown-item 
                        @click="setUpdate(row)" >
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.schoolFee.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.schoolFee.from }} to {{ paginations.schoolFee.to }} of {{ paginations.schoolFee.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.schoolFee.page"
                      :total-rows="paginations.schoolFee.totalRows"
                      :per-page="paginations.schoolFee.perPage"
                      size="sm"
                      align="end"
                      @input="loadSchoolFees()" />
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
					School Fees - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
        <b-col md=12>
          <b-form-group >
            <label class="required">Name</label>
            <b-form-input 
              ref="name" 
              v-model="forms.schoolFee.fields.name"
              :state="forms.schoolFee.states.name" />
            <b-form-invalid-feedback>
              {{forms.schoolFee.errors.name}}
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
                v-model="forms.schoolFee.fields.description" 
                :state="forms.schoolFee.states.description"/>
              <b-form-invalid-feedback>
                {{forms.schoolFee.errors.description}}
              </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
     
      <!-- end modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          variant="outline-danger" 
          class="float-left" 
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button 
          variant="outline-primary" 
          class="float-right" 
          @click="onSchoolFeeEntry()">
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
          Delete School Fee
      </div>
      Are you sure you want to delete this School Fee ?
      <div slot="modal-footer">
        <b-button 
          variant="outline-primary" 
          class="mr-2" 
          @click="onSchoolFeeDelete()">
          Yes
        </b-button>
        <b-button 
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

const schoolFeeFields = {
  id: null,
  name: null,
  description: null,
}

import { SchoolFeeApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
export default {
	name: "schoolFee",
	mixins: [ SchoolFeeApi ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        schoolFee: {
          fields: { ...schoolFeeFields },
          states: { ...schoolFeeFields },
          errors: { ...schoolFeeFields }
        }
      },
			tables: {
				schoolFees: {
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
				schoolFee: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        schoolFee: {
          criteria: null
        }
      }
		}
	},
	created(){
		this.loadSchoolFees()
	},
	methods: {
		loadSchoolFees(){
      const { schoolFees } = this.tables
      const { schoolFee, schoolFee: { perPage, page } } = this.paginations

      schoolFees.isBusy = true

			var params = { paginate: true, perPage, page }
      this.getSchoolFeeList(params).then(({ data }) =>{
        schoolFees.items = data.data
        schoolFee.from = data.meta.from
        schoolFee.to = data.meta.to
        schoolFee.totalRows = data.meta.total
        schoolFees.isBusy = false
      })
    },
    onSchoolFeeEntry(){
      const { schoolFee, schoolFee: { fields } } = this.forms
      reset(schoolFee)
      if(this.entryMode == "Add"){
        this.addSchoolFee(fields)
          .then(({ data }) => {
            const { schoolFee } = this.paginations
            if(schoolFee.totalRows % schoolFee.perPage == 0){
              schoolFee.totalRows++
            }
            let totalPages = Math.ceil(schoolFee.totalRows / schoolFee.perPage)
            if(schoolFee.page == totalPages){
              this.loadUserGroups()
            }
            else {
              schoolFee.page = totalPages
            }
            showNotification(this, "success", "School Fee created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(schoolFee, errors)
          })
      }
      else {
        const { fields } = this.forms.schoolFee
        this.updateSchoolFee(fields, fields.id)
          .then(({ data }) => {
            this.loadSchoolFees()
            showNotification(this, "success", "School Fee updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(schoolFee, errors)
          })
      }
    },
    onSchoolFeeDelete(){
      const { id } = this.forms.schoolFee.fields
      this.deleteSchoolFee(id)
        .then(response => {
          this.loadSchoolFees()
          showNotification(this, "success", "School Fee deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { schoolFee, schoolFee: { fields } } = this.forms
      copyValue(row.item, fields)
      reset(schoolFee)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    setCreate(){
      const { schoolFee } = this.forms
      reset(schoolFee)
      clearFields(schoolFee.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    }
	}
}
</script>