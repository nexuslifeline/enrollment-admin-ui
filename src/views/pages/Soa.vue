<template>
  <PageContent
    title="Statement of Account"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadBillings()"
    :filterVisible="isFilterVisible"
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
      <div class="ml-1 drop-down__container" >
         <b-dropdown
          v-if="isAccessible($options.StatementOfAccountPermissions.GENERATE.id)"
          text="Generate"
          variant="outline-primary"
          split-variant="outline-primary"
          class="soa__drop-down"
          split>
          <b-dropdown-item
            @click="$router.push({ name: 'Individual SOA'})">
            Individual SOA
          </b-dropdown-item>
          <b-dropdown-item @click="$router.push({ name: 'Batch SOA'})">
            Batch SOA
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
    <template v-slot:content>
    <div v-if="checkIfHasSchoolCategoryAccess()" >
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
              isAccessible($options.StatementOfAccountPermissions.GENERATE.id)
            "
            variant="primary"
          >
            <template v-slot:button-content>
              <v-icon name="plus-circle" />
              Generate SOA
            </template>
            <b-dropdown-item @click="setCreateSoa()"
              >Generate Single SOA</b-dropdown-item
            >
            <b-dropdown-item @click="setCreateBatchSoa()"
              >Generate Batch SOA</b-dropdown-item
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
        responsive
        :fields="tables.billings.fields"
        :items="tables.billings.items"
        :busy="tables.billings.isBusy"
      >
        <template v-slot:table-busy>
          <div class="text-center my-2">
            <v-icon name="spinner" spin class="mr-2" />
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(name)="data">
          <StudentColumn
            :data="data.item"
            :callback="{ loadDetails: () => previewBilling(data.item.id) }"
          />
        </template>
        <template v-slot:cell(education)="data">
          <EducationColumn :data="data.item.student.latestAcademicRecord" />
        </template>
        <template v-slot:cell(billingStatusId)="{ value }">
          <b-badge
            :variant="
              value === $options.BillingStatuses.UNPAID.id
                ? 'danger'
                : 'success'
            "
          >
            {{ $options.BillingStatuses.getEnum(value).name }}
          </b-badge>
        </template>
        <template v-slot:cell(action)="{ item: { id } }">
          <b-dropdown
            v-if="
              isAccessible([
                $options.StatementOfAccountPermissions.PREVIEW.id,
                $options.StatementOfAccountPermissions.EDIT.id,
                $options.StatementOfAccountPermissions.DELETE.id,
              ])
            "
            boundary="window"
            right
            variant="link"
            toggle-class="text-decoration-none"
            no-caret
          >
            <template v-slot:button-content>
              <v-icon name="ellipsis-v" />
            </template>
            <b-dropdown-item
              v-if="isAccessible($options.StatementOfAccountPermissions.PREVIEW.id)"
              @click="previewBilling(id)">
              <v-icon name="file-pdf" /> Preview
            </b-dropdown-item>
            <!-- <b-dropdown-item
              v-if="
                isAccessible($options.StatementOfAccountPermissions.EDIT.id)
              "
              @click="setUpdateSoa(id)"
            >
              <v-icon name="pen" /> Edit
            </b-dropdown-item> -->
            <b-dropdown-item
              v-if="isAccessible($options.StatementOfAccountPermissions.DELETE.id)"
              @click="(forms.billing.fields.id = id), (showModalConfirmation = true)">
              <v-icon name="trash" /> Delete
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
      <b-row>
        <b-col md="6">
          Showing {{ paginations.billing.from }} to
          {{ paginations.billing.to }} of
          {{ paginations.billing.totalRows }} records.
        </b-col>
        <b-col md="6">
          <b-pagination
            class="c-pagination"
            v-model="paginations.billing.page"
            :total-rows="paginations.billing.totalRows"
            :per-page="paginations.billing.perPage"
            size="sm"
            align="end"
            @input="loadBillings()"
          />
        </b-col>
      </b-row>
    </div>
    <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>

    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Delete SOA
      </div>
      Are you sure you want to delete this SOA?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.billing.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onDeleteSoa()"
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
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation = false"
        >
          No
        </b-button>
      </div>
    </b-modal>
    <FileViewer
      :show="fileViewer.show"
      :file="file"
      :owner="file.owner"
      :isBusy="file.isLoading"
      @close="fileViewer.show = false"/>
    </template>
  </PageContent>
</template>
<script>
import FileViewer from '../components/FileViewer';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import SelectPaginated from '../components/SelectPaginated';
import {
  SchoolCategories,
  Semesters,
  BillingStatuses,
  BillingTypes,
  StatementOfAccountPermissions,
  AcademicRecordStatuses
} from '../../helpers/enum';
import {
  TermApi,
  BillingApi,
  LevelApi,
  StudentApi,
  SchoolYearApi,
  AcademicRecordApi,
  ReportApi,
  SchoolFeeApi,
} from '../../mixins/api';
import { StudentColumn, EducationColumn } from '../components/ColumnDetails';
import {
  clearFields,
  formatNumber,
  reset,
  showNotification,
  validate,
} from '../../helpers/forms';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import Card from '../components/Card';
import debounce from 'lodash/debounce';
import tables from '../../helpers/tables';
import { copyValue } from '../../helpers/extractor';
import Access from '../../mixins/utils/Access';
import PageContent from "../components/PageContainer/PageContent";
import NoAccess from '../components/NoAccess';
import SelectedOption from '../components/DropdownSlots/SelectedOption';
import ProfileMaker from '../components/ProfileMaker.vue';

// const billingFields = {
//   id: null,
//   student: {
//     studentNo: null,
//     name: null,
//     levelName: null,
//     courseName: null,
//     semesterName: null,
//   },
//   billingItems: null,
//   semesterId: null,
//   studentId: null,
//   studentFeeId: null,
//   termId: null,
//   previousBalance: null,
//   amount: null,
//   totalAmount: null,
//   dueDate: null,
// };

// const batchBillingFields = {
//   schoolCategoryId: null,
//   semesterId: null,
//   dueDate: null,
//   levelId: null,
//   termId: null,
//   billingItems: null,
// };

export default {
  components: {
    SchoolCategoryTabs,
    VueBootstrapTypeahead,
    Card,
    FileViewer,
    StudentColumn,
    EducationColumn,
    PageContent,
    NoAccess,
    SelectPaginated,
    SelectedOption,
    ProfileMaker
  },
  mixins: [
    TermApi,
    BillingApi,
    LevelApi,
    StudentApi,
    SchoolYearApi,
    AcademicRecordApi,
    ReportApi,
    SchoolFeeApi,
    tables,
    Access,
  ],
  SchoolCategories,
  Semesters,
  BillingStatuses,
  StatementOfAccountPermissions,
  AcademicRecordStatuses,
  data() {
    return {
      isFilterVisible: true,
      formatNumber: formatNumber,
      fileViewer: {
        isActiveNavEnabled: false,
        activeNavCount: 0,
        activeNavIndex: 0,
        show: false,
      },
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      // showBatchEntry: false,
      // showEntry: false,
      // showModalFees: false,
      showModalConfirmation: false,
      // entryMode: 'Add',
      tables: {
        billings: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Student',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            // {
            //   key: 'education',
            //   label: 'EDUCATION',
            //   tdClass: 'align-middle',
            //   thClass: 'align-middle',
            //   thStyle: { width: '20%' },
            // },
            {
              key: 'dueDate',
              label: 'Due Date',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '130px' },
            },
            {
              key: 'billingNo',
              label: 'BILLING NO.',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'previousBalance',
              label: 'Previous',
              tdClass: 'align-middle text-right',
              thClass: 'text-right align-middle',
              thStyle: { width: 'auto' },
             formatter: (value) => formatNumber(value)
            },
            {
              key: 'totalAmount',
              label: 'Current',
              tdClass: 'align-middle text-right',
              thClass: 'text-right align-middle',
              thStyle: { width: 'auto' },
              formatter: (value) => formatNumber(value)
            },
            {
              key: 'totalAmountDue',
              label: 'Total Due',
              tdClass: 'align-middle text-right',
              thClass: 'text-right align-middle',
              thStyle: { width: 'auto' },
              formatter: (value) => formatNumber(value)
            },
            {
              key: 'billingStatusId',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center aling-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
        // billingItems: {
        //   isBusy: false,
        //   fields: [
        //     {
        //       key: 'schoolFee.name',
        //       label: 'FEE NAME',
        //       tdClass: 'align-middle',
        //       thStyle: { width: 'auto' },
        //     },
        //     {
        //       key: 'schoolFee.description',
        //       label: 'DESCRIPTION',
        //       tdClass: 'align-middle',
        //       thStyle: { width: '40%' },
        //     },
        //     {
        //       key: 'amount',
        //       label: 'AMOUNT',
        //       tdClass: 'align-middle text-right',
        //       thClass: 'text-right',
        //       thStyle: { width: 'auto' },
        //     },
        //     {
        //       key: 'action',
        //       label: '',
        //       tdClass: 'align-middle text-right',
        //       thClass: 'text-right',
        //       thStyle: { width: '5px' },
        //     },
        //   ],
        // },
        // fees: {
        //   fields: [
        //     {
        //       key: 'name',
        //       label: 'NAME',
        //       tdClass: 'align-middle',
        //       thStyle: { width: '30%' },
        //     },
        //     {
        //       key: 'description',
        //       label: 'Description',
        //       tdClass: 'align-middle',
        //       thStyle: { width: '40%' },
        //     },
        //     {
        //       key: 'action',
        //       label: '',
        //       tdClass: 'align-middle text-right',
        //       thClass: 'text-right',
        //       thStyle: { width: '30%' },
        //     },
        //   ],
        //   items: [],
        // },
      },
      forms: {
        batchBilling: {
          isProcessing: false,
          fields: { id: null },
          // states: { ...batchBillingFields },
          // errors: { ...batchBillingFields },
        },
        billing: {
          isProcessing: false,
          // studentQuery: null,
          // isLoading: false,
          fields: { id: null },
          // states: { ...billingFields },
          // errors: { ...billingFields },
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
        // fee: {
        //   from: 0,
        //   to: 0,
        //   totalRows: 0,
        //   page: 1,
        //   perPage: 10,
        // },
      },
      filters: {
        billing: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          billingStatusId: this.$options.BillingStatuses.UNPAID.id,
          billingStatusItem: this.$options.BillingStatuses.UNPAID,
        },
        // fee: {
        //   criteria: null,
        // },
      },
      // options: {
      //   terms: {
      //     isLoading: false,
      //     items: [],
      //   },
      //   levels: {
      //     items: [],
      //   },
      //   students: {
      //     isLoading: false,
      //     items: [],
      //   },
      // },
      // activeSchoolYear: [],
      // showOtherFees: false,
    };
  },
  created() {
    // const { billing } = this.filters
    // if (!this.checkIfSuperUser()) {
    //   billing.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
    //   billing.schoolCategoryItem =  this.getDefaultSchoolCategory()
    // }

    this.loadBillings();
    // this.loadLevels();
    // this.loadFees();
    // this.loadActiveSchoolYear();
  },
  methods: {
    // move to utils
    // getPhoto(option) {
    //   const photo = (option && option.photo && option.photo.hashName) || '';
    //   return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    // },
    loadBillings() {
      if (!this.$store.state?.schoolYear?.id) {
        console.warn('No selected School Year found!');
        return;
      }

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
        billingTypeId: BillingTypes.SOA.id,
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
    // loadFees() {
    //   const { fees } = this.tables;
    //   const { fee } = this.paginations;
    //   const params = { paginate: false };
    //   fees.isBusy = true;
    //   this.getSchoolFeeList(params).then(({ data }) => {
    //     fees.items = data;
    //     fee.totalRows = data.length;
    //     this.paginate(fee);
    //     fees.isBusy = false;
    //   });
    // },
    // addFee(row) {
    //   const { item } = row;
    //   let form = 'billing';
    //   if (this.showBatchEntry) {
    //     form = 'batchBilling';
    //   }
    //   const { billingItems } = this.forms[form].fields;
    //   const result = billingItems.find((fee) => fee.id === item.id);

    //   if (result) {
    //     showNotification(this, 'danger', item.name + ' is already added.');
    //     return;
    //   }
    //   billingItems.push({
    //     schoolFeeId: row.item.id,
    //     schoolFee: { name: row.item.name, description: row.item.description },
    //     amount: 0.0,
    //   });
    // },
    // removeFee(row) {
    //   let form = 'billing';
    //   if (this.showBatchEntry) {
    //     form = 'batchBilling';
    //   }
    //   const { billingItems } = this.forms[form].fields;
    //   billingItems.splice(row.index, 1);
    // },
    // loadLevels() {
    //   const { levels } = this.options;
    //   this.getLevelList({ paginate: false }).then(({ data }) => {
    //     levels.items = data;
    //   });
    // },
    // loadTerms() {
    //   const { schoolCategoryId, semesterId } = this.forms.batchBilling.fields;
    //   const {
    //     COLLEGE,
    //     SENIOR_HIGH_SCHOOL,
    //     VOCATIONAL,
    //   } = this.$options.SchoolCategories;
    //   if (
    //     [COLLEGE.id, SENIOR_HIGH_SCHOOL.id, VOCATIONAL.id].includes(
    //       schoolCategoryId
    //     ) &&
    //     !semesterId
    //   ) {
    //     return;
    //   }
    //   const { terms } = this.options;
    //   const params = {
    //     paginate: false,
    //     schoolCategoryId,
    //     semesterId,
    //     activeSchoolYear: true,
    //   };
    //   terms.isLoading = true;
    //   this.getTermList(params).then(({ data }) => {
    //     terms.items = data;
    //     terms.isLoading = false;
    //   });
    // },
    // loadStudents() {
    //   const { students } = this.options;
    //   const { studentQuery } = this.forms.billing;
    //   const params = {
    //     paginate: false,
    //     criteria: studentQuery,
    //   };
    //   this.getStudentList(params).then(({ data }) => {
    //     students.items = data;
    //   });
    // },
    // loadActiveSchoolYear() {
    //   const params = {
    //     paginate: false,
    //     isActive: 1,
    //   };
    //   this.getSchoolYearList(params).then(({ data }) => {
    //     if (data) {
    //       this.activeSchoolYear = data[0];
    //     }
    //   });
    // },
    // loadStudentFeeTerms() {
    //   const { studentId, semesterId } = this.forms.billing.fields;
    //   const { terms } = this.options;
    //   const params = {
    //     schoolYearId: this.activeSchoolYear.id,
    //     semesterId,
    //     paginate: false,
    //   };
    //   terms.isLoading = true;
    //   this.getStudentBillingTerms(studentId, params).then(({ data }) => {
    //     terms.items = data;
    //     terms.isLoading = false;
    //     this.getTermInfo();
    //   });
    // },
    // onBatchCreateSoa() {
    //   const {
    //     batchBilling,
    //     batchBilling: {
    //       fields,
    //       fields: { billingItems: items, dueDate, termId, levelId },
    //     },
    //   } = this.forms;
    //   const billingItems = items.map((i) => {
    //     return {
    //       schoolFeeId: i.schoolFeeId,
    //       amount: i.amount,
    //     };
    //   });
    //   batchBilling.isProcessing = true;
    //   reset(batchBilling);
    //   this.batchSoaBilling({ termId, dueDate, levelId, billingItems })
    //     .then(({ data }) => {
    //       batchBilling.isProcessing = false;
    //       this.loadBillings();
    //       showNotification(this, 'success', 'Batch SOA successfully created.');
    //       this.showBatchEntry = false;
    //     })
    //     .catch((error) => {
    //       const errors = error.response.data.errors;
    //       batchBilling.isProcessing = false;
    //       validate(batchBilling, errors, this);
    //     });
    // },
    // onSaveSoa() {
    //   const {
    //     billing,
    //     billing: {
    //       fields: { student, billingItems: items, amount, ...fields },
    //     },
    //   } = this.forms;
    //   billing.isProcessing = true;
    //   const billingItems = items.map((i) => {
    //     return {
    //       schoolFeeId: i.schoolFeeId,
    //       amount: i.amount,
    //     };
    //   });
    //   billingItems.push({
    //     termId: fields.termId,
    //     amount,
    //   });
    //   const data = {
    //     ...fields,
    //     billingItems,
    //     schoolYearId: this.activeSchoolYear.id,
    //     billingStatusId: BillingStatuses.UNPAID.id,
    //     billingTypeId: BillingTypes.SOA.id,
    //   };
    //   reset(billing);
    //   if (this.entryMode === 'Add') {
    //     this.addBilling(data)
    //       .then(({ data }) => {
    //         billing.isProcessing = false;
    //         this.loadBillings();
    //         showNotification(this, 'success', 'SOA successfully created.');
    //         this.showEntry = false;
    //       })
    //       .catch((error) => {
    //         const errors = error.response.data.errors;
    //         billing.isProcessing = false;
    //         validate(billing, errors, this);
    //       });
    //   } else {
    //     this.updateBilling(data, fields.id)
    //       .then(({ data }) => {
    //         billing.isProcessing = false;
    //         this.loadBillings();
    //         showNotification(this, 'success', 'SOA successfully updated.');
    //         this.showEntry = false;
    //       })
    //       .catch((error) => {
    //         const errors = error.response.data.errors;
    //         billing.isProcessing = false;
    //         validate(billing, errors, this);
    //       });
    //   }
    // },
    onDeleteSoa() {
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
        showNotification(this, 'success', 'SOA deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    // avatar(student) {
    //   let src = '';
    //   if (student.photo) {
    //     src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
    //   }
    //   return src;
    // },
    // getStudentInfo(student) {
    //   const {
    //     billing,
    //     billing: { fields },
    //   } = this.forms;
    //   fields.studentId = student.id;
    //   fields.student.studentNo = student.studentNo;
    //   fields.student.name = student.name;
    //   fields.semesterId = student.latestAcademicRecord?.semesterId;
    //   billing.studentQuery = null;
    //   this.loadStudentFeeTerms();
    //   if (student.latestAcademicRecord) {
    //     this.getAcademicRecord(student.latestAcademicRecord.id).then(
    //       ({ data }) => {
    //         fields.student.levelName = data.level.name;
    //         fields.student.courseName = data.course.name;
    //         fields.student.semesterName = data.semester.name;
    //       }
    //     );
    //   } else {
    //     fields.student.levelName = null;
    //     fields.student.courseName = null;
    //     fields.student.semesterName = null;
    //   }
    // },
    // getTermInfo() {
    //   const {
    //     fields,
    //     fields: { termId },
    //   } = this.forms.billing;
    //   const { terms } = this.options;
    //   const term = terms.items.find((t) => t.id === termId);
    //   if (term) {
    //     if (this.entryMode === 'Add') {
    //       fields.previousBalance = term.previousBalance;
    //     }
    //     fields.amount = term.pivot.amount;
    //     fields.studentFeeId = term.pivot.studentFeeId;
    //   }
    // },
    // setCreateSoa() {
    //   this.entryMode = 'Add';
    //   const {
    //     billing,
    //     billing: { fields },
    //   } = this.forms;
    //   reset(billing);
    //   clearFields(fields);
    //   fields.termId = null;
    //   fields.billingItems = [];
    //   this.options.terms.items = [];
    //   this.showEntry = true;
    //   this.showOtherFees = false;
    // },
    // setUpdateSoa(id) {
    //   const {
    //     billing,
    //     billing: { fields },
    //   } = this.forms;
    //   reset(billing);
    //   clearFields(fields);
    //   this.showEntry = true;
    //   this.showOtherFees = false;
    //   this.entryMode = 'Edit';
    //   fields.billingItems = [];
    //   billing.isLoading = true;
    //   this.getBilling(id).then(({ data }) => {
    //     fields.id = data.id;
    //     fields.dueDate = data.dueDate;
    //     fields.billingItems = data.billingItems.filter(
    //       (b) => b.termId === null
    //     );
    //     fields.previousBalance = data.previousBalance;
    //     this.getStudentInfo(data.student);
    //     fields.termId = data.termId;
    //     billing.isLoading = false;
    //   });
    // },
    // setCreateBatchSoa() {
    //   const {
    //     batchBilling,
    //     batchBilling: { fields },
    //   } = this.forms;
    //   reset(batchBilling);
    //   clearFields(fields);
    //   fields.semesterId = null;
    //   fields.levelId = null;
    //   fields.schoolCategoryId = null;
    //   fields.termId = null;
    //   fields.billingItems = [];
    //   this.showBatchEntry = true;
    //   this.showOtherFees = false;
    // },
    previewBilling(id) {
      this.file.type = null;
      this.file.src = null;
      this.fileViewer.show = true;
      this.file.isLoading = true;
      this.file.name = 'Statement of Account';
      this.previewStatementOfAccount(id).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
      });
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
    // isSelectable(student) {
    //   return student?.latestAcademicRecord?.academicRecordStatusId === this.$options.AcademicRecordStatuses.ENROLLED.id
    // }
  },
  watch: {
    // 'forms.billing.studentQuery': debounce(function() {
    //   this.loadStudents();
    // }, 500),
    '$store.state.schoolYear': function(newVal) {
      this.loadBillings();
    },
  },
  computed: {
    // totalAmount() {
    //   const {
    //     fields,
    //     fields: { billingItems },
    //   } = this.forms.billing;
    //   let amount = 0;
    //   billingItems.map((i) => (amount += i.amount));
    //   fields.totalAmount = Number(fields.amount) + amount;
    //   return formatNumber(amount);
    // },
    // batchTotalAmount() {
    //   const {
    //     fields,
    //     fields: { billingItems },
    //   } = this.forms.batchBilling;
    //   let amount = 0;
    //   billingItems.map((i) => (amount += i.amount));
    //   return formatNumber(amount);
    // },
  },
};
</script>

<style lang="scss" >
@import '../../assets/scss/_shared.scss';

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
        position: relative;

        .select-option__avatar {
          width: auto;
        }

        .select-option__info {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
        }

        .is-enrolled {
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
    }
  }

  .drop-down__container {
    display: flex;
    align-items: center;
  }

  .soa__drop-down {
    height: 24px;

    .btn-outline-primary {
      display: flex;
      align-items: center;
    }
  }
</style>