<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <b-card>
        <div v-if="forms.academicRecord.fields.student">
          <b-row class="mb-2">
            <b-col md="12">
              <span class="font-weight-bold">Student Information</span>
              <hr class="bg-light mt-1 mb-0" />
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Student Number :
              <span class="font-weight-bold">{{
                forms.academicRecord.fields.student.studentNo
                  ? forms.academicRecord.fields.student.studentNo
                  : 'Awaiting Confirmation'
              }}</span>
            </b-col>
            <b-col md="6">
              Name :
              <span class="font-weight-bold">{{
                forms.academicRecord.fields.student.name
              }}</span>
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Student Category :
              <b-badge
                :variant="
                  forms.academicRecord.fields.studentCategoryId ===
                  $options.StudentCategories.NEW.id
                    ? 'success'
                    : forms.academicRecord.fields.studentCategoryId ===
                      $options.StudentCategories.OLD.id
                    ? 'primary'
                    : 'warning'
                "
              >
                {{
                  forms.academicRecord.fields.studentCategory
                    ? forms.academicRecord.fields.studentCategory.name
                    : ''
                }}
              </b-badge>
            </b-col>
            <b-col md="6">
              Contact Number :
              <span class="font-weight-bold">{{
                forms.academicRecord.fields.student.mobileNo
              }}</span>
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Email :
              <span class="font-weight-bold">{{
                forms.academicRecord.fields.student.email
              }}</span>
            </b-col>
            <b-col md="6">
              Address :
              <span class="font-weight-bold">
                {{
                  forms.academicRecord.fields.student.address
                    ? forms.academicRecord.fields.student.address
                        .currentCompleteAddress
                    : ''
                }}
              </span>
            </b-col>
          </b-row>
        </div>
        <hr />
        <b-row>
          <b-col md="3">
            <b-form-group>
              <label>Level</label>
              <b-form-select
                @change="checkSchoolCategory(data)"
                v-model="forms.academicRecord.fields.levelId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Level --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="level in options.levels.items"
                  :key="level.id"
                  :value="level.id"
                >
                  {{ level.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group>
              <label>Status</label>
              <b-form-select
                v-model="forms.academicRecord.fields.academicRecordStatusId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Status --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="status in $options.AcademicRecordStatuses.values"
                  :key="status.id"
                  :value="status.id"
                >
                  {{ status.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group>
              <label>School Year</label>
              <b-form-input
                v-model="forms.academicRecord.fields.schoolYear.name"
                readonly
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="forms.academicRecord.fields.courseId">
          <b-col md="5">
            <b-form-group>
              <label>Course</label>
              <b-form-select v-model="forms.academicRecord.fields.courseId">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Course --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="course in options.courses.items"
                  :key="course.id"
                  :value="course.id"
                >
                  {{
                    `${course.description} ${course.major ? course.major : ''}`
                  }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group>
              <label>Semester</label>
              <b-form-select v-model="forms.academicRecord.fields.semesterId">
                <b-form-select-option
                  v-for="semester in $options.Semesters.values"
                  :key="semester.id"
                  :value="semester.id"
                >
                  {{ semester.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <hr />
        <div v-if="forms.academicRecord.fields.subjects">
          <b-row class="mb-3">
            <b-col md="12">
              <h5 class="pt-2">SUBJECTS</h5>
            </b-col>
          </b-row>
          <div class="details__section-button-container">
            <div class="section__container">
              <label>Section</label>
              <b-form-select
                class="section-select"
                v-model="forms.academicRecord.fields.sectionId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Section --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="section in filterSection(forms.academicRecord.fields)"
                  :key="section.id"
                  :value="section.id"
                >
                  {{ section.name }}
                </b-form-select-option>
              </b-form-select>
            </div>
            <button
              class="btn btn-primary add-subject-button"
              @click="onAddSubject(forms.academicRecord.fields)"
            >
              <v-icon name="plus-circle" /> ADD SUBJECT
            </button>
          </div>
          <b-table
            class="mb-4"
            hover
            outlined
            small
            responsive
            show-empty
            :fields="tables.subjects.fields"
            :items="forms.academicRecord.fields.subjects"
            :busy="tables.subjects.isBusy"
          >
            <template v-slot:custom-foot>
              <b-tr class="font-weight-bold">
                <b-td colspan="2" class="text-right">
                  <span class="text-danger">Total Units </span>
                </b-td>
                <b-td class="text-center">
                  <span class="text-danger">
                    {{
                      totalUnits(forms.academicRecord.fields.subjects, 'units')
                    }}
                  </span>
                </b-td>
                <b-td class="text-center">
                  <span class="text-danger">
                    {{
                      totalUnits(forms.academicRecord.fields.subjects, 'labs')
                    }}
                  </span>
                </b-td>
                <b-td class="text-center">
                  <span class="text-danger">
                    {{
                      totalUnits(
                        forms.academicRecord.fields.subjects,
                        'totalUnits'
                      )
                    }}
                  </span>
                </b-td>
                <b-td></b-td>
              </b-tr>
            </template>
            <template v-slot:cell(action)="row">
              <b-button
                @click="
                  removeSubject(forms.academicRecord.fields.subjects, row)
                "
                size="sm"
                variant="danger"
              >
                <v-icon name="trash" />
              </b-button>
            </template>
          </b-table>
        </div>
        <hr />
        <div v-if="forms.academicRecord.fields.studentFee">
          <b-row class="mb-3">
            <b-col md="4">
              <h5 class="pt-2">STUDENT FEES</h5>
            </b-col>
            <b-col md="4" class="text-center"> </b-col>
            <b-col md="4">
              <b-button
                @click="showModalFees = true"
                variant="primary"
                class="float-right"
              >
                <v-icon name="plus-circle" /> New Item
              </b-button>
            </b-col>
          </b-row>
          <b-table
            hover
            outlined
            small
            responsive
            show-empty
            :fields="tables.studentFeeItems.fields"
            :items="forms.academicRecord.fields.studentFee.studentFeeItems"
            :busy="tables.studentFeeItems.isBusy"
          >
            <template v-slot:cell(pivot.notes)="row">
              <b-form-input v-model="row.item.pivot.notes" />
            </template>
            <template v-slot:cell(pivot.isInitialFee)="row">
              <b-form-checkbox
                value="1"
                unchecked-value="0"
                v-model="row.item.pivot.isInitialFee"
              />
            </template>
            <template v-slot:cell(pivot.amount)="row">
              <vue-autonumeric
                :disabled="
                  row.item.id === $options.Fees.TUITION_FEE.id &&
                    forms.academicRecord.fields.isComputedByUnits === 1
                "
                v-model="row.item.pivot.amount"
                class="form-control text-right"
                :options="[
                  {
                    minimumValue: 0,
                    modifyValueOnWheel: false,
                    emptyInputBehavior: 0,
                  },
                ]"
              >
              </vue-autonumeric>
            </template>
            <template v-slot:cell(action)="row">
              <b-button
                v-if="row.item.id !== $options.Fees.TUITION_FEE.id"
                @click="removeFee(row)"
                size="sm"
                variant="danger"
              >
                <v-icon name="trash" />
              </b-button>
            </template>
          </b-table>
          <b-row>
            <b-col md="4">
              <b-form-group
                label="INITIAL FEE TOTAL :"
                label-for="enrollmentFee"
                label-class="font-weight-bold"
                label-cols="6"
              >
                <vue-autonumeric
                  class="form-control text-right"
                  disabled
                  v-model="initialFeeTotal"
                  :options="[
                    {
                      minimumValue: 0,
                      modifyValueOnWheel: false,
                      emptyInputBehavior: 0,
                    },
                  ]"
                >
                </vue-autonumeric>
              </b-form-group>
            </b-col>
            <!-- <b-col md=4>
              <b-form-group
                label="PREVIOUS BALANCE :"
                label-for="enrollmentFee"
                label-class="font-weight-bold"
                label-cols="4">
                <vue-autonumeric
                  class="form-control text-right"
                  v-model="forms.academicRecord.fields.previousBalance"
                  :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                </vue-autonumeric>
              </b-form-group>
            </b-col> -->
            <b-col offset-md="4" md="2">
              <h5 class="float-right font-weight-bold">Total</h5>
            </b-col>
            <b-col md="2">
              <h5 class="float-right font-weight-bold">
                {{
                  feesTotalAmount(
                    forms.academicRecord.fields.studentFee,
                    forms.academicRecord.fields.studentFee.studentFeeItems
                  )
                }}
              </h5>
            </b-col>
          </b-row>
        </div>
        <template v-slot:footer>
          <b-button
            :to="
              `/master-files/student/${$route.params.studentId}/school-records/enrollments`
            "
            class="float-right my-2 mr-2"
            variant="dark"
            >Cancel</b-button
          >
          <b-button
            :disabled="isProcessing"
            @click="onUpdateEnrollment()"
            class="float-right m-2"
            variant="primary"
          >
            <v-icon v-if="isProcessing" name="sync" spin />
            Update
          </b-button>
        </template>
      </b-card>
    </b-overlay>
    <b-modal
      v-model="showModalSubjects"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        Subjects
      </div>
      <b-row>
        <b-col md="12">
          <b-row class="mb-2">
            <b-col offset-md="4" md="8">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-table
            small
            hover
            outlined
            show-empty
            :items.sync="tables.subjects.items"
            :fields="tables.subjects.fields"
            :filter="filters.subject.criteria"
            :busy="tables.subjects.isBusy"
            :current-page="paginations.subject.page"
            :per-page="paginations.subject.perPage"
            @filtered="onFiltered($event, paginations.subject)"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="addSubject(row)" size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.subject.from }} to
              {{ paginations.subject.to }} of
              {{ paginations.subject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="paginate(paginations.subject)"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-right"
          variant="dark"
          @click="showModalSubjects = false"
        >
          Close
        </b-button>
      </div>
    </b-modal>
    <b-modal
      v-model="showModalFees"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        School Fees
      </div>
      <b-row>
        <b-col md="12">
          <b-row class="mb-2">
            <b-col offset-md="8" md="4">
              <b-form-input
                v-model="filters.fee.criteria"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-table
            small
            hover
            outlined
            show-empty
            :items.sync="tables.fees.items"
            :fields="tables.fees.fields"
            :filter="filters.fee.criteria"
            :busy="tables.fees.isBusy2"
            :current-page="paginations.fee.page"
            :per-page="paginations.fee.perPage"
            @filtered="onFiltered($event, paginations.fee)"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="addFee(row)" size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.fee.from }} to {{ paginations.fee.to }} of
              {{ paginations.fee.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.fee.page"
                :total-rows="paginations.fee.totalRows"
                :per-page="paginations.fee.perPage"
                size="sm"
                align="end"
                @input="paginate(paginations.fee)"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="dark"
          @click="showModalFees = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
  </div>
</template>
<script>
import {
  AcademicRecordStatuses,
  StudentCategories,
  Semesters,
  Fees,
} from '../../../helpers/enum';
import { copyValue } from '../../../helpers/extractor';
import { formatNumber, showNotification } from '../../../helpers/forms';
import tables from '../../../helpers/tables';
import {
  AcademicRecordApi,
  CourseApi,
  LevelApi,
  SchoolFeeApi,
  SectionApi,
  SubjectApi,
} from '../../../mixins/api';
const academicRecordFields = {
  id: null,
  student: null,
  levelId: null,
  courseId: null,
  semesterId: null,
  academicRecordStatusId: null,
  schoolYear: {
    name: null,
  },
  schoolYearId: null,
  studentCategory: null,
  studentCategoryId: null,
  subjects: null,
  studentFee: null,
  sectionId: null,
};
export default {
  AcademicRecordStatuses,
  StudentCategories,
  Semesters,
  Fees,
  mixins: [
    AcademicRecordApi,
    SectionApi,
    CourseApi,
    LevelApi,
    SubjectApi,
    SchoolFeeApi,
    tables,
  ],
  created() {
    this.academicRecordId = this.$route.params.academicRecordId;
    this.loadAcademicRecord();
    this.loadSectionList();
    this.loadCourseList();
    this.loadLevelList();
    this.loadFees();
  },
  data() {
    return {
      academicRecordId: null,
      isLoading: false,
      showModalSubjects: false,
      showModalFees: false,
      isProcessing: false,
      forms: {
        academicRecord: {
          fields: { ...academicRecordFields },
        },
      },
      options: {
        sections: {
          items: [],
        },
        courses: {
          items: [],
        },
        levels: {
          items: [],
        },
      },
      tables: {
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
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right text-center',
              thStyle: { width: '8%' },
            },
            // {
            // 	key: "amountPerUnit",
            // 	label: "Amount per Lec Unit",
            // 	tdClass: "align-middle text-right",
            // 	thClass: "text-right",
            // 	thStyle: {width: "16%"}
            // },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            // {
            // 	key: "amountPerLab",
            // 	label: "Amount per Lab",
            // 	tdClass: "align-middle text-right",
            // 	thClass: "text-right",
            // 	thStyle: {width: "13%"}
            // },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
          filteredItems: [],
        },
        studentFeeItems: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'pivot.notes',
              label: 'NOTES',
              tdClass: 'align-middle',
              thStyle: { width: '50%' },
            },
            {
              key: 'pivot.isInitialFee',
              label: 'INITIAL FEE',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'pivot.amount',
              label: 'AMOUNT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '20%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '5px' },
            },
          ],
          items: [],
        },
        fees: {
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '30%' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        fee: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        subject: {
          criteria: null,
        },
        fee: {
          criteria: null,
        },
      },
    };
  },
  methods: {
    onUpdateEnrollment() {
      const {
        fields: {
          id,
          studentFee: { studentFeeItems, ...studentFee },
          student,
          schoolYear,
          studentCategory,
          subjects: rawSubjects,
          ...fields
        },
      } = this.forms.academicRecord;

      let fees = studentFeeItems.map((fee) => {
        const {
          id: schoolFeeId,
          pivot: { amount, notes, isInitialFee },
        } = fee;
        return { schoolFeeId, amount, notes, isInitialFee };
      });

      let subjects = rawSubjects.map((subject) => {
        const {
          id: subjectId,
          pivot: { sectionId },
        } = subject;
        return { subjectId, sectionId };
      });

      const data = {
        ...fields,
        subjects,
        fees,
        studentFee,
      };

      this.isProcessing = true;
      this.updateAcademicRecord(data, id)
        .then(({ data }) => {
          this.isProcessing = false;
          // this.loadStudentFeesList()
          this.$router.push({
            path: `/master-files/student/${this.$route.params.studentId}/school-records/enrollments`,
            query: { success: true },
          });
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          this.isProcessing = false;
        });
    },
    loadLevelList() {
      const { levels } = this.options;
      const params = { paginate: false };
      this.getLevelList(params).then(({ data }) => {
        levels.items = data;
      });
    },
    loadCourseList() {
      const { courses } = this.options;
      const params = { paginate: false };
      this.getCourseList(params).then(({ data }) => {
        courses.items = data;
      });
    },
    loadSectionList() {
      const { sections } = this.options;
      const params = { paginate: false };
      this.getSectionList(params).then(({ data }) => {
        sections.items = data;
      });
    },
    loadFees() {
      const { fees } = this.tables;
      const { fee } = this.paginations;
      const params = { paginate: false };
      fees.isBusy = true;
      this.getSchoolFeeList(params).then(({ data }) => {
        fees.items = data;
        fee.totalRows = data.length;
        this.paginate(fee);
        fees.isBusy = false;
      });
    },
    loadSubjects(schoolCategoryId) {
      const { subjects } = this.tables;
      const { subject } = this.paginations;
      subjects.items = [];

      subjects.isBusy = true;
      let params = { paginate: false, schoolCategoryId };

      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data;
        subject.totalRows = data.length;
        this.paginate(subject);
        subjects.isBusy = false;
      });
    },
    loadAcademicRecord() {
      this.isLoading = true;
      const { fields } = this.forms.academicRecord;
      this.getAcademicRecord(this.academicRecordId).then(({ data }) => {
        copyValue(data, fields);
        this.isLoading = false;
      });
    },
    filterSection(item) {
      const sect = this.options.sections.items.filter(
        (s) =>
          s.schoolYearId === item.schoolYearId &&
          s.levelId === item.levelId &&
          s.courseId === item.courseId &&
          s.semesterId === item.semesterId
      );
      return sect;
    },
    checkSchoolCategory(row) {
      const categories = [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id,
        SchoolCategories.VOCATIONAL.id,
      ];
      const { item } = row;
      const { items } = this.options.levels;

      const level = items.find((level) => level.id === item.levelId);
      const schoolCategoryId = level.schoolCategoryId;

      if (!categories.includes(schoolCategoryId)) {
        item.courseId = null;
        item.semesterId = null;
      }
    },
    onAddSubject(item) {
      this.studentSubjects = item.subjects;
      this.showModalSubjects = true;
      this.loadSubjects(item.schoolCategoryId);
    },
    addSubject(row) {
      const { item } = row;
      // check if subject exist in the table
      const result = this.studentSubjects.find(
        (subject) => subject.id === item.id
      );
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      this.$set(item, 'pivot', {});
      this.$set(item.pivot, 'sectionId', null);
      this.studentSubjects.push(item);
    },
    removeSubject(subjects, row) {
      subjects.splice(row.index, 1);
    },
    addFee(row) {
      const { item } = row;
      const { studentFee } = this.forms.academicRecord.fields;
      const result = studentFee.studentFeeItems.find(
        (fee) => fee.id === item.id
      );

      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }

      studentFee.studentFeeItems.push({
        id: row.item.id,
        name: row.item.name,
        isIntegrated: row.item.isIntegrated,
        description: row.item.description,
        pivot: {
          schoolFeeId: row.item.id,
          amount: 0.0,
          notes: '',
          isInitialFee: 0,
        },
      });
    },
    removeFee(row) {
      const { studentFee } = this.forms.academicRecord.fields;
      studentFee.studentFeeItems.splice(row.index, 1);
    },
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0;
        subjects.forEach((s) => {
          units += Number(s[field]);
        });
        return units;
      };
    },
    feesTotalAmount() {
      return (item, fees) => {
        let amount = 0;
        fees.forEach((fee) => {
          amount += Number(fee.pivot.amount);
        });
        item.totalAmount = amount;
        return formatNumber(amount);
      };
    },
    initialFeeTotal: {
      get: function() {
        let total = 0;
        const { studentFee } = this.forms.academicRecord.fields;
        studentFee.studentFeeItems.forEach((fee) => {
          if (fee.pivot.isInitialFee) {
            total += Number(fee.pivot.amount);
          }
        });
        studentFee.enrollmentFee = total;
        return total;
      },
      set: function(newValue) {
        return (data) => {
          const { studentFee } = this.forms.academicRecord.fields;
          studentFee.enrollmentFee = newValue;
          return newValue;
        };
      },
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../../assets/scss/shared.scss';

.preview__modal-description {
  z-index: 5000;
  position: fixed;
  height: 50px;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px;
}
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
