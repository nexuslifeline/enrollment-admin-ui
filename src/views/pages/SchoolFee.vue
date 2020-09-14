<template>
  <div class="c-app">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">School Fee Management</h4>
      </div>
      <div>
      <!-- add button and search -->
      <b-row class="mb-3">
        <b-col md=12>
          <b-row>
            <b-col md=8>
              <b-button
                v-if="isAccessible($options.SchoolFeePermissions.ADD.id)"
                variant="primary"
                @click="setCreate()">
                <v-icon name="plus-circle" /> ADD NEW SCHOOL FEE
              </b-button>
            </b-col>
            <b-col md=4>
              <b-form-input
                v-model="filters.schoolFee.criteria"
                type="text"
                placeholder="Search"
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
            small hover outlined show-empty
            :fields="tables.schoolFees.fields"
            :busy="tables.schoolFees.isBusy"
            :items="tables.schoolFees.items"
            :current-page="paginations.schoolFee.page"
            :per-page="paginations.schoolFee.perPage"
            :filter="filters.schoolFee.criteria"
            @filtered="onFiltered($event, paginations.schoolFee)">
            <!-- :filter="filters.schoolFee.criteria> -->
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
                  $options.SchoolFeePermissions.EDIT.id,
                  $options.SchoolFeePermissions.DELETE.id
                ]) || row.item.id !== fees.TUITION_FEE.id"
                right variant="link"
                toggle-class="text-decoration-none"
                no-caret>
                <template v-slot:button-content>
                  <v-icon name="ellipsis-v" />
                </template>
                <b-dropdown-item
                  v-if="isAccessible($options.SchoolFeePermissions.EDIT.id)"
                  @click="setUpdate(row)"
                  :disabled="showModalEntry">
                  Edit
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="isAccessible($options.SchoolFeePermissions.DELETE.id)"
                  @click="forms.schoolFee.fields.id = row.item.id, showModalConfirmation = true"
                  :disabled="showModalConfirmation">
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
                @input="recordDetails(paginations.schoolFee)" />
              </b-col>
            </b-row>
        </b-col>
      </b-row>
      <!-- end table -->
      </div>
    </div>
    <!-- Modal Entry -->
    <b-modal
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					School Fees - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.schoolFee.isLoading" rounded="sm">
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
        <b-row>
          <b-col md=12>
            <b-form-group >
              <label>School Fee Category</label>
              <b-form-select
                v-model="forms.schoolFee.fields.schoolFeeCategoryId"
                :state="forms.schoolFee.states.schoolFeeCategoryId">
                <template v-slot:first>
                  <b-form-select-option :value="null" >-- N/A --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="schoolFeeCategory in options.schoolFeeCategories.items"
                  :key="schoolFeeCategory.id"
                  :value="schoolFeeCategory.id">
                  {{ schoolFeeCategory.name }}
                </b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                {{ forms.schoolFee.errors.schoolFeeCategoryId }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- end modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.schoolFee.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onSchoolFeeEntry()">
          <v-icon
            v-if="forms.schoolFee.isProcessing"
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
          Delete School Fee
      </div>
      Are you sure you want to delete this School Fee ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.schoolFee.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSchoolFeeDelete()">
          <v-icon
            v-if="forms.schoolFee.isProcessing"
            name="sync"
            spin
            class="mr-2"/>
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

const schoolFeeFields = {
  id: null,
  name: null,
  description: null,
  schoolFeeCategoryId: null
}

import { SchoolFeeApi, SchoolFeeCategoryApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'
import { Fees, SchoolFeePermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access'
export default {
	name: "schoolFee",
  mixins: [ SchoolFeeApi, SchoolFeeCategoryApi, Tables, Access ],
  SchoolFeePermissions,
	data() {
		return {
      fees: Fees,
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        schoolFee: {
          isProcessing: false,
          isLoading: false,
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
							key: "schoolFeeCategory.name",
							label: "School Category",
							tdClass: "align-middle",
							thStyle: {width: "30%"}
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
      options: {
        schoolFeeCategories: {
          items: []
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
    this.loadSchoolFeeCategories()
	},
	methods: {
		loadSchoolFees(){
      const { schoolFees } = this.tables
      const { schoolFee } = this.paginations
      schoolFees.isBusy = true

			let params = { paginate: false }
      this.getSchoolFeeList(params).then(({ data }) =>{
        schoolFees.items = data
        schoolFee.totalRows = data.length
        this.recordDetails(schoolFee)
        schoolFees.isBusy = false
      })
    },
    loadSchoolFeeCategories() {
      const { schoolFeeCategories } = this.options
			let params = { paginate: false }
      this.getSchoolFeeCategoryList(params).then(({ data }) =>{
        schoolFeeCategories.items = data
      })
    },
    onSchoolFeeEntry(){
      const { schoolFee, schoolFee: { fields } } = this.forms
      const { schoolFees } = this.tables
      schoolFee.isProcessing = true
      reset(schoolFee)
      if(this.entryMode == "Add"){
        this.addSchoolFee(fields)
          .then(({ data }) => {
            this.addRow(schoolFees, this.paginations.schoolFee, data)
            schoolFee.isProcessing = false
            showNotification(this, "success", "School Fee created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolFee.isProcessing = false
            validate(schoolFee, errors)
          })
      }
      else {
        const { fields } = this.forms.schoolFee
        this.updateSchoolFee(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(schoolFees, data)
            schoolFee.isProcessing = false
            showNotification(this, "success", "School Fee updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolFee.isProcessing = false
            validate(schoolFee, errors)
          })
      }
    },
    onSchoolFeeDelete(){
      const { schoolFee, schoolFee: { fields: { id } } } = this.forms
      const { schoolFees } = this.tables
      schoolFee.isProcessing = true
      this.deleteSchoolFee(id)
        .then(({ data }) => {
          this.deleteRow(schoolFees, this.paginations.schoolFee, id)
          schoolFee.isProcessing = false
          showNotification(this, "success", "School Fee deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { schoolFee, schoolFee: { fields } } = this.forms
      this.showModalEntry = true
      schoolFee.isLoading = true
      copyValue(row.item, fields)
      reset(schoolFee)
      this.entryMode = "Edit"
      schoolFee.isLoading = false
    },
    setCreate(){
      const { schoolFee } = this.forms
      this.showModalEntry = true
      schoolFee.isLoading = true
      reset(schoolFee)
      clearFields(schoolFee.fields)
      this.entryMode='Add'
      schoolFee.isLoading = false
    },
	}
}
</script>