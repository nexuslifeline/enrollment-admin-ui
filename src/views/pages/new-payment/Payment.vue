<template>
   <PageContent
    title="Payment Transactions"
    description="Manage and review a payment that was submitted by the student. If something is incorrect you can disapproved the payment."
    :searchKeyword="filters.payment.criteria"
    :pageFrom="paginations.payment.from"
    :pageTo="paginations.payment.to"
    :pageTotal="paginations.payment.totalRows"
    :perPage="paginations.payment.perPage"
    :currentPage.sync="paginations.payment.page"
    @onPageChange="loadPayments"
    @onRefresh="loadPayments"
    :createButtonVisible="false"
    hasPanel
    :panelNotificationCount="pendingCount">
    <template v-slot:panel-content>
      <PendingPayments :count.sync="pendingCount" @onApproveRejectItem="loadPayments" />
    </template>
    <template v-slot:filters>
      <b-form-input
        v-model="filters.payment.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
        @update="loadPayments()"
      />
    </template>
    <template v-slot:content>
      <div>
        <b-table
          class="c-table"
          small
          hover
          outlined
          show-empty
          :fields="tables.payments.fields"
          :busy="tables.payments.isBusy"
          :items="tables.payments.items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="onSortChanged"
          responsive
        >
          <template v-slot:cell(student)="row">
            <StudentColumn
              :data="row.item"
              :callback="{ loadDetails: () => $router.push({ name: 'Payment Detail', params: { paymentId: row.item.id } }) }" />
          </template>
          <template v-slot:cell(paymentMode)="row">
            {{ row.item.paymentMode.name }}
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              boundary="window">
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click="$router.push({ name: 'Payment Detail', params: { paymentId: row.item.id } })">
                Review Payment
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </div>
      <router-view
        :previousRoute="{ name: 'NewPayment' }"></router-view>
    </template>
  </PageContent>
</template>

<script>
import { PaymentApi } from '../../../mixins/api';
import StudentColumn  from '../../components/ColumnDetails/StudentColumn'
import format from 'date-fns/format'
import { PaymentStatuses } from '../../../helpers/enum'
import PendingPayments from '../../components/PendingPayments/PendingPayments'
export default {
  format,
  PaymentStatuses,
  mixins: [ PaymentApi ],
  components: { StudentColumn, PendingPayments },
  data() {
     return {
        pendingCount: 0,
        sortBy: 'name',
        sortDesc: true,
        tables: {
            payments: {
              isBusy: false,
              fields: [
                {
                  key: 'student',
                  label: 'Student',
                  tdClass: 'align-middle',
                  thStyle: { width: '37%' },
                },
                {
                  key: 'transactionNo',
                  label: 'Transaction No',
                  tdClass: 'align-middle',
                  thStyle: { width: '15%' },
                },
                 {
                  key: 'referenceNo',
                  label: 'Reference No',
                  tdClass: 'align-middle',
                  thStyle: { width: '15%' },
                },
                {
                  key: 'paymentMode',
                  label: 'Payment Type',
                  tdClass: 'align-middle',
                  thStyle: { width: '13%' },
                },
                {
                  key: 'datePaid',
                  label: 'Date Paid',
                  tdClass: 'align-middle',
                  thStyle: { width: '10%' },
                  formatter: (value, key, item) => {
                    if (!value) return '';
                    return format(new Date(value), 'MM/dd/yyyy');
                  },
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  tdClass: 'align-middle text-right',
                  thClass: 'text-right',
                  thStyle: { width: '10%' },
                },
                {
                  key: 'action',
                  label: '',
                  tdClass: 'align-middle',
                  thClass: 'align-middle',
                  thStyle: { width: '40px' },
                },
              ],
              items: []
          }
        },
        filters: {
          payment: {
            criteria: null
          }
        },
        paginations: {
          payment: {
            from: 0,
            to: 0,
            totalRows: 0,
            page: 1,
            perPage: 10,
          },
        }
     }
  },
  created() {
    this.loadPayments()
  },
  methods: {
    loadPayments() {
      const { payments } = this.tables;
      const { criteria } = this.filters.payment;
      const { payment, payment: { perPage, page } } = this.paginations;

      payments.isBusy = true;

      const params = {
        paginate: true,
        perPage,
        page,
        criteria,
        paymentStatusId: this.$options.PaymentStatuses.APPROVED.id
        // ordering: this.getOrdering(this.sortBy, this.sortDesc)
      };

      this.getPaymentList(params).then(({ data }) => {
        payments.items = data.data;
        payment.from = data.meta.from;
        payment.to = data.meta.to;
        payment.totalRows = data.meta.total;
        payments.isBusy = false;
      });
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadPayments();
    },
    onReviewPayment(payment) {
      console.log(payment)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>