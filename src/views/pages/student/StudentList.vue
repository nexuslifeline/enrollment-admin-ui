<template>
  <div class="c-page-content">
    <Card title="Student Management">
      <div>
        <!-- add button and search -->
        <b-row class="mb-3">
          <b-col md=12>
            <b-row>
              <b-col md=8>
                <b-button
                  v-if="isAccessible($options.StudentPermissions.ADD.id)"
                  variant="primary"
                  :to="`/master-files/student/add`">
                  <v-icon name="plus-circle" /> ADD NEW STUDENT
                </b-button>
              </b-col>
              <b-col md=4>
                <b-form-input
                  v-model="filters.student.criteria"
                  type="text"
                  placeholder="Search"
                  debounce="500"
                  @update="loadStudents()">
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
              :fields="tables.students.fields"
              :busy="tables.students.isBusy"
              :items="tables.students.items"
            >
              <template v-slot:cell(name)="data">
                <b-media>
                  <template v-slot:aside>
                    <b-avatar
                      rounded
                      blank
                      size="64"
                      :text="data.item.firstName.charAt(0) + '' + data.item.lastName.charAt(0)"
                      :src="avatar(data.item)" />
                  </template>
                  <span>{{ data.item.name }}</span><br>
                  <small>Student no.: {{ data.item.studentNo ? data.item.studentNo : 'Awaiting Confirmation' }}</small><br>
                  <small>Address : {{ data.item.address ? data.item.currentAddress ? data.item.currentAddress :  data.item.address.currentCompleteAddress : '' }}
                  </small>
                </b-media>
              </template>
              <template v-slot:cell(contact)="data">
                Email : {{ data.item.email }} <br>
                <small>Phone : {{ data.item.phoneNo }}</small> <br>
                <small>Mobile : {{ data.item.mobileNo }}</small> <br>
              </template>
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
                    $options.StudentPermissions.UPDATE_ACADEMIC_RECORDS.id,
                    $options.StudentPermissions.EDIT.id,
                    $options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id,
                    $options.StudentPermissions.DELETE.id
                  ])"
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret>
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    :to="`/master-files/student/${row.item.id}/school-records`" >
                    Update School Records
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.StudentPermissions.EDIT.id)"
                    :to="`/master-files/student/${row.item.id}`"
                    :disabled="showStudentEntry">
                    Edit Student Info
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id)"
                    @click="setUpdateUser(row)"
                    :disabled="showModalUpdateUser" >
                    Edit Account
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.StudentPermissions.DELETE.id)"
                    @click="forms.user.fields.id = row.item.id, showModalConfirmation = true"
                    :disabled="showModalConfirmation">
                    Delete
                  </b-dropdown-item>
                  <!-- TODO: SET USER ACCESS OF PREVIEW LEDGER BUTTON -->
                  <b-dropdown-item
                    @click="onShowLedgerModal(row.item.id)">
                    Preview Ledger
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md=6>
                Showing {{ paginations.student.from }} to {{ paginations.student.to }} of {{ paginations.student.totalRows }} records.
              </b-col>
              <b-col md=6>
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.student.page"
                  :total-rows="paginations.student.totalRows"
                  :per-page="paginations.student.perPage"
                  size="sm"
                  align="end"
                  @input="loadStudents()" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </Card>
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
              :state="forms.user.states.userUsername"
              debounce="500" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userUsername}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Password</label>
            <b-form-input
              type="password"
              v-model="forms.user.fields.password"
              :state="forms.user.states.userPassword"
              debounce="500" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userPassword}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Confirm Password</label>
            <b-form-input
              type="password"
              v-model="forms.user.fields.passwordConfirmation"
              debounce="500"/>
          </b-form-group>
				</b-col>
			</b-row>
      <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalUpdateUser=false">
          Close
        </b-button>
        <b-button
          :disabled="isUserSaving"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onStudentEntry()">
          <v-icon
            v-if="isUserSaving"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Delete Student
      </div>
      Are you sure you want to delete this student ?
      <div slot="modal-footer">
        <b-button
          :disabled="isUserSaving"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onStudentDelete()">
          <v-icon
            v-if="isUserSaving"
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

    <b-modal
      v-model="showModalPreview"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="sm" >
      <div slot="modal-title">
          Preview Student Ledger
      </div>
      <b-row>
        <b-col md=12>
          <b-form-group>
            <label class="required">School Year</label>
            <b-form-select
              v-model="filters.ledger.schoolYearId">
              <b-form-select-option v-for='schoolYear in options.schoolYears.items' :key='schoolYear.id' :value='schoolYear.id'>
                {{ schoolYear.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
          <b-form-group>
            <label class="required">As Of Date</label>
            <b-form-datepicker
              :date-format-options="{ year: 'numeric', month: 'long', day: '2-digit', weekday: 'short' }"
              class="date-pickers"
              v-model="filters.ledger.asOfDate"/>
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-button
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="previewLedger(selectedStudentId)">
          <v-icon
            v-if="isUserSaving"
            name="sync"
            spin
            class="mr-2" />
          Preview
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalPreview=false">
          close
        </b-button>
      </div>
    </b-modal>

    <FileViewer
      :show="showModalFileViewer"
      :file="file"
      :owner="file.owner"
      :isBusy="file.isLoading"
      @close="showModalFileViewer = false"
    />
  </div>
</template>
<script>

import { StudentApi, UserGroupApi } from "../../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../../helpers/forms'
import { Countries, CivilStatuses, StudentPermissions } from "../../../helpers/enum"
import Tables from "../../../helpers/tables"
import PhotoViewer from '../../components/PhotoViewer'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
import Card from '../../components/Card'

const studentFields = {
  id: null,
  //studentNo: null,
  // studentNo: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  birthDate: null,
  civilStatusId: null,
  email: null,
}

const addressFields = {
  currentHouseNoStreet: null,
  currentBarangay: null,
  currentCityTown: null,
  currentProvince: null,
  currentRegion: null,
  currentDistrict: null,
  currentPostalCode: null,
  currentCountryId: Countries.PHILIPPINES.id,
  currentCompleteAddress: null,
  currentHomeLandlineMobileNo: null,
  permanentHouseNoStreet: null,
  permanentBarangay: null,
  permanentCityTown: null,
  permanentProvince: null,
  permanentRegion: null,
  permanentDistrict: null,
  permanentPostalCode: null,
  permanentCountryId: Countries.PHILIPPINES.id,
  permanentCompleteAddress: null,
  permanentHomeLandlineMobileNo: null
}

const addressErrorFields = {
  addressCurrentHouseNoStreet: null,
  addressCurrentBarangay: null,
  addressCurrentCityTown: null,
  addressCurrentProvince: null,
  addressCurrentRegion: null,
  addressCurrentDistrict: null,
  addressCurrentPostalCode: null,
  addressCurrentCountryId: null,
  addressCurrentCompleteAddress: null,
  addressCurrentHomeLandlineMobileNo: null,
  addressPermanentHouseNoStreet: null,
  addressPermanentBarangay: null,
  addressPermanentCityTown: null,
  addressPermanentProvince: null,
  addressPermanentRegion: null,
  addressPermanentDistrict: null,
  addressPermanentPostalCode: null,
  addressPermanentCountryId: null,
  addressPermanentCompleteAddress: null,
  addressPermanentHomeLandlineMobileNo: null
}

const familyFields = {
  fatherName: null,
  fatherOccupation: null,
  fatherMobileNo: null,
  fatherEmail: null,
  motherName: null,
  motherOccupation: null,
  motherMobileNo: null,
  motherEmail: null,
  parentGuardianName: null,
  parentGuardianContactNo: null
}

const familyErrorFields = {
  familyFatherName: null,
  familyFatherOccupation: null,
  familyFatherMobileNo: null,
  familyFatherEmail: null,
  familyMotherName: null,
  familyMotherOccupation: null,
  familyMotherMobileNo: null,
  familyMotherEmail: null,
  familyParentGuardianName: null,
  familyParentGuardianContactNo: null
}

const educationFields = {
  lastSchoolAttended: null,
  lastSchoolAddress: null,
  lastSchoolYearFrom: null,
  lastSchoolYearTo: null,
  lastLevel: null,
  elementaryCourse: null,
  elementaryCourseYearFrom: null,
  elementaryCourseYearTo: null,
  elementaryCourseHonors: null,
  highSchoolCourse: null,
  highSchoolCourseYearFrom: null,
  highSchoolCourseYearTo: null,
  highSchoolCourseHonors: null,
  seniorSchoolCourse: null,
  seniorSchoolCourseYearFrom: null,
  seniorSchoolCourseYearTo: null,
  seniorSchoolCourseHonors: null,
  collegeDegree: null,
  collegeDegreeYearFrom: null,
  collegeDegreeYearTo: null,
  collegeDegreeHonors: null,
}

const userFields = {
  username: null,
  password: null,
  passwordConfirmation: null,
}

const userErrorFields = {
  userUsername: null,
  userPassword: null,
}

import { StudentApi, UserGroupApi, ReportApi, SchoolYearApi } from "../../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../../helpers/forms'
import { Countries, CivilStatuses, StudentPermissions } from "../../../helpers/enum"
import Tables from "../../../helpers/tables"
import PhotoViewer from '../../components/PhotoViewer'
import FileViewer from '../../components/FileViewer'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
export default {
	name: "StudentList",
  mixins: [StudentApi, Tables, Access, ReportApi, SchoolYearApi],
  components: {
    FileViewer
export default {
	name: "StudentList",
  mixins: [
    StudentApi,
    Tables,
    Access
  ],
  components: {
    PhotoViewer,
    Card
  },
  StudentPermissions,
	data() {
		return {
      selectedStudentId: null,
      showModalPreview: false,
      showModalFileViewer: false,
      showStudentEntry: false,
      showModalUpdateUser: false,
      showModalConfirmation: false,
      isProfilePhotoBusy: false,
      isProcessing : false,
      isUserSaving: false,
      studentPhotoUrl: null,
      Countries: Countries,
      CivilStatuses: CivilStatuses,
      selectedPhoto: null,
      entryMode: "",
      activeTabIndex: 0,
      isLoading: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false
      },
      forms: {
        student: {
          fields: { ...studentFields },
          states: { ...studentFields },
          errors: { ...studentFields }
        },
        address: {
          fields: { ...addressFields },
          states: { ...addressErrorFields },
          errors: { ...addressErrorFields }
        },
        family: {
          fields: { ...familyFields },
          states: { ...familyErrorFields },
          errors: { ...familyErrorFields }
        },
        education: {
          fields: { ...educationFields },
          states: { ...educationFields },
          errors: { ...educationFields }
        },
        user: {
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields }
        }
      },
			tables: {
				students: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "50%"},
							// formatter: (value, key, item) => {
							// 	if(!item.middleName) {
							// 		item.middleName = ""
							// 	}
							// 	item.name = item.firstName + " " + item.middleName + " " + item.lastName
							// }
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "45%" },
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
					items: []
				}
      },
      tabHeaders: [
          { header: 'Profile', description: 'Officially registering you is just few steps away. First, tell us a bit about yourself.' },
          { header: 'Address', description: 'Let us know your address. Please include all required(*) fields.' },
          { header: 'Family', description: 'Details about your family. Please include all required(*) fields.' },
          { header: 'Education', description: 'Details about your previous educational background. Please include all required(*) fields.' }
      ],
      paginations: {
				student: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        student: {
          criteria: null
        },
        ledger: {
          schoolYearId: null,
          asOfDate: null,
        }
      },
      options: {
        civilStatuses: {
          items: CivilStatuses
        },
        countries: {
          items: Countries
        },
        schoolYears: {
          items: []
        }
      }
		}
	},
	created() {
    this.loadStudents()
    this.loadSchoolYears()
	},
	methods: {
		loadStudents() {
      const { students } = this.tables
      const { criteria } = this.filters.student
      const { student, student: { perPage, page } } = this.paginations

      students.isBusy = true

			let params = { paginate: true, perPage, page, criteria }
      this.getStudentList(params).then(({ data }) => {
        students.items = data.data
        student.from = data.meta.from
        student.to = data.meta.to
        student.totalRows = data.meta.total
        students.isBusy = false
      })
    },
    onStudentEntry() {
      const {
        student: { fields: { id: studentId } },
        student,
        address,
        family,
        education,
        user } = this.forms

      const { students } = this.tables

      reset(student)
      reset(address)
      reset(family)
      reset(education)
      reset(user)

      const data = {
        ...student.fields,
        address: { ...address.fields },
        family: { ...family.fields },
        education: { ...education.fields }
      }

      if (this.entryMode == "Edit Student") {
        this.isProcessing = true;
        this.updateStudent(data, studentId)
          .then(({ data }) => {
            this.updateRow(students, data)
            showNotification(this, 'success', 'Student has been updated.')
            this.showStudentEntry = false;
            this.isProcessing = false;
        }).catch(error => {
          const errors = error.response.data.errors
          validate(student, errors)
          validate(address, errors)
          validate(family, errors)
          validate(education, errors)
          this.isProcessing = false;
          this.showBulletedNotification(errors)
        })
      } else if (this.entryMode == "Edit User") {
        this.isUserSaving = true
        student.fields.email = user.fields.username
        const data = { id: student.fields.id, email: student.fields.email, user: user.fields }

        this.updateStudent(data, studentId)
          .then(({ data }) => {
            this.updateRow(students, data)
            showNotification(this, "success", "Student's Account is updated successfully.")
            this.showModalUpdateUser = false
            this.isUserSaving = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(user, errors)
            this.isUserSaving = false
          })
      }
    },
    setUpdateUser(row) {

      const { student, user } = this.forms
      const { item } = row
      this.showModalUpdateUser = true
      this.isLoading = true
      clearFields(user.fields)
      reset(user)

      copyValue(item, student.fields)

      if (row.item.user)
      user.fields.username = row.item.user.username

      this.entryMode = "Edit User"
      this.isLoading = false
    },
    onStudentDelete(){
      const { student, user: { fields: { id } } } = this.forms
      const { students } = this.tables
      this.isUserSaving = true
      this.deleteStudent(id)
        .then(({ data }) => {
          this.deleteRow(students, this.paginations.student, id)
          this.isUserSaving = false
          showNotification(this, "success", "User deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    createBase64Image(fileObject) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.studentPhotoUrl = e.target.result
      }
      reader.readAsDataURL(fileObject)
      setTimeout(() => this.isProfilePhotoBusy = false, 1000)
    },
    showBulletedNotification(errors) {
      const h = this.$createElement
      const errorList = []
      Object.keys(errors).forEach((key) => {
        errorList.push(h('li', errors[key][0]))
      })
      const vNodesMsg = h(
        'ul',
        errorList
      )
      showNotification(this, "danger", vNodesMsg, 4000)
    },
    previewLedger(studentId) {
      this.file.type = null
      this.file.src = null
      this.file.notes = null
      this.file.isLoading = true
      this.file.owner = null;
      this.file.name = 'Student Ledger'

      const { schoolYearId, asOfDate } = this.filters.ledger

      this.showModalFileViewer = true
      const params = { schoolYearId, asOfDate }
      this.previewStudentLedger(studentId, params).then(response => {
          this.file.type = response.headers.contentType
          const file = new Blob([response.data], { type: "application/pdf" } )
          const reader = new FileReader();
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
          this.file.isLoading = false
      })
    },
    loadSchoolYears() {
      const params = { paginate: false }
      const { schoolYears } = this.options
      this.getSchoolYearList(params).then(( { data }) => {
        schoolYears.items = data
      })
    },
    onShowLedgerModal(studentId) {
      this.selectedStudentId = studentId
      this.showModalPreview = true
      this.filters.ledger.schoolYearId = this.getActiveSchoolYearId
      this.filters.ledger.asOfDate = new Date()
    }
  },
  computed: {
    getActiveSchoolYearId() {
      const { items } = this.options.schoolYears
      const schoolYear = items.find(sy => sy.isActive === 1)

      if(!schoolYear)
        return null

      return schoolYear?.id
    }
  }
}
</script>
<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";

  .profile-photo {
    height: 200px;
    width: 200px;
  }

  .profile-photo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
