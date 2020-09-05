<template>
  <div class="c-app">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">User Group Management</h4>
      </div>
      <div>
                    <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md=12>
                <b-row>
                  <b-col md=8>
                    <b-button variant="primary"
                      @click="setCreate()">
                      <v-icon name="plus-circle" /> ADD NEW USER GROUP
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.userGroup.criteria"
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
									hover outlined show-empty
									:fields="tables.userGroups.fields"
                  :busy="tables.userGroups.isBusy"
                  :items="tables.userGroups.items"
                  :current-page="paginations.userGroup.page"
                  :per-page="paginations.userGroup.perPage"
                  :filter="filters.userGroup.criteria"
                  @filtered="onFiltered($event, paginations.userGroup)">
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
                        @click="setUpdate(row)"
                        :disabled="showModalEntry">
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click="forms.userGroup.fields.id = row.item.id, showModalConfirmation = true"
                        :disabled="showModalConfirmation">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.userGroup.from }} to {{ paginations.userGroup.to }} of {{ paginations.userGroup.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.userGroup.page"
                      :total-rows="paginations.userGroup.totalRows"
                      :per-page="paginations.userGroup.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.userGroup)" />
                    </b-col>
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
      </div>
    </div>
    <!-- Modal Entry -->
    <b-modal
      @shown="$refs.code.focus()"
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User Group - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.userGroup.isLoading" rounded="sm">
        <b-row>
          <b-col md=6>
            <b-form-group >
              <label class="required">Code</label>
              <b-form-input
                ref="code"
                v-model="forms.userGroup.fields.code"
                :state="forms.userGroup.states.code" />
              <b-form-invalid-feedback>
                {{forms.userGroup.errors.code}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md=6>
            <b-form-group >
              <label class="required">Name</label>
              <b-form-input
                ref="name"
                v-model="forms.userGroup.fields.name"
                :state="forms.userGroup.states.name" />
              <b-form-invalid-feedback>
                {{forms.userGroup.errors.name}}
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
                v-model="forms.userGroup.fields.description"
                :state="forms.userGroup.states.description" />
              <b-form-invalid-feedback>
                {{forms.userGroup.errors.description}}
              </b-form-invalid-feedback>
            </b-form-group>
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
          :disabled="forms.userGroup.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onUserGroupEntry()">
          <v-icon
            v-if="forms.userGroup.isProcessing"
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
          Delete User Group
      </div>
      Are you sure you want to delete this user group?
      <div slot="modal-footer">
        <b-button
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onUserGroupDelete()">
          <v-icon
            v-if="forms.userGroup.isProcessing"
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

const userGroupFields = {
  id: null,
  code: null,
  name: null,
  description: null
}

import { UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'
export default {
	name: "UserGroup",
	mixins: [ UserGroupApi, Tables ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        userGroup: {
          isProcessing: false,
          isLoading: false,
          fields: { ...userGroupFields },
          states: { ...userGroupFields },
          errors: { ...userGroupFields }
        }
      },
			tables: {
				userGroups: {
          isBusy: false,
					fields: [
            {
							key: "code",
							label: "Code",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
						},
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
				userGroup: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        userGroup: {
          criteria: null
        }
      }
		}
	},
	created(){
		this.loadUserGroups()
	},
	methods: {
		loadUserGroups(){
      const { userGroups } = this.tables
      const { userGroup, userGroup: { perPage, page } } = this.paginations

      userGroups.isBusy = true

			let params = { paginate: false }
      this.getUserGroupList(params).then(({ data }) =>{
        userGroups.items = data
        userGroup.totalRows = data.length
        this.recordDetails(userGroup)
        userGroups.isBusy = false
      })
    },
    onUserGroupEntry(){
      const { userGroup, userGroup: { fields } } = this.forms
      const { userGroups } = this.tables
      userGroup.isProcessing = true
      reset(userGroup)
      if(this.entryMode == "Add"){
        this.addUserGroup(fields)
          .then(({ data }) => {
            this.addRow(userGroups, this.paginations.userGroup, data)
            userGroup.isProcessing = false
            showNotification(this, "success", "User group created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            userGroup.isProcessing = false
            validate(userGroup, errors)
          })
      }
      else {
        this.updateUserGroup(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(userGroups, data)
            userGroup.isProcessing = false
            showNotification(this, "success", "User group updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            userGroup.isProcessing = false
            validate(userGroup, errors)
          })
      }
    },
    onUserGroupDelete(){
      const { userGroup, userGroup: { fields: { id } } } = this.forms
      const { userGroups } = this.tables
      userGroup.isProcessing = true
      this.deleteUserGroup(id)
        .then(({ data }) => {
          this.deleteRow(userGroups, this.paginations.userGroup, id)
          userGroup.isProcessing = false
          showNotification(this, "success", "User group deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { userGroup, userGroup: { fields } } = this.forms
      userGroup.isLoading = true
      copyValue(row.item, fields)
      reset(userGroup)
      this.entryMode = "Edit"
      userGroup.isLoading = false
    },
    setCreate(){
      this.showModalEntry = true
      const { userGroup } = this.forms
      userGroup.isLoading = true
      reset(userGroup)
      clearFields(userGroup.fields)
      this.entryMode='Add'
      userGroup.isLoading = false
    }
	}
}
</script>