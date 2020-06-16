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
                      @click="clearFields(), entryMode='Add', onShowModal()">
                      <b-icon-plus-circle></b-icon-plus-circle> ADD NEW COURSE
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.course.criteria"
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
									:fields="tables.courses.fields"
                  :busy="tables.courses.isBusy"
                  :items="tables.courses.items" 
                  :filter="filters.course.criteria">
                  <template v-slot:cell(action)="row">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <b-icon-grip-horizontal></b-icon-grip-horizontal>
                      </template>
                      <b-dropdown-item 
                        @click="setCourseUpdate(row)" >
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.course.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.course.from }} to {{ paginations.course.to }} of {{ paginations.course.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.course.page"
                      :total-rows="paginations.course.totalRows"
                      :per-page="paginations.course.perPage"
                      size="sm"
                      align="end"
                      @input="loadCourses()" />
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
					Courses - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row> 
        <b-col md=12>
          <b-form-group>
            <label class="required">Name</label>
            <b-form-input 
              ref="name" 
              v-model="forms.course.fields.name"
              :state="forms.course.states.name" />
            <b-form-invalid-feedback>
              {{forms.course.errors.name}}
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
                v-model="forms.course.fields.description" 
                :state="forms.course.states.description"/>
              <b-form-invalid-feedback>
                {{forms.course.errors.description}}
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
          @click="onCourseEntry()">
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
          Delete Course
      </div>
      Are you sure you want to delete this course ?
      <div slot="modal-footer">
        <b-button 
          variant="outline-primary" 
          class="mr-2" 
          @click="onCourseDelete()">
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

const courseFields = {
  id: null,
  name: "",
  description: "",
}

import { CourseApi } from "../../mixins/api"
import { validate, reset } from '../../helpers/forms';
export default {
	name: "Course",
	mixins: [ CourseApi ],
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        course: {
          fields: { ...courseFields },
          states: { ...courseFields },
          errors: { ...courseFields }
        }
      },
			tables: {
				courses: {
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
				course: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        course: {
          criteria: null
        }
      }
		}
	},
	created(){
		this.loadCourses()
	},
	methods: {
		loadCourses(){
      const { courses } = this.tables
      const { course } = this.paginations

      courses.isBusy = true

			var params = { paginate: true, perPage: course.perPage, page: course.page }
      this.getCourseList(params).then(response =>{
        const res = response.data
        courses.items = res.data
        course.from = res.meta.from
        course.to = res.meta.to
        course.totalRows = res.meta.total
        courses.isBusy = false
      })
    },
    onCourseEntry(){
      reset(this.forms.course)
      if(this.entryMode == "Add"){
        this.addCourse(this.forms.course.fields)
          .then(response => {
            const res = response
            const { course } = this.paginations
            if(course.totalRows % course.perPage == 0){
              course.totalRows++
            }
            if(course.page == course.totalRows){
              this.loadCourses()
            }
            else {
              course.page = course.totalRows
            }
            this.showNotification("success", "Course created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            // if(err){
            //   var key = Object.keys(err)[0]
            //   this.showNotification("danger", err[key])
            //   this.$refs[key].focus()
            // }
            validate(this.forms.course, errors)
          })
      }
      else {
        const { fields } = this.forms.course
        this.updateCourse(fields, fields.id)
          .then(response => {
            const res = response.data
            this.loadCourses()
            this.showNotification("success", "Course updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            // if(err){
            //   var key = Object.keys(err)[0]
            //   this.showNotification("danger", err[key])
            //   this.$refs[key].focus()
            // }
            validate(this.forms.course, errors)
          })
      }
    },
    onCourseDelete(){
      const { id } = this.forms.course.fields
      this.deleteCourse(id)
        .then(response => {
          this.loadCourses()
          this.showNotification("success", "Course deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    clearFields(){
      var keyField = this.forms.course.fields
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
    setCourseUpdate(row){
      reset(this.forms.course)
      for(var key in this.forms.course.fields){
        this.forms.course.fields[key] = row.item[key]
      }
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    showNotification(variant, msg){
      this.$bvToast.toast(msg, {
        title: "Notification",
        variant: variant,
        solid: true
      })
    },
    onShowModal(){
      reset(this.forms.course)
      this.showModalEntry = true
    }
	}
}
</script>