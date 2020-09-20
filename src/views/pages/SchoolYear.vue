<template>
  <div class="c-page-content">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">School Year Management</h4>
      </div>
      <div>
      <!-- add button and search -->
      <b-row class="mb-3">
        <b-col md=12>
          <b-row>
            <b-col md=8>
              <b-button
                v-if="isAccessible($options.SchoolYearPermissions.ADD.id)"
                variant="outline-primary"
                @click="setCreate()">
                <v-icon name="plus-circle" /> ADD NEW SCHOOL YEAR
              </b-button>
            </b-col>
            <b-col md=4>
              <b-form-input
                v-model="filters.schoolYear.criteria"
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
            :fields="tables.schoolYears.fields"
            :busy="tables.schoolYears.isBusy"
            :items.sync="tables.schoolYears.items"
            :current-page="paginations.schoolYear.page"
            :per-page="paginations.schoolYear.perPage"
            :filter="filters.schoolYear.criteria">
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon
                  name="spinner"
                  spin
                  class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(isActive)="row">
              <b-badge :variant="row.item.isActive ? 'success' : 'danger'">
                {{row.item.isActive ? 'Active' : 'Inactive'}}
              </b-badge>
            </template>
            <template v-slot:cell(action)="row">
              <b-dropdown
                v-if="isAccessible([
                  $options.SchoolYearPermissions.EDIT.id,
                  $options.SchoolYearPermissions.DELETE.id
                ])"
                right
                variant="link"
                toggle-class="text-decoration-none"
                no-caret>
                <template v-slot:button-content>
                  <v-icon name="ellipsis-v" />
                </template>
                <b-dropdown-item
                  v-if="isAccessible($options.SchoolYearPermissions.EDIT.id)"
                  @click="setUpdate(row)"
                  :disabled="showModalEntry" >
                  Edit
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="isAccessible($options.SchoolYearPermissions.DELETE.id)"
                  @click="forms.schoolYear.fields.id = row.item.id, showModalConfirmation = true"
                  :disabled="showModalConfirmation">
                  Delete
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
          <b-row>
            <b-col md=6>
              Showing {{ paginations.schoolYear.from }} to {{ paginations.schoolYear.to }} of {{ paginations.schoolYear.totalRows }} records.
              </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.schoolYear.page"
                :total-rows="paginations.schoolYear.totalRows"
                :per-page="paginations.schoolYear.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.schoolYear)" />
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
            School Year - {{ entryMode }}
        </div> <!-- modal title -->
      <b-overlay :show="forms.schoolYear.isLoading" rounded="sm">
        <!-- modal body -->
        <b-form-group >
          <label class="required">Name</label>
          <b-form-input
            ref="name"
            v-model="forms.schoolYear.fields.name"
            :state="forms.schoolYear.states.name" />
          <b-form-invalid-feedback>
            {{forms.schoolYear.errors.name}}
          </b-form-invalid-feedback>
        </b-form-group>
          <b-form-group >
            <label class="required">Description</label>
            <b-form-textarea
              ref="description"
              v-model="forms.schoolYear.fields.description"
              :state="forms.schoolYear.states.description"/>
            <b-form-invalid-feedback>
              {{forms.schoolYear.errors.description}}
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group >
          <label class="required">Start Date</label>
          <b-form-input type="date"
            v-model="forms.schoolYear.fields.startDate"
            :state="forms.schoolYear.states.startDate"/>
          <b-form-invalid-feedback>
            {{ forms.schoolYear.errors.startDate }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            class="pl-5"
            v-model="forms.schoolYear.fields.isActive"
            :value=1
            :unchecked-value=0>
            <b>Active</b>
          </b-form-checkbox>
        </b-form-group>
        <!-- end modal body -->
      </b-overlay>
      <div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
          <b-button
            variant="outline-danger"
            class="float-left btn-close"
            @click="showModalEntry=false">
            Close
          </b-button>
          <b-button
            :disabled="forms.schoolYear.isProcessing"
            variant="outline-primary"
            class="float-right btn-save"
            @click="onSchoolYearEntry()">
            <v-icon
              v-if="forms.schoolYear.isProcessing"
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
          Delete School Year
      </div>
      Are you sure you want to delete this School Year ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.schoolYear.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSchoolYearDelete()">
          <v-icon
            v-if="forms.schoolYear.isProcessing"
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
const schoolYearFields = {
  id: null,
  name: null,
  description: null,
  isActive: null,
  startDate: null
}
import { SchoolYearApi } from "../../mixins/api"
import Tables from '../../helpers/tables'
import { clearFields, reset, validate, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import { SchoolYearPermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access'

export default {
  name: "schoolYear",
  mixins: [ Tables, SchoolYearApi, Access ],
  SchoolYearPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        schoolYear: {
          isProcessing: false,
          isLoading: false,
          fields: {...schoolYearFields},
          states: {...schoolYearFields},
          errors: {...schoolYearFields}
        }
      },
      tables: {
				schoolYears: {
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
							key: "startDate",
							label: "Start Date",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
            },
            {
							key: "isActive",
							label: "Status",
							tdClass: "align-middle",
							thStyle: {width: "50px"}
            },
            {
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: {width: "45px"}
            },
          ],
          items:[]
				}
      },
      paginations: {
				schoolYear: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        schoolYear: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadSchoolYear()
  },
  methods: {
    loadSchoolYear() {
      const { schoolYears } = this.tables
      const { schoolYear } = this.paginations

      schoolYears.isBusy = true
      const params = { paginate: false }
      this.getSchoolYearList(params).then(({ data }) => {
        schoolYears.items = data
        schoolYear.totalRows = data.length
        this.recordDetails(schoolYear)
        schoolYears.isBusy = false
      }).catch(error => {
        schoolYears.isBusy = false
      })
    },
    onSchoolYearEntry(){
      const { schoolYear, schoolYear: { fields } } = this.forms
      const { schoolYears } = this.tables
      schoolYear.isProcessing = true
      reset(schoolYear)
      if(this.entryMode == "Add"){
        this.addSchoolYear(fields)
          .then(({ data }) => {
            this.addRow(schoolYears, this.paginations.schoolYear, data)
            schoolYear.isProcessing = false
            showNotification(this, "success", "School Year created successfully.")
            this.showModalEntry = false
            this.updateOldSchoolYear(data)
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolYear.isProcessing = false
            validate(schoolYear, errors)
          })
      }
      else {
        const { fields } = this.forms.schoolYear
        this.updateSchoolYear(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(schoolYears, data)
            schoolYear.isProcessing = false
            showNotification(this, "success", "School Year updated successfully.")
            this.showModalEntry = false
            this.updateOldSchoolYear(data)
          })
          .catch(error => {
            const errors = error.response.data.errors
            schoolYear.isProcessing = false
            validate(schoolYear, errors)
          })
      }
    },
    onSchoolYearDelete(){
      const { schoolYear, schoolYear: { fields: { id } } } = this.forms
      const { schoolYears } = this.tables
      schoolYear.isProcessing = true
      this.deleteSchoolYear(id)
        .then(({ data }) => {
          this.deleteRow(schoolYears, this.paginations.schoolYear, id)
          schoolYear.isProcessing = false
          showNotification(this, "success", "School Year deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setCreate() {
      const { schoolYear } = this.forms
      this.showModalEntry = true
      schoolYear.isLoading = true

      clearFields(schoolYear.fields)
      reset(schoolYear)
      schoolYear.fields.isActive = 1
      this.entryMode = "Add"
      schoolYear.isLoading = false
    },
    setUpdate(row) {
      const { schoolYear, schoolYear: { fields } } = this.forms
      copyValue(row.item, fields)
      reset(schoolYear)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    updateOldSchoolYear(data) {
      if (data.isActive) {
        let schoolYear = this.tables.schoolYears.items.find(sy =>
          sy.id !== data.id &&
          sy.isActive === data.isActive
        )
        if (schoolYear) {
          schoolYear.isActive = 0
        }
      }
    },
  }
}
</script>
