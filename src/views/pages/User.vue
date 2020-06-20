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
                      <v-icon name="plus-circle" /> ADD NEW USER
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.user.criteria"
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
									:fields="tables.users.fields"
                  :busy="tables.users.isBusy"
                  :items="tables.users.items"
                  :current-page="paginations.user.page"
                  :per-page="paginations.user.perPage"
                  :filter="filters.user.criteria"
                  @filtered="onFiltered($event, paginations.user)">
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
                        @click="setUpdatePersonnel(row)" >
                        Edit Personnel Info
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="setUpdateUser(row)" >
                        Edit Account Info
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.user.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.user.from }} to {{ paginations.user.to }} of {{ paginations.user.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.user.page"
                      :total-rows="paginations.user.totalRows"
                      :per-page="paginations.user.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.user)" />
                    </b-col>
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <!-- Modal Entry Add -->
    <b-modal 
      @shown="$refs.username.focus()"
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User - Add
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
				<b-col md=6>
          <b-form-group >
            <label class="required">Email</label>
            <b-form-input 
              ref="username" 
              v-model="forms.user.fields.username" 
              :state="forms.user.states.userUsername" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userUsername}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Password</label>
            <b-form-input 
              type="password"
              v-model="forms.user.fields.password" 
              :state="forms.user.states.userPassword" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userPassword}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Confirm Password</label>
            <b-form-input 
              type="password"
              v-model="forms.user.fields.passwordConfirmation" />
          </b-form-group>
          <b-form-group>
            <label class="required">User Group</label>
            <b-form-select 
              v-model="forms.user.fields.userGroupId"
              :state="forms.user.states.userUserGroupId" >
              <template v-slot:first>
                <b-form-select-option :value='null' disabled>-- Select User Group --</b-form-select-option>
              </template>
              <b-form-select-option v-for='userGroup in options.userGroups.items' :key='userGroup.id' :value='userGroup.id'>
                {{userGroup.name}}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{forms.user.errors.userUserGroupId}}
            </b-form-invalid-feedback>
          </b-form-group>
				</b-col>
        <b-col md=6>
          <b-form-group >
            <label class="required">Firstname</label>
            <b-form-input 
              v-model="forms.personnel.fields.firstName" 
              :state="forms.personnel.states.firstName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.firstName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label>Middlename</label>
            <b-form-input 
              v-model="forms.personnel.fields.middleName" 
              :state="forms.personnel.states.middleName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.middleName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Lastname</label>
            <b-form-input 
              v-model="forms.personnel.fields.lastName" 
              :state="forms.personnel.states.lastName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.lastName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="required">Birthdate</label>
            <b-form-input type="date" 
              v-model="forms.personnel.fields.birthDate" 
              :state="forms.personnel.states.birthDate" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.birthDate}}
            </b-form-invalid-feedback>
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
          :disabled="forms.user.isProcessing"
          variant="outline-primary" 
          class="float-right btn-save" 
          @click="onUserEntry()">
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync" 
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- End Modal Entry -->
    <!-- Modal Entry Edit Personnel info -->
    <b-modal 
      @shown="$refs.firstname.focus()"
			v-model="showModalUpdatePersonnel"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User - Edit
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
        <b-col md=12>
          <b-form-group >
            <label class="required">Firstname</label>
            <b-form-input
              ref="firstname" 
              v-model="forms.personnel.fields.firstName" 
              :state="forms.personnel.states.firstName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.firstName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label>Middlename</label>
            <b-form-input 
              v-model="forms.personnel.fields.middleName" 
              :state="forms.personnel.states.middleName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.middleName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Lastname</label>
            <b-form-input 
              v-model="forms.personnel.fields.lastName" 
              :state="forms.personnel.states.lastName" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.lastName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="required">Birthdate</label>
            <b-form-input type="date" 
              v-model="forms.personnel.fields.birthDate" 
              :state="forms.personnel.states.birthDate" />
            <b-form-invalid-feedback>
              {{forms.personnel.errors.birthDate}}
            </b-form-invalid-feedback>
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
          :disabled="forms.user.isProcessing"
          variant="outline-primary" 
          class="float-right btn-save" 
          @click="onUserEntry()">
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync" 
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- End Modal Entry Edit Personnel info -->
    <!-- Modal Entry Edit User info -->
    <b-modal 
      @shown="$refs.username.focus()"
			v-model="showModalUpdateUser"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User Account - Edit
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
				<b-col md=12>
          <b-form-group >
            <label class="required">Email</label>
            <b-form-input 
              ref="username" 
              v-model="forms.user.fields.username" 
              :state="forms.user.states.userUsername" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userUsername}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Password</label>
            <b-form-input 
              type="password"
              v-model="forms.user.fields.password" 
              :state="forms.user.states.userPassword" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userPassword}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Confirm Password</label>
            <b-form-input 
              type="password"
              v-model="forms.user.fields.passwordConfirmation" />
          </b-form-group>
          <b-form-group>
            <label class="required">User Group</label>
            <b-form-select 
              v-model="forms.user.fields.userGroupId"
              :state="forms.user.states.userUserGroupId" >
              <template v-slot:first>
                <b-form-select-option :value='null' disabled>-- Select User Group --</b-form-select-option>
              </template>
              <b-form-select-option v-for='userGroup in options.userGroups.items' :key='userGroup.id' :value='userGroup.id'>
                {{userGroup.name}}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{forms.user.errors.userUserGroupId}}
            </b-form-invalid-feedback>
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
          :disabled="forms.user.isProcessing"
          variant="outline-primary" 
          class="float-right btn-save" 
          @click="onUserEntry()">
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync" 
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- End Modal Entry Edit User info -->
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
          :disabled="forms.user.isProcessing"
          variant="outline-primary" 
          class="mr-2 btn-save" 
          @click="onUserGroupDelete()">
          <v-icon
            v-if="forms.user.isProcessing"
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

const userFields = {
  username: null,
  password: null,
  passwordConfirmation: null,
  userGroupId: null,
}

const userErrorFields = {
  userUsername: null,
  userPassword: null,
  userUserGroupId: null,
}

const personnelFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null
}

import { PersonnelApi, UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
import Tables from '../../helpers/tables'
import Personnel from '../../mixins/api/Personnel'
export default {
	name: "Personnel",
	mixins: [ PersonnelApi, UserGroupApi, Tables ],
	data() {
		return {
      showModalEntry: false,
      showModalUpdatePersonnel: false,
      showModalUpdateUser: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        personnel: {
          fields: { ...personnelFields },
          states: { ...personnelFields },
          errors: { ...personnelFields }
        }, 
        user: {
          isProcessing: false,
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields }
        }
      },
			tables: {
				users: {
          isBusy: false,
					fields: [
            {
							key: "user.username",
							label: "Email",
							tdClass: "align-middle",
							thStyle: {width: "20%"}
						},
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
              thStyle: {width: "30%"},
              formatter: (value, key, item) => {
								if(!item.middleName){
									item.middleName = ""
								}
								return item.name = item.firstName + " " + item.middleName + " " + item.lastName
							} 
						},
						{
							key: "user.userGroup.name",
							label: "User Group",
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
				user: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        user: {
          criteria: null
        }
      },
      options: {
        userGroups: {
          items: []
        }
      }
		}
	},
	created(){
    this.loadPersonnels()
    this.getUserGroupList({ paginate: false })
      .then(({ data }) => {
        this.options.userGroups.items = data
      })
	},
	methods: {
		loadPersonnels(){
      const { users } = this.tables
      const { user } = this.paginations

      users.isBusy = true

			let params = { paginate: false }
      this.getPersonnelList(params).then(({ data }) =>{
        users.items = data
        user.totalRows = data.length
        this.recordDetails(user)
        users.isBusy = false
      })
    },
    onUserEntry(){
      const { user, personnel, personnel: { fields: { id } } } = this.forms
      const { users } = this.tables
      user.isProcessing = true
      reset(user)
      reset(personnel)
      if(this.entryMode == "Add"){
        const data = { ...personnel.fields, user: user.fields }
        this.addPersonnel(data)
          .then(({ data }) => {
            this.addRow(users, this.paginations.user, data)
            user.isProcessing = false
            showNotification(this, "success", "User created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            user.isProcessing = false
            validate(user, errors)
            validate(personnel, errors)
          })
      }
      else if (this.entryMode == "Edit Personnel") {
        this.updatePersonnel(personnel.fields, id)
          .then(({ data }) => {
            this.updateRow(users, data)
            user.isProcessing = false
            showNotification(this, "success", "User updated successfully.")
            this.showModalUpdatePersonnel = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            user.isProcessing = false
            validate(personnel, errors)
          })
      }
      else if (this.entryMode == "Edit User") {
        const data = { user: user.fields }
        this.updatePersonnel(data, id)
          .then(({ data }) => {
            this.updateRow(users, data)
            user.isProcessing = false
            showNotification(this, "success", "User updated successfully.")
            this.showModalUpdateUser = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            user.isProcessing = false
            validate(user, errors)
          })
      }
    },
    onUserGroupDelete(){
      const { user, user: { fields: { id } } } = this.forms
      const { users } = this.tables
      user.isProcessing = true
      this.deletePersonnel(id)
        .then(({ data }) => {
          this.deleteRow(users, this.paginations.user, id)
          user.isProcessing = false
          showNotification(this, "success", "User deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdateUser(row){
      const { user, user: { fields } } = this.forms
      const { item } = row
      clearFields(fields)
      reset(user)

      fields.id = item.id
      fields.username = item.user.username
      fields.userGroupId = item.user.userGroupId

      this.entryMode = "Edit User"
      this.showModalUpdateUser = true
    },
    setUpdatePersonnel(row){
      const { personnel, personnel: { fields } } = this.forms
      const { item } = row
      clearFields(fields)
      reset(personnel)
      console.log(item)
      fields.id = item.id
      fields.firstName = item.firstName
      fields.middleName = item.middleName
      fields.lastName = item.lastName
      fields.birthDate = item.birthDate

      this.entryMode = "Edit Personnel"
      this.showModalUpdatePersonnel = true
    },
    setCreate(){
      const { user, personnel } = this.forms
      reset(user)
      reset(personnel)
      clearFields(user.fields)
      clearFields(personnel.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    }
	}
}
</script>