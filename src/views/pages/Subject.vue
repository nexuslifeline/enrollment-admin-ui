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
                      @click="clearFields(), entryMode='Add', showModalEntry=true">
                      <b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT
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
                  :filter="filters.subject.criteria">
                  <template v-slot:cell(action)="row">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <b-icon-grip-horizontal></b-icon-grip-horizontal>
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
                      @input="loadSubjects()" />
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
          <b-form-group label="Code">
            <b-form-input 
              ref="code" 
              placeholder="Code" 
              v-model="forms.subject.fields.code" />
          </b-form-group>
				</b-col>
        <b-col md=6>
          <b-form-group label="Name">
            <b-form-input 
              ref="name" 
              placeholder="Name" 
              v-model="forms.subject.fields.name" />
          </b-form-group>
				</b-col>
			</b-row>
      <b-form-group label="Description">
        <b-form-textarea 
          ref="description" 
          placeholder="Description" 
          v-model="forms.subject.fields.description" />
      </b-form-group>
      <b-row>
        <b-col md=6>
          <b-form-group label="Units">
            <b-form-input 
              type="number" 
              @input="computeTotalAmount()" 
              class="text-right" 
              v-model="forms.subject.fields.units" />
          </b-form-group>
        </b-col>
        <b-col md=6>
          <b-form-group label="Amount per Unit">
            <b-form-input 
              type="number"
              @input="computeTotalAmount()" 
              class="text-right" 
              v-model="forms.subject.fields.amountPerUnit" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md=6>
          <b-form-group label="Labs">
            <b-form-input 
              type="number" 
              @input="computeTotalAmount()" 
              class="text-right" 
              v-model="forms.subject.fields.labs" />
          </b-form-group>
        </b-col>
        <b-col md=6>
          <b-form-group label="Amount per Lab">
            <b-form-input 
              type="number" 
              @input="computeTotalAmount()" 
              class="text-right" 
              v-model="forms.subject.fields.amountPerLab" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col offset-md=6 md=6>
          <b-form-group label="Total Amount">
            <b-form-input 
              disabled type="number" 
              class="text-right" 
              v-model="forms.subject.fields.totalAmount" />
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
          @click="onSubjectEntry()">
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- Modal Entry -->
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
          class="mr-2" 
          @click="onSubjectDelete()">
          Yes
        </b-button>
        <b-button 
          variant="outline-danger" 
          @click="showModalConfirmation=false">
          No
        </b-button>            
      </div>
    </b-modal>
  </div>
</template>
<script>
import { SubjectApi } from "../../mixins/api"
export default {
	name: "Subject",
	mixins: [ SubjectApi ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        subject: {
          fields: {
            id: null,
            code: "",
            name: "",
            description: "",
            units: 0,
            amountPerUnit: 0,
            labs: 0,
            amountPerLab: 0,
            totalAmount: 0
          }
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
							thStyle: {width: "8%"}
						},
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
						{
							key: "units",
							label: "UNITS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            {
							key: "amountPerUnit",
							label: "AMOUNT PER UNIT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "13%"}
						},
						{
							key: "labs",
							label: "LABS",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            {
							key: "amountPerLab",
							label: "AMOUNT PER LAB",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "13%"}
            },
            {
							key: "totalAmount",
							label: "TOTAL AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "15%"}
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
      }
		}
	},
	created(){
		this.loadSubjects()
	},
	methods: {
		loadSubjects(){
      this.tables.subjects.isBusy = true
      const { perPage, page } = this.paginations.subject
			var params = { paginate: true, perPage, page }
      this.getSubjectList(params).then(response =>{
        const res = response.data
        this.tables.subjects.items = res.data
        this.paginations.subject.from = res.meta.from
        this.paginations.subject.to = res.meta.to
        this.paginations.subject.totalRows = res.meta.total
        this.tables.subjects.isBusy = false
      })
    },
    onSubjectEntry(){
      if(this.entryMode == "Add"){
        this.addSubject(this.forms.subject.fields)
          .then(response => {
            const res = response
            const { subject } = this.paginations
            if(subject.totalRows % subject.perPage == 0){
              subject.totalRows++
            }
            if(subject.page == subject.totalRows){
              this.loadSubjects()
            }
            else {
              subject.page = subject.totalRows
            }
            this.showNotification("success", "Subject created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const err = error.response.data.errors
            if(err){
              var key = Object.keys(err)[0]
              this.showNotification("danger", err[key])
              this.$refs[key].focus()
            }
          })
      }
      else {
        const { fields } = this.forms.subject
        this.updateSubject(fields, fields.id)
          .then(response => {
            const res = response.data
            this.loadSubjects()
            this.showNotification("success", "Subject updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const err = error.response.data.errors
            if(err){
              var key = Object.keys(err)[0]
              this.showNotification("danger", err[key])
              this.$refs[key].focus()
            }
          })
      }
    },
    onSubjectDelete(){
      const { id } = this.forms.subject.fields
      this.deleteSubject(id)
        .then(response => {
          this.loadSubjects()
          this.showNotification("success", "Subject deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    clearFields(){
      var keyField = this.forms.subject.fields
      for(var key in keyField){
        if (typeof keyField[key] !== "object") {
          if(typeof keyField[key] == "number"){
            keyField[key] = 0
          }
          else{
            keyField[key] = null
          }
        } 
        else {
          var innerFields = keyField[key]
          for (var innerKey in innerFields) {
            innerFields[innerKey] = null
          }
        }
      }
    },
    setSubjectUpdate(row){
      for(var key in this.forms.subject.fields){
        this.forms.subject.fields[key] = row.item[key]
      }
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    computeTotalAmount(){
      const { fields } = this.forms.subject
      fields.totalAmount = (fields.units * fields.amountPerUnit) + (fields.labs * fields.amountPerLab)
    },
    showNotification(variant, msg){
      this.$bvToast.toast(msg, {
        title: "Notification",
        variant: variant,
        solid: true
      })
    }
	}
}
</script>