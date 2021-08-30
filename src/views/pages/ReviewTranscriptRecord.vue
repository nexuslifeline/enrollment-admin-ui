<template>
  <PageContent
    title="Review Transcript Record"
    :createButtonVisible="false"
    :filterVisible="false"
    :showBottomActions="false">
    <template v-slot:content>
      <b-overlay :show="isProcessing">
        <div class="transcript">
          <div class="transcript-info__container">
            <div class="transcript-info__row">
              <div class="transcript-info__details">
                <div class="detail__label">Student Number :</div>
                <p>
                  {{
                    transcriptRecord.student.studentNo
                      ? transcriptRecord.student.studentNo
                      : 'Awaiting Confirmation'
                  }}
                </p>
              </div>
              <div class="transcript-info__details">
                <div class="detail__label">Name :</div>
                <p>
                  {{ transcriptRecord.student.name }}
                </p>
              </div>
            </div>
            <div class="transcript-info__row">
              <div class="transcript-info__details">
                <div class="detail__label">Email :</div>
                <p>
                  {{
                    transcriptRecord.student.email
                  }}
                </p>
              </div>
              <div class="transcript-info__details">
                <div class="detail__label">Mobile Number :</div>
                <p>
                  {{ transcriptRecord.student.mobileNo }}
                </p>
              </div>
            </div>
            <div class="transcript-info__row">
              <div class="transcript-info__details">
                <div class="detail__label">Address :</div>
                <p>
                  {{
                    transcriptRecord.student.currentAddress ||
                    transcriptRecord.student.address
                      ? transcriptRecord.student.address.currentCompleteAddress
                      : ''
                  }}
                </p>
              </div>
            </div>
            <div class="transcript-info__row">
              <div class="transcript-info__details">
                <div class="detail__label">Curriculum :</div>
                <p class="detail__label">
                  {{
                    transcriptRecord.studentCurriculum ? transcriptRecord.studentCurriculum.name : ''
                  }}
                </p>
              </div>
              <div class="transcript-info__details">
                <div class="detail__label">Course :</div>
                <p>
                  {{ transcriptRecord.course ? `${transcriptRecord.course.description} ${transcriptRecord.course.major ? `(${transcriptRecord.course.major})` : '' }` : '' }}
                </p>
              </div>
            </div>
            <div class="transcript-info__row">
              <div class="transcript-info__details">
                <div class="detail__label">Level :</div>
                <p>
                  {{
                    transcriptRecord.level ? transcriptRecord.level.name : ''
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="transcript-subjects__container">
            <div class="transcript-subjects__header">
              <h5>Transcript of Records</h5>
              <div class="font-weight-bold">{{transcriptRecord.curriculum ? transcriptRecord.curriculum.name : ''}}</div>
            </div>
            <!-- <div v-if="transcriptRecord.subjects">
              <b-row v-if="transcriptRecord.courseId === null">
                <b-col md="12">
                  <b-row>
                    <b-col md="9">
                      <h5>{{ transcriptRecord.level ? transcriptRecord.level.name : '' }}</h5>
                    </b-col>
                    <b-col md="3">
                      <b-button
                        class="float-right mb-2"
                        variant="outline-primary"
                        @click="onAddSubject(transcriptRecord.levelId)"
                      >
                        <v-icon name="plus-circle" /> ADD NEW SUBJECT
                      </b-button>
                    </b-col>
                  </b-row>
                  <b-table
                    class="mb-4"
                    outlined
                    responsive
                    show-empty
                    :fields="tables.subjects.fields"
                    :items="transcriptRecord.subjects"
                    :busy="tables.subjects.isBusy"
                  >
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                    <template v-slot:cell(pivot.grade)="row">
                      <vue-autonumeric
                        :disabled="
                          transcriptRecord.transcriptRecordStatusId !==
                            $options.TranscriptRecordStatuses.DRAFT.id
                        "
                        v-model="row.item.pivot.grade"
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
                    <template v-slot:cell(pivot.notes)="row">
                      <b-form-input
                        :disabled="
                          transcriptRecord.transcriptRecordStatusId !==
                            $options.TranscriptRecordStatuses.DRAFT.id
                        "
                        v-model="row.item.pivot.notes"
                      >
                      </b-form-input>
                    </template>
                    <template v-slot:cell(labs)="row">
                      {{
                        transcriptRecord.schoolCategoryId ===
                        $options.SchoolCategories.VOCATIONAL.id
                          ? 'N/A'
                          : row.item.labs
                      }}
                    </template>
                    <template v-slot:cell(units)="row">
                      {{
                        transcriptRecord.schoolCategoryId ===
                        $options.SchoolCategories.VOCATIONAL.id
                          ? 'N/A'
                          : row.item.units
                      }}
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="removeSubject(row)"
                        size="sm"
                        variant="danger"
                      >
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                    <template v-slot:custom-foot>
                      <b-tr>
                        <b-td colspan="5" class="text-right">
                          <span class="text-danger">Total Units </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{
                              transcriptRecord.schoolCategoryId ===
                              $options.SchoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : totalUnits(
                                    transcriptRecord.subjects,
                                    'units'
                                  )
                            }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{
                              transcriptRecord.schoolCategoryId ===
                              $options.SchoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : totalUnits(transcriptRecord.subjects, 'labs')
                            }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{
                              transcriptRecord.schoolCategoryId ===
                              $options.SchoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : totalUnits(
                                    transcriptRecord.subjects,
                                    'totalUnits'
                                  )
                            }}
                          </span>
                        </b-td>
                      </b-tr>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col md="12">
                  <b-list-group>
                    <b-list-group-item
                      v-for="(level, idx) in transcriptRecord.levels"
                      :key="level.id"
                    >
                      <div
                        v-b-toggle="'level' + level.id"
                        class="d-flex justify-content-between align-items-center"
                      >
                        <h5>{{ level.name }}</h5>
                        <span class="when-open">
                          <v-icon name="caret-down" />
                        </span>
                        <span class="when-closed">
                          <v-icon name="caret-left" />
                        </span>
                      </div>
                      <b-collapse
                        :id="'level' + level.id"
                        class="mt-2"
                        role="tabpanel"
                        active
                      >
                        <b-form-checkbox
                          class="mb-2"
                          @input="getSemesters(level, $event)"
                        >
                          Show All Semesters
                        </b-form-checkbox>
                        <div
                          v-for="semester in filterSemester(
                            level
                          )"
                          :key="semester.id"
                        >
                          <b-row>
                            <b-col md="9">
                              <h6>{{ semester.name }}</h6>
                            </b-col>
                            <b-col md="3">
                              <b-button
                                class="float-right mb-2"
                                variant="outline-primary"
                                @click="
                                  onAddSubject(level.id, semester.id)
                                "
                              >
                                <v-icon name="plus-circle" /> ADD NEW
                                SUBJECT
                              </b-button>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col md="12">
                              <b-table
                                responsive
                                hover
                                striped
                                show-empty
                                :items="
                                  filterSubjects(
                                    level.id,
                                    semester.id
                                  ).items
                                "
                                :fields="tables.subjects.fields"
                                :busy="tables.subjects.isBusy"
                              >
                                <template v-slot:table-busy>
                                  <div class="text-center my-2">
                                    <v-icon
                                      name="spinner"
                                      spin
                                      class="mr-2"
                                    />
                                    <strong>Loading...</strong>
                                  </div>
                                </template>
                                <template
                                  v-slot:cell(pivot.grade)="row"
                                >
                                  <vue-autonumeric
                                    :disabled="
                                      transcriptRecord
                                        .transcriptRecordStatusId !==
                                        $options
                                          .TranscriptRecordStatuses
                                          .DRAFT.id
                                    "
                                    v-model="row.item.pivot.grade"
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
                                    @click="removeSubject(row)"
                                    size="sm"
                                    variant="danger"
                                  >
                                    <v-icon name="trash" />
                                  </b-button>
                                </template>
                                <template
                                  v-slot:cell(pivot.notes)="row"
                                >
                                  <b-form-input
                                    :disabled="
                                      transcriptRecord
                                        .transcriptRecordStatusId !==
                                        $options
                                          .TranscriptRecordStatuses
                                          .DRAFT.id
                                    "
                                    v-model="row.item.pivot.notes"
                                  >
                                  </b-form-input>
                                </template>
                                <template v-slot:cell(labs)="row">
                                  {{
                                    transcriptRecord.schoolCategoryId ===
                                    $options.SchoolCategories.VOCATIONAL
                                      .id
                                      ? 'N/A'
                                      : row.item.labs
                                  }}
                                </template>
                                <template v-slot:cell(units)="row">
                                  {{
                                    transcriptRecord.schoolCategoryId ===
                                    $options.SchoolCategories.VOCATIONAL
                                      .id
                                      ? 'N/A'
                                      : row.item.units
                                  }}
                                </template>
                                <template v-slot:custom-foot>
                                  <b-tr>
                                    <b-td
                                      colspan="5"
                                      class="text-right"
                                    >
                                      <span class="text-danger"
                                        >Total Units
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{
                                          transcriptRecord.schoolCategoryId ===
                                          $options.SchoolCategories
                                            .VOCATIONAL.id
                                            ? 'N/A'
                                            : totalUnits(
                                                filterSubjects(
                                                  level.id,
                                                  semester.id
                                                ).items,
                                                'units'
                                              )
                                        }}
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{
                                          transcriptRecord.schoolCategoryId ===
                                          $options.SchoolCategories
                                            .VOCATIONAL.id
                                            ? 'N/A'
                                            : totalUnits(
                                                filterSubjects(
                                                  level.id,
                                                  semester.id
                                                ).items,
                                                'labs'
                                              )
                                        }}
                                      </span>
                                    </b-td>
                                    <b-td class="text-center">
                                      <span class="text-danger">
                                        {{
                                          transcriptRecord.schoolCategoryId ===
                                          $options.SchoolCategories
                                            .VOCATIONAL.id
                                            ? 'N/A'
                                            : totalUnits(
                                                filterSubjects(
                                                  level.id,
                                                  semester.id
                                                ).items,
                                                'totalUnits'
                                              )
                                        }}
                                      </span>
                                    </b-td>
                                  </b-tr>
                                </template>
                              </b-table>
                            </b-col>
                          </b-row>
                        </div>
                      </b-collapse>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
            </div> -->
            <TranscriptView :transcriptId ="transcriptRecordId" />
          </div>
        </div>
      </b-overlay>
      <b-modal
        v-model="showModalSubjects"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
        size="xl"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Subjects
        </div>
        <!-- modal title -->
        <b-row>
          <!-- modal body -->
          <b-col md="12">
            <b-row class="mb-2">
              <b-col md="4"> </b-col>
              <b-col offset-md="4" md="4">
                <b-form-input
                  v-model="filters.subject.criteria"
                  type="text"
                  placeholder="Search"
                  debounce="500"
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
              :fields="tables.subjects.fields2"
              :filter="filters.subject.criteria"
              :busy="tables.subjects.isBusy2"
              :current-page="paginations.subject.page"
              :per-page="paginations.subject.perPage"
              @filtered="onFiltered($event, paginations.subject)"
            >
              <template class="d-none" v-slot:cell(prerequisites)>
                <b-tr class="d-none"> </b-tr>
              </template>
              <template v-slot:cell(action)="data">
                <b-button @click="addSubject(data)" size="sm" variant="success">
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
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button
            class="float-right"
            variant="outline-danger"
            @click="showModalSubjects = false"
          >
            Close
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
    </template>
    <template v-slot:bottom-actions>
      <div class="transcript__action-bar">
        <b-button
          :disabled="isSaving"
          variant="outline-primary" 
          @click="onUpdateTranscriptRecord()">
          <v-icon v-if="isSaving" name="spinner" spin />
          Update
        </b-button>
        <b-button
          :disabled="isSaving"
          variant="outline-primary" 
          @click="onUpdateTranscriptRecord(true)">
          <v-icon v-if="isSaving" name="spinner" spin />
          Finalize
        </b-button>
        <b-button variant="outline-danger" :to="`/registrar/academic-transcript`">Cancel</b-button>
      </div>
    </template>
  </PageContent>
</template>
<script>
import { copyValue } from '../../helpers/extractor'
import { CourseApi, TranscriptRecordApi, SubjectApi } from '../../mixins/api'
const transcriptRecordFields = {
  id: null,
  student: {
    studentNo: null,
    name: null,
    email: null,
    mobileNo: null,
    address: null
  },
  curriculum: null,
  studentCurriculum: null,
  course: null,
  level: null,
  subjects: null,
  courseId: null,
  levelId: null,
  transcriptRecordStatusId: null,
  levels: null
}
import PageContent from  '../components/PageContainer/PageContent'
import { Semesters, SchoolCategories, TranscriptRecordStatuses } from '../../helpers/enum'
import tables from '../../helpers/tables'
import { showNotification } from '../../helpers/forms'
import TranscriptView  from '../components/Transcript/Transcript'

export default {
  components: {
    PageContent,
    TranscriptView
  },
  mixins: [TranscriptRecordApi,CourseApi,SubjectApi,tables],
  Semesters,
  SchoolCategories,
  TranscriptRecordStatuses,
  data() {
    return {
      isProcessing: false,
      isSaving: false,
      levelId: null,
      semesterId: null,
      showModalSubjects: false,
      transcriptRecord: {
        ...transcriptRecordFields
      },
      tables: {
        subjects: {
          isBusy: false,
          fields: [
            // {
            //   key: 'pivot.isTaken',
            //   label: 'Credited',
            //   tdClass: 'align-middle text-center',
            //   thClass: 'text-center',
            //   thStyle: { width: '120px' },
            // },
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
              formatter: (value, key, item) => {
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
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          fields2: [
            // {
            // 	key: "code",
            // 	label: "CODE",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "15%"}
            // },
            {
              key: 'name',
              label: 'SUBJECT CODE',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '15%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
      },
      filters: {
        subject: {
          criteria: null
        }
      },
      paginations: {
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
    }
  },
  created() {
    const transcriptRecordId = this.$route.params.transcriptRecordId;
    this.loadTranscript(transcriptRecordId);
  },
  methods: {
    loadTranscript(transcriptRecordId) {
      this.isProcessing = true
      this.getTranscriptRecord(transcriptRecordId).then(({ data }) => {
        copyValue(data, this.transcriptRecord)
        if (data.courseId) {
          this.loadLevelsOfCourse(data.courseId);
        }
        this.loadSubjects(data.schoolCategoryId)
        this.isProcessing = false
      });
    },
    loadSubjects(schoolCategoryId) {
      const { subjects } = this.tables;
      const { subject } = this.paginations;
      subjects.isBusy2 = true;
      let params = { paginate: false, schoolCategoryId };
      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data;
        // subjects.filteredItems = data
        subject.totalRows = data.length;
        this.paginate(subject);
        subjects.isBusy2 = false;
      });
    },
    loadLevelsOfCourse(courseId) {
      let params = { paginate: false };
      this.getLevelsOfCourse(courseId, params).then(({ data }) => {
        this.transcriptRecord.levels = data
      });
    },
    filterSemester(level) {
      let defaultSemesters = this.$options.Semesters.values.slice(0, 2);
      if (level.isShowAll) {
        return this.$options.Semesters.values;
      } else {
        const { subjects } = this.transcriptRecord;
        let filteredSubjects = subjects.filter(
          (subject) => subject.pivot.levelId === level.id
        );
        let distinctSemesters = [
          ...new Set(filteredSubjects.map((x) => x.pivot.semesterId)),
        ];
        distinctSemesters.forEach((d) => {
          if (d) {
            if (!defaultSemesters.map((x) => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d));
            }
          }
        });
        return defaultSemesters;
      }
    },
    filterSubjects(levelId, semesterId = null) {
      const { subjects } = this.transcriptRecord;
      let filteredSubjects = subjects.filter(
        (subject) =>
          subject.pivot.levelId === levelId &&
          subject.pivot.semesterId === semesterId
      );
      const data = { items: filteredSubjects, isTakenAll: false };
      return data;
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event);
    },
    toggleCheckAll(subjects, value) {
      subjects.forEach((subject) => {
        subject.pivot.isTaken = value ? 1 : 0;
      });
    },
    onAddSubject(levelId, semesterId = null) {
      this.levelId = levelId;
      this.semesterId = semesterId;
      this.showModalSubjects = true;
      this.filters.subject.criteria = null;
    },
    addSubject(data) {
      const { item } = data;
      // check if subject exist in the table
      const result = this.transcriptRecord.subjects.find(
        (subject) => subject.id === item.id
      );
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      this.transcriptRecord.subjects.push({
        ...item,
        prerequisites: [],
        pivot: {
          grade: 0,
          notes: '',
          isTaken: 0,
          levelId: this.levelId,
          semesterId: this.semesterId,
        },
      });
    },
    removeSubject(data) {
      const { item } = data;
      const { item: transcriptRecord } = this.row;
      const index = transcriptRecord.subjects.findIndex(
        (i) => i.id === item.id
      );
      transcriptRecord.subjects.splice(index, 1);
    },
    onUpdateTranscriptRecord(isFinalized = false) {
      const {
        id,
        curriculumId,
        studentCurriculumId,
        studentId,
        schoolCategoryId,
        levelId,
        courseId,
        subjects,
      } = this.transcriptRecord;

      const transcriptRecordSubjects = subjects.map((subject) => {
        return {
          subjectId: subject.id,
          levelId: subject.pivot.levelId,
          semesterId: subject.pivot.semesterId,
          grade: subject.pivot.grade,
          notes: subject.pivot.notes,
          isTaken: subject.pivot.isTaken,
        };
      });
      const { TranscriptRecordStatuses } = this.$options;
      const transcriptRecordStatusId = isFinalized
        ? TranscriptRecordStatuses.FINALIZED.id
        : TranscriptRecordStatuses.DRAFT.id;
      const data = {
        id,
        curriculumId,
        studentCurriculumId,
        studentId,
        schoolCategoryId,
        levelId,
        courseId,
        transcriptRecordStatusId,
        subjects: transcriptRecordSubjects,
      };
      this.isSaving = true
      this.updateTranscriptRecord(id, data).then(({ data }) => {
        // this.loadTranscriptRecords();
        this.isSaving = false
        this.$router.push({
          path: `/registrar/academic-transcript`,
          query: { success: true },
        });
        // transcriptRecord.toggleDetails();
      });
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
    transcriptRecordId() {
      return this.$route.params.transcriptRecordId
    }
  },
}
</script>
<style lang="scss" scoped>
  .transcript {
    position: relative;
  }
  .transcript-info__container {
    margin: 30px;
    display: flex;
    flex-direction: column;

    .transcript-info__row {
      display: flex;

      .transcript-info__details {
        width: 50%;

        .detail__label {
          font-weight: bold;
        }
      }
    }
  }
  .transcript-subjects__container {
    // width: 100%;
    margin: 30px;

    .transcript-subjects__header {
      text-align: center;
    }
  }
  .collapsed .when-open,
  .not-collapsed .when-closed {
    display: none;
  }

  .transcript__action-bar {
    padding: 0 15px;
    
    button {
      margin: 3px;
    }
  }
</style>