<template>
  <PageContent
    title="Other Billings"
    description="Review and manage other charges to student that were billed for a given period of time."
    :searchKeyword="filters.billing.criteria"
    :pageFrom="paginations.billing.from"
    :pageTo="paginations.billing.to"
    :pageTotal="paginations.billing.totalRows"
    :perPage="paginations.billing.perPage"
    :currentPage.sync="paginations.billing.page"
    @onPageChange="loadBillings"
    @onRefresh="loadBillings"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.billing.criteria"
        debounce="500"
        @update="loadBillings()"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <!--<v-select
        :options="$options.SchoolCategories.values"
        :value="filters.billing.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />-->
      <SelectCategory
        :value="filters.billing.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <v-select
        :options="$options.BillingStatuses.values"
        :value="filters.billing.billingStatusItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
     <template v-slot:extra-buttons>
      <!-- <div class="ml-1 drop-down__container" >
         <b-dropdown
          v-if="isAccessible($options.OtherBillingPermissions.GENERATE.id)"
          variant="primary"
          class="other__drop-down"
        >
          <b-dropdown-item @click="setCreateOtherFee(), showBatchEntry = false"
            >Generate Other Billing</b-dropdown-item
          >
          <b-dropdown-item @click="setCreateBatchOtherFee(), showEntry = false"
            >Batch Generate Other Billing</b-dropdown-item
          >
        </b-dropdown>
      </div> -->
      <SplitButton
        v-if="isAccessible($options.OtherBillingPermissions.GENERATE.id)"
        text="Generate Batch Bill"
        @click="() => $router.push({ name: 'Batch Other Billing' })"
        :actions="[
          { text: 'Create Individual Bill', callback: () => $router.push({ name: 'Individual Other Billing' }) },
          { text: 'Create Batch Bill', callback: () => $router.push({ name: 'Batch Other Billing' }) },
        ]"
      />
      <!-- <div class="ml-1 drop-down__container" >
         <b-dropdown
          v-if="isAccessible($options.OtherBillingPermissions.GENERATE.id)"
          text="Generate"
          variant="primary"
          split-variant="primary"
          class="other__drop-down"
          split
          boundary="window">
          <b-dropdown-item
            @click="$router.push({ name: 'Individual Other Billing' })">
            Individual Billing
          </b-dropdown-item>
          <b-dropdown-item @click="$router.push({ name: 'Batch Other Billing' })">
            Batch billing
          </b-dropdown-item>
        </b-dropdown>
      </div> -->
    </template>
    <template v-slot:content>
      <div v-if="!showEntry && !showBatchEntry && checkIfHasSchoolCategoryAccess()">
        <!-- <b-row class="mb-2">
          <b-col md="8">
            <b-form-radio-group
              @input="loadBillings()"
              v-model="filters.billing.billingStatusId"
            >
              <b-form-radio :value="null">Show All</b-form-radio>
              <b-form-radio
                v-for="status in $options.BillingStatuses.values"
                :value="status.id"
                :key="status.id"
              >
                {{ status.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
          <b-col md="4"> </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="8">
            <b-dropdown
              v-if="
                isAccessible($options.OtherBillingPermissions.GENERATE.id)
              "
              variant="primary"
            >
              <template v-slot:button-content>
                <v-icon name="plus-circle" />
                Generate Other Billing
              </template>
              <b-dropdown-item @click="setCreateOtherFee()"
                >Generate Other Billing</b-dropdown-item
              >
              <b-dropdown-item @click="setCreateBatchOtherFee()"
                >Batch Generate Other Billing</b-dropdown-item
              >
            </b-dropdown>
          </b-col>
          <b-col md="4">
            <b-form-input
              v-model="filters.billing.criteria"
              debounce="500"
              @update="loadBillings()"
              type="text"
              placeholder="Search"
            >
            </b-form-input>
          </b-col>
        </b-row> -->
        <b-table
          class="c-table"
          details-td-class="table-secondary"
          hover
          outlined
          small
          show-empty
          :fields="tables.billings.fields"
          :items="tables.billings.items"
          :busy="tables.billings.isBusy"
          responsive
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:row-details="{ item }">
            <b-card>
              <b-table
                outlined
                small
                show-empty
                :fields="tables.billingItems.fields"
                :items="item.billingItems"
                :busy="item.isLoading"
              >
                <template v-slot:table-busy>
                  <div class="text-center my-2">
                    <v-icon name="spinner" spin class="mr-2" />
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
            </b-card>
          </template>
          <template v-slot:cell(billingNo)="data">
            <BillColumn
              :data="data.item"
              :callback="{ loadDetails: () => previewBilling(data.item.id) }"
            />
          </template>
          <template v-slot:cell(name)="data">
            <StudentColumn
              :data="data.item"
              :callback="{ loadDetails: () => null }"
            />
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              boundary="window"
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click="setViewDetails(row)">
                <v-icon name="search" /> View Details
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.OtherBillingPermissions.EDIT.id) && !row.item.payments.lengt > 0"
                @click="$router.push({ name: 'Edit Other Billing', params: { billingId: row.item.id } })"
              >
                <v-icon name="pen" /> Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="
                  isAccessible($options.OtherBillingPermissions.DELETE.id)
                "
                @click="
                  (forms.billing.fields.id = row.item.id),
                    (showModalConfirmation = true)
                "
              >
                <v-icon name="trash" /> Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item.student.latestAcademicRecord" />
          </template>
          <template v-slot:cell(billingStatusId)="data">
            <OtherBillingStatusColumn :data="data.item" />
          </template>
        </b-table>
        <!-- <div class="d-flex">
          <div>
            Showing {{ paginations.billing.from }} to
            {{ paginations.billing.to }} of
            {{ paginations.billing.totalRows }} records.
          </div>
          <div class="ml-auto">
            <b-pagination
              class="c-pagination"
              v-model="paginations.billing.page"
              :total-rows="paginations.billing.totalRows"
              :per-page="paginations.billing.perPage"
              size="sm"
              align="end"
              @input="loadBillings()"
            />
          </div>
        </div> -->
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
      <Card v-if="showEntry" :title="`Other Billing Entry - ${entryMode}`">
        <b-overlay :show="forms.billing.isLoading">
          <!-- <b-row>
            <b-col md="6">
              <b-form-group>
                <label class="required">Student</label>
                <vue-bootstrap-typeahead
                  v-model="forms.billing.studentQuery"
                  :serializer="
                    (s) => {
                      return `${s.studentNo ? s.studentNo : 'N/A'} - ${s.name}`;
                    }
                  "
                  :data="options.students.items"
                  placeholder="Input student number or name"
                  ref="studentQuery"
                  @hit="
                    getStudentInfo($event), ($refs.studentQuery.inputValue = '')
                  "
                >
                  <template slot="suggestion" slot-scope="{ data }">
                    <span>{{
                      `${data.studentNo ? data.studentNo : 'N/A'} - ${data.name}`
                    }}</span>
                  </template>
                </vue-bootstrap-typeahead>
              </b-form-group>
            </b-col>
          </b-row> -->
          <b-row>
            <b-col md="6">
              <b-form-group
                :state="forms.billing.states.studentId"
                :invalid-feedback="forms.billing.errors.studentId">
                <label class="required">Student No.</label>
                <div class="search-container">
                  <SelectPaginated
                    class="select-paginated"
                    label='studentNo'
                    @input="getStudentInfo($event)"
                    :value="forms.billing.fields.student"
                    :fetchData="getStudentList"
                    :selectable="option => isSelectable(option)"
                  >
                    <template v-slot:selected-option="data">
                      <div class="select-option">
                        <div class="select-option__avatar">
                          <b-avatar v-if="data.name" variant="info" :src="getPhoto(data)" size="20px" />
                        </div>
                        <div class="d-flex w-100">
                          <span class="ml-2">{{ data.name }}</span>
                        </div>
                      </div>
                    </template>
                    <template slot="option" slot-scope="data">
                      <div class="select-option">
                        <div class="select-option__avatar">
                          <b-avatar variant="info" :src="getPhoto(data)"></b-avatar>
                        </div>
                        <div class="select-option__info">
                          <span>{{
                            data.studentNo ? data.studentNo : 'Awaiting Confirmation'
                          }}</span>
                          <span>{{ data.name }}</span>
                          <span>{{ data.email }}</span>
                        </div>
                        <div class="is-enrolled">
                          <b-badge v-if="isSelectable(data)" variant="success">Enrolled</b-badge>
                          <b-badge v-else variant="warning">Not Enrolled</b-badge>
                        </div>
                      </div>
                    </template>
                    <template slot="loader">
                      <b-spinner label="Loading..." class="loader"></b-spinner>
                    </template>
                  </SelectPaginated>
                </div>
                <!-- <b-form-input
                  disabled
                  v-model="forms.billing.fields.student.studentNo"
                /> -->
              </b-form-group>
              <!-- <b-form-group>
                <label>Name</label>
                <b-form-input
                  disabled
                  :state="forms.billing.states.studentId"
                  v-model="forms.billing.fields.student.name"
                />
                <b-form-invalid-feedback>
                  {{ forms.billing.errors.studentId }}
                </b-form-invalid-feedback>
              </b-form-group> -->
              <b-form-group>
                <label class="required">Due Date</label>
                <b-form-datepicker
                  :state="forms.billing.states.dueDate"
                  v-model="forms.billing.fields.dueDate"
                />
                <b-form-invalid-feedback>
                  {{ forms.billing.errors.dueDate }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group>
                <label>Level</label>
                <b-form-input
                  disabled
                  v-model="forms.billing.fields.student.levelName"
                />
              </b-form-group>
              <b-form-group v-if="forms.billing.fields.student.courseName">
                <label>Course</label>
                <b-form-input
                  disabled
                  v-model="forms.billing.fields.student.courseName"
                />
              </b-form-group>
              <b-form-group v-if="forms.billing.fields.student.semesterName">
                <label>Semester</label>
                <b-form-input
                  disabled
                  v-model="forms.billing.fields.student.semesterName"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col md="4">
              <h5 class="pt-2">OTHER FEES</h5>
            </b-col>
            <b-col md="4"> </b-col>
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
            details-td-class="table-secondary"
            hover
            outlined
            small
            show-empty
            :fields="tables.billingItems.fields"
            :items="forms.billing.fields.billingItems"
            :busy="tables.billingItems.isBusy"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="removeFee(row)" size="sm" variant="danger">
                <v-icon name="trash" />
              </b-button>
            </template>
            <template v-slot:cell(amount)="row">
              <vue-autonumeric
                v-model="row.item.amount"
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
            <template v-slot:custom-foot>
              <b-tr>
                <b-td colspan="2" class="text-right">
                  <span class="text-danger font-weight-bold">Total Amount </span>
                </b-td>
                <b-td class="text-right">
                  <span class="text-danger font-weight-bold">
                    {{ totalAmount }}
                  </span>
                </b-td>
                <b-td></b-td>
              </b-tr>
            </template>
          </b-table>
          <hr />
          <b-row>
            <b-col md="12">
              <b-button
                class="float-right btn-save ml-2"
                @click="showEntry = false"
                variant="dark"
              >
                Close
              </b-button>
              <b-button
                :disabled="forms.billing.isProcessing"
                class="float-right btn-save"
                @click="onBillingEntry()"
                variant="primary"
              >
                <v-icon
                  v-if="forms.billing.isProcessing"
                  name="sync"
                  spin
                  class="mr-2"
                />
                Generate
              </b-button>
            </b-col>
          </b-row>
        </b-overlay>
      </Card>
      <Card v-if="showBatchEntry" title="Other Billing Batch Entry">
        <b-row>
          <b-col md="6">
            <b-form-group>
              <label class="required">School Category</label>
              <b-form-select
                @input="forms.batchBilling.fields.levelId = null"
                v-model="forms.batchBilling.fields.schoolCategoryId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null"
                    >-- Select School Category --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="schoolCategory in $options.SchoolCategories.values"
                  :key="schoolCategory.id"
                  :value="schoolCategory.id"
                >
                  {{ schoolCategory.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <label class="required">Level</label>
              <b-form-select v-model="forms.batchBilling.fields.levelId">
                <template v-slot:first>
                  <b-form-select-option :value="null"
                    >-- ALL --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="level in options.levels.items.filter(
                    (l) =>
                      l.schoolCategoryId ===
                      forms.batchBilling.fields.schoolCategoryId
                  )"
                  :key="level.id"
                  :value="level.id"
                >
                  {{ level.name }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group>
              <label class="required">Due Date</label>
              <b-form-datepicker
                :state="forms.batchBilling.states.dueDate"
                v-model="forms.batchBilling.fields.dueDate"
              />
              <b-form-invalid-feedback>
                {{ forms.batchBilling.errors.dueDate }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              v-if="
                [
                  $options.SchoolCategories.COLLEGE.id,
                  $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
                  $options.SchoolCategories.VOCATIONAL.id,
                ].includes(forms.batchBilling.fields.schoolCategoryId)
              "
            >
              <label class="required">Course</label>
              <b-form-select v-model="forms.batchBilling.fields.courseId">
                <template v-slot:first>
                  <b-form-select-option :value="null"
                    >-- ALL --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="course in options.courses.items"
                  :key="course.id"
                  :value="course.id"
                >
                  {{
                    `${course.description} ${
                      course.major ? `- ${course.major}` : ''
                    }`
                  }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
            <b-form-group
              v-if="
                [
                  $options.SchoolCategories.COLLEGE.id,
                  $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
                  $options.SchoolCategories.VOCATIONAL.id,
                ].includes(forms.batchBilling.fields.schoolCategoryId)
              "
            >
              <label class="required">Semester</label>
              <b-form-select v-model="forms.batchBilling.fields.semesterId">
                <template v-slot:first>
                  <b-form-select-option :value="null"
                    >-- Select Semester --</b-form-select-option
                  >
                </template>
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
        <b-row class="mb-3">
          <b-col md="4">
            <h5 class="pt-2">OTHER FEES</h5>
          </b-col>
          <b-col md="4"> </b-col>
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
          details-td-class="table-secondary"
          hover
          outlined
          small
          show-empty
          :fields="tables.billingItems.fields"
          :items="forms.batchBilling.fields.billingItems"
          :busy="tables.billingItems.isBusy"
        >
          <template v-slot:cell(action)="row">
            <b-button @click="removeFee(row)" size="sm" variant="danger">
              <v-icon name="trash" />
            </b-button>
          </template>
          <template v-slot:cell(amount)="row">
            <vue-autonumeric
              v-model="row.item.amount"
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
          <template v-slot:custom-foot>
            <b-tr>
              <b-td colspan="2" class="text-right">
                <span class="text-danger font-weight-bold">Total Amount </span>
              </b-td>
              <b-td class="text-right">
                <span class="text-danger font-weight-bold">
                  {{ batchTotalAmount }}
                </span>
              </b-td>
              <b-td></b-td>
            </b-tr>
          </template>
        </b-table>
        <hr />
        <b-row>
          <b-col md="12">
            <b-button
              class="float-right btn-save ml-2"
              @click="showBatchEntry = false"
              variant="dark"
            >
              Close
            </b-button>
            <b-button
              :disabled="forms.batchBilling.isProcessing"
              class="float-right btn-save"
              @click="onBatchCreateBilling()"
              variant="primary"
            >
              <v-icon
                v-if="forms.batchBilling.isProcessing"
                name="sync"
                spin
                class="mr-2"
              />
              Generate
            </b-button>
          </b-col>
        </b-row>
      </Card>
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
                  @input="paginate()"
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
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Other Billing
        </div>
        Are you sure you want to delete this Other Billing?
        <div slot="modal-footer">
          <b-button
            :disabled="forms.billing.isProcessing"
            variant="primary"
            class="mr-2 btn-save"
            @click="onDeleteOtherBilling()"
          >
            <v-icon
              v-if="forms.billing.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Yes
          </b-button>
          <b-button
            variant="dark"
            class=""
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
     </template>
  </PageContent>
</template>
<script>
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import {
  SchoolCategories,
  Semesters,
  BillingStatuses,
  BillingTypes,
  OtherBillingPermissions,
  AcademicRecordStatuses
} from '../../helpers/enum';
import {
  TermApi,
  BillingApi,
  LevelApi,
  StudentApi,
  SchoolYearApi,
  AcademicRecordApi,
  SchoolFeeApi,
  CourseApi,
} from '../../mixins/api';
import {
  clearFields,
  formatNumber,
  reset,
  showNotification,
  validate,
} from '../../helpers/forms';
import debounce from 'lodash/debounce';
import tables from '../../helpers/tables';
import Card from '../components/Card';
import { copyValue } from '../../helpers/extractor';
import Access from '../../mixins/utils/Access';
import { StudentColumn, EducationColumn, BillColumn } from '../components/ColumnDetails';
import PageContent  from '../components/PageContainer/PageContent'
import NoAccess from "../components/NoAccess";
import SelectPaginated from '../components/SelectPaginated';
import OtherBillingStatusColumn from '../components/ColumnDetails/OtherBillingStatusColumn'

const billingFields = {
  id: null,
  student: {
    studentNo: null,
    name: null,
    levelName: null,
    courseName: null,
    semesterName: null,
  },
  semesterId: null,
  studentId: null,
  totalAmount: null,
  dueDate: null,
  billingItems: null,
};

const batchBillingFields = {
  schoolCategoryId: null,
  semesterId: null,
  dueDate: null,
  levelId: null,
  courseId: null,
  billingItems: null,
};

export default {
  components: {
    BillColumn,
    Card,
    StudentColumn,
    EducationColumn,
    PageContent,
    NoAccess,
    SelectPaginated,
    OtherBillingStatusColumn
  },
  mixins: [
    TermApi,
    BillingApi,
    LevelApi,
    StudentApi,
    SchoolYearApi,
    AcademicRecordApi,
    SchoolFeeApi,
    CourseApi,
    tables,
    Access,
  ],
  SchoolCategories,
  Semesters,
  BillingStatuses,
  OtherBillingPermissions,
  AcademicRecordStatuses,
  data() {
    return {
      isFilterVisible: true,
      showBatchEntry: false,
      showEntry: false,
      showModalFees: false,
      showModalConfirmation: false,
      entryMode: 'Add',
      tables: {
        billings: {
          isBusy: false,
          fields: [
            {
              key: 'billingNo',
              label: 'BILLING NO.',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'name',
              label: 'STUDENT',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            // {
            //   key: 'education',
            //   label: 'EDUCATION',
            //   tdClass: 'align-middle',
            //   thStyle: { width: '20%' },
            // },
            // {
            //   key: 'dueDate',
            //   label: 'DUE DATE',
            //   tdClass: 'align-middle',
            //   thStyle: { width: '130px' },
            // },

            {
              key: 'totalAmount',
              label: 'AMOUNT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: 'auto' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            // {
            //   key: 'billingStatusId',
            //   label: 'STATUS',
            //   tdClass: 'align-middle text-center',
            //   thClass: 'text-center',
            //   thStyle: { width: '10%' },
            // },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
        billingItems: {
          isBusy: false,
          fields: [
            {
              key: 'schoolFee.name',
              label: 'FEE NAME',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'schoolFee.description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'amount',
              label: 'AMOUNT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: 'auto' },
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
      forms: {
        batchBilling: {
          isProcessing: false,
          fields: { ...batchBillingFields },
          states: { ...batchBillingFields },
          errors: { ...batchBillingFields },
        },
        billing: {
          isProcessing: false,
          isLoading: false,
          studentQuery: null,
          fields: { ...billingFields },
          states: { ...billingFields },
          errors: { ...billingFields },
        },
      },
      paginations: {
        billing: {
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
        billing: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          billingStatusId: this.$options.BillingStatuses.UNPAID.id,
          billingStatusItem: this.$options.BillingStatuses.UNPAID,
        },
        fee: {
          criteria: null,
        },
      },
      options: {
        levels: {
          items: [],
        },
        courses: {
          items: [],
        },
        students: {
          isLoading: false,
          items: [],
        },
      },
      activeSchoolYear: [],
    };
  },
  created() {
    const { billing } = this.filters
    if (!this.checkIfSuperUser()) {
      billing.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      billing.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }

    this.loadBillings();
    this.loadLevels();
    this.loadActiveSchoolYear();
    this.loadFees();
    this.loadCourses();
  },
  methods: {
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
    loadBillings() {
      const {
        schoolCategoryId,
        criteria,
        billingStatusId,
      } = this.filters.billing;
      const { billings } = this.tables;
      const {
        billing,
        billing: { perPage, page },
      } = this.paginations;
      const orderBy = 'created_at';
      const sort = 'DESC';
      const params = {
        paginate: true,
        schoolCategoryId,
        criteria,
        perPage,
        page,
        billingStatusId,
        billingTypeId: BillingTypes.BILLING.id,
        schoolYearId: this.$store.state.schoolYear.id,
        orderBy,
        sort,
      };

      billings.isBusy = true;
      this.getBillingList(params).then(({ data }) => {
        billings.items = data.data;
        billing.from = data.meta.from;
        billing.to = data.meta.to;
        billing.totalRows = data.meta.total;
        billings.isBusy = false;
      });
    },
    loadLevels() {
      const { levels } = this.options;
      this.getLevelList({ paginate: false }).then(({ data }) => {
        levels.items = data;
      });
    },
    loadCourses() {
      const { courses } = this.options;
      this.getCourseList({ paginate: false }).then(({ data }) => {
        courses.items = data;
      });
    },
    loadStudents() {
      const { students } = this.options;
      const { studentQuery } = this.forms.billing;
      const params = {
        paginate: false,
        criteria: studentQuery,
      };
      this.getStudentList(params).then(({ data }) => {
        students.items = data;
      });
    },
    loadActiveSchoolYear() {
      const params = {
        paginate: false,
        isActive: 1,
      };
      this.getSchoolYearList(params).then(({ data }) => {
        if (data) {
          this.activeSchoolYear = data[0];
        }
      });
    },
    onBatchCreateBilling() {
      const {
        batchBilling,
        batchBilling: {
          fields: { student, billingItems: items, ...fields },
        },
      } = this.forms;
      batchBilling.isProcessing = true;
      const billingItems = items.map((i) => {
        return {
          schoolFeeId: i.schoolFeeId,
          amount: i.amount,
        };
      });
      const data = {
        ...fields,
        billingItems,
        schoolYearId: this.activeSchoolYear.id,
        billingStatusId: BillingStatuses.UNPAID.id,
        billingTypeId: BillingTypes.BILLING.id,
      };
      reset(batchBilling);
      this.batchOtherBilling(data)
        .then(({ data }) => {
          batchBilling.isProcessing = false;
          this.loadBillings();
          showNotification(
            this,
            'success',
            'Batch Other Billing successfully created.'
          );
          this.showBatchEntry = false;
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          batchBilling.isProcessing = false;
          validate(batchBilling, errors, this);
        });
    },
    onBillingEntry() {
      const {
        billing,
        billing: {
          fields: { student, billingItems: items, ...fields },
        },
      } = this.forms;
      billing.isProcessing = true;
      const billingItems = items.map((i) => {
        return {
          schoolFeeId: i.schoolFeeId,
          amount: i.amount,
        };
      });
      const data = {
        ...fields,
        billingItems,
        schoolYearId: this.activeSchoolYear.id,
        billingStatusId: BillingStatuses.UNPAID.id,
        billingTypeId: BillingTypes.BILLING.id,
      };
      reset(billing);
      if (this.entryMode === 'Add') {
        this.addBilling(data)
          .then(({ data }) => {
            billing.isProcessing = false;
            this.loadBillings();
            showNotification(
              this,
              'success',
              'Other Billing successfully created.'
            );
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            billing.isProcessing = false;
            validate(billing, errors, this);
          });
      } else {
        this.updateBilling(data, fields.id)
          .then(({ data }) => {
            billing.isProcessing = false;
            this.loadBillings();
            showNotification(
              this,
              'success',
              'Other Billing successfully updated.'
            );
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            billing.isProcessing = false;
            validate(billing, errors, this);
          });
      }
    },
    onDeleteOtherBilling() {
      const {
        billing,
        billing: {
          fields: { id },
        },
      } = this.forms;
      billing.isProcessing = true;
      this.deleteBilling(id).then(({ data }) => {
        billing.isProcessing = false;
        this.loadBillings();
        showNotification(
          this,
          'success',
          'Other Billing deleted successfully.'
        );
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
    getStudentInfo(student) {
      const {
        billing,
        billing: { fields },
      } = this.forms;
      fields.studentId = student.id;
      fields.student.studentNo = student.studentNo;
      fields.student.name = student.name;
      fields.semesterId = student.latestAcademicRecord?.semesterId;
      billing.studentQuery = null;
      if (student.latestAcademicRecord) {
        this.getAcademicRecord(student.latestAcademicRecord.id).then(
          ({ data }) => {
            fields.student.levelName = data.level.name;
            fields.student.courseName = data.course.name;
            fields.student.semesterName = data.semester.name;
          }
        );
      } else {
        fields.student.levelName = null;
        fields.student.courseName = null;
        fields.student.semesterName = null;
      }
    },
    setCreateOtherFee() {
      const {
        billing,
        billing: { fields },
      } = this.forms;
      reset(billing);
      clearFields(fields);
      fields.billingItems = [];
      // fields.termId = null
      this.showEntry = true;
    },
    setUpdateOtherFee(id) {
      const {
        billing,
        billing: { fields },
      } = this.forms;
      reset(billing);
      clearFields(fields);
      fields.billingItems = [];
      this.showEntry = true;
      this.entryMode = 'Edit';
      billing.isLoading = true;
      this.getBilling(id).then(({ data }) => {
        const { student, ...fieldKeys } = fields;
        copyValue(data, fields, Object.keys(fieldKeys));
        this.getStudentInfo(data.student);
        billing.isLoading = false;
      });
    },
    setCreateBatchOtherFee() {
      const {
        batchBilling,
        batchBilling: { fields },
      } = this.forms;
      reset(batchBilling);
      clearFields(fields);
      fields.semesterId = null;
      fields.levelId = null;
      fields.courseId = null;
      fields.schoolCategoryId = null;
      fields.billingItems = [];
      this.showBatchEntry = true;
    },
    setViewDetails(row) {
      if (!row.detailsShowing) {
        const {
          item,
          item: { id },
        } = row;
        this.$set(item, 'isLoading', true);
        this.getBilling(id).then(({ data }) => {
          this.$set(item, 'billingItems', data.billingItems);
          item.isLoading = false;
        });
      }
      row.toggleDetails();
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
    addFee(row) {
      const { item } = row;
      let form = 'billing';
      if (this.showBatchEntry) {
        form = 'batchBilling';
      }
      const { billingItems } = this.forms[form].fields;
      const result = billingItems.find((fee) => fee.id === item.id);

      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      billingItems.push({
        schoolFeeId: row.item.id,
        schoolFee: { name: row.item.name, description: row.item.description },
        amount: 0.0,
      });
    },
    removeFee(row) {
      let form = 'billing';
      if (this.showBatchEntry) {
        form = 'batchBilling';
      }
      const { billingItems } = this.forms[form].fields;
      billingItems.splice(row.index, 1);
    },
    onCategoryFilterChange(item) {
      const { billing } = this.filters;
      billing.schoolCategoryId = item?.id || 0;
      billing.schoolCategoryItem = item;
      this.loadBillings();
    },
    onStatusFilterChange(item) {
      const { billing } = this.filters;
      billing.billingStatusId = item?.id || 0;
      billing.billingStatusItem = item;
      this.loadBillings();
    },
    isSelectable(student) {
      return student?.latestAcademicRecord?.academicRecordStatusId === this.$options.AcademicRecordStatuses.ENROLLED.id
    }
  },
  computed: {
    totalAmount() {
      const {
        fields,
        fields: { billingItems },
      } = this.forms.billing;
      fields.totalAmount = 0;
      billingItems.map((i) => (fields.totalAmount += i.amount));
      return formatNumber(fields.totalAmount);
    },
    batchTotalAmount() {
      const {
        fields,
        fields: { billingItems },
      } = this.forms.batchBilling;
      fields.totalAmount = 0;
      billingItems.map((i) => (fields.totalAmount += i.amount));
      return formatNumber(fields.totalAmount);
    },
  },
  watch: {
    'forms.billing.studentQuery': debounce(function() {
      this.loadStudents();
    }, 500),
    '$store.state.schoolYear': function(newVal) {
      this.loadBillings();
    },
  },
};
</script>

<style lang="scss">
@import '../../assets/scss/_shared.scss';

  .drop-down__container {
    display: flex;
    align-items: center;
  }

  .other__drop-down {
    height: 24px;

    .btn-primary {
      display: flex!important;
      align-items: center!important;
    }
  }

  .search-container {
    display: flex;
    align-items: center;
    width: 100%;

    .select-paginated {
      width: 100%;

      @include for-size(phone-only) {
        width: 100%;
      }
      .select-option {
        display: flex;
        justify-content: center;
        align-items: center;

        .select-option__avatar {
          width: auto;
        }

        .select-option__info {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
