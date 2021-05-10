<template>
  <div class="payment-list__container">
    <b-overlay :show="isLoading" rounded="sm">
      <div class="page-content__title-container">
        <h4 class="page-content__title">Payment Entry</h4>
      </div>
      <div class="search-container">
        <!-- <b-form-input :value="selectedStudent ? selectedStudent.studentNo : ''"/> -->
        <SelectPaginated
          class="select-paginated"
          @input="getStudentInfo($event)"
          :fetchData="getStudentList"
        >
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
            </div>
          </template>
          <template slot="loader">
            <b-spinner label="Loading..." class="loader"></b-spinner>
          </template>
        </SelectPaginated>
      </div>
      <div class="payment-entry__body">
        <div class="payment-entry__top-pane">
          <div class="payment-details">
            <!-- <h5>STUDENT DETAILS</h5> -->
            <div class="student-no-container">
              <b-form-group
                label="Student No"
                class="student-no"
                label-class="required"
              >
                <b-form-input
                  disabled
                  :value="
                    selectedStudent
                      ? selectedStudent.studentNo || 'Awaiting Confirmation'
                      : ''
                  "
                />
              </b-form-group>
              <!-- <b-button class="student-browse" variant="outline-primary" @click="onShowModalStudent">...</b-button> -->
            </div>
            <b-form-group label="Student">
              <b-form-input
                disabled
                :value="selectedStudent ? selectedStudent.name : ''"
                :state="forms.payment.states.studentId"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.studentId }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Address">
              <b-form-textarea
                rows="3"
                disabled
                :value="selectedStudent ? selectedStudent.currentAddress : ''"
              />
            </b-form-group>
          </div>
          <div class="payment-details">
            <!-- <h5>PAYMENT DETAILS</h5> -->
            <!-- <b-form-group
              label="Transaction No"
              label-class="required" >
              <b-form-input
                v-model="forms.payment.fields.transactionNo"
                :state="forms.payment.states.transactionNo"/>
              <b-form-invalid-feedback>
                {{ forms.payment.errors.transactionNo }}
              </b-form-invalid-feedback>
            </b-form-group> -->
            <b-form-group label="Reference No" label-class="required">
              <b-form-input
                v-model="forms.payment.fields.referenceNo"
                :state="forms.payment.states.referenceNo"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.referenceNo }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Payment Mode" label-class="required">
              <b-form-select
                v-model="forms.payment.fields.paymentModeId"
                :state="forms.payment.states.paymentModeId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null"
                    >-- N/A --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="paymentMode in options.paymentModes.items"
                  :key="paymentMode.id"
                  :value="paymentMode.id"
                >
                  {{ paymentMode.name }}
                </b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                {{ forms.payment.errors.paymentModeId }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Payment Date" label-class="required">
              <b-form-datepicker
                v-model="forms.payment.fields.datePaid"
                :state="forms.payment.states.datePaid"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.datePaid }}
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div class="payment-details">
            <b-form-group label="Amount Tendered" label-class="required">
              <vue-autonumeric
                ref="totalAmount"
                v-model="forms.payment.fields.amount"
                :state="forms.payment.states.amount"
                class="form-control text-right"
                :class="
                  forms.payment.states.amount === false ? 'is-invalid' : ''
                "
                debounce="500"
                :options="[
                  {
                    minimumValue: 0,
                    modifyValueOnWheel: false,
                    emptyInputBehavior: 0,
                  },
                ]"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.amount }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Notes">
              <b-form-textarea
                rows="3"
                v-model="forms.payment.fields.notes"
                :state="forms.payment.states.notes"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.notes }}
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="payment-entry__bottom-pane">
          <h5>Current Billings</h5>
          <p>Please select a billing to pay.</p>
          <p>
            <small
              v-show="forms.payment.states.billingId === false"
              style="color:red;"
            >
              You have to select atleast 1 billing.
            </small>
          </p>
          <b-table
            ref="billings"
            class="billings-table"
            small
            hover
            outlined
            show-empty
            selectable
            :fields="tables.billings.fields"
            :busy="tables.billings.isBusy"
            :items="tables.billings.items"
            selected-variant="primary"
            select-mode="single"
            @row-selected="onRowSelected"
          >
            <template v-slot:cell(selected)="{ rowSelected }">
              <!-- <v-icon :name="rowSelected ? 'check' : ''"></v-icon> -->
              <template v-if="rowSelected">
                <v-icon :name="rowSelected ? 'check' : ''" />
              </template>
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(action)="row">
              <button type="button" class="btn-invisible">
                <v-icon
                  :name="row.detailsShowing ? 'chevron-down' : 'chevron-left'"
                  @click="loadDetails(row)"
                  scale="1"
                />
              </button>
            </template>
            <template v-slot:row-details="data">
              <b-overlay :show="data.item.isLoading" rounded="sm">
                <div class="row-details-container">
                  <div
                    v-if="
                      data.item.termBillings &&
                        data.item.termBillings.length > 0
                    "
                  >
                    <b-table
                      small
                      hover
                      outlined
                      show-empty
                      :fields="tables.soaBillings.fields"
                      :busy="tables.soaBillings.isBusy"
                      :items="data.item.termBillings"
                    >
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <v-icon name="spinner" spin class="mr-2" />
                          <strong>Loading...</strong>
                        </div>
                      </template>
                    </b-table>
                  </div>
                  <div
                    v-if="
                      data.item.otherBillings &&
                        data.item.otherBillings.length > 0
                    "
                  >
                    <b-table
                      small
                      hover
                      outlined
                      show-empty
                      :fields="tables.otherBillings.fields"
                      :busy="tables.otherBillings.isBusy"
                      :items="data.item.otherBillings"
                    >
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <v-icon name="spinner" spin class="mr-2" />
                          <strong>Loading...</strong>
                        </div>
                      </template>
                    </b-table>
                  </div>
                  <div
                    v-if="
                      data.item.billingTypeId ===
                        $options.BillingTypes.INITIAL_FEE.id
                    "
                  >
                    <b-table
                      small
                      hover
                      outlined
                      show-empty
                      :fields="tables.initialBillings.fields"
                      :busy="tables.initialBillings.isBusy"
                      :items="data.item.initialBillings"
                    >
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <v-icon name="spinner" spin class="mr-2" />
                          <strong>Loading...</strong>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </div>
              </b-overlay>
            </template>
          </b-table>
          <div class="total-container">
            <strong>TOTAL REMAINING BALANCE :</strong>
            <vue-autonumeric
              :disabled="true"
              ref="totalAmount"
              :value="getTotalBilling"
              class="total-billing-amount"
              :class="'form-control'"
              :options="[
                {
                  minimumValue: 0,
                  modifyValueOnWheel: false,
                  emptyInputBehavior: 0,
                },
              ]"
            >
            </vue-autonumeric>
          </div>
        </div>
      </div>
      <div class="action-container mt-2">
        <b-button
          class="float-right ml-2"
          :to="`/finance/post-payment`"
          variant="outline-danger"
          :disabled="isProcessing"
        >
          Cancel
        </b-button>
        <b-button
          class="float-right"
          variant="outline-primary"
          :disabled="isProcessing"
          @click="onSavePayment"
        >
          <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
          Save
        </b-button>
      </div>
    </b-overlay>
    <b-modal
      size="xl"
      v-model="showModalStudent"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Student List
      </div>
      <b-row class="mb-2">
        <b-col md="4" offset-md="8">
          <b-form-input
            v-model="filters.student.criteria"
            type="text"
            placeholder="Search"
            debounce="500"
            @update="loadStudents()"
          >
          </b-form-input>
        </b-col>
      </b-row>
      <b-table
        small
        hover
        outlined
        show-empty
        :fields="tables.students.fields"
        :busy="tables.students.isBusy"
        :items="tables.students.items"
      >
        <template v-slot:cell(name)="data">
          <b-media>
            <template v-slot:aside>
              <b-avatar
                rounded
                blank
                size="64"
                :text="
                  data.item.firstName.charAt(0) +
                    '' +
                    data.item.lastName.charAt(0)
                "
                :src="avatar(data.item)"
              />
            </template>
            <span>{{ data.item.name }}</span
            ><br />
            <small
              >Student no.:
              {{
                data.item.studentNo
                  ? data.item.studentNo
                  : 'Awaiting Confirmation'
              }}</small
            ><br />
            <small
              >Address :
              {{
                data.item.address
                  ? data.item.currentAddress
                    ? data.item.currentAddress
                    : data.item.address.currentCompleteAddress
                  : ''
              }}
            </small>
          </b-media>
        </template>
        <template v-slot:cell(contact)="data">
          Email : {{ data.item.email }} <br />
          <small>Phone : {{ data.item.phoneNo }}</small> <br />
          <small>Mobile : {{ data.item.mobileNo }}</small> <br />
        </template>
        <template v-slot:table-busy>
          <div class="text-center my-2">
            <v-icon name="spinner" spin class="mr-2" />
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(action)="row">
          <b-button variant="outline-primary" @click="onSelectedStudent(row)"
            ><v-icon name="check"
          /></b-button>
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
            v-model="paginations.student.page"
            :total-rows="paginations.student.totalRows"
            :per-page="paginations.student.perPage"
            size="sm"
            align="end"
            @input="loadStudents()"
          />
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalStudent = false"
        >
          Close
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  StudentApi,
  PaymentApi,
  BillingApi,
  SchoolYearApi,
} from '../../../mixins/api';
import {
  PaymentModes,
  PaymentStatuses,
  BillingTypes,
} from '../../../helpers/enum';
import {
  showNotification,
  formatNumber,
  clearFields,
  validate,
  reset,
} from '../../../helpers/forms';
import { format } from 'date-fns';
// import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import SelectPaginated from '../../components/SelectPaginated';
import { debounce } from 'lodash';

const paymentFields = {
  id: null,
  referenceNo: null,
  // transactionNo: null,
  billingId: null,
  studentId: null,
  amount: null,
  datePaid: null,
  paymentModeId: null,
  notes: null,
  paymentStatusId: PaymentStatuses.APPROVED.id,
  schoolYearId: null,
};

export default {
  mixins: [StudentApi, PaymentApi, BillingApi, SchoolYearApi],
  components: { SelectPaginated },
  BillingTypes,
  data() {
    return {
      activeSchoolYear: null,
      showModalStudent: false,
      isLoading: false,
      isProcessing: false,
      selectedStudent: null,
      studentQuery: null,
      forms: {
        payment: {
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields },
        },
      },
      tables: {
        billings: {
          fields: [
            {
              key: 'selected',
              label: '',
              tdClass: 'align-middle',
              thStyle: { minWidth: '45px' },
            },
            {
              key: 'billingNo',
              label: 'Billing No',
              tdClass: 'align-middle',
              thStyle: { width: '17%' },
            },
            {
              key: 'dueDate',
              label: 'Due Date',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'previousBalance',
              label: 'Previous Balance',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => {
                if (Math.sign(value) < 0) {
                  return `(${Math.abs(value)})`;
                }
                return formatNumber(value);
              },
            },
            {
              key: 'totalAmount',
              label: 'Current Due ',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => {
                if (Math.sign(value) < 0) {
                  return `(${formatNumber(Math.abs(value))})`;
                }
                return formatNumber(value);
              },
            },
            {
              key: 'total',
              label: 'Total Amount ',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value, key, item) => {
                const total =
                  parseFloat(item.previousBalance) +
                  parseFloat(item.totalAmount);
                if (Math.sign(total) < 0) {
                  return `(${formatNumber(Math.abs(total))})`;
                }
                return formatNumber(total);
              },
            },
            {
              key: 'totalPaid',
              label: 'Paid ',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => {
                if (Math.sign(value) < 0) {
                  return `(${formatNumber(Math.abs(value))})`;
                }
                return formatNumber(value);
              },
            },
            {
              key: 'remainingBalance',
              label: 'Balance ',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value, key, item) => {
                const remBalance =
                  parseFloat(item.previousBalance) +
                  parseFloat(item.totalAmount) -
                  item.totalPaid;
                if (Math.sign(remBalance) < 0) {
                  return `(${formatNumber(Math.abs(remBalance))})`;
                }
                return formatNumber(remBalance);
              },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thClass: 'text-center',
              thStyle: { width: '30px' },
            },
          ],
          items: [],
        },
        students: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '50%' },
            },
            {
              key: 'contact',
              label: 'Contact Info',
              tdClass: 'align-middle',
              thStyle: { width: '45%' },
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
        soaBillings: {
          isBusy: false,
          fields: [
            {
              key: 'term.name',
              label: 'Term',
              tdClass: 'align-middle',
              thStyle: { width: '35%' },
            },
            {
              key: 'term.schoolYear.name',
              label: 'School Year',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'term.semester.name',
              label: 'Semester',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'amount',
              label: 'Amount',
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
        otherBillings: {
          isBusy: false,
          fields: [
            {
              key: 'schoolFee.name',
              label: 'Fees',
              tdClass: 'align-middle',
              thStyle: { width: '85%' },
            },
            {
              key: 'amount',
              label: 'Amount',
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
        initialBillings: {
          isBusy: false,
          fields: [
            {
              key: 'item',
              label: 'Fees',
              tdClass: 'align-middle',
              thStyle: { width: '85%' },
            },
            {
              key: 'amount',
              label: 'Amount',
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
      },
      paginations: {
        student: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 8,
        },
      },
      filters: {
        student: {
          criteria: null,
        },
      },
      options: {
        paymentModes: {
          items: PaymentModes.values,
        },
        students: {
          isLoading: false,
          items: [],
        },
      },
    };
  },
  created() {
    this.getActiveSchoolYear();
    this.forms.payment.fields.amount = 0;
    this.forms.payment.fields.datePaid = format(new Date(), 'yyyy-MM-dd');
  },
  methods: {
    loadStudents() {
      const { students } = this.tables;
      const { criteria } = this.filters.student;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;

      students.isBusy = true;

      let params = { paginate: true, perPage, page, criteria };
      this.getStudentList(params).then(({ data }) => {
        students.items = data.data;
        student.from = data.meta.from;
        student.to = data.meta.to;
        student.totalRows = data.meta.total;
        students.isBusy = false;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    onShowModalStudent() {
      this.showModalStudent = true;
      this.filters.student.criteria = null;
      this.paginations.student.page = 1;
      this.loadStudents();
    },
    onSelectedStudent(row) {
      this.showModalStudent = false;
      this.selectedStudent = row.item;
      this.forms.payment.fields.studentId = row.item.id;
      this.studentQuery = row.item.studentNo;
      this.loadBillings(row.item.id);
    },
    async loadBillings(studentId) {
      const { billings } = this.tables;
      billings.isBusy = true;
      await this.getBillingsOfStudent(studentId).then(({ data }) => {
        billings.items = data;
        billings.isBusy = false;
      });

      if (billings.items.length > 0) this.$refs.billings.selectRow(0);
    },
    onRowSelected(row) {
      if (row.length > 0) {
        const { payment } = this.forms;
        const remainingBalance =
          parseFloat(row[0].previousBalance) +
          parseFloat(row[0].totalAmount) -
          parseFloat(row[0].totalPaid);
        payment.fields.billingId = row.length ? row[0].id : null;
        payment.fields.amount = remainingBalance > 0 ? remainingBalance : 0;
      }
    },
    onSavePayment() {
      this.isProcessing = true;
      const {
        payment,
        payment: { fields },
      } = this.forms;
      fields.schoolYearId = this.activeSchoolYear.id;
      reset(payment);
      this.addPayment(fields)
        .then(({ data }) => {
          // console.log(data);
          this.isProcessing = false;
          this.$router.push('/finance/post-payment');
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          this.isProcessing = false;
          validate(payment, errors);
        });
    },
    getStudentInfo(student) {
      this.selectedStudent = student;
      this.forms.payment.fields.studentId = student.id;
      this.loadBillings(student.id);
    },
    loadStudentsTypeAhead() {
      const { students } = this.options;
      const { studentQuery } = this.studentQuery;
      const params = {
        paginate: false,
        criteria: studentQuery,
      };
      this.getStudentList(params).then(({ data }) => {
        students.items = data;
      });
    },
    loadDetails(row) {
      const { item } = row;
      this.$set(item, 'isLoading', true);
      if (!row.detailsShowing) {
        this.getBillingItemsOfBilling(item.id).then(({ data }) => {
          this.$set(
            item,
            'termBillings',
            data.filter((e) => e.termId !== null)
          );
          this.$set(
            item,
            'otherBillings',
            data.filter((e) => e.schoolFeeId !== null)
          );
          this.$set(
            item,
            'initialBillings',
            data.filter((e) => e.termId === null && e.schoolFeeId === null)
          );
          this.$set(item, 'isLoading', false);
        });
      }
      row.toggleDetails();
    },
    getActiveSchoolYear() {
      this.isLoading = true;
      const params = { paginate: false, isActive: 1 };
      this.getSchoolYearList(params).then(({ data }) => {
        if (data.length > 0) {
          this.activeSchoolYear = data[0];
        }
        this.isLoading = false;
      });
    },
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
  },
  computed: {
    getTotalBilling() {
      const { billings } = this.tables;
      var sum = billings.items.reduce((sum, current) => {
        return (
          sum +
          (parseFloat(current.totalAmount) +
            parseFloat(current.previousBalance) -
            parseFloat(current.totalPaid))
        );
      }, 0);

      return formatNumber(sum, 2);
    },
    getTotalTerms(items) {
      var sum = items.reduce((sum, current) => {
        return sum + parseFloat(current.amount);
      }, 0);

      return formatNumber(sum, 2);
    },
  },
  watch: {
    studentQuery: debounce(function() {
      this.loadStudentsTypeAhead();
    }, 500),
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/_shared.scss';
.payment-list__container {
  height: 100%;
  width: 100%;
  padding: 20px;
}
.payment-entry__body {
  width: 100%;
  height: 100%;
  display: flex;
  border: solid 1px whitesmoke;
  padding: 15px;
  flex-direction: column;

  .payment-entry__top-pane {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .payment-details {
      width: 32%;
    }

    .student-no-container {
      display: flex;
      justify-content: space-between;

      .student-browse {
        height: 30px;
        width: 40px;
        margin-top: 10px;
        align-self: center;
        justify-self: flex-end;
        border: solid 1px;
      }

      .student-no {
        flex: 1;
        margin-right: 10px;
      }
    }
  }
  .payment-entry__bottom-pane {
    margin-top: 20px;

    .total-container {
      height: 55px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .total-billing-amount {
        width: 200px;
        margin-left: 20px;
        text-align: right;
      }
    }
  }

  @include for-size(phone-only) {
    .payment-entry__top-pane {
      width: 100%;
      flex-direction: column;

      .payment-details {
        width: 100%;
      }
    }

    .payment-entry__bottom-pane {
      width: 100%;
      margin: 0;

      .billings-table {
        height: auto;
      }
    }
  }
}

.search-container {
  display: flex;
  align-items: center;

  .select-paginated {
    width: 30%;
    margin-bottom: 15px;

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
.action-container {
  margin: 20px 0;
  height: 50px;
}

.row-details-container {
  width: 100%;
  height: 100%;
  padding: 10px 45px;
}
</style>
