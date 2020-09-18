<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Subjects <br>
          <small>List of all subjects of the student.</small>
        </span>
      </h5>
      <b-card-body>
        <b-table
          details-td-class="table-secondary"
          hover outlined small show-empty
          :fields="tables.academicRecords.fields"
          :items="tables.academicRecords.items"
          :busy="tables.academicRecords.isBusy">
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
              <span><b-link @click="loadDetails(row)">{{ row.item.student.name }}</b-link></span><br>
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
            <v-icon
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'"
              @click="loadDetails(row)" />
          </template>
          <template v-slot:row-details="data">
            <b-overlay :show="isLoading" rounded="sm">
              <b-card>
                <b-row>
                  <b-col md="3">
                    <b-form-group>
                      <label>Level</label>
                      <b-form-select
                        @change="checkSchoolCategory(data)"
                        v-model="data.item.levelId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Level --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="level in options.levels.items"
                          :key="level.id"
                          :value="level.id">
                          {{ level.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group>
                      <label>Status</label>
                      <b-form-select
                        v-model="data.item.academicRecordStatusId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Status --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="status in AcademicRecordStatuses.values"
                          :key="status.id"
                          :value="status.id">
                          {{ status.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group>
                      <label>School Year</label>
                      <b-form-input
                        v-model="data.item.schoolYear.name"
                        readonly />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.courseId">
                  <b-col md="5">
                    <b-form-group>
                      <label>Course</label>
                      <b-form-select
                        v-model="data.item.courseId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="course in options.courses.items"
                          :key="course.id"
                          :value="course.id">
                          {{`${course.description} ${(course.major ? course.major : '')}`}}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>Semester</label>
                      <b-form-select
                        v-model="data.item.semesterId">
                        <b-form-select-option
                          v-for="semester in semesters.values"
                          :key="semester.id"
                          :value="semester.id">
                          {{semester.name}}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <hr>
                <div v-if="data.item.subjects">
                  <b-row class="mb-3">
                    <b-col md=12>
                      <h5 class="pt-2">SUBJECTS</h5>
                    </b-col>
                  </b-row>
                  <div class="details__section-button-container">
                    <div class="section__container">
                      <label>Section</label>
                      <b-form-select
                        class="section-select"
                        v-model="data.item.sectionId">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>-- Section --</b-form-select-option>
                        </template>
                        <b-form-select-option
                          v-for="section in filterSection(data.item)"
                          :key="section.id"
                          :value="section.id">
                          {{ section.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </div>
                    <button class="btn btn-outline-primary add-subject-button"
                      @click="onAddSubject(data.item)">
                      <v-icon name="plus-circle" /> ADD SUBJECT
                    </button>
                  </div>
                  <b-table
                    class="mb-4"
                    hover outlined small responsive show-empty
                    :fields="tables.subjects.fields"
                    :items="data.item.subjects"
                    :busy="tables.subjects.isBusy">
                    <template v-slot:custom-foot>
                      <b-tr class="font-weight-bold">
                        <b-td colspan=2 class="text-right">
                          <span class="text-danger">Total Units </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                              {{ totalUnits(data.item.subjects, 'units') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                              {{ totalUnits(data.item.subjects, 'labs') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                              {{ totalUnits(data.item.subjects, 'totalUnits') }}
                          </span>
                        </b-td>
                        <b-td></b-td>
                      </b-tr>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="removeSubject(data.item.subjects, row)"
                        size="sm" variant="danger">
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                  </b-table>
                </div>
                <template v-slot:footer>
                  <b-button
                    @click="loadDetails(data)"
                    class="float-right my-2 mr-2"
                    variant="outline-danger">Cancel</b-button>
                  <b-button
                    :disabled="isProcessing"
                    @click="onUpdateSubjects(data.item)"
                    class="float-right m-2"
                    variant="outline-primary">
                    <v-icon
                      v-if="isProcessing"
                      name="sync"
                      spin />
                    Update
                  </b-button>
                </template>
              </b-card>
            </b-overlay>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-modal
			v-model="showModalSubjects"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title">
					Subjects
			</div>
			<b-row>
				<b-col md=12>
          <b-row class="mb-2">
            <b-col offset-md="4" md="8">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.subjects.items"
						:fields="tables.subjects.fields"
            :filter="filters.subject.criteria"
						:busy="tables.subjects.isBusy"
            :current-page="paginations.subject.page"
            :per-page="paginations.subject.perPage"
            @filtered="onFiltered($event, paginations.subject)">
						<template v-slot:cell(action)="row">
							<b-button
                @click="addSubject(row)"
                size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
						</template>
					</b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.subject.from}} to {{paginations.subject.to}} of {{paginations.subject.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.subject)"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row>
			<div slot="modal-footer" class="w-100">
				<b-button
        class="float-right"
        variant="outline-danger"
        @click="showModalSubjects=false">
        Close
      </b-button>
			</div>
		</b-modal>
  </div>
</template>
<script>
import { StudentApi, AcademicRecordApi, SectionApi, LevelApi, CourseApi, SubjectApi } from '../../../mixins/api'
import { StudentCategories, AcademicRecordStatuses, Semesters, SchoolCategories } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import tables from '../../../helpers/tables'
import { showNotification } from '../../../helpers/forms'
export default {
  mixins: [ StudentApi, AcademicRecordApi, SectionApi, LevelApi, CourseApi, SubjectApi, tables ],
  components: {
    EvaluationEntry
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentAcademicRecordList()
    this.loadSectionList()
    this.loadCourseList()
    this.loadLevelList()
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
        subjects: {
					isBusy: false,
					fields: [
            // {
						// 	key: "code",
						// 	label: "Code",
						// 	tdClass: "align-middle",
						// 	thStyle: {width: "6%"}
						// },
						{
							key: "name",
							label: "Subject Code",
							tdClass: "align-middle",
							thStyle: {width: "12%"}
						},
						{
							key: "description",
							label: "Description",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
						{
							key: "units",
							label: "Lec Units",
							tdClass: "align-middle text-center",
							thClass: "text-right text-center",
							thStyle: {width: "8%"}
            },
            // {
						// 	key: "amountPerUnit",
						// 	label: "Amount per Lec Unit",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
						// 	thStyle: {width: "16%"}
						// },
						{
							key: "labs",
							label: "Lab Units",
							tdClass: "align-middle text-center",
							thClass: "text-right",
							thStyle: {width: "8%"}
            },
            // {
						// 	key: "amountPerLab",
						// 	label: "Amount per Lab",
						// 	tdClass: "align-middle text-right",
						// 	thClass: "text-right",
						// 	thStyle: {width: "13%"}
            // },
            {
							key: "totalUnits",
							label: "Total Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
              thStyle: {width: "12%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: {width: "5%"}
						}
          ],
          items: [],
          filteredItems: []
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
      },
      options: {
        sections: {
          items: []
        },
        courses: {
          items: []
        },
        levels: {
          items: []
        }
      },
    }
  },
  methods: {
    onUpdateSubjects(item) {
      const {
        id: academicRecordId,
        levelId,
        academicRecordStatusId,
        courseId,
        semesterId,
        sectionId,
        subjects: rawSubjects
      } = item

      let subjects = rawSubjects.map(subject => {
        const { id: subjectId, pivot: { sectionId } } = subject
				return { subjectId, sectionId }
      })

      const data = {
        levelId,
        academicRecordStatusId,
        courseId,
        semesterId,
        sectionId,
        subjects
      }

      this.isProcessing = true;
      this.updateAcademicRecord(data, academicRecordId)
      .then(({ data }) => {
        this.isProcessing = false
        this.loadStudentAcademicRecordList()
        showNotification(this, "success", "Approved Successfully.")
      }).catch((error) => {
				const errors = error.response.data.errors
        this.isProcessing = false;
      });
    },
    loadLevelList() {
      const { levels } = this.options
      const params = { paginate: false }
      this.getLevelList(params)
      .then(({ data }) => {
        levels.items = data
      })
    },
    loadCourseList() {
      const { courses } = this.options
      const params = { paginate: false }
      this.getCourseList(params)
      .then(({ data }) => {
        courses.items = data
      })
    },
    loadSectionList() {
      const { sections } = this.options
      const params = { paginate: false }
      this.getSectionList(params)
      .then(({ data }) => {
        sections.items = data
      })
    },
    loadStudentAcademicRecordList() {
      const academicRecordStatusId = AcademicRecordStatuses.FINALIZED.id
      const params = { paginate: false, academicRecordStatusId }
      const { academicRecords } = this.tables
      academicRecords.isBusy = true
      this.getAcademicRecordsOfStudent(this.studentId, params)
      .then(({ data }) => {
        academicRecords.isBusy = false
        academicRecords.items = data
      })
    },
    loadSubjects(schoolCategoryId){
      const { subjects } = this.tables
      const { subject } = this.paginations
      subjects.items = []

      subjects.isBusy = true
      let params = { paginate: false, schoolCategoryId }

			this.getSubjectList(params)
      .then(({ data }) => {
        subjects.items = data
        subject.totalRows = data.length
        this.recordDetails(subject)
        subjects.isBusy = false
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
    loadDetails(row){
			if (!row.detailsShowing) {
				const {
					id: academicRecordId,
					admissionId
				} = row.item
        const params = { paginate: false }

				this.isLoading = true
				this.getSubjectsOfAcademicRecord(academicRecordId, params)
					.then(({ data }) => {
						this.$set(row.item, 'subjects', data)
						this.isLoading = false
        })
			}
			row.toggleDetails()
    },
    filterSection(item) {
      const sect=
         this.options.sections.items.filter(s =>
          s.schoolYearId === item.schoolYearId
              && s.levelId === item.levelId
                  && s.courseId === item.courseId
                    && s.semesterId === item.semesterId )
      return sect
    },
    checkSchoolCategory(row) {
      const categories = [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id,
        SchoolCategories.VOCATIONAL.id
      ]
      const { item } = row
      const { items } = this.options.levels

      const level = items.find(level => level.id === item.levelId)
      const schoolCategoryId = level.schoolCategoryId;

      if (!categories.includes(schoolCategoryId)) {
        item.courseId = null
        item.semesterId = null
      }
    },
    onAddSubject(item){
      this.studentSubjects = item.subjects
      this.showModalSubjects = true
      this.loadSubjects(item.schoolCategoryId)
    },
		addSubject(row){
      const { item } = row
      // check if subject exist in the table
      const result = this.studentSubjects.find(subject => subject.id === item.id)
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.')
        return
      }
      this.$set(item, 'pivot', {})
      this.$set(item.pivot, 'sectionId', null)
			this.studentSubjects.push(item)
		},
		removeSubject(subjects, row){
			subjects.splice(row.index, 1)
		},
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0
        subjects.forEach(s => {
          units += Number(s[field])
        })
        return units
      }
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