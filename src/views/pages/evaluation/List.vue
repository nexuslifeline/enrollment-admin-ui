<template>
  <PageContent
    :title="`Evaluation and Admission Records`"
    description="Manage and review the student's evaluation and admission request. You can accept transfer credit if necessary. If required requirements are not provided, you can temporarily disapprove the record."
    :badges="[{ text: $store.state.schoolYear.name }]"
    :searchKeyword="filters.student.criteria"
    :pageFrom="paginations.student.from"
    :pageTo="paginations.student.to"
    :pageTotal="paginations.student.totalRows"
    :perPage="paginations.student.perPage"
    :currentPage.sync="paginations.student.page"
    @onPageChange="loadEvaluation"
    @onRefresh="loadEvaluation"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        debounce="500"
        @update="loadEvaluation"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <SelectCategory
        :value="filters.student.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
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
        :options="evaluationStatuses.values"
        :value="filters.student.evaluationStatus"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div v-if="checkIfHasSchoolCategoryAccess()">
        <b-table
          class="c-table"
          outlined
          small
          show-empty
          responsive
          :fields="tables.students.fields"
          :items="tables.students.items"
          :busy="tables.students.isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="onSortChanged"
        >
          <template v-slot:head(attachments)>
            <div class="text-center">
              <v-icon name="paperclip" />
            </div>
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(attachments)="data">
            <span
              >{{ data.item.filesCount }} &nbsp; &nbsp; &nbsp; &nbsp;
            </span>
            <v-icon name="paperclip" />
          </template>
          <template v-slot:cell(name)="{ item: { id: evaluationId, academicRecord }}">
            <StudentColumn
              :showIsManual="true"
              :data="academicRecord"
              :callback="{ loadDetails: () =>
                $router.push({ name: 'Evaluation Detail', params: { evaluationId: evaluationId } })
              }"
            />
          </template>
          <template v-slot:cell(address)="{ item: { academicRecord }}">
            <AddressColumn :data="academicRecord" />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item.academicRecord" />
          </template>
          <template
            v-slot:cell(studentCategory)="{
              item: { academicRecord: { studentCategory, studentCategoryId  } },
            }"
          >
            <b-badge
              :variant="
                studentCategoryId === studentCategories.NEW.id
                  ? 'success'
                  : studentCategoryId === studentCategories.OLD.id
                  ? 'primary'
                  : 'warning'
              "
            >
              {{  studentCategoryId === studentCategories.TRANSFEREE_OLD.id
                ? 'TRANSFEREE'
                : studentCategory.name }}
            </b-badge>
          </template>
          <template v-slot:cell(status)="data">
            <StatusColumn :data="data.item" />
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              boundary="window"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <!-- v-if="isAccessible($options.StudentPermissions.EDIT_ACADEMIC_RECORDS.id)" -->
              <b-dropdown-item :to="{ name: 'Evaluation Detail', params: { evaluationId: row.item.id }}">
                {{
                  evaluationStatuses.APPROVED.academicRecordStatuses.includes(row.item.academicRecord.academic_record_status_id)
                    ? 'View Record'
                    : 'Review Record'
                }}
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <!-- <b-row>
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
              @input="loadEvaluation()"
            />
          </b-col>
        </b-row> -->
      </div>
      <NoAccess v-else />
      <router-view
        :previousRoute="{ name: 'Evaluation' }"
        @onEvaluationUpdated="loadEvaluation"></router-view>
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  EvaluationApi,
  StudentFileApi,
  CurriculumApi,
  CourseApi,
  TranscriptRecordApi,
  SchoolYearApi,
} from '../../../mixins/api';
import {
  SchoolCategories,
  EvaluationStatuses,
  Semesters,
  UserGroups,
  StudentCategories,
  EvaluationPermissions,
} from '../../../helpers/enum';
import Tables from '../../../helpers/tables';
import Access from '../../../mixins/utils/Access';
import { camelToSnakeCase } from '../../../helpers/utils';
import { format } from 'date-fns';
import { colorFactory, getColorFactoryLength } from '../../../helpers/colors';
import { StudentColumn, EducationColumn, AddressColumn, StatusColumn } from '../../components/ColumnDetails';
import PageContent from '../../components/PageContainer/PageContent';
import NoAccess from '../../components/NoAccess';

const COLOR_FACTORY_LENGTH = getColorFactoryLength();

const evaluationFields = {
  evaluationStatusId: null,
  approvalNotes: null,
  disapprovalNotes: null,
};

export default {
  name: 'Evaluation',
  constants: {
    COLOR_FACTORY_LENGTH,
  },
  colorFactory,
  camelToSnakeCase,
  format,
  mixins: [
    EvaluationApi,
    StudentFileApi,
    CurriculumApi,
    CourseApi,
    Tables,
    Access,
    TranscriptRecordApi,
    SchoolYearApi
  ],
  components: {
    StudentColumn,
    EducationColumn,
    AddressColumn,
    StatusColumn,
    PageContent,
    NoAccess
  },
  EvaluationPermissions,
  data() {
    return {
      sortBy: 'submittedDate',
      sortDesc: true,
      isFilterVisible: true,
      showEvaluationForm: false,
      fileViewer: {
        isActiveNavEnabled: false,
        activeNavCount: 0,
        activeNavIndex: 0,
        show: false,
      },
      showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
      isLoading: false,
      evaluationStatuses: EvaluationStatuses,
      semesters: Semesters,
      studentCategories: StudentCategories,
      lastActiveEvaluation: null,
      lastActiveFile: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      forms: {
        evaluation: {
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields },
        },
      },
      tables: {
        students: {
          isBusy: false,
          filterIncludedFields: ['firstName', 'lastName'],
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '32%' },
              sortable: true
            },
             {
              key: 'address',
              label: 'Address',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              sortable: true
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              sortable: false
            },
            {
              key: 'submittedDate',
              label: 'Submitted',
              tdClass: 'align-middle',
              thStyle: { width: '100px' },
              sortable: true,
              formatter: (value) => {
                if (!value) return '';

                return format(new Date(value), 'MM/dd/yyyy');
              },
            },
            {
              key: 'studentCategory',
              label: 'Category',
              tdClass: 'align-middle font-weight-bold',
              thStyle: { width: '80px' },
              sortable: true,
            },
            {
              key: 'status',
              label: 'Status',
              tdClass: 'align-middle',
              thStyle: { width: '50px' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '25px' },
            },
          ],
          items: [],
        },
        subjects: {
          isBusy: false,
          fields: [
            {
              key: 'pivot.isTaken',
              label: 'Credited',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '120px' },
            },
            {
              key: 'pivot.grade',
              label: 'Grade',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'pivot.notes',
              label: 'Remarks',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'name',
              label: 'Subject',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              formatter: (value, key, item) => {
                return `${value} - ${item.description}`;
              },
            },
            // {
            // 	key: "description",
            // 	label: "Description",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "auto"}
            // },
            {
              key: 'prerequisites',
              label: 'Prerequisites',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
              formatter: (value) => {
                if (value.length > 0) {
                  return value
                    .map((subject) => {
                      return subject.name;
                    })
                    .join(', ');
                }
                return '';
              },
            },
            {
              key: 'units',
              label: 'Lec',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '6%' },
            },
            {
              key: 'labs',
              label: 'Lab',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '6%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
          ],
          items: [],
          filteredItems: [],
        },
        files: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Filename',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'notes',
              label: 'Notes',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '35px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        student: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        subject: {
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
          schoolCategoryId: null,
          schoolCategoryItem: null,
          courseItem: null,
          courseId: null,
          // evaluationStatusId: EvaluationStatuses.SUBMITTED.id,
          evaluationStatus: EvaluationStatuses.PENDING
        },
        subject: {
          criteria: null,
          departmentId: null,
        },
      },
      options: {
        courses: {
          items: [],
        },
        departments: {
          items: [],
        },
        schoolCategories: SchoolCategories,
        curriculums: {
          isLoading: false,
          items: [],
        },
      },
      isProcessing: false,
      schoolCategoryId: null,
      row: [],
    };
  },
  created() {
    // this.checkRights()
    // to prevent show all evaluation with filtered school category
    const { student } = this.filters
    if (!this.checkIfSuperUser()) {
      student.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      student.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadEvaluation();
    this.loadCourseList();
  },
  methods: {
    // setApproval(row) {
    //   this.forms.evaluation.approvalNotes = null;
    //   if (row.item.curriculumMsg) {
    //     showNotification(
    //       this,
    //       'danger',
    //       'Please set a curriculum before approving.'
    //     );
    //     return;
    //   }
    //   this.row = row;
    //   this.showModalApproval = true;
    // },
    // onApproval() {
    //   this.isProcessing = true;
    //   const {
    //     item,
    //     item: {
    //       id: evaluationId,
    //       academicRecord: {
    //         curriculumId,
    //         studentCurriculumId,
    //         courseId,
    //         schoolCategoryId,
    //         levelId,
    //       }
    //     },
    //   } = this.row;

    //   const {
    //     evaluation: { fields: evaluation },
    //   } = this.forms;

    //   let subjects = [];

    //   item.subjects.forEach((subject) => {
    //     subjects.push({
    //       subjectId: subject.id,
    //       levelId: subject.pivot.levelId,
    //       semesterId: subject.pivot.semesterId,
    //       grade: subject.pivot.grade,
    //       notes: subject.pivot.notes,
    //       isTaken: subject.pivot.isTaken,
    //     });
    //   });

    //   evaluation.evaluationStatusId = EvaluationStatuses.APPROVED.id;
    //   // const curriculumId = item.curriculumId
    //   // const studentCurriculumId = item.studentCurriculumId

    //   //set transcript fields value
    //   const fullLevelSchoolCategory = [
    //     SchoolCategories.SENIOR_HIGH_SCHOOL.id,
    //     SchoolCategories.COLLEGE.id,
    //     SchoolCategories.GRADUATE_SCHOOL.id,
    //     SchoolCategories.VOCATIONAL.id,
    //   ];

    //   if (item.transcriptRecord) {
    //     item.transcriptRecord.curriculumId = curriculumId;
    //     item.transcriptRecord.studentCurriculumId = studentCurriculumId;
    //     item.transcriptRecord.courseId = courseId;
    //     item.transcriptRecord.schoolCategoryId = schoolCategoryId;
    //     item.transcriptRecord.levelId = fullLevelSchoolCategory.includes(
    //       schoolCategoryId
    //     )
    //       ? null
    //       : levelId;
    //   }

    //   const data = {
    //     ...evaluation,
    //     curriculumId,
    //     studentCurriculumId,
    //     courseId,
    //     subjects,
    //     transcriptRecord: {
    //       ...item.transcriptRecord,
    //     },
    //   };

    //   this.updateEvaluation(data, evaluationId)
    //     .then(({ data }) => {
    //       clearFields(evaluation);
    //       this.loadEvaluation();
    //       this.isProcessing = false;
    //       this.showModalApproval = false;
    //       showNotification(this, 'success', 'Approved Successfully.');
    //       this.$store.state.approvalCount.evaluation--;
    //     })
    //     .catch((error) => {
    //       this.isProcessing = false;
    //       const errors = error.response.data.errors;
    //       this.showBulletedNotification(errors);
    //     });
    // },
    // setDisapproval(row) {
    //   this.forms.evaluation.disapprovalNotes = null;
    //   this.row = row;
    //   this.showModalRejection = true;
    // },
    // onDisapproval() {
    //   this.isProcessing = true;
    //   const {
    //     item,
    //     item: { id: evaluationId },
    //   } = this.row;

    //   const {
    //     evaluation: { fields: evaluation },
    //   } = this.forms;

    //   evaluation.evaluationStatusId = EvaluationStatuses.REJECTED.id;

    //   const data = {
    //     ...evaluation,
    //   };

    //   this.updateEvaluation(data, evaluationId)
    //     .then(({ data }) => {
    //       clearFields(evaluation);
    //       this.loadEvaluation();
    //       this.isProcessing = false;
    //       this.showModalRejection = false;
    //       showNotification(this, 'success', 'Rejected Successfully.');
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       this.isProcessing = false;
    //     });
    // },
    loadEvaluation() {
      if (!this.$store.state?.schoolYear?.id) {
        console.warn('No selected School Year found!');
        return;
      }

      const { students } = this.tables;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;
      students.isBusy = true;
      const {
        evaluationStatus,
        schoolCategoryId,
        courseId,
        criteria,
      } = this.filters.student;

      const params = {
        paginate: true,
        perPage,
        page,
        academicRecordStatusId: evaluationStatus?.academicRecordStatuses,
        schoolCategoryId,
        courseId,
        criteria,
        schoolYearId: this.$store.state.schoolYear.id,
        ordering: this.getOrdering(this.sortBy, this.sortDesc)
      };

      this.getEvaluationList(params).then((response) => {
        const res = response.data;
        students.items = res.data;
        student.from = res.meta.from;
        student.to = res.meta.to;
        student.totalRows = res.meta.total;
        students.isBusy = false;
      });
    },
    loadCourseList() {
      let params = { paginate: false };
      this.getCourseList(params).then(({ data }) => {
        this.options.courses.items = data;
      });
    },
    // loadDetails(row) {
    //   if (!row.detailsShowing) {
    //     const {
    //       item,
    //       item: {
    //         id,
    //         studentId,
    //         academicRecord: {
    //           schoolCategoryId,
    //           levelId,
    //           courseId,
    //           transcriptRecordId,
    //         }
    //       },
    //     } = row;

    //     this.$set(item, 'isLoading', true);
    //     this.$set(item, 'curriculumEdit', false);
    //     this.$set(item, 'studentCurriculumEdit', false);
    //     this.$set(item, 'studentCourseEdit', false);
    //     this.$set(item, 'curriculums', false);

    //     let params = { paginate: false, schoolCategoryId, levelId };

    //     if (
    //       schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
    //       schoolCategoryId === SchoolCategories.COLLEGE.id
    //     ) {
    //       params = { paginate: false, schoolCategoryId, courseId };
    //     }
    //     item.isLoading = true;
    //     this.getStudentFileList(studentId, { paginate: false }).then(
    //       ({ data }) => {
    //         this.$set(row.item, 'files', data);
    //         if (item.evaluationStatusId === EvaluationStatuses.SUBMITTED.id) {
    //           // this.loadCurriculumList(params, row)
    //           this.getCurriculumList(params).then(({ data }) => {
    //             item.curriculums = data;
    //             if (data.length > 0) {
    //               if (item.curriculumId === null) {
    //                 const activeCurriculum = data.find((c) => c.active === 1);
    //                 if (activeCurriculum) {
    //                   item.curriculumId = activeCurriculum.id;
    //                   if (item.studentCategoryId === StudentCategories.NEW.id) {
    //                     item.studentCurriculumId = activeCurriculum.id;
    //                     item.studentCurriculum = activeCurriculum;
    //                   }
    //                 } else {
    //                   this.$set(item, 'curriculumMsg', true);
    //                   item.isLoading = false;
    //                   return;
    //                 }
    //               }
    //               this.loadCurriculum(item.curriculumId, row);
    //               // item.isLoading = false
    //             } else {
    //               this.$set(item, 'curriculumMsg', true);
    //               item.isLoading = false;
    //             }
    //           });
    //         } else {
    //           this.loadSubjectsOfTranscriptRecord(transcriptRecordId, row);
    //         }
    //       }
    //     );
    //   }
    //   row.toggleDetails();
    // },
    // onChangeCourse(row) {
    //   const {
    //     item,
    //     item: { academicRecord: { schoolCategoryId, courseId } },
    //   } = row;
    //   item.isLoading = true;
    //   const params = { paginate: false, schoolCategoryId, courseId };

    //   this.getCurriculumList(params).then(({ data }) => {
    //     item.curriculums = data;
    //     if (data.length > 0) {
    //       const activeCurriculum = data.find((c) => c.active === 1);
    //       if (activeCurriculum) {
    //         item.curriculumId = activeCurriculum.id;
    //         if (item.studentCategoryId === StudentCategories.NEW.id) {
    //           item.studentCurriculumId = activeCurriculum.id;
    //           item.studentCurriculum = activeCurriculum;
    //         }
    //         item.curriculumMsg = false;
    //         this.loadCurriculum(item.curriculumId, row);
    //       } else {
    //         item.curriculum = null;
    //         item.studentCurriculum = null;
    //         item.studentCurriculumId = null;
    //         item.curriculumId = null;
    //         item.subjects = null;
    //         item.curriculumMsg = true;
    //         return;
    //       }
    //     } else {
    //       item.curriculum = null;
    //       item.studentCurriculum = null;
    //       item.studentCurriculumId = null;
    //       item.curriculumId = null;
    //       item.subjects = null;
    //       item.curriculumMsg = true;
    //       return;
    //     }
    //   });
    // },
    getName(item, child) {
      if (item) {
        let value = item[child];
        if (value) {
          return value['name'];
        }
      }
      return '';
    },
    // setupActiveFileViewer(row, data) {
    //   this.lastActiveEvaluation = data;
    //   this.lastActiveFile = row;
    //   this.fileViewer.isActiveNavEnabled = !!data?.item?.files?.length;
    //   this.fileViewer.activeNavCount = data?.item?.files?.length;
    //   this.fileViewer.activeNavIndex = row.index;
    // },
    // previewFile(row, data) {
    //   this.setupActiveFileViewer(row, data);

    //   const { studentId, id, name, notes } = row.item;
    //   this.file.type = null;
    //   this.file.src = null;
    //   this.file.name = name;
    //   this.file.notes = notes;
    //   this.fileViewer.show = true;
    //   this.file.isLoading = true;
    //   this.file.owner = data.item.student;

    //   this.getStudentFilePreview(studentId, id).then((response) => {
    //     this.file.type = response.headers.contentType;
    //     this.file.isLoading = false;
    //     const file = new Blob([response.data], {
    //       type: response.headers.contentType,
    //     });
    //     const reader = new FileReader();
    //     reader.onload = (e) => (this.file.src = e.target.result);
    //     reader.readAsDataURL(file);
    //   });
    // },
    // downloadFile(row, data) {
    //   const { studentId, id, name } = row.item;

    //   this.getStudentFilePreview(studentId, id).then((response) => {
    //     const fileUrl = window.URL.createObjectURL(
    //       new Blob([response.data], {
    //         type: response.headers.contentType,
    //       })
    //     );
    //     const reader = new FileReader();
    //     reader.onload = (e) => (this.file.src = e.target.result);
    //     const fileLink = document.createElement('a');

    //     fileLink.href = fileUrl;
    //     fileLink.setAttribute('download', name);
    //     document.body.appendChild(fileLink);

    //     fileLink.click();
    //   });
    // },
    // loadCurriculum(id, row) {
    //   const { subjects } = this.tables;
    //   subjects.isBusy = true;
    //   row.item.isLoading = true;
    //   this.getCurriculum(id).then(({ data }) => {
    //     row.item.curriculum = data;
    //     const newSubjects = data.subjects.map((obj) => ({
    //       ...obj,
    //       pivot: { ...obj.pivot, isTaken: 0, grade: 0, notes: '' },
    //     }));
    //     this.$set(row.item, 'isTakenAll', false);
    //     this.$set(row.item, 'subjects', newSubjects);
    //     if (row.item.courseId) {
    //       this.loadLevelsOfCourse(row);
    //     } else {
    //       row.item.isLoading = false;
    //     }
    //     subjects.isBusy = false;
    //   });
    // },
    // loadStudentCurriculum(id, row) {
    //   const {
    //     item,
    //     item: { curriculum, curriculums },
    //   } = row;
    //   const studentCurr = curriculums.find((i) => i.id === id);
    //   item.curriculumId = id;
    //   item.studentCurriculum = studentCurr;
    //   item.isLoading = true;
    //   this.loadCurriculum(id, row);
    // },
    // loadSubjectsOfTranscriptRecord(transcriptRecordId, row) {
    //   const { subjects } = this.tables;
    //   subjects.isBusy = true;
    //   this.getSubjectsOfTranscriptRecord(transcriptRecordId, {
    //     paginate: false,
    //   }).then(({ data }) => {
    //     this.$set(row.item, 'isTakenAll', false);
    //     this.$set(row.item, 'subjects', data);
    //     if (row.item.courseId) {
    //       this.loadLevelsOfCourse(row);
    //     } else {
    //       row.item.isLoading = false;
    //     }
    //     subjects.isBusy = false;
    //   });
    // },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      if (userGroup) {
        this.filters.student.schoolCategoryId = userGroup.schoolCategoryId;
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }
      this.loadEvaluation();
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    // loadLevelsOfCourse(row) {
    //   let params = { paginate: false };
    //   row.item.isLoading = true;
    //   this.getLevelsOfCourse(row.item.courseId, params).then(({ data }) => {
    //     this.$set(row.item, 'levels', data);
    //     row.item.isLoading = false;
    //   });
    // },
    // filterSubjects(row, levelId, semesterId = null) {
    //   const { subjects } = row.item;
    //   let filteredSubjects = subjects.filter(
    //     (subject) =>
    //       subject.pivot.levelId === levelId &&
    //       subject.pivot.semesterId === semesterId
    //   );
    //   const data = { items: filteredSubjects, isTakenAll: false };
    //   return data;
    // },
    // getSemesters(level, event) {
    //   this.$set(level, 'isShowAll', event);
    // },
    // filterSemester(row, level) {
    //   let defaultSemesters = this.semesters.values.slice(0, 2);
    //   if (level.isShowAll) {
    //     return this.semesters.values;
    //   } else {
    //     const { subjects } = row.item;
    //     let filteredSubjects = subjects.filter(
    //       (subject) => subject.pivot.levelId === level.id
    //     );
    //     let distinctSemesters = [
    //       ...new Set(filteredSubjects.map((x) => x.pivot.semesterId)),
    //     ];
    //     distinctSemesters.forEach((d) => {
    //       if (d) {
    //         if (!defaultSemesters.map((x) => x.id).includes(d)) {
    //           defaultSemesters.push(Semesters.getEnum(d));
    //         }
    //       }
    //     });
    //     return defaultSemesters;
    //   }
    // },
    // toggleCheckAll(subjects, value) {
    //   subjects.forEach((subject) => {
    //     subject.pivot.isTaken = value ? 1 : 0;
    //   });
    // },
    // showBulletedNotification(errors) {
    //   const h = this.$createElement;
    //   const errorList = [];
    //   Object.keys(errors).forEach((key) => {
    //     errorList.push(h('li', errors[key][0]));
    //   });
    //   const vNodesMsg = h('ul', errorList);
    //   showNotification(this, 'danger', vNodesMsg);
    // },
    // getCurrentFiles() {
    //   const { index: studentIdx } = this.lastActiveEvaluation;
    //   const { files } = this.tables?.students?.items[studentIdx];
    //   return files;
    // },
    // getCurrentFileIndex() {
    //   const { index } = this.lastActiveFile;
    //   return index;
    // },
    // onFileNavLeft() {
    //   const files = this.getCurrentFiles();
    //   let currentIdx = this.getCurrentFileIndex();
    //   const isFirst = currentIdx === 0;
    //   currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
    //   const file = files[currentIdx];
    //   const currentFileItem = {
    //     ...this.lastActiveFile,
    //     index: currentIdx,
    //     item: file,
    //   };
    //   this.previewFile(currentFileItem, this.lastActiveEvaluation);
    // },
    // onFileNavRight() {
    //   const files = this.getCurrentFiles();
    //   let currentIdx = this.getCurrentFileIndex();
    //   const isLast = currentIdx === files.length - 1;
    //   currentIdx = isLast ? 0 : currentIdx + 1;
    //   const file = files[currentIdx];
    //   const currentFileItem = {
    //     ...this.lastActiveFile,
    //     index: currentIdx,
    //     item: file,
    //   };
    //   this.previewFile(currentFileItem, this.lastActiveEvaluation);
    // },
    onCategoryFilterChange(item) {
      const { student } = this.filters;
      student.schoolCategoryId = item?.id || 0;
      student.schoolCategoryItem = item;
      this.loadEvaluation();
    },
    onStatusFilterChange(item) {
      const { student } = this.filters;
      // student.evaluationStatusId = item?.id || 0;
      student.evaluationStatus = item;
      this.loadEvaluation();
    },
    onCourseFilterChange(item) {
      const { student } = this.filters;
      student.courseId = item?.id || 0;
      student.courseItem = item;
      this.loadEvaluation();
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadEvaluation();
    },
    getOrdering(sortBy, sortDesc = false) {
      if (!sortBy) return;
      const orderBy = this.mapOrdering(sortBy);
      if (!orderBy) return;
      return `${sortDesc ? '-' : ''}${orderBy}`;
    },
    mapOrdering(sortBy) {
      return ({
        name: 'first_name',
        address: 'complete_address',
        education: 'level_name',
        contact: 'email',
        studentCategory: 'student_category_name'
      })?.[sortBy] || this.$options.camelToSnakeCase(sortBy);
    },
  },
  watch: {
    '$store.state.schoolYear': function() {
      this.loadEvaluation();
    }
  },
  computed: {
    // totalUnits() {
    //   return (subjects, field) => {
    //     let units = 0;
    //     subjects.forEach((s) => {
    //       units += Number(s[field]);
    //     });
    //     return units;
    //   };
    // },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.student;
      const { schoolCategories } = this.options;
      return [
        schoolCategories.SENIOR_HIGH_SCHOOL.id,
        schoolCategories.COLLEGE.id,
        schoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    }
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
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
.evaluation__form-details-first {
  width: 25%;
}
.evaluation__form-details-second {
  width: 30%;
}

</style>
