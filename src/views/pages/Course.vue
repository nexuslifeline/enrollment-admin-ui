<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .bottom-space {
    margin-bottom: 0px;
    
    @include for-size(phone-only) {
      margin-bottom: 15px;
    }

  }
</style> 

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
                    <b-button class="bottom-space" variant="outline-primary"
                      @click="setCreate()">
                      <v-icon name="plus-circle" /> ADD NEW COURSE
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
                  :current-page="paginations.course.page"
                  :per-page="paginations.course.perPage"
                  :filter="filters.course.criteria"
                  @filtered="onFiltered($event, paginations.course)">
                  <template v-slot:cell(action)="row">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <v-icon name="ellipsis-v" />
                      </template>
                      <b-dropdown-item 
                        @click="setUpdate(row)" >
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
                      @input="recordDetails(paginations.course)"
                      size="sm"
                      align="end" />
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
          <b-form-group>
            <label class="required">Degree Types</label>
            <b-form-select 
              v-model="forms.course.fields.degreeTypeId" 
              :state="forms.course.states.degreeTypeId">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>-- Select Degree Type --</b-form-select-option>
              </template>
              <b-form-select-option 
                v-for="degreeType in options.degreeTypes.values"
                :key="degreeType.id"
                :value="degreeType.id">
                {{degreeType.name}}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{forms.course.errors.degreeTypeId}}
            </b-form-invalid-feedback>
          </b-form-group>
				</b-col>
          <!-- <b-form-checkbox-group
            v-model="forms.course.fields.levels"
            stacked>
            <b-form-checkbox
              v-for="level in options.levels.items"
              :key="level.id"
              :value="level.id">
              {{ level.name }}
            </b-form-checkbox>
            <b-form-invalid-feedback 
              :state="forms.course.states.levels">
              {{forms.course.errors.levels}}
            </b-form-invalid-feedback>
          </b-form-checkbox-group> -->
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
  name: null,
  description: null,
  degreeTypeId: null,
  levels: null
}

import { CourseApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import { DegreeTypes } from '../../helpers/enum'
import Tables from '../../helpers/tables'
export default {
	name: "Course",
	mixins: [ CourseApi, Tables ],
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
      },
      options: {
        degreeTypes: DegreeTypes
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

			var params = { paginate: false }
      this.getCourseList(params).then(({ data }) =>{
        courses.items = data
        course.totalRows = data.length
        this.recordDetails(course)
        courses.isBusy = false
      })
    },
    onCourseEntry(){
      const { course, course: { fields } } = this.forms
      const { courses } = this.tables
      let degreeType = DegreeTypes.getEnum(this.forms.course.fields.degreeTypeId)
      if (degreeType) {
        fields.levels = degreeType.levels
      }
      reset(course)
      if (this.entryMode == "Add") {
        this.addCourse(fields)
          .then(({ data }) => {
            const { course } = this.paginations
            this.addRow(courses, course, data)
            showNotification(this, "success", "Course created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(course, errors)
          })
      } else {
        this.updateCourse(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(courses, data)
            showNotification(this, "success", "Course updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(course, errors)
          })
      }
    },
    onCourseDelete(){
      const { id } = this.forms.course.fields
      const { courses } = this.tables
      this.deleteCourse(id)
        .then(({ data }) => {
          this.deleteRow(courses, id)
          showNotification(this, "success", "Course deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { course, course: { fields } } = this.forms
      copyValue(row.item, fields)
      reset(course)
      this.entryMode = "Edit"
      this.showModalEntry = true
    },
    setCreate(){
      const { course } = this.forms
      reset(course)
      clearFields(course.fields)
      this.entryMode='Add'
      this.showModalEntry = true
    }
	}
}
</script>