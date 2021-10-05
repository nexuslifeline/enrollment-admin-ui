<template>
  <CenterContainer>
    <BackLink :previousRoute="{ name: 'PaymentList' }" />
    <PaymentConfirmation
      :isConfirming="isProcessing"
      @onConfirm="onSubmitPayment"
      :isShown.sync="isShownConfirmation"
      :data="[
        { label: 'Student #:', description: studentNo },
        { label: 'Name:', description: name },
        { label: 'Course:', description: courseName },
        { label: 'Level & Semester:', description: [levelName, semesterName].join(' - ') },
        { label: 'Mode of Payment:', description: paymentMode, underline: true },
        { label: 'Date of Payment:', description: formattedPaymentDate },
        { label: 'Payment will be posted to:', description: billingNo, underline: true },
        { label: 'SOA/Bill Amount:', description: billingAmount },
        { label: `You are about to post a payment amounting: `, description: paymentAmount, underline: true, blue: true, medium: true },
      ]"
    />
    <Card title="Payment Information" titleSize="m" hasFooter>
      <InputContainer>
        <b-form-group>
          <label class="required">Student</label>
          <SelectStudent
            v-model="forms.payment.fields.studentId"
            @input="onStudentSelect"
          />
        </b-form-group>
      </InputContainer>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Reference No</label>
            <b-form-input
              v-model="forms.payment.fields.referenceNo"
              :state="forms.payment.states.referenceNo"
            />
            <b-form-invalid-feedback>
              {{ forms.payment.errors.referenceNo }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Date of Payment</label>
            <b-form-datepicker
              v-model="forms.payment.fields.datePaid"
              :state="forms.payment.states.datePaid"
            />
            <b-form-invalid-feedback>
              {{ forms.payment.errors.datePaid }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Payment Mode</label>
            <b-form-select
              v-model="forms.payment.fields.paymentModeId"
              :state="forms.payment.states.paymentModeId">
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
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required font-weight-bold">Amount to Pay</label>
            <vue-autonumeric
              ref="totalAmount"
              v-model="forms.payment.fields.amount"
              :state="forms.payment.states.amount"
              class="form-control text-right font-weight-bold"
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
        </InputContainer>
      </InputGroup>
       <LinkVisibilityToggler
        linkText="Add Payment Notes"
        hideLinkText="Hide Payment Notes"
        :hideOnContentShow="true">
        <InputGroup>
          <InputContainer>
            <b-form-group>
              <label class="required">Amount to Pay</label>
              <b-form-textarea
                rows="2"
                v-model="forms.payment.fields.notes"
                :state="forms.payment.states.notes"
              />
            </b-form-group>
          </InputContainer>
        </InputGroup>
      </LinkVisibilityToggler>
      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="isShownConfirmation = true" :disabled="isProcessing || tables.billings.items.length === 0">
            <v-icon name="spinner" spin v-if="isProcessing"/> Submit Payment
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
    <Card title="Billing Statement(s)" titleSize="m" noPaddingBody hasFooter>
      <div>
        <b-table
          ref="billings"
          class="card__billings-table"
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
          foot-clone
        >
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
                <div v-if="data.item.termBillings && data.item.termBillings.length > 0">
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
                  v-if="data.item.otherBillings && data.item.otherBillings.length > 0">
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
                <div v-if="data.item.billingTypeId === $options.BillingTypes.INITIAL_FEE.id">
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

          <template #foot(totalPaid)>
            <b>Total: </b>
          </template>
          <template #foot(totalRemainingDue)>
            <b>{{ grandTotalRemainingDue }}</b>
          </template>
          <template #foot()>
            <span> </span>
          </template>
        </b-table>
      </div>
      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="isShownConfirmation = true" :disabled="isProcessing || tables.billings.items.length === 0">
            <v-icon name="spinner" spin v-if="isProcessing"/> Submit Payment
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
 </CenterContainer>
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
  validate,
  reset,
  formatAccountingNumber
} from '../../../helpers/forms';
import { format } from 'date-fns';

const paymentFields = {
  referenceNo: null,
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
  BillingTypes,
  data() {
    return {
      PaymentModes,
      activeRow: {},
      activeStudent: {},
      isShownConfirmation: false,
      activeSchoolYear: null,
      isLoading: false,
      isProcessing: false,
      forms: {
        payment: {
          fields: { ...paymentFields, paymentModeId: PaymentModes.CASH.id },
          states: { ...paymentFields },
          errors: { ...paymentFields },
        },
      },
      tables: {
        billings: {
          fields: [
            {
              key: 'billingNo',
              label: 'Billing No',
              tdClass: 'align-middle',
            },
            {
              key: 'dueDate',
              label: 'Due Date',
              tdClass: 'align-middle',
              formatter: (v) => format(new Date(v), 'MMMM dd, yyyy')
            },
            {
              key: 'previousBalance',
              label: 'Previous',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              formatter: (value) => formatAccountingNumber(value),
            },
            {
              key: 'totalAmount',
              label: 'Current',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              formatter: (value) => formatAccountingNumber(value),
            },
            {
              key: 'totalPaid',
              label: 'Paid',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => formatAccountingNumber(value),
            },
            {
              key: 'totalRemainingDue',
              label: 'Total Due',
              tdClass: 'align-middle text-right font-weight-bold',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => formatAccountingNumber(value),
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
              formatter: (value) => formatAccountingNumber(value),
            },
          ],
          items: [],
        },
        otherBillings: {
          isBusy: false,
          fields: [
            {
              key: 'schoolFee.name',
              label: 'Item',
              tdClass: 'align-middle',
              thStyle: { width: '85%' },
            },
            {
              key: 'amount',
              label: 'Amount',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => formatAccountingNumber(value),
            },
          ],
          items: [],
        },
        initialBillings: {
          isBusy: false,
          fields: [
            {
              key: 'item',
              label: 'Item',
              tdClass: 'align-middle',
              thStyle: { width: '85%' },
            },
            {
              key: 'amount',
              label: 'Amount',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => formatAccountingNumber(value),
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
        // students: {
        //   isLoading: false,
        //   items: [],
        // },
      },
    };
  },
  created() {
    this.showDefaultStudent();
    this.getActiveSchoolYear();
    this.forms.payment.fields.amount = 0;
    this.forms.payment.fields.datePaid = format(new Date(), 'yyyy-MM-dd');
  },
  methods: {
    onStudentSelect(student) {
      this.activeStudent = student;
      if (!student?.id) {
        this.tables.billings.items = [];
        return;
      }
      this.loadBillings(student?.id);
    },
    showDefaultStudent() {
      const { studentId } = this.$route.query;
      if (studentId) {
        this.loadBillings(studentId);
        this.getStudent(studentId).then(({ data }) => {
          this.forms.payment.fields.studentId = data;
        });
      }
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
        payment.fields.billingId = row[0]?.id;
        payment.fields.amount = remainingBalance > 0 ? remainingBalance : 0;
        this.activeRow = row[0];
      }
    },
    onSubmitPayment() {
      this.isProcessing = true;
      const {
        payment,
        payment: { fields: { billingId, amount, datePaid, paymentModeId, notes, referenceNo } },
      } = this.forms;
      reset(payment);
      this.postPayment({ amount, datePaid, paymentModeId, notes, referenceNo }, billingId)
        .then(() => {
          this.isProcessing = false;
          this.$router.push('/finance/post-payment');
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          this.isProcessing = false;
          validate(payment, errors, this);
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
      return photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
  },
  computed: {
    grandTotalRemainingDue() {
      const { billings } = this.tables;
      return formatAccountingNumber(billings?.items?.reduce((accum, item) => accum + item?.totalRemainingDue, 0.0) || 0);
    },
    billingNo() {
      return this.activeRow?.billingNo || '';
    },
    billingAmount() {
      return formatAccountingNumber(this.activeRow?.totalRemainingDue);
    },
    paymentMode() {
      return this.PaymentModes.getEnum(this.forms.payment.fields?.paymentModeId)?.name || '';
    },
    formattedPaymentDate() {
      return format(new Date(this.forms.payment.fields.datePaid), 'MMMM dd, yyyy');
    },
    name() {
      return this.activeStudent?.name;
    },
    studentNo() {
      return this.activeStudent?.studentNo;
    },
    courseName() {
      return this.activeStudent?.latestAcademicRecord?.course?.name;
    },
    levelName() {
      return this.activeStudent?.latestAcademicRecord?.level?.name;
    },
    semesterName() {
      return this.activeStudent?.latestAcademicRecord?.semester?.name;
    },
    paymentAmount() {
      return formatAccountingNumber(this.forms.payment.fields.amount);
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/_shared.scss';

.card__billings-table {
  border: 0 !important;

  th {
    border: 0 !important;
    height: 30px;
  }

  tr {
    &:last-child {
      border-bottom: 1px solid $light-gray-10;
    }

    &.b-table-row-selected {
      td {
        background-color: $blue !important;
        color: $white;

        svg {
          color: $white;
        }
      }
    }
  }
}


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
  // padding: 10px 45px;
}
</style>
