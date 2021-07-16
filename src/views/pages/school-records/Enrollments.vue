<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Enrollments <br>
          <small>List of all enrollments of the student.</small>
        </span>
      </h5>
      <b-card-body>
        <b-table
          details-td-class="table-secondary"
          hover outlined small show-empty
          :fields="tables.academicRecords.fields"
          :items="tables.academicRecords.items"
          :busy="tables.academicRecords.isBusy"
          responsive>
          <template v-slot:cell(name)="row">
            <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="row.item.student.firstName.charAt(0) + '' + row.item.student.lastName.charAt(0)"
                  :src="avatar(row.item.student)" />
              </template>
              <span>{{ row.item.student.name }}</span><br>
              <small>Student no.: {{ row.item.student.studentNo ? row.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ row.item.student.address ?
                row.item.student.address.currentCompleteAddress : "" }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(contact)="{item: student}">
            Email : {{ student.email }} <br>
            <small>Phone : {{ student.phoneNo }}</small> <br>
            <small>Mobile : {{ student.mobileNo }}</small> <br>
          </template>
          <template v-slot:cell(education)="{ item }">
            <span>{{ getName(item, 'level') + " "
              + getName(item, 'semester') + " "
              + getName(item, 'studentType') }}</span><br>
            <small v-if="item.course">{{item.course.description}} {{item.course.major ? `(${item.course.major})` : ''}}</small>
          </template>
          <template v-slot:cell(status)>
            <b-badge
              variant='primary'>
              Finalized
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret boundary="window">
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                :to="`/master-files/student/${$route.params.studentId}/school-records/enrollments/${row.item.id}`">
                Edit
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import { StudentApi, AcademicRecordApi } from '../../../mixins/api'
import { StudentCategories, AcademicRecordStatuses, Semesters, SchoolCategories } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import tables from '../../../helpers/tables'
import { showNotification } from '../../../helpers/forms'
export default {
  mixins: [ StudentApi, AcademicRecordApi, tables ],
  components: {
    EvaluationEntry
  },
  created() {
    if (this.$route.query?.success) {
      showNotification(this, "success", "Updated Successfully.")
      this.$router.replace({'query': null});
    }
    this.studentId = this.$route.params.studentId
    this.loadStudentAcademicRecordList()
  },
  data() {
    return {
      isProcessing: false,
      studentCategories: StudentCategories,
      AcademicRecordStatuses: AcademicRecordStatuses,
      semesters: Semesters,
      showModalSubjects: false,
      studentSubjects: [],
      tables: {
        academicRecords: {
					isBusy: false,
					filterIncludedFields: ["firstName", "lastName"],
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "30%"}
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "30%" },

						},
						{
							key: "education",
							label: "Education Level",
							tdClass: "align-middle",
              thStyle: { width: "25%"}
						},
						{
							key: "status",
							label: "Status",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "12%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
					items: []
        },
      },
    }
  },
  methods: {
    loadStudentAcademicRecordList() {
      // const academicRecordStatusId = AcademicRecordStatuses.FINALIZED.id
      const params = { paginate: false }
      const { academicRecords } = this.tables
      academicRecords.isBusy = true
      this.getAcademicRecordsOfStudent(this.studentId, params)
      .then(({ data }) => {
        academicRecords.isBusy = false
        academicRecords.items = data
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
  }
}
</script>
<style scoped lang="scss">
	@import "../../../assets/scss/shared.scss";

	.details__section-button-container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .add-subject-button {
    width: 175px;

    @include for-size(phone-only) {
      width: 100%;
    }
  }

  .section__container {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 10px;

    label {
      margin-right: 10px;
    }

   .section-select {
      width: 200px;
   }

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
      margin-right: 0;
      margin-bottom: 10px;
      width: 100%;

      .section-select {
        width: 100%;
      }

    }
  }
</style>