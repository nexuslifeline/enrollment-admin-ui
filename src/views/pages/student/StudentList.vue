<template>
  <PageContent
    title="Student Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadStudents"
    :filterVisible="isFilterVisible"
    @create="onAddNewStudent"
    :isBusyCreating="isBusyCreating"
    :createButtonVisible="isAccessible($options.StudentPermissions.ADD.id) && showAddButton">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
        @update="loadStudents()"
      />
      <v-select
        :options="options.levels.items"
        :value="filters.student.leveItem"
        @input="onLevelFilterChange"
        label="name"
        placeholder="Level"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        :options="options.courses.items"
        :value="filters.student.courseItem"
        @input="onCourseFilterChange"
        label="name"
        placeholder="Course"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        :options="options.semesters.items"
        :value="filters.student.semesterItem"
        @input="onSemesterFilterChange"
        label="name"
        placeholder="Semester"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div class="content">
        <b-row>
          <b-col md="12">
            <b-table
              class="c-table"
              small
              hover
              outlined
              show-empty
              :fields="tables.students.fields"
              :busy="tables.students.isBusy"
              :items="tables.students.items"
              responsive
            >
              <template v-slot:cell(name)="data">
                <StudentColumn
                  :data="{ student: data.item }"
                  :callback="{
                    loadDetails: () => {
                      $options.StudentPermissions.EDIT.id
                        ? $router.push(`/master-files/student/${data.item.id}`)
                        : null;
                    },
                  }"
                />
              </template>
              <template v-slot:cell(contact)="data">
               <ContactColumn :data="data.item"/>
              </template>
              <template v-slot:cell(education)="data">
                <EducationColumn :data="data.item.latestAcademicRecord" />
              </template>
              <template v-slot:cell(requirementPercentage)="{ item, value }">
                <div class="text-center">
                  <b-link
                    :to="
                      `/master-files/student/${item.id}/school-records/requirements`
                    ">
                    {{ value }}%
                    <BProgress :value="value" variant="info" animated striped />
                  </b-link>
                </div>
              </template>
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  v-if="
                    isAccessible([
                      $options.StudentPermissions.UPDATE_ACADEMIC_RECORDS.id,
                      $options.StudentPermissions.EDIT.id,
                      $options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id,
                      $options.StudentPermissions.DELETE.id,
                    ])
                  "
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                  boundary="window"
                >
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <!-- <b-dropdown-item
                    v-if="showRowActionButton"
                    :to="`/master-files/student/${row.item.id}/school-records`"
                  >
                    Update School Records
                  </b-dropdown-item> -->
                  <b-dropdown-item
                    v-if="
                      isAccessible($options.StudentPermissions.EDIT.id) &&
                        showRowActionButton
                    "
                    :to="`/master-files/student/${row.item.id}`"
                  >
                    Edit Profile & Settings
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible(
                        $options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id
                      ) & showRowActionButton"
                    @click="onChangeUsername(row)"
                    :disabled="!row.item.user"
                  >
                    Change Username
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible(
                      $options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id
                    ) & showRowActionButton"
                    :to="`/master-files/student/account/${row.item.id}/change-password`"
                    :disabled="!row.item.user"
                  >
                    Change Password
                  </b-dropdown-item>
                  <!-- TODO: SET USER ACCESS OF PREVIEW LEDGER BUTTON -->
                  <b-dropdown-item
                    v-if="showPreviewLedgerButton"
                    @click="onShowLedgerModal(row.item.id)"
                  >
                    Preview Ledger
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.StudentPermissions.DELETE.id) && showRowActionButton"
                    @click="onSetDelete(row.item.id)"
                    :disabled="showModalConfirmation"
                  >
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.student.from }} to
                {{ paginations.student.to }} of
                {{ paginations.student.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.student.page"
                  :total-rows="paginations.student.totalRows"
                  :per-page="paginations.student.perPage"
                  size="sm"
                  align="end"
                  @input="loadStudents()"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
      <!-- <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Student
        </div>
        Are you sure you want to delete this student ?
        <div slot="modal-footer">
          <b-button
            :disabled="isUserSaving"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onStudentDelete()"
          >
            <v-icon v-if="isUserSaving" name="sync" spin class="mr-2" />
            Yes
          </b-button>
          <b-button
            variant="outline-danger"
            class="btn-close"
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal> -->
      <StudentDeleteModal v-if="showModalConfirmation" :show.sync="showModalConfirmation" :studentId="selectedStudentId" @onStudentDeleted="loadStudents()"/>
      <b-modal
        v-model="showModalPreview"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
        size="md"
      >
        <div slot="modal-title">
          Preview Student Ledger
        </div>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">School Year</label>
              <b-form-select v-model="filters.ledger.schoolYearId">
                <b-form-select-option
                  v-for="schoolYear in options.schoolYears.items"
                  :key="schoolYear.id"
                  :value="schoolYear.id"
                >
                  {{ schoolYear.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <label class="required">As Of Date</label>
              <b-form-datepicker
                :date-format-options="{
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  weekday: 'short',
                }"
                class="date-pickers"
                v-model="filters.ledger.asOfDate"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <div slot="modal-footer">
          <b-button
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="previewLedger(selectedStudentId)"
          >
            <v-icon v-if="isUserSaving" name="sync" spin class="mr-2" />
            Preview
          </b-button>
          <b-button
            variant="outline-danger"
            class="btn-close"
            @click="showModalPreview = false"
          >
            Close
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
      <router-view
        :user="selectedUser"
        :previousRoute="{ name: 'Student List' }">
      </router-view>
    </template>
  </PageContent>
</template>
<script>
import {
  StudentApi,
  UserGroupApi,
  ReportApi,
  SchoolYearApi,
  LevelApi,
  CourseApi,
} from '../../../mixins/api';
import {
  validate,
  reset,
  showNotification,
  clearFields,
} from '../../../helpers/forms';
import {
  Countries,
  CivilStatuses,
  StudentPermissions,
  Semesters,
  SchoolCategories
} from '../../../helpers/enum';
import Tables from '../../../helpers/tables';
import PhotoViewer from '../../components/PhotoViewer';
import FileViewer from '../../components/FileViewer';
import AvatarMaker from '../../components/AvatarMaker';

import { copyValue } from '../../../helpers/extractor';
import Access from '../../../mixins/utils/Access';
import Card from '../../components/Card';
import {
  StudentColumn,
  EducationColumn,
  ContactColumn,
} from '../../components/ColumnDetails';
import { getFilePath } from '../../../helpers/utils';
import PageContent from "../../components/PageContainer/PageContent";
import StudentDeleteModal from './StudentDelete'

export default {
  name: 'StudentList',
  getFilePath,
  Semesters,
  SchoolCategories,
  mixins: [StudentApi, Tables, Access, UserGroupApi, ReportApi, SchoolYearApi, LevelApi, CourseApi ],
  components: {
    PhotoViewer,
    FileViewer,
    Card,
    StudentColumn,
    EducationColumn,
    ContactColumn,
    AvatarMaker,
    PageContent,
    StudentDeleteModal
  },
  props: {
    showAddButton: {
      type: Boolean,
      default: true,
    },
    showRowActionButton: {
      //add edit delete button
      type: Boolean,
      default: true,
    },
    showPreviewLedgerButton: {
      type: Boolean,
      default: true,
    },
  },
  StudentPermissions,
  data() {
    return {
      selectedUser: {},
      isBusyCreating: false,
      isFilterVisible: true,
      selectedStudentId: null,
      showModalPreview: false,
      showModalFileViewer: false,
      showModalConfirmation: false,
      isProcessing: false,
      isUserSaving: false,
      studentPhotoUrl: null,
      Countries: Countries,
      CivilStatuses: CivilStatuses,
      selectedPhoto: null,
      activeTabIndex: 0,
      isLoading: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      tables: {
        students: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: 'auto' },
              // formatter: (value, key, item) => {
              // 	if(!item.middleName) {
              // 		item.middleName = ""
              // 	}
              // 	item.name = item.firstName + " " + item.middleName + " " + item.lastName
              // }
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'contact',
              label: 'Contact Info',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            // {
            //   key: 'requirementPercentage',
            //   label: 'Requirement %',
            //   tdClass: 'align-middle',
            //   thClass: 'align-middle',
            //   thStyle: { width: '20%' },
            // },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
      },
      tabHeaders: [
        {
          header: 'Profile',
          description:
            'Officially registering you is just few steps away. First, tell us a bit about yourself.',
        },
        {
          header: 'Address',
          description:
            'Let us know your address. Please include all required(*) fields.',
        },
        {
          header: 'Family',
          description:
            'Details about your family. Please include all required(*) fields.',
        },
        {
          header: 'Education',
          description:
            'Details about your previous educational background. Please include all required(*) fields.',
        },
      ],
      paginations: {
        student: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        student: {
          criteria: null,
          levelId: null,
          levelItem: null,
          courseId: null,
          courseItem: null,
          semesterId: null,
          semesterItem: null
        },
        ledger: {
          schoolYearId: null,
          asOfDate: null,
        },
      },
      options: {
        civilStatuses: {
          items: CivilStatuses,
        },
        countries: {
          items: Countries,
        },
        schoolYears: {
          items: [],
        },
        levels: {
          items: []
        },
        courses: {
          items: []
        },
        semesters: {
          items: this.$options.Semesters.values
        }
      },
    };
  },
  created() {
    this.loadStudents();
    this.loadSchoolYears();
    this.loadLevels()
    this.loadCourses()
  },
  methods: {
    loadStudents() {
      const { students } = this.tables;
      const { criteria, levelId, courseId, semesterId } = this.filters.student;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;

      students.isBusy = true;

      let params = { paginate: true, perPage, page, criteria, levelId, courseId, semesterId };
      console.log(params)
      this.getStudentList(params).then(({ data }) => {
        students.items = data.data;
        student.from = data.meta.from;
        student.to = data.meta.to;
        student.totalRows = data.meta.total;
        students.isBusy = false;
      });
    },
    loadLevels() {
      const params = { paginate: false }
      const { levels } = this.options
      this.getLevelList(params).then(({ data }) => {
        levels.items = data
      })
    },
    loadCourses() {
      const params = { paginate: false }
      const { courses } = this.options
      this.getCourseList(params).then(({ data }) => {
        courses.items = data
      })
    },
    onStudentDelete() {
      const { students } = this.tables;
      this.isUserSaving = true;
      this.deleteStudent(this.selectedStudentId).then(({ data }) => {
        this.deleteRow(students, this.paginations.student, id);
        this.isUserSaving = false;
        showNotification(this, 'success', 'Student deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    showBulletedNotification(errors) {
      const h = this.$createElement;
      const errorList = [];
      Object.keys(errors).forEach((key) => {
        errorList.push(h('li', errors[key][0]));
      });
      const vNodesMsg = h('ul', errorList);
      showNotification(this, 'danger', vNodesMsg, 4000);
    },
    previewLedger(studentId) {
      this.file.type = null;
      this.file.src = null;
      this.file.notes = null;
      this.file.isLoading = true;
      this.file.owner = null;
      this.file.name = 'Student Ledger';

      const { schoolYearId, asOfDate } = this.filters.ledger;

      this.showModalFileViewer = true;
      const params = { schoolYearId, asOfDate };
      this.previewStudentLedger(studentId, params).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
      });
    },
    loadSchoolYears() {
      const params = { paginate: false };
      const { schoolYears } = this.options;
      this.getSchoolYearList(params).then(({ data }) => {
        schoolYears.items = data;
      });
    },
    onShowLedgerModal(studentId) {
      this.selectedStudentId = studentId;
      this.showModalPreview = true;
      this.filters.ledger.schoolYearId = this.getActiveSchoolYearId;
      this.filters.ledger.asOfDate = new Date();
    },
    onLevelFilterChange(item) {
      const { student } = this.filters;
      student.levelId = item?.id || 0;
      student.levelItem = item;
      student.courseId = null
      student.courseItem = null
      student.semesterId = null
      student.semesterItem = null
      this.loadStudents();
    },
    onCourseFilterChange(item) {
      const { student } = this.filters;
      student.courseId = item?.id || 0;
      student.courseItem = item;
      this.loadStudents();
    },
    onSemesterFilterChange(item) {
      const { student } = this.filters;
      student.semesterId = item?.id || 0;
      student.semesterItem = item;
      this.loadStudents();
    },
    onAddNewStudent() {
      this.isBusyCreating = true;
      this.addStudent({}).then(({ data }) => {
        this.isBusyCreating = false;
        this.$router.push({ name: 'Student Edit', params: { studentId: data?.id } });
      }).catch((error) => {
        console.log(error);
        this.isBusyCreating = false;
      });
    },
    onChangeUsername(row) {
      this.selectedUser = row.item?.user || {};
      this.$router.push({ name: 'List Change Student Username', params: { studentId: row.item.id } })
    },
    onSetDelete(studentId) {
      this.selectedStudentId = studentId;
      this.showModalConfirmation = true;
    }
  },
  computed: {
    getActiveSchoolYearId() {
      const { items } = this.options.schoolYears;
      const schoolYear = items.find((sy) => sy.isActive === 1);

      if (!schoolYear) return null;

      return schoolYear?.id;
    },
    isCourseVisible() {
      const { SchoolCategories } = this.$options;
      const { levelItem } = this.filters.student;
      console.log(levelItem)
      if(!levelItem) {
        return false
      }
      const schoolCategoryId = levelItem?.schoolCategoryId
      return [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/_shared.scss';

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
