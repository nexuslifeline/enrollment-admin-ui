<template>
  <div class="c-page-content">
    <Card title="Transcript Records">
      <div>
        <SchoolCategoryTabs
          :showAll="true"
          @loadSchoolCategoryId="
            (filters.transcriptRecord.schoolCategoryId = $event), loadLevels();
            loadTranscriptRecords();
          "
          @clickAll="
            (filters.transcriptRecord.schoolCategoryId = null),
              (filters.transcriptRecord.courseId = null),
              loadTranscriptRecords()
          "
          @click="
            (filters.transcriptRecord.schoolCategoryId = $event),
              (filters.transcriptRecord.courseId = null),
              loadCourses();
            loadTranscriptRecords();
          "
        />
        <div>
          <b-row class="mb-2">
            <!-- row button and search input -->
            <b-col md="3">
              <b-form-radio-group
                @input="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.transcriptRecordStatusId"
              >
                <b-form-radio :value="null">All</b-form-radio>
                <b-form-radio
                  v-for="status in $options.TranscriptRecordStatuses.values"
                  v-if="
                    status.id !== $options.TranscriptRecordStatuses.PENDING.id
                  "
                  :value="status.id"
                  :key="status.id"
                >
                  {{ status.name }}
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
            <b-col md="3">
              <b-form-select
                @change="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.levelId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Level --</b-form-select-option
                  >
                </template>
                <b-form-select-option :value="null">None</b-form-select-option>
                <b-form-select-option
                  v-for="level in options.levels.items.filter((l) =>
                    filters.transcriptRecord.schoolCategoryId
                      ? l.schoolCategoryId ===
                        filters.transcriptRecord.schoolCategoryId
                      : true
                  )"
                  :key="level.id"
                  :value="level.id"
                >
                  {{ level.name }}
                </b-form-select-option>
              </b-form-select>
            </b-col>
            <b-col md="3">
              <b-form-select
                v-if="
                  filters.transcriptRecord.schoolCategoryId ===
                    $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.COLLEGE.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.GRADUATE_SCHOOL.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.VOCATIONAL.id
                "
                @change="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.courseId"
                class="float-right"
                :disabled="options.courses.isLoading"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Course --</b-form-select-option
                  >
                </template>
                <b-form-select-option :value="null">None</b-form-select-option>
                <b-form-select-option
                  v-for="course in options.courses.items"
                  :key="course.id"
                  :value="course.id"
                >
                  {{ course.description }}
                  {{ course.major ? `(${course.major})` : '' }}
                </b-form-select-option>
              </b-form-select>
            </b-col>
            <b-col md="3">
              <b-form-input
                v-model="filters.transcriptRecord.criteria"
                debounce="500"
                @update="loadTranscriptRecords()"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <!-- row button and search input -->
          <b-table
            class="c-table"
            outlined
            small
            show-empty
            responsive
            :fields="tables.transcriptRecords.fields"
            :items="tables.transcriptRecords.items"
            :busy="tables.transcriptRecords.isBusy"
          >
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(name)="data">
              <b-media>
                <template v-slot:aside>
                  <AvatarMaker
                    :avatarId="data.item.student.id"
                    :size="50"
                    :text="
                      `${data.item.student.firstName.charAt(
                        0
                      )}${data.item.student.lastName.charAt(0)}`
                    "
                    :src="avatar(data.item.student)"
                  />
                </template>
                <div>
                  <b-link @click="loadDetails(data)">{{
                    data.item.student.name
                  }}</b-link>
                </div>
                <div class="text-muted">
                  {{ data.item.student.email }}
                </div>
                <div class="text-muted">
                  {{
                    data.item.student.currentAddress ||
                    data.item.student.address
                      ? data.item.student.address.currentCompleteAddress
                      : ''
                  }}
                </div>
              </b-media>
            </template>
            <template v-slot:cell(curriculum)="data">
              <span>
                {{ getName(data.item, 'curriculum') }}<br />
                {{ getName(data.item, 'level') }}<br />
                <small v-if="data.item.course"
                  >{{ data.item.course.description }}
                  {{
                    data.item.course.major ? `(${data.item.course.major})` : ''
                  }}</small
                >
              </span>
            </template>
            <template v-slot:cell(status)="data">
              <b-badge
                :variant="
                  data.item.transcriptRecordStatusId ===
                  $options.TranscriptRecordStatuses.FINALIZED.id
                    ? 'success'
                    : 'warning'
                "
              >
                {{
                  $options.TranscriptRecordStatuses.getEnum(
                    data.item.transcriptRecordStatusId
                  ).name
                }}
              </b-badge>
            </template>
            <template v-slot:cell(action)="row">
              <!-- <button type="button" @click="loadDetails(row)" class="btn-invisible">
                <BIconFolder2Open v-if="row.detailsShowing " />
                <BIconFolderSymlink v-else scale="1.2" />
              </button> -->
              <b-dropdown
                right
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template v-slot:button-content>
                  <v-icon name="ellipsis-v" />
                </template>
                <!-- v-if="isAccessible($options.StudentPermissions.UPDATE_ACADEMIC_RECORDS.id)" -->
                <b-dropdown-item @click.prevent="loadDetails(row)">
                  {{
                    row.item.transcriptRecordStatusId ===
                    $options.TranscriptRecordStatuses.FINALIZED.id
                      ? 'Print'
                      : 'Review Record'
                  }}
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.transcriptRecord.from }} to
              {{ paginations.transcriptRecord.to }} of
              {{ paginations.transcriptRecord.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                class="c-pagination"
                v-model="paginations.transcriptRecord.page"
                :total-rows="paginations.transcriptRecord.totalRows"
                :per-page="paginations.transcriptRecord.perPage"
                size="sm"
                align="end"
                @input="loadTranscriptRecords()"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </Card>
  </div>
  <!-- main container -->
</template>
<script>
import {
  LevelApi,
  SchoolCategoryApi,
  TranscriptRecordApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  TranscriptRecordStatuses,
  StudentCategories,
} from '../../helpers/enum';
import {
  showNotification,
  formatNumber,
  clearFields,
} from '../../helpers/forms';
import Tables from '../../helpers/tables';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import { copyValue } from '../../helpers/extractor';
import { format } from 'date-fns';
import { colorFactory, getColorFactoryLength } from '../../helpers/colors';
import AvatarMaker from '../components/AvatarMaker';
import Card from '../components/Card';

const COLOR_FACTORY_LENGTH = getColorFactoryLength();

export default {
  name: 'TranscriptRecord',
  constants: {
    COLOR_FACTORY_LENGTH,
  },
  colorFactory,
  format,
  mixins: [Tables, TranscriptRecordApi, SchoolCategoryApi, LevelApi],
  components: {
    SchoolCategoryTabs,
    Card,
    AvatarMaker,
  },
  TranscriptRecordStatuses,
  SchoolCategories,
  StudentCategories,
  data() {
    return {
      tables: {
        transcriptRecords: {
          isBusy: false,
          filterIncludedFields: ['firstName', 'lastName'],
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              // formatter: (value, key, item) => {
              // 	if(!item.student.middleName){
              // 		item.student.middleName = ""
              // 	}
              // 	item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
              // }
            },
            // {
            // 	key: "education",
            // 	label: "Education",
            // 	tdClass: "align-middle",
            //   thStyle: { width: "20%"}
            // },
            {
              key: 'curriculum',
              label: 'Curriculum',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'status',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
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
          ],
          items: [],
          filteredItems: [],
        },
      },
      paginations: {
        transcriptRecord: {
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
        transcriptRecord: {
          criteria: null,
          schoolCategoryId: null,
          courseId: null,
          transcriptRecordStatusId: null,
          levelId: null,
        },
        subject: {
          criteria: null,
          departmentId: null,
        },
      },
      options: {
        courses: {
          isLoading: false,
          items: [],
        },
        levels: {
          isLoading: false,
          items: [],
        },
      },
      isProcessing: false,
      schoolCategoryId: null,
      row: [],
    };
  },
  // created() {
  //   this.loadTranscriptRecords();
  // },
  methods: {
    loadTranscriptRecords() {
      const {
        transcriptRecordStatusId,
        schoolCategoryId,
        courseId,
        levelId,
        criteria,
      } = this.filters.transcriptRecord;
      const {
        transcriptRecord,
        transcriptRecord: { perPage, page },
      } = this.paginations;
      let params = {
        paginate: true,
        perPage,
        page,
        transcriptRecordStatusId,
        schoolCategoryId,
        courseId,
        levelId,
        criteria,
      };

      const { transcriptRecords } = this.tables;
      this.getTranscriptRecordList(params).then(({ data }) => {
        console.log(data);
        transcriptRecords.items = data.data;
        transcriptRecord.from = data.meta.from;
        transcriptRecord.to = data.meta.to;
        transcriptRecord.totalRows = data.meta.total;
        transcriptRecords.isBusy = false;
      });
    },
    loadCourses() {
      const { schoolCategoryId } = this.filters.transcriptRecord;
      const { courses } = this.options;
      let params = { paginate: false };
      courses.isLoading = true;
      this.getCoursesOfSchoolCategoryList(schoolCategoryId, params).then(
        ({ data }) => {
          courses.isLoading = false;
          courses.items = data;
        }
      );
    },
    loadLevels() {
      const params = { paginate: false };
      const { levels } = this.options;
      this.getLevelList(params).then(({ data }) => {
        levels.items = data;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    getName(item, child) {
      if (item) {
        let value = item[child];
        if (value) {
          return value['name'];
        }
      }
      return '';
    },
  },
};
</script>
