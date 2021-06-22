<template>
  <PageContent
    :title="`Student Assessment Fee (${$store.state.schoolYear.name})`"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadAcademicRecords"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        debounce="500"
        @update="loadAcademicRecords()"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <SelectCategory
        :value="filters.student.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
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
      <!-- :options="filteredApplicationsStatuses" -->
      <v-select
        :options="assessmentStatuses.values"
        :value="filters.student.assessmentStatus"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div v-if="checkIfHasSchoolCategoryAccess()">

        <b-alert :show="showTermsAlert" variant="danger" class="mb-3">
          No Terms(Grading Period) has been configured. It is recommended to setup this first before approving student enrollment requests. <span v-if="isAccessible($options.SettingPermissions.TERM.id)">To setup Terms click  <router-link to="/setting/terms-setting">here</router-link></span>.
        </b-alert>

        <b-table
          class="c-table"
          hover
          outlined
          small
          responsive
          show-empty
          :fields="tables.students.fields"
          :items="tables.students.items"
          :busy="tables.students.isBusy"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(name)="data">
            <StudentColumn
              :showIsManual="true"
              :data="data.item"
              :callback="{ loadDetails: () => loadDetails(data) }"
            />
          </template>
          <template v-slot:cell(address)="data">
            <AddressColumn :data="data.item" />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" :showSchoolYear="false"/>
          </template>
          <template v-slot:cell(status)="data">
            <AssessmentStatusColumn :data="data.item" />
          </template>
          <template v-slot:cell(action)="row">
            <!-- <v-icon
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'"
              @click="loadDetails(row)" /> -->

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
              <!-- <b-dropdown-item @click.prevent="loadDetails(row)">
                {{
                  row.item.application
                    ? getEllipsisCaption(
                        row.item.application.applicationStatusId
                      )
                    : getEllipsisCaption(row.item.admission.applicationStatusId)
                }}
              </b-dropdown-item> -->
              <!-- <b-dropdown-item
                v-if="
                  (row.item.application
                    ? row.item.application.applicationStatusId
                    : row.item.admission.applicationStatusId) !==
                    applicationStatuses.SUBMITTED.id
                "
                @click.prevent="loadAssessmentForm(row.item.id)"
              >
                Preview Assessment Form
              </b-dropdown-item> -->
              <b-dropdown-item @click.prevent="loadDetails(row)">
                {{ getEllipsisCaption(row.item.academicRecordStatusId) }}
              </b-dropdown-item>
               <b-dropdown-item
                v-if="assessmentStatuses.APPROVED.academicRecordStatuses.includes(row.item.academicRecordStatusId)"
                @click.prevent="loadAssessmentForm(row.item.id)">
                Preview Assessment Form
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:row-details="data">
            <ActiveRowViewer
              :isBusy="data.item.isLoading"
              backTitle="Go back to list"
              @onBack="data.toggleDetails()"
              :showOptions="
                isAccessible($options.StudentFeePermissions.APPROVAL.id) && showOptions"
              :showActionBar="
                isAccessible($options.StudentFeePermissions.APPROVAL.id) && showOptions"
              :options="[
                {
                  label: 'Approve',
                  callback: () => setApproveFees(data),
                  isAllowed: isAccessible(
                    $options.StudentFeePermissions.APPROVAL.id
                  ) && !showTermsAlert && hasTermsSchoolCategory(data.item),
                },
                {
                  label: 'Reject',
                  callback: () => setRejectFees(data),
                  isAllowed: isAccessible(
                    $options.StudentFeePermissions.DISAPPROVAL.id
                  ) && !showTermsAlert && hasTermsSchoolCategory(data.item),
                },
              ]"
            >
              <template v-slot:header>
                <div class="active-view__header-details-container">
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
                  <div class="active-view__header-details">
                    <p class="active-view__header-name">
                      {{ data.item.student.name }}
                    </p>
                    <p class="active-view__header-email">
                      {{ data.item.student.email }}
                    </p>
                  </div>
                  <p class="active-view__header-date">
                    <BIconAlarm />
                    {{
                      $options.format(
                        new Date(
                          data.item.application
                            ? data.item.application.appliedDate
                            : data.item.admission.appliedDate
                        ),
                        'MMMM dd, yyyy'
                      )
                    }}
                  </p>
                </div>
              </template>

              <template v-slot:navigation>
                <ActiveViewLinks
                  :items="[
                    {
                      text: 'Application',
                      target: 'header-current-application',
                    },
                    {
                      text: 'Subjects',
                      target: 'header-subjects',
                    },
                    {
                      text: 'Fees',
                      target: 'header-fees',
                    },
                  ]"
                />
              </template>

              <template v-slot:content>
                <div>
                  <b-alert :show="!hasTermsSchoolCategory(data.item)" variant="danger" class="mb-3">
                    sss No Terms(Grading Period) has been configured. It is recommended to setup this first before approving student enrollment requests. <span v-if="isAccessible($options.SettingPermissions.TERM.id)">To setup Terms click  <router-link to="/setting/terms-setting">here</router-link></span>.
                  </b-alert>
                  <ActiveViewHeader
                    id="header-current-application"
                    title="Review Application for current Academic Year"
                    circleText="1"
                  />
                  <ActiveViewItems>
                    <ActiveViewItem label="Level: ">
                      <p>
                        {{ getName(data.item, 'level') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      label="Course: "
                      v-if="!!getName(data.item, 'course')"
                    >
                      <p>
                        {{ data.item.course.description }}
                        {{
                          data.item.course.major
                            ? `(${data.item.course.major})`
                            : ''
                        }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      v-if="!!getName(data.item, 'course')"
                      label="Semester: "
                    >
                      <p>
                        {{ getName(data.item, 'semester') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="School Year: ">
                      <p>
                        {{ getName(data.item, 'schoolYear') }}
                      </p>
                    </ActiveViewItem>
                  </ActiveViewItems>
                </div>
                <div v-if="data.item.subjects">
                  <ActiveViewHeader
                    id="header-subjects"
                    title="Subjects"
                    circleText="2"
                  />
                  <b-row class="mb-1 mt-4">
                    <b-col md="6">
                      <h5>SUBJECTS</h5>
                    </b-col>
                  </b-row>
                  <b-table
                    hover
                    outlined
                    small
                    responsive
                    show-empty
                    :fields="tables.subjects.fields"
                    :items="data.item.subjects"
                    :busy="tables.subjects.isBusy"
                  >
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col md="10">
                      <h5 class="float-right font-weight-bold">TUITION FEE</h5>
                    </b-col>
                    <b-col md="2">
                      <h5 class="float-right pr-2 font-weight-bold">
                        {{ subjectsTotalAmount(data.item.subjects) }}
                      </h5>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.fees">
                  <ActiveViewHeader
                    id="header-fees"
                    title="Fees"
                    circleText="3"
                  />
                  <b-row class="mb-1 mt-4">
                    <b-col md="4">
                      <h5 class="pt-2">STUDENT FEES</h5>
                    </b-col>
                    <b-col md="4" class="text-center">
                      <span
                        v-if="data.item.msg"
                        class="text-danger font-weight-bold"
                        >{{ data.item.msg }}</span
                      >
                    </b-col>
                    <b-col md="4">
                      <b-button
                        @click="onAddFees(data.item.fees)"
                        v-if="showOptions"
                        variant="outline-primary"
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
                    :fields="tables.studentFees.fields"
                    :items="data.item.fees"
                    :busy="tables.studentFees.isBusy"
                  >
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                    <template v-slot:cell(pivot.notes)="row">
                      <b-form-input
                        v-model="row.item.pivot.notes"
                        :disabled="!showOptions"
                      />
                    </template>
                    <template v-slot:cell(pivot.isInitialFee)="row">
                      <!-- <b-form-checkbox
                        :disabled="!showOptions"
                        value="1"
                        unchecked-value="0"
                        v-model="row.item.pivot.isInitialFee"
                      /> -->
                      <Toggle
                        @input="row.item.pivot.isInitialFee = $event ? 1 : 0"
                        :value="row.item.pivot.isInitialFee"
                        :isDisabled="!showOptions"/>
                    </template>
                    <template v-slot:cell(pivot.amount)="row">
                      <vue-autonumeric
                        :disabled="
                          (row.item.id === fees.TUITION_FEE.id &&
                            data.item.isComputedByUnits === 1) ||
                            !showOptions"
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
                        v-if="showOptions && row.item.id !== fees.TUITION_FEE.id"
                        @click="removeFee(data.item.fees, row)"
                        size="sm"
                        variant="danger"
                      >
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col md="4">
                      <!-- <b-form-group
                        label="INITIAL FEE TOTAL :"
                        label-for="enrollmentFee"
                        label-class="font-weight-bold"
                        label-cols="4"
                      > -->
                      <div class="footer-info">
                        <label
                          >INITIAL FEE TOTAL :
                          <v-icon
                            name="info-circle"
                            class="icon-tooltip"
                            v-b-tooltip.hover="{
                              variant: 'info',
                              title:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                            }"
                          />
                        </label>
                        <vue-autonumeric
                          disabled
                          class="form-control text-right"
                          :value="initialFeeSum"
                          :options="[
                            {
                              minimumValue: 0,
                              modifyValueOnWheel: false,
                              emptyInputBehavior: 0,
                            },
                          ]"
                        />
                      </div>
                      <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="4">
                      <!-- <b-form-group
                        label="PREVIOUS BALANCE :"
                        label-for="enrollmentFee"
                        label-class="font-weight-bold"
                        label-cols="4"
                      > -->
                      <div class="footer-info">
                        <label
                          >PREVIOUS BALANCE :
                          <v-icon
                            name="info-circle"
                            class="icon-tooltip"
                            v-b-tooltip.hover="{
                              variant: 'info',
                              title:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                            }"
                          />
                        </label>
                        <vue-autonumeric
                          class="form-control text-right"
                          v-model="data.item.previousBalance"
                          :disabled="!showOptions"
                          :options="[
                            {
                              minimumValue: 0,
                              modifyValueOnWheel: false,
                              emptyInputBehavior: 0,
                            },
                          ]"
                        />
                      </div>
                      <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="2">
                      <h5 class="float-right font-weight-bold">Total</h5>
                    </b-col>
                    <b-col md="2">
                      <h5 class="float-right font-weight-bold">
                        {{ feesTotalAmount(data.item.fees) }}
                      </h5>
                    </b-col>
                  </b-row>
                </div>
              </template>

              <template v-slot:actionBar>
                <div class="float-right" v-if="showOptions">
                  <b-button
                    @click="setApproveFees(data)"
                    class="mr-2 ml-2" variant="outline-primary"
                    v-if="isAccessible($options.StudentFeePermissions.APPROVAL.id)"
                    :disabled="showTermsAlert || !hasTermsSchoolCategory(data.item)"> Approve</b-button>
                  <b-button
                    v-if="isAccessible($options.StudentFeePermissions.DISAPPROVAL.id)"
                    :disabled="showTermsAlert || !hasTermsSchoolCategory(data.item)"
                    @click="setRejectFees(data)"
                    variant="outline-danger"
                    >Reject</b-button
                  >
                </div>
              </template>
            </ActiveRowViewer>
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
              @input="loadAcademicRecords()"
            />
          </b-col>
        </b-row>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
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
                  @input="recordDetails()"
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
      <!-- Modal Approval -->
      <!-- <b-modal
        v-model="showModalApproval"
        centered
        header-bg-variant="success"
        header-text-variant="light"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
        
          Finalize Approval
        </div>
   
        <b-row>

          <b-col md="12">
            <label>Notes</label>
            <b-textarea v-model="approvalNotes" rows="7" />
          </b-col>
        </b-row>

        <div slot="modal-footer" class="w-100">

          <b-button class="float-left" @click="showModalApproval = false">
            Cancel
          </b-button>
          <b-button
            @click="approveFees()"
            class="float-right"
            variant="outline-primary"
          >
            <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
            Confirm
          </b-button>
        </div>

      </b-modal> -->
      <!-- Modal Approval -->
      <FileViewer
        :show="fileViewer.show"
        :file="file"
        :owner="file.owner"
        :isBusy="file.isLoading"
        @close="fileViewer.show = false"
      />

      <AssessmentApproval
        v-if="showModalApproval"
        :isShown.sync="showModalApproval"
        :academicRecordId="selectedAcademicRecord.id"
        :fees="selectedAcademicRecord && selectedAcademicRecord.fees || []"
        :previousBalance="selectedAcademicRecord && selectedAcademicRecord.previousBalance || 0"
        @onCancel="showModalApproval = false"
        @onApproved="onAssesmentApproved"
      />
      <AssessmentRejection
        v-if="showModalRejection"
        :isShown.sync="showModalRejection"
        :academicRecordId="selectedAcademicRecord.id"
        @onCancel="showModalRejection = false"
        @onRejected="onAssesmentRejected"
      />
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  StudentApi,
  CourseApi,
  AcademicRecordApi,
  RateSheetApi,
  SchoolFeeApi,
  ReportApi,
  SchoolYearApi,
  TermApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  AcademicRecordStatuses,
  ApplicationStatuses,
  StudentFeeStatuses,
  Fees,
  UserGroups,
  BillingTypes,
  BillingStatuses,
  StudentFeePermissions,
  SettingPermissions,
  AssessmentStatuses,
  EnlistmentStatuses,
} from '../../helpers/enum';
import { showNotification, formatNumber } from '../../helpers/forms';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import Tables from '../../helpers/tables';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import { StudentColumn, EducationColumn, AddressColumn, AssessmentStatusColumn } from '../components/ColumnDetails';

import ActiveRowViewer from '../components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewHeader from '../components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from '../components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from '../components/ActiveRowViewer/ActiveViewItem';
import ActiveViewLinks from '../components/ActiveRowViewer/ActiveViewLinks';
import AttachmentList from '../components/Attachment/AttachmentList';
import AvatarMaker from '../components/AvatarMaker';
import FileViewer from '../components/FileViewer';
import { format } from 'date-fns';
import PageContent from "../components/PageContainer/PageContent";
import FilterButton from "../components/PageContainer/FilterButton";
import NoAccess from "../components/NoAccess";
import AssessmentApproval from '../components/ApprovalModals/Assessment'
import AssessmentRejection from '../components/RejectionModals/Assessment'
import Toggle from '../components/Form/Toggle'

export default {
  name: 'StudentFee',
  mixins: [
    StudentApi,
    CourseApi,
    AcademicRecordApi,
    RateSheetApi,
    SchoolFeeApi,
    ReportApi,
    Tables,
    Access,
    SchoolYearApi,
    TermApi
  ],
  format,
  components: {
    SchoolCategoryTabs,
    Card,
    StudentColumn,
    EducationColumn,
    ActiveRowViewer,
    ActiveViewHeader,
    AttachmentList,
    ActiveViewItems,
    ActiveViewItem,
    ActiveViewLinks,
    AvatarMaker,
    FileViewer,
    PageContent,
    FilterButton,
    NoAccess,
    AddressColumn,
    AssessmentStatusColumn,
    AssessmentApproval,
    AssessmentRejection,
    Toggle
  },
  StudentFeePermissions,
  SettingPermissions,
  data() {
    return {
      selectedAcademicRecord: null,
      isFilterVisible: true,
      fileViewer: {
        show: false,
      },
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      showModalFees: false,
      showModalApproval: false,
      showModalRejection: false,
      approvalNotes: null,
      applicationStatuses: ApplicationStatuses,
      assessmentStatuses: AssessmentStatuses,
      enlismentStatuses: EnlistmentStatuses,
      academicRecordStatuses: AcademicRecordStatuses,
      fees: Fees,
      isProcessing: false,
      showTermsAlert: false,
      tables: {
        students: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'address',
              label: 'Address',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
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
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'amountPerUnit',
              label: 'AMOUNT PER LEC UNIT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '13%' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'amountPerLab',
              label: 'AMOUNT PER LAB',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '13%' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            {
              key: 'totalAmount',
              label: 'TOTAL AMOUNT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
          ],
          items: [],
        },
        studentFees: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'schoolFeeCategory.name',
              label: 'CATEGORY',
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
              key: 'schoolFeeCategory.name',
              label: 'Category',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '150px' },
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
        fee: {
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
          schoolCategoryId: 0,
          schoolCategoryItem: null,
          courseItem: null,
          courseId: null,
          // applicationStatusId: ApplicationStatuses.SUBMITTED.id,
          assessmentStatus: AssessmentStatuses.PENDING
        },
        fee: {
          criteria: null,
        },
      },
      options: {
        courses: {
          items: [],
        },
        schoolCategories: SchoolCategories,
        terms: {
          items: []
        }
      },
      schoolCategoryId: null,
      studentFees: [],
      row: [],
    };
  },
  created() {
    // this.checkRights()
    const { student } = this.filters
    if (!this.checkIfSuperUser()) {
      student.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      student.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadCourseList();
    this.loadFees();
    this.loadAcademicRecords()
    this.loadTerms()
  },
  methods: {
    onAssesmentApproved() {
      this.selectedAcademicRecord = null
      this.showModalApproval = false
      this.loadAcademicRecords()
    },
    onAssesmentRejected() {
      this.selectedAcademicRecord = null
      this.showModalRejection = false
      this.loadAcademicRecords()
    },
    loadTerms() {
      const { terms } = this.options
      const params = { paginate: false, schoolYearId: this.$store.state.schoolYear.id }
      this.getTermList(params).then(({ data }) => {
        terms.items = data
        this.showTermsAlert = terms.items.length > 0 ? false : true
      })
    },
    setApproveFees(row) {
      this.approvalNotes = null;
      this.row = row
      this.showModalApproval = true;
    },
    setRejectFees(row) {
      this.row = row
      this.showModalRejection = true;
    },
    approveFees() {
      const {
        item,
        item: {
          id: academicRecordId,
          applicationId,
          admissionId,
          enrollmentFee,
          previousBalance,
          student,
          isComputedByUnits,
        },
      } = this.row;

      const applicationAdmission = [
        {
          application: {
            applicationStatusId: ApplicationStatuses.APPROVED.id,
          },
        },
        {
          admission: {
            applicationStatusId: ApplicationStatuses.APPROVED.id,
          },
        },
      ];

      const index = applicationId ? 0 : 1;

      let fees = [];
      let totalAmount = 0;

      item.fees.forEach((fee) => {
        fees.push({
          schoolFeeId: fee.id,
          amount: fee.pivot.amount,
          notes: fee.pivot.notes,
          isInitialFee: fee.pivot.isInitialFee,
        });
        totalAmount += Number(fee.pivot.amount);
      });

      const data = {
        ...applicationAdmission[index],
        studentFee: {
          studentFeeStatusId: StudentFeeStatuses.APPROVED.id,
          totalAmount,
          isComputedByUnits,
          enrollmentFee: enrollmentFee,
          approvalNotes: this.approvalNotes,
        },
        id: academicRecordId,
        fees,
        billing: {
          dueDate: '2021-08-24',
          totalAmount: enrollmentFee,
          studentId: student.id,
          billingTypeId: BillingTypes.INITIAL_FEE.id,
          billingStatusId: BillingStatuses.UNPAID.id,
          schoolYearId: item.schoolYearId,
          semesterId: item.semesterId,
          previousBalance,
        },
        billingItem: {
          item: 'Registration Fee',
          amount: enrollmentFee,
        },
      };

      this.isProcessing = true;
      this.updateAcademicRecord(data, academicRecordId)
        .then(({ data }) => {
          const form = applicationId ? 'application' : 'admission';
          item[form].applicationStatusId = ApplicationStatuses.APPROVED.id;
          this.isProcessing = false;
          this.loadAcademicRecords();
          this.showModalApproval = false;
          showNotification(this, 'success', 'Approved Successfully.');
          this.$store.state.approvalCount.assessment--;
        })
        .catch((error) => {
          console.log(error);
          this.isProcessing = false;
        });
    },
    loadAcademicRecords() {
      const { students } = this.tables;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;
      students.isBusy = true;
      const {
        assessmentStatus,
        // applicationStatusId,
        schoolCategoryId,
        courseId,
        criteria,
      } = this.filters.student;
      const orderBy = 'updated_at';
      const sort = 'DESC';
      // const notAcademicRecordStatusId = AcademicRecordStatuses.DRAFT.id;
      let params = {
        paginate: true,
        perPage,
        page,
        academicRecordStatusId: assessmentStatus?.academicRecordStatuses ||
          [
            ...this.assessmentStatuses.PENDING.academicRecordStatuses,
            ...this.assessmentStatuses.REJECTED.academicRecordStatuses,
            ...this.assessmentStatuses.APPROVED.academicRecordStatuses
          ],
        // notAcademicRecordStatusId,
        schoolCategoryId,
        courseId,
        // applicationStatusId,
        schoolYearId: this.$store.state.schoolYear.id,
        orderBy,
        sort,
        criteria,
      };
      this.getAcademicRecordList(params).then((response) => {
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
      this.getCourseList(params).then((response) => {
        const res = response.data;
        this.options.courses.items = res;
      });
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        const {
          id: academicRecordId,
          academicRecordStatusId,
          levelId,
          courseId,
          semesterId,
          schoolCategoryId,
          application,
          admission,
        } = row.item;

        const params = { paginate: false };
        this.$set(row.item, 'isLoading', true);
        this.getSubjectsOfAcademicRecord(academicRecordId, params).then(
          ({ data }) => {
            this.$set(row.item, 'subjects', data);
            if (academicRecordStatusId === this.academicRecordStatuses.ENLISTMENT_APPROVED.id  || academicRecordStatusId === this.academicRecordStatuses.ASSESSMENT_REJECTED.id) {
              const rateSheetParams = { levelId, courseId, semesterId };
              this.getRateSheetList(rateSheetParams).then(({ data }) => {
                const res = data.data;
                console.log(data)
                this.$set(
                  row.item,
                  'enrollmentFee',
                  res[0] ? res[0].enrollmentFee : 0
                );
                this.$set(row.item, 'previousBalance', 0);
                this.$set(
                  row.item,
                  'isComputedByUnits',
                  res[0] ? res[0].isComputedByUnits : 0
                );
                this.$set(row.item, 'fees', res[0] ? res[0].fees : []);
                if (res.length > 0) {
                  if (res[0].isComputedByUnits) {
                    const tuitionFee = row.item.fees.find(
                      (fee) => fee.id === Fees.TUITION_FEE.id
                    );
                    let amount = 0;
                    let notes = '';
                    row.item.subjects.forEach((subject) => {
                      amount += Number(subject.totalAmount);
                      notes += subject.name + ', ';
                    });

                    if (tuitionFee) {
                      tuitionFee.pivot.amount = amount;
                      tuitionFee.pivot.notes = notes.replace(/,\s*$/, '');
                    } else {
                      row.item.fees.unshift({
                        id: Fees.TUITION_FEE.id,
                        name: Fees.TUITION_FEE.name,
                        pivot: { amount: amount, notes: notes },
                      });
                    }
                  }
                } else {
                  this.$set(row.item, 'msg', 'No rate sheet fee is set.');
                }
                row.item.isLoading = false;
              });
            } else {
              this.getStudentFeeOfAcademicRecord(academicRecordId).then(
                ({ data }) => {
                  this.$set(row.item, 'enrollmentFee', data.enrollmentFee);
                  this.$set(
                    row.item,
                    'previousBalance',
                    data.billings[0].previousBalance
                  );
                  this.$set(row.item, 'fees', data.studentFeeItems);
                  this.$set(
                    row.item,
                    'isComputedByUnits',
                    data.isComputedByUnits
                  );
                  row.item.isLoading = false;
                }
              );
            }
            this.selectedAcademicRecord = row.item;
          }
        );
      }
      row.toggleDetails();
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
    onAddFees(fees) {
      this.studentFees = fees;
      this.showModalFees = true;
    },
    addFee(row) {
      const { item } = row;
      // check if rate sheet exist in the table
      const result = this.studentFees.find((fee) => fee.id === item.id);
      // let result2
      // if ([Fees.TUITION_FEE_PER_UNIT.id, Fees.TUITION_FEE.id].includes(item.id)) {
      //   result2 = this.studentFees.find(fee => [Fees.TUITION_FEE_PER_UNIT.id, Fees.TUITION_FEE.id].includes(fee.id))
      // }

      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      this.studentFees.push({
        id: row.item.id,
        name: row.item.name,
        isIntegrated: row.item.isIntegrated,
        schoolFeeCategory: { name: row.item.schoolFeeCategory.name },
        description: row.item.description,
        pivot: { schoolFeeId: row.item.id, amount: 0.0, notes: '' },
      });
    },
    removeFee(fees, row) {
      fees.splice(row.index, 1);
    },
    loadFees() {
      const { fees } = this.tables;
      const { fee } = this.paginations;
      const params = { paginate: false };
      fees.isBusy = true;
      this.getSchoolFeeList(params).then(({ data }) => {
        fees.items = data;
        fee.totalRows = data.length;
        this.recordDetails(fee);
        fees.isBusy = false;
      });
    },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = false;
      if (userGroup) {
        this.filters.student.schoolCategoryId = userGroup.schoolCategoryId;
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }
      this.loadAcademicRecords();
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    getEllipsisCaption(academicRecordStatusId) {
      if (this.assessmentStatuses?.APPROVED?.academicRecordStatuses?.includes(academicRecordStatusId)) {
        return 'View Details';
      }

      return 'Review Record';
    },
    loadAssessmentForm(academicRecordId) {
      this.file.type = null;
      this.file.src = null;
      this.fileViewer.show = true;
      this.file.isLoading = true;
      this.file.name = 'Assessment Form';
      this.previewAssessmentForm(academicRecordId).then(({ data, headers }) => {
        this.file.type = headers.contentType;
        const file = new Blob([data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
      });
    },
    onCategoryFilterChange(item) {
      const { student } = this.filters;
      student.schoolCategoryId = item?.id || 0;
      student.schoolCategoryItem = item;
      this.loadAcademicRecords();
    },
    onStatusFilterChange(item) {
      const { student } = this.filters;
      // student.applicationStatusId = item?.id || 0;
      student.assessmentStatus = item;
      this.loadAcademicRecords();
    },
    onCourseFilterChange(item) {
      const { student } = this.filters;
      student.courseId = item?.id || 0;
      student.courseItem = item;
      this.loadAcademicRecords();
    },
    hasTermsSchoolCategory(item) {
      const { terms } = this.options
      return terms.items.find(term => term.schoolCategoryId === item.schoolCategoryId)
    },
  },
  watch: {
    '$store.state.schoolYear': function(newVal) {
      this.loadTerms();
      this.loadAcademicRecords();
    },
  },
  computed: {
    subjectsTotalAmount() {
      return (subjects) => {
        let amount = 0;
        subjects.forEach((s) => {
          amount += Number(s.totalAmount);
        });
        return formatNumber(amount);
      };
    },
    feesTotalAmount() {
      return (fees) => {
        let amount = 0;
        fees.forEach((fee) => {
          amount += Number(fee.pivot.amount);
        });
        return formatNumber(amount);
      };
    },
    initialFeeTotal: {
      get: function() {
        return (data) => {
          let total = 0;
          const {
            item,
            item: { fees },
          } = data;
          fees.forEach((fee) => {
            if (fee.pivot.isInitialFee == 1) {
              total += Number(fee.pivot.amount);
            }
          });
          item.enrollmentFee = total;
          return total;
        };
      },
      set: function(newValue) {
        return (data) => {
          const { item } = data;
          item.enrollmentFee = newValue;
          return newValue;
        };
      },
    },
    initialFeeSum() {

      if(!this.selectedAcademicRecord)
      return 0

      const { fees } = this.selectedAcademicRecord
      if(fees && fees.length > 0) {
        return fees.reduce((acc, curr) => {
          return acc += parseInt(curr.pivot.isInitialFee) === 1 ? parseFloat(curr.pivot.amount) : 0
        }, 0)
      }
    },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.student;
      const { schoolCategories } = this.options;
      return [
        schoolCategories.SENIOR_HIGH_SCHOOL.id,
        schoolCategories.COLLEGE.id,
        schoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
    // filteredApplicationsStatuses() {
    //   return this.applicationStatuses.values.filter(e =>
    //     e.id === this.applicationStatuses.SUBMITTED.id ||
    //     e.id === this.applicationStatuses.APPROVED.id ||
    //     e.id === this.applicationStatuses.REJECTED.id ||
    //     e.id === this.applicationStatuses.COMPLETED.id
    //   )
    // },
    showOptions() {
      //for pending statuses
      if(!this.selectedAcademicRecord)
      return false //avoid flicker
      return this.selectedAcademicRecord.academicRecordStatusId === this.academicRecordStatuses.ENLISTMENT_APPROVED.id
    }
  },
};
</script>

<style lang="scss">
@import '../../assets/scss/shared.scss';
.footer-info {
  display: flex;
  width: 100%;
  align-items: center;

  label {
    min-width: 170px;
    font-weight: bold;
  }

  @include for-size(desktop-down) {
    label {
      min-width: 110px;
      max-width: 110px;
    }
  }

  @include for-size(phone-only) {
    margin-bottom: 5px;
  }
}
</style>
