<template>
    <PageContent
      title="Rate Sheeet Management"
      @toggleFilter="isFilterVisible = !isFilterVisible"
      @refresh="loadFeesOfLevel"
      :filterVisible="isFilterVisible"
      :createButtonVisible="checkIfHasSchoolCategoryAccess()"
      @create="showModalFees = true">
      <template v-slot:filters>
        <!--<v-select
          :options="options.schoolCategories.values"
          :value="filters.rateSheet.schoolCategoryItem"
          @input="onCategoryFilterChange"
          label="name"
          placeholder="School Category"
          class="mt-2"
          :clearable="false"
          :searchable="false"
          :selectable="option => checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        />-->
        <SelectCategory
          :value="filters.rateSheet.schoolCategoryItem"
          @input="onCategoryFilterChange"
          label="name"
          placeholder="School Category"
        />
        <v-select
          :options="options.levels.fixItems"
          :value="filters.rateSheet.levelItem"
          @input="onLevelFilterChange"
          label="name"
          placeholder="Level"
          class="mt-2"
          :clearable="false"
          :searchable="false"
        />
        <v-select
          v-if="isCourseVisible"
          :options="options.courses.fixItems"
          :value="filters.rateSheet.courseItem"
          @input="onCourseFilterChange"
          label="name"
          placeholder="Course"
          class="mt-2"
          :clearable="false"
          :searchable="false"
        />
        <v-select
          v-if="isCourseVisible"
          :options="options.semesters.values"
          :value="filters.rateSheet.semesterItem"
          @input="onSemesterFilterChange"
          label="name"
          placeholder="Semester"
          class="mt-2"
          :clearable="false"
          :searchable="false"
        />
      </template>
      <template v-slot:content>
        <!-- <SchoolCategoryTabs
          :showAll="false"
          @loadSchoolCategoryId="loadLevelsOfSchoolCategoryList($event)"
          @click="loadLevelsOfSchoolCategoryList($event)"
        /> -->
        <div v-if="checkIfHasSchoolCategoryAccess()">
          <b-overlay :show="isLoaded" rounded="sm">
            <b-card>
              <b-card-body>
                <!-- <b-row class="mb-3">
                  <b-col md="2">
                  </b-col>
                  <b-col md="8">
                    <b-row v-show="options.courses.items.length > 0">
                      <b-col md="8">
                        <b-form-select
                          v-model="forms.rateSheet.fields.courseId"
                          @change="loadFeesOfLevel()"
                        >
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
                            {{ course.description }}
                            {{ course.major ? `(${course.major})` : '' }}
                          </b-form-select-option>
                        </b-form-select>
                      </b-col>
                      <b-col md="4">
                        <b-form-select
                          v-model="forms.rateSheet.fields.semesterId"
                          @change="loadFeesOfLevel()"
                        >
                          <template v-slot:first>
                            <b-form-select-option :value="null" disabled
                              >-- Semester --</b-form-select-option
                            >
                          </template>
                          <b-form-select-option
                            v-for="semester in options.semesters.values"
                            :key="semester.id"
                            :value="semester.id"
                          >
                            {{ semester.name }}
                          </b-form-select-option>
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col md="2">
                    <b-button
                      class="float-right"
                      variant="primary"
                      @click="showModalFees = true"
                    >
                      <v-icon name="plus-circle" /> ADD NEW ITEM</b-button
                    >
                  </b-col>
                </b-row> -->
                <b-row>
                  <!-- <b-col md="2">
                    <b-tabs
                      class="c-tab-pills-vertical"
                      pills
                      vertical
                      v-model="levelIndex"
                    >
                      <b-tab
                        v-for="level in options.levels.items"
                        :key="level.id"
                        @click="loadCoursesOfLevelList(level.id)"
                        :title="level.name"
                      />
                    </b-tabs>
                  </b-col> -->
                  <b-col md="12">
                    <b-table
                      responsive
                      small
                      hover
                      outlined
                      show-empty
                      :items.sync="forms.rateSheet.fields.fees"
                      :fields="tables.rateSheetFees.fields"
                      :busy="tables.rateSheetFees.isBusy"
                    >
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <v-icon name="spinner" spin class="mr-2" />
                          <strong>Loading...</strong>
                        </div>
                      </template>
                      <template v-slot:cell(pivot.isInitialFee)="row">
                        <!-- <b-form-input v-model="row.item.pivot.amount" style="text-align: right"/> -->
                        <b-form-checkbox
                          value="1"
                          unchecked-value="0"
                          v-model="row.item.pivot.isInitialFee"
                        />
                      </template>
                      <template v-slot:head(isComputedByUnits)>
                        COMPUTED BY UNITS
                        <v-icon
                          name="info-circle"
                          class="icon-tooltip"
                          v-b-tooltip.hover="{
                            variant: 'info',
                            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}"
                        />
                      </template>
                      <template v-slot:head(pivot.isInitialFee)>
                        INITIAL FEE
                        <v-icon
                          name="info-circle"
                          class="icon-tooltip"
                          v-b-tooltip.hover="{
                            variant: 'info',
                            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}"
                        />
                      </template>
                      <template v-slot:cell(isComputedByUnits)="row">
                        <!-- <b-form-input v-model="row.item.pivot.amount" style="text-align: right"/> -->
                        <b-form-checkbox
                          v-if="row.item.id === fees.TUITION_FEE.id"
                          v-model="forms.rateSheet.fields.isComputedByUnits"
                          :value="1"
                          :unchecked-value="0"
                          @input="$event ? (row.item.pivot.amount = 0) : ''"
                        />
                      </template>
                      <template v-slot:cell(pivot.amount)="row">
                        <!-- <b-form-input v-model="row.item.pivot.amount" style="text-align: right"/> -->
                        <vue-autonumeric
                          :disabled="
                            forms.rateSheet.fields.isComputedByUnits === 1 &&
                              row.item.id === fees.TUITION_FEE.id
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
                      <template v-slot:cell(pivot.notes)="row">
                        <b-form-input v-model="row.item.pivot.notes" />
                      </template>
                      <template v-slot:cell(action)="row">
                        <b-button
                          @click="removeFee(row)"
                          size="sm"
                          variant="danger"
                          ><v-icon name="trash"
                        /></b-button>
                      </template>
                    </b-table>
                    <hr />
                    <b-row>
                      <b-col md="4">
                        <b-form-group
                          label="INITIAL FEE TOTAL"
                          label-for="enrollmentFee"
                          label-class="font-weight-bold"
                          label-cols="4"
                        >
                          <vue-autonumeric
                            id="enrollmentFee"
                            v-model="initialFeeTotal"
                            class="form-control text-right w-75"
                            :options="[
                              {
                                minimumValue: 0,
                                modifyValueOnWheel: false,
                                emptyInputBehavior: 0,
                              },
                            ]"
                          >
                          </vue-autonumeric>
                          <!-- <b-form-input id="enrollmentFee" v-model="forms.rateSheet.fields.enrollmentFee"></b-form-input> -->
                        </b-form-group>
                      </b-col>
                      <b-col offset-md="2" md="6">
                        <b-row>
                          <b-col sm="9">
                            <h6 class="font-weight-bold pt-1 float-right">
                              TOTAL :
                            </h6>
                          </b-col>
                          <b-col sm="3">
                            <h6 class="font-weight-bold pt-1 float-right">
                              {{ totalAmount }}
                            </h6>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card-body>
              <template v-slot:footer>
                <b-button
                  v-if="isAccessible($options.RateSheetPermissions.UPDATE.id)"
                  :disabled="forms.rateSheet.isProcessing"
                  class="float-right btn-save"
                  variant="outline-primary"
                  @click="createUpdateRateSheet()"
                >
                  <v-icon
                    v-if="forms.rateSheet.isProcessing"
                    name="sync"
                    spin
                    class="mr-2"
                  />
                  Save
                </b-button>
              </template>
            </b-card>
          </b-overlay>
        </div>
        <!-- MODAL FEES -->
        <b-modal
          v-model="showModalFees"
          :noCloseOnEsc="true"
          :noCloseOnBackdrop="true"
          size="xl"
        >
          <div slot="modal-title">
            <!-- modal title -->
            School Fees
          </div>
          <!-- modal title -->
          <b-row>
            <!-- modal body -->
            <b-col md="12">
              <b-row class="mb-2">
                <b-col offset-md="8" md="4">
                  <b-form-input
                    v-model="filters.fee.criteria"
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
                :items.sync="tables.fees.items"
                :fields="tables.fees.fields"
                :filter="filters.fee.criteria"
                :busy="tables.fees.isBusy2"
                :current-page="paginations.fee.page"
                :per-page="paginations.fee.perPage"
                @filtered="onFiltered($event, paginations.fee)"
              >
                <template v-slot:cell(action)="row">
                  <b-button @click="addFee(row)" size="sm" variant="success"
                    ><v-icon name="plus"
                  /></b-button>
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
                    @input="recordDetails(paginations.fee)"
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
              @click="showModalFees = false"
            >
              Close
            </b-button>
          </div>
          <!-- modal footer buttons -->
        </b-modal>
        <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
      </template>
    </PageContent>
    <!-- main container -->
</template>
<script>
import {
  RateSheetApi,
  SchoolCategoryApi,
  LevelApi,
  CourseApi,
  SchoolFeeApi,
  SemesterApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  Semesters,
  UserGroups,
  Fees,
  RateSheetPermissions,
} from '../../helpers/enum';
import { showNotification, formatNumber } from '../../helpers/forms';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import Tables from '../../helpers/tables';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import PageContent from "../components/PageContainer/PageContent";
import NoAccess from "../components/NoAccess";
export default {
  name: 'RateSheet',
  mixins: [
    RateSheetApi,
    SchoolCategoryApi,
    LevelApi,
    CourseApi,
    SchoolFeeApi,
    SemesterApi,
    Tables,
    Access,
  ],
  components: {
    SchoolCategoryTabs,
    Card,
    PageContent,
    NoAccess
  },
  RateSheetPermissions,
  data() {
    return {
      isFilterVisible: true,
      isLoaded: false,
      showModalFees: false,
      fees: Fees,
      forms: {
        rateSheet: {
          isProcessing: false,
          fields: {
            id: null,
            levelId: null,
            courseId: null,
            semesterId: null,
            enrollmentFee: 0,
            isComputedByUnits: null,
            fees: [],
          },
        },
      },
      tables: {
        rateSheetFees: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'pivot.notes',
              label: 'NOTES',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'pivot.isInitialFee',
              label: 'INITIAL FEE',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'isComputedByUnits',
              label: 'COMPUTED BY UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '15%' },
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
        },
        fees: {
          isBusy: false,
          isBusy2: false,
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
        fee: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        fee: {
          criteria: null,
        },
        rateSheet: {
          schoolCategoryId: null,
          schoolCategoryItem: null,
          levelId: null,
          levelItem: null,
          courseId: null,
          courseItem: null
        }
      },
      options: {
        schoolCategories: SchoolCategories,
        levels: {
          items: [],
          fixItems: []
        },
        courses: {
          items: [],
          fixItems: []
        },
        semesters: Semesters,
      },
      levelIndex: 0,
      schoolCategoryId: null,
      userGroupId: null,
    };
  },
  created() {
    const { rateSheet } = this.filters
    console.log(this.getDefaultSchoolCategory())
    rateSheet.schoolCategoryId = this.getDefaultSchoolCategory()?.id
    rateSheet.schoolCategoryItem = this.getDefaultSchoolCategory()
    this.loadLevels()
    this.loadCourses()
    this.loadFees()
    setTimeout(() => {
      this.loadFeesOfLevel()
    }, 1000);
  },
  computed: {
    initialFeeTotal: {
      get: function() {
        let total = 0;
        const {
          fields,
          fields: { fees },
        } = this.forms.rateSheet;
        fees.forEach((fee) => {
          if (fee.pivot.isInitialFee) {
            total += Number(fee.pivot.amount);
          }
        });
        fields.enrollmentFee = total;
        return total;
      },
      set: function(newValue) {
        const { fields } = this.forms.rateSheet;
        fields.enrollmentFee = newValue;
        return newValue;
      },
    },
    totalAmount() {
      let total = 0;
      this.forms.rateSheet.fields.fees.forEach((fee) => {
        total += Number(fee.pivot.amount);
      });

      return formatNumber(total);
    },
    levelName() {
      const { fields } = this.forms.rateSheet;
      let level = this.options.levels.items.find((i) => i.id == fields.levelId);
      if (level) {
        return level.name;
      }
    },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.rateSheet;
      const { schoolCategories } = this.options;
      return [
        schoolCategories.SENIOR_HIGH_SCHOOL.id,
        schoolCategories.COLLEGE.id,
        schoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
  },
  methods: {
    loadLevelsOfSchoolCategoryList(id) {
      this.isLoaded = true;
      this.schoolCategoryId = id;
      const params = { paginate: false };
      const { fields } = this.forms.rateSheet;
      const { levels, courses } = this.options;
      // fields.isComputedByUnits = false
      courses.items = [];
      this.getLevelsOfSchoolCategoryList(id, params)
        .then(({ data }) => {
          this.levelIndex = 0;
          levels.items = data;
          if (data.length > 0) {
            this.loadCoursesOfLevelList(data[0].id);
          } else {
            fields.fees = [];
          }
          //rateSheet.fields.levelId = res[0].id
          this.isLoaded = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadCoursesOfLevelList(levelId) {
      this.isLoaded = true;
      const { rateSheet } = this.forms;
      const params = { paginate: false };
      const { courses, semesters } = this.options;
      rateSheet.fields.levelId = levelId;
      rateSheet.fields.semesterId = null;
      rateSheet.fields.courseId = null;
      //const {  }
      this.getCoursesOfLevelList(levelId, params).then(({ data }) => {
        courses.items = data;

        if (data.length > 0) {
          rateSheet.fields.semesterId = semesters.getEnum(1).id;
          rateSheet.fields.courseId = courses.items[0].id;
        }

        this.loadFeesOfLevel();
        this.isLoaded = false;
      });
    },
    loadFeesOfLevel() {
      const { rateSheetFees } = this.tables;
      const { rateSheet } = this.forms;
      const { levelId, courseId, semesterId } = this.filters.rateSheet;

      const params = {
          levelId: this.filters.rateSheet.levelId,
          courseId: this.filters.rateSheet.courseId,
          semesterId: this.filters.rateSheet.semesterId
        }

      rateSheetFees.isBusy = true;
      rateSheet.fields.id = null; //clear id of rate sheet field
      rateSheet.fields.fees = [];

      this.getRateSheetList(params).then(({ data }) => {
        if (data.data.length > 0) {
          rateSheet.fields.id = data.data[0].id;
          rateSheet.fields.levelId = data.data[0].levelId;
          rateSheet.fields.courseId = data.data[0].courseId;
          rateSheet.fields.semesterId = data.data[0].semesterId;
          rateSheet.fields.enrollmentFee = data.data[0].enrollmentFee;
          rateSheet.fields.isComputedByUnits = data.data[0].isComputedByUnits;
          rateSheet.fields.fees = data.data[0].fees;
        }
        else {
          rateSheet.fields.levelId = levelId
          rateSheet.fields.courseId = courseId;
          rateSheet.fields.semesterId = semesterId;
        }
        rateSheetFees.isBusy = false;
      });
    },
    loadFees() {
      const { fees } = this.tables;
      const { fee } = this.paginations;
      fees.isBusy2 = true;
      const params = { paginate: false };
      this.getSchoolFeeList(params).then(({ data }) => {
        fees.items = data;
        fee.totalRows = data.length;
        this.recordDetails(fee);
        fees.isBusy2 = false;
      });
    },
    loadSemesterList() {
      let params = { paginate: false };
      this.getSemesterList(params).then(({ data }) => {
        this.options.semesters.items = data;
      });
    },
    addFee(row) {
      const { fields } = this.forms.rateSheet;
      const { item } = row;
      // check if rate sheet exist in the table

      const schoolCategoriesTuitionPerUnit = [
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id,
      ];

      if (schoolCategoriesTuitionPerUnit.includes(this.schoolCategoryId)) {
        if (item.id === Fees.TUITION_FEE.id) {
          fields.isComputedByUnits = true;
        }
      }
      // else {
      //   if (item.id === Fees.TUITION_FEE_PER_UNIT.id) {
      //     showNotification(this, 'danger', Fees.TUITION_FEE_PER_UNIT.name + " can't be add.")
      //     return
      //   }
      // }

      const result = fields.fees.find((fee) => fee.id === item.id);

      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }

      fields.fees.push({
        id: item.id,
        name: item.name,
        isIntegrated: item.isIntegrated,
        description: item.description,
        pivot: {
          schoolFeeId: item.id,
          amount: 0.0,
          notes: '',
          isInitialFee: 0,
        },
      });
    },
    removeFee(row) {
      this.forms.rateSheet.fields.fees.splice(row.index, 1);
    },
    createUpdateRateSheet() {
      const {
        rateSheet,
        rateSheet: { fields },
      } = this.forms;
      rateSheet.isProcessing = true;
      const data = {
        ...fields,
        fees: [],
      };

      fields.fees.forEach((rs) => {
        data.fees.push({
          rateSheetId: rs.pivot.rateSheetId,
          schoolFeeId: rs.pivot.schoolFeeId,
          amount: rs.pivot.amount,
          notes: rs.pivot.notes,
          isInitialFee: rs.pivot.isInitialFee,
        });
      });


      if (fields.id === null) {
        this.addRateSheet(data)
          .then(({ data }) => {
            fields.id = data.id;
            rateSheet.isProcessing = false;
            showNotification(this, 'success', 'Rate Sheet is updated.');
            //console.log(res)
          })
          .catch((error) => {
            rateSheet.isProcessing = false;
            showNotification(this, 'danger', 'Error in updating rate sheet');
          });
      } else {
        this.updateRateSheet(fields.id, data)
          .then(({ data }) => {
            rateSheet.isProcessing = false;
            showNotification(this, 'success', 'Rate Sheet is updated.');
          })
          .catch((error) => {
            rateSheet.isProcessing = false;
            showNotification(this, 'danger', 'Error in updating rate sheet');
          });
      }
    },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = false;
      if (userGroup) {
        // this.filters.student.schoolCategoryId = userGroup.schoolCategoryId
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }

      if (UserGroups.SUPER_USER.id == userGroup.id) {
        this.schoolCategoryId = SchoolCategories.getEnum(1).id;
        this.userGroupId = UserGroups.SUPER_USER.id;
      }
      this.loadLevelsOfSchoolCategoryList(this.schoolCategoryId);
    },
    onCategoryFilterChange(item) {
      const { rateSheet } = this.filters;
      rateSheet.schoolCategoryId = item?.id || 0;
      rateSheet.schoolCategoryItem = item;
      rateSheet.courseId = null
      rateSheet.courseItem = null
      rateSheet.semesterId = null
      rateSheet.semesterItem = null
      rateSheet.levelId = null
      rateSheet.levelItem = null
      this.loadLevels()
      this.loadCourses()
      setTimeout(() => {
        this.loadFeesOfLevel();
      }, 500);
    },
    onLevelFilterChange(item) {
      const { rateSheet } = this.filters;
      rateSheet.levelId = item?.id || 0;
      rateSheet.levelItem = item;
      this.loadFeesOfLevel();
    },
    onCourseFilterChange(item) {
      const { rateSheet } = this.filters;
      rateSheet.courseId = item?.id || 0;
      rateSheet.courseItem = item;
      this.loadFeesOfLevel();
    },
     onSemesterFilterChange(item) {
      const { rateSheet } = this.filters;
      rateSheet.semesterId = item?.id || 0;
      rateSheet.semesterItem = item;
      this.loadFeesOfLevel();
    },
    loadCourses() {
      const params = { paginate: false };
      const { courses } = this.options;
      this.getCourseList(params).then(({ data }) => {
        courses.fixItems = data;
        if(this.isCourseVisible) {
          const course = courses.fixItems[0] ? courses.fixItems[0] : null
          this.filters.rateSheet.courseId = course?.id
          this.filters.rateSheet.courseItem = course

          this.filters.rateSheet.semesterId = this.options.semesters.FIRST_SEM.id
          this.filters.rateSheet.semesterItem = this.options.semesters.FIRST_SEM
        }
      });
    },
    loadLevels() {
      const params = { paginate: false };
      const { schoolCategoryId } = this.filters.rateSheet
      const { levels } = this.options;
      this.getLevelList(params).then(({ data }) => {
        levels.fixItems = schoolCategoryId ? data.filter(e=> e.schoolCategoryId === schoolCategoryId) : data;
        const level = levels.fixItems[0] ? levels.fixItems[0] : null
        this.filters.rateSheet.levelId = level?.id
        this.filters.rateSheet.levelItem = level
      });
    },
  },
};
</script>
