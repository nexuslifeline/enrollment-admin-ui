<template>
  <div class="c-page-content">
    <Card title="School Fee Category Management">
      <div>
        <!-- add button and search -->
        <b-row class="mb-3">
          <b-col md=12>
            <b-row>
              <b-col md=8>
                <b-button
                  v-if="isAccessible($options.FeeCategoryPermissions.ADD.id)"
                  variant="primary"
                  @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD NEW SCHOOL FEE CATEGORY
                </b-button>
              </b-col>
              <b-col md=4>
                <b-form-input
                  v-model="filters.schoolFeeCategory.criteria"
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
              class="c-table"
              small hover outlined show-empty
              :fields="tables.schoolFeeCategories.fields"
              :busy="tables.schoolFeeCategories.isBusy"
              :items="tables.schoolFeeCategories.items"
              :current-page="paginations.schoolFeeCategory.page"
              :per-page="paginations.schoolFeeCategory.perPage"
              :filter="filters.schoolFeeCategory.criteria"
              @filtered="onFiltered($event, paginations.schoolFeeCategory)">
              <!-- :filter="filters.schoolFeeCategory.criteria> -->
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
                    $options.FeeCategoryPermissions.EDIT.id,
                    $options.FeeCategoryPermissions.DELETE.id
                  ])"
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret>
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    v-if="isAccessible($options.FeeCategoryPermissions.EDIT.id)"
                    @click="setUpdate(row)"
                    :disabled="showModalEntry">
                    Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.FeeCategoryPermissions.DELETE.id)"
                    @click="forms.schoolFeeCategory.fields.id = row.item.id, showModalConfirmation = true"
                    :disabled="showModalConfirmation">
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md=6>
                Showing {{ paginations.schoolFeeCategory.from }} to {{ paginations.schoolFeeCategory.to }} of {{ paginations.schoolFeeCategory.totalRows }} records.
                </b-col>
              <b-col md=6>
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.schoolFeeCategory.page"
                  :total-rows="paginations.schoolFeeCategory.totalRows"
                  :per-page="paginations.schoolFeeCategory.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.schoolFeeCategory)" />
                </b-col>
              </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </Card>
    <!-- Modal Entry -->
    <b-modal
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					School Fee Category - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.schoolFeeCategory.isLoading" rounded="sm">
        <b-row>
          <b-col md=12>
            <b-form-group >
              <label class="required">Name</label>
              <b-form-input
                ref="name"
                v-model="forms.schoolFeeCategory.fields.name"
                :state="forms.schoolFeeCategory.states.name" />
              <b-form-invalid-feedback>
                {{forms.schoolFeeCategory.errors.name}}
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
                  v-model="forms.schoolFeeCategory.fields.description"
                  :state="forms.schoolFeeCategory.states.description"/>
                <b-form-invalid-feedback>
                  {{forms.schoolFeeCategory.errors.description}}
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
          :disabled="forms.schoolFeeCategory.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onSchoolFeeEntry()">
          <v-icon
            v-if="forms.schoolFeeCategory.isProcessing"
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
          Delete School Fee Category
      </div>
      Are you sure you want to delete this School Fee Category ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.schoolFeeCategory.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSchoolFeeDelete()">
          <v-icon
            v-if="forms.schoolFeeCategory.isProcessing"
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

const schoolFeeCategoryFields = {
  id: null,
  name: null,
  description: null,
}

import { SchoolFeeCategoryApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'
import Access from '../../mixins/utils/Access'
import { FeeCategoryPermissions } from '../../helpers/enum'
import Card from '../components/Card'

export default {
	name: "schoolFeeCategory",
  mixins: [
    SchoolFeeCategoryApi,
    Tables,
    Access
  ],
  components: {
    Card
  },
  FeeCategoryPermissions,
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        schoolFeeCategory: {
          isProcessing: false,
          isLoading: false,
          fields: { ...schoolFeeCategoryFields },
          states: { ...schoolFeeCategoryFields },
          errors: { ...schoolFeeCategoryFields }
        }
      },
			tables: {
				schoolFeeCategories: {
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
				schoolFeeCategory: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        schoolFeeCategory: {
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
      const { schoolFeeCategories } = this.tables
      const { schoolFeeCategory } = this.paginations
      schoolFeeCategories.isBusy = true

			let params = { paginate: false }
      this.getSchoolFeeCategoryList(params).then(({ data }) =>{
        schoolFeeCategories.items = data
        schoolFeeCategory.totalRows = data.length
        this.recordDetails(schoolFeeCategory)
        schoolFeeCategories.isBusy = false
      })
    },
    onSchoolFeeEntry(){
      const { schoolFeeCategory, schoolFeeCategory: { fields } } = this.forms
      const { schoolFeeCategories } = this.tables
      schoolFeeCategory.isProcessing = true
      reset(schoolFeeCategory)
      if(this.entryMode == "Add"){
        this.addSchoolFeeCategory(fields)
          .then(({ data }) => {
            this.addRow(schoolFeeCategories, this.paginations.schoolFeeCategory, data)
            schoolFeeCategory.isProcessing = false
            showNotification(this, "success", "School Fee Category created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolFeeCategory.isProcessing = false
            validate(schoolFeeCategory, errors)
          })
      }
      else {
        const { fields } = this.forms.schoolFeeCategory
        this.updateSchoolFeeCategory(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(schoolFeeCategories, data)
            schoolFeeCategory.isProcessing = false
            showNotification(this, "success", "School Fee Category updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolFeeCategory.isProcessing = false
            validate(schoolFeeCategory, errors)
          })
      }
    },
    onSchoolFeeDelete(){
      const { schoolFeeCategory, schoolFeeCategory: { fields: { id } } } = this.forms
      const { schoolFeeCategories } = this.tables
      schoolFeeCategory.isProcessing = true
      this.deleteSchoolFeeCategory(id)
        .then(({ data }) => {
          this.deleteRow(schoolFeeCategories, this.paginations.schoolFeeCategory, id)
          schoolFeeCategory.isProcessing = false
          showNotification(this, "success", "School Fee Category deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { schoolFeeCategory, schoolFeeCategory: { fields } } = this.forms
      schoolFeeCategory.isLoading = true
      copyValue(row.item, fields)
      reset(schoolFeeCategory)
      this.entryMode = "Edit"
      schoolFeeCategory.isLoading = false
    },
    setCreate(){
      this.showModalEntry = true
      const { schoolFeeCategory } = this.forms
      schoolFeeCategory.isLoading = true
      reset(schoolFeeCategory)
      clearFields(schoolFeeCategory.fields)
      this.entryMode='Add'
      schoolFeeCategory.isLoading = false
    },
	}
}
</script>