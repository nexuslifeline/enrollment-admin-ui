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
                      <b-icon-plus-circle></b-icon-plus-circle> ADD NEW USER GROUP
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.userGroup.criteria"
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
									:fields="tables.userGroups.fields"
                  :busy="tables.userGroups.isBusy"
                  :items="tables.userGroups.items" 
                  :filter="filters.userGroup.criteria">
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
                        @click="forms.userGroup.fields.id = row.item.id, showModalConfirmation = true">
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
                      @input="loadUserGroups()" />
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
      @shown="$refs.code.focus()"
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User Group - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
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
      
      <!-- modal body -->
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
          @click="onUserGroupEntry()">
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
          class="mr-2" 
          @click="onUserGroupDelete()">
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

const userGroupFields = {
  id: null,
  code: null,
  name: null,
  description: null
}

import { UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
export default {
	name: "UserGroup",
	mixins: [ UserGroupApi ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        userGroup: {
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
      userGroups.isBusy = true
      const { userGroup, userGroup: { perPage, page } } = this.paginations
			var params = { paginate: true, perPage, page }
      this.getUserGroupList(params).then(({ data }) =>{
        userGroups.items = data.data
        userGroup.from = data.meta.from
        userGroup.to = data.meta.to
        userGroup.totalRows = data.meta.total
        userGroups.isBusy = false
      })
    },
    onUserGroupEntry(){
      const { userGroup, userGroup: { fields } } = this.forms
      reset(userGroup)
      if(this.entryMode == "Add"){
        this.addUserGroup(fields)
          .then(({ data }) => {
            const { userGroup } = this.paginations
            if(userGroup.totalRows % userGroup.perPage == 0){
              userGroup.totalRows++
            }
            let totalPages = Math.ceil(userGroup.totalRows / userGroup.perPage)
            if(userGroup.page == totalPages){
              this.loadUserGroups()
            }
            else {
              userGroup.page = totalPages
            }
            showNotification(this, "success", "User group created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(userGroup, errors)
          })
      }
      else {
        this.updateUserGroup(fields, fields.id)
          .then(({ data }) => {
            this.loadUserGroups()
            showNotification(this, "success", "User group updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(userGroup, errors)
          })
      }
    },
    onUserGroupDelete(){
      const { id } = this.forms.userGroup.fields
      this.deleteUserGroup(id)
        .then(response => {
          this.loadUserGroups()
          showNotification(this, "success", "User group deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { userGroup, userGroup: { fields } } = this.forms
      copyValue(row.item, fields)
      reset(userGroup)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    setCreate(){
      const { userGroup } = this.forms
      reset(userGroup)
      clearFields(userGroup.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    }
	}
}
</script>