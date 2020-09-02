<template>
  <div>
    <b-card v-if="!showEntry">
      <h5 slot="header">
        <span>
          Student Evaluations <br>
          <small>List of all evaluation of the student.</small>
        </span>
      </h5>
      <b-card-body>
        <b-table
          details-td-class="table-secondary"
          hover outlined small show-empty responsive
          :fields="tables.evaluations.fields"
          :items.sync="tables.evaluations.items"
          :busy="tables.evaluations.isBusy">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon
                name="spinner"
                spin
                class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(attachments)="data">
            <span>{{ data.item.filesCount }} &nbsp; &nbsp; &nbsp; &nbsp; </span>  <v-icon name="paperclip"/>
          </template>
          <template v-slot:cell(name)="data">
            <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                  :src="avatar(data.item.student)" />
              </template>
              <span>{{ data.item.student.name }}</span><br>
              <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ data.item.student.address ?
                data.item.student.address.currentCompleteAddress : "" }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(contact)="data">
            Email : {{ data.item.student.email }} <br>
            <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
            <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
          </template>
          <template v-slot:cell(education)="data">
            <span>
              {{ getName(data.item, 'level') }}<br>
              {{ getName(data.item, 'course') }}<br>
              <!-- {{ data.item.enrolledYear ? `Enrolled Year: ${data.item.enrolledYear}` : '' }} -->
            </span>
          </template>
          <template v-slot:cell(studentCategory.name)="{ item: { studentCategory, studentCategoryId } }">
            <b-badge
              :variant="studentCategoryId === studentCategories.NEW.id
                ? 'success'
                : studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
              {{ studentCategory.name }}
            </b-badge>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="data.item.evaluationStatusId === evaluationStatuses.APPROVED.id
                ? 'success'
                : data.item.evaluationStatusId === evaluationStatuses.REJECTED.id ? 'danger' : 'warning'">
              {{ evaluationStatuses.getEnum(data.item.evaluationStatusId).name }}
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="setUpdate(row)" >
                Edit
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <EvaluationEntry
      @save="onUpdateEvaluation()"
      @close="showEntry = false"
      :isProcessing="isProcessing"
      :isLoading="isEntryLoading"
      :form="forms.evaluation.fields"
      v-else />
  </div>
</template>
<script>
import { StudentApi, EvaluationApi } from '../../../mixins/api'
import { EvaluationStatuses, StudentCategories } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import { copyValue } from '../../../helpers/extractor'
import { clearFields, showNotification } from '../../../helpers/forms'

const evaluationFields = {
  id: null,
  student: {
    studentNo: null,
    name: null,
    mobileNo: null,
    email: null,
    address: {
      currentCompleteAddress: null
    }
  },
  studentCategory: null,
  level: null,
  course: null,
  studentCategoryId: null,
  lastSchoolAttended: null,
  lastSchoolLevelId: null,
  from: null,
  to: null,
  studentCurriculumId: null,
  schoolCategoryId: null,
  curriculumId: null,
  courseId: null,
  levelId: null,
  semesterId: null,
  subjects: null,
  evaluationStatusId: null
}

export default {
  mixins: [ StudentApi, EvaluationApi ],
  components: {
    EvaluationEntry
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentEvaluationList()
  },
  data() {
    return {
      isProcessing: false,
      showEntry: false,
      isEntryLoading: false,
      studentCategories: StudentCategories,
      evaluationStatuses: EvaluationStatuses,
      studentId: null,
      forms: {
        evaluation: {
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields }
        }
      },
      tables: {
        evaluations: {
          isBusy: false,
          fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "auto"},
							formatter: (value, key, item) => {
								if(!item.student.middleName){
									item.student.middleName = ""
								}
								item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
							}
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "20%" },

						},
						{
							key: "education",
							label: "Education",
							tdClass: "align-middle",
              thStyle: { width: "20%"}
            },
            {
              key: "studentCategory.name",
							label: "Student Category",
							tdClass: "align-middle text-center font-weight-bold",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
						{
							key: "status",
							label: "Status",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
            {
							key: "attachments",
							label: "",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "8%"}
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
      }
    }
  },
  methods: {
    onUpdateEvaluation() {
      const { fields, fields: { student, level, course, studentCategory, ...evaluation } } = this.forms.evaluation
      const subjects = evaluation.subjects.map(s => {
        const subject = {
          subjectId: s.id,
          levelId: s.pivot.levelId,
          semesterId: s.pivot.semesterId,
          grade: s.pivot.grade,
          notes: s.pivot.notes,
          isTaken: s.pivot.isTaken
        }
        return subject
      })
      const data = { ...evaluation, subjects }
      // console.log(data)
      // return
      this.isProcessing = true;
      this.updateEvaluation(data, evaluation.id)
      .then(({ data }) => {
        // this.loadEvaluation()
        this.isProcessing = false
        this.showEntry = false
        showNotification(this, "success", "Updated Successfully.")
        this.loadStudentEvaluationList()
      }).catch((error) => {
        this.isProcessing = false;
        const errors = error.response.data.errors
        // this.showBulletedNotification(errors)
      });

    },
    loadStudentEvaluationList() {
      const evaluationStatusId = EvaluationStatuses.APPROVED.id
      const params = { paginate: false, evaluationStatusId }
      const { evaluations } = this.tables
      evaluations.isBusy = true
      this.getEvaluationsOfStudent(this.studentId, params)
      .then(({ data }) => {
        evaluations.isBusy = false
        evaluations.items = data
      })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    getName(item, child){
      if (item) {
        let value = item[child]
        if (value) {
          return value['name']
        }
      }
      return ''
    },
    setUpdate(row) {
      this.isEntryLoading = true
      this.showEntry = true
      const { fields } = this.forms.evaluation
      clearFields(fields)
      this.getEvaluation(row.item.id)
      .then(({ data }) => {
        copyValue(data, fields)
        this.isEntryLoading = false
      })
      // this.evaluationEntryInfo = row.item
    }
  }
}
</script>
