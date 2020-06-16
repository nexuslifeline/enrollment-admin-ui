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
                      <b-icon-plus-circle></b-icon-plus-circle> ADD NEW USER
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
                  :filter="filters.user.criteria">
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
                      @input="loadPersonnels()" />
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
      @shown="$refs.username.focus()"
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
				<b-col md=6>
          <b-form-group >
            <label class="required">Email</label>
            <b-form-input 
              ref="username" 
              v-model="forms.user.fields.username" 
              :state="forms.user.states.username" />
            <b-form-invalid-feedback>
              {{forms.user.errors.username}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Password</label>
            <b-form-input 
              type="password"
              v-model="forms.user.fields.password" 
              :state="forms.user.states.password" />
            <b-form-invalid-feedback>
              {{forms.user.errors.password}}
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
              :state="forms.user.states.userGroupId" >
              <template v-slot:first>
                <b-form-select-option :value='null' disabled>-- Select User Group --</b-form-select-option>
              </template>
              <b-form-select-option v-for='userGroup in options.userGroups.items' :key='userGroup.id' :value='userGroup.id'>
                {{userGroup.name}}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{forms.user.errors.userGroupId}}
            </b-form-invalid-feedback>
          </b-form-group>
				</b-col>
        <b-col md=6>
          <b-form-group >
            <label class="required">Firstname</label>
            <b-form-input 
              v-model="forms.user.fields.firstName" 
              :state="forms.user.states.firstName" />
            <b-form-invalid-feedback>
              {{forms.user.errors.firstName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label>Middlename</label>
            <b-form-input 
              v-model="forms.user.fields.middleName" 
              :state="forms.user.states.middleName" />
            <b-form-invalid-feedback>
              {{forms.user.errors.middleName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Lastname</label>
            <b-form-input 
              v-model="forms.user.fields.lastName" 
              :state="forms.user.states.lastName" />
            <b-form-invalid-feedback>
              {{forms.user.errors.lastName}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="required">Birthdate</label>
            <b-form-input type="date" 
              v-model="forms.user.fields.birthDate" 
              :state="forms.user.states.birthDate" />
            <b-form-invalid-feedback>
              {{forms.user.errors.birthDate}}
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
          @click="onUserEntry()">
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

const userFields = {
  id: null,
  username: null,
  password: null,
  passwordConfirmation: null,
  userGroupId: null,
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null
}

import { PersonnelApi, UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
export default {
	name: "Personnel",
	mixins: [ PersonnelApi, UserGroupApi ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        user: {
          fields: { ...userFields },
          states: { ...userFields },
          errors: { ...userFields }
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
      users.isBusy = true
      const { user, user: { perPage, page } } = this.paginations
			var params = { paginate: true, perPage, page }
      this.getPersonnelList(params).then(({ data }) =>{
        users.items = data.data
        user.from = data.meta.from
        user.to = data.meta.to
        user.totalRows = data.meta.total
        users.isBusy = false
      })
    },
    onUserEntry(){
      const { user, user: { fields } } = this.forms
      reset(user)
      if(this.entryMode == "Add"){
        this.addPersonnel(fields)
          .then(({ data }) => {
            const { user } = this.paginations
            if(user.totalRows % user.perPage == 0){
              user.totalRows++
            }
            let totalPages = Math.ceil(user.totalRows / user.perPage)
            if(user.page == totalPages){
              this.loadPersonnels()
            }
            else {
              user.page = totalPages
            }
            showNotification(this, "success", "User created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(user, errors)
          })
      }
      else {
        this.updatePersonnel(fields, fields.id)
          .then(({ data }) => {
            this.loadPersonnels()
            showNotification(this, "success", "User updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(user, errors)
          })
      }
    },
    onUserGroupDelete(){
      const { id } = this.forms.user.fields
      this.deletePersonnel(id)
        .then(response => {
          this.loadPersonnels()
          showNotification(this, "success", "User deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { user, user: { fields } } = this.forms
      const { item } = row
      clearFields(fields)
      reset(user)

      fields.id = item.id
      fields.username = item.user.username
      fields.userGroupId = item.user.userGroupId
      fields.firstName = item.firstName
      fields.lastName = item.lastName
      fields.middleName = item.middleName
      fields.birthDate = item.birthDate

      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    setCreate(){
      const { user } = this.forms
      reset(user)
      clearFields(user.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    }
	}
}
</script>