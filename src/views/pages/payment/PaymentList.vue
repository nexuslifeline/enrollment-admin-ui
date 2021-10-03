<template>
  <PageContent
    title="Post Payment"
    description="Manually post a payment. Once posted this will automatically reflect to student's account without the need to approve it."
    :searchKeyword="filters.payment.criteria"
    :pageFrom="paginations.payment.from"
    :pageTo="paginations.payment.to"
    :pageTotal="paginations.payment.totalRows"
    :perPage="paginations.payment.perPage"
    :currentPage.sync="paginations.payment.page"
    @onPageChange="loadPayments"
    @onRefresh="loadPayments"
    :createButtonVisible="showAddButton && isAccessible($options.PaymentPermissions.ADD.id)"
    @create="$router.push(`/finance/post-payment/add`)">
    <template v-slot:filters>
      <b-form-input
        type="text"
        placeholder="Search"
        debounce="500"
        class="search-input"
        v-model="filters.payment.criteria"
        @update="loadPayments()"
      />
      <div class="mt-2">FROM</div>
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="date-pickers mt-1"
        v-model="filters.payment.dateFrom"
        @input="loadPayments"
        boundary="window"
      />
      <div class="mt-2">TO</div>
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="date-pickers mt-2"
        v-model="filters.payment.dateTo"
        @input="loadPayments"
        boundary="window"
        :min="filters.payment.dateFrom"
      />
      <b-button
        v-if="showPrintPreviewButton"
        class="print-preview mt-3 w-100"
        variant="primary"
        @click="previewCollection()"
        ><v-icon name="print" /> PRINT PREVIEW</b-button>
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
          responsive
        >
          <!-- :filter="filters.schoolFee.criteria> -->
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(student)="data">
            <!-- <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="
                    data.item.student.firstName.charAt(0) +
                      '' +
                      data.item.student.lastName.charAt(0)
                  "
                  :src="avatar(data.item)"
                />
              </template>
              <span>{{ data.item.student.name }}</span
              ><br />
              <small
                >Student no.:
                {{
                  data.item.student.studentNo
                    ? data.item.student.studentNo
                    : 'Awaiting Confirmation'
                }}</small
              ><br />
              <small
                >Address :
                {{
                  data.item.student.address
                    ? data.item.student.currentAddress
                      ? data.item.student.currentAddress
                      : data.item.student.address.currentCompleteAddress
                    : ''
                }}
              </small>
            </b-media> -->
            <StudentColumn
              :data="data.item"
              :callback="{ loadDetails: () => null }"
            />
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              v-if="
                showRowActionButton &&
                  isAccessible($options.PaymentPermissions.CANCEL.id)
              "
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              boundary="window"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="
                  (selectedPaymentId = row.item.id),
                    (showModalConfirmation = true)
                "
                :disabled="showModalConfirmation"
              >
                Cancel Payment
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <!-- <div class="d-flex">
          <div>
            Showing {{ paginations.payment.from }} to
            {{ paginations.payment.to }} of
            {{ paginations.payment.totalRows }} records.
          </div>
          <div class="ml-auto">
            <b-pagination
              class="c-pagination"
              v-model="paginations.payment.page"
              :total-rows="paginations.payment.totalRows"
              :per-page="paginations.payment.perPage"
              size="sm"
              align="end"
              @input="loadPayments()"
            />
          </div>
        </div> -->
      </div>
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Cancel Payment
        </div>
        Are you sure you want to cancel this Payment ?
        <div slot="modal-footer">
          <b-button
            :disabled="isProcessing"
            variant="primary"
            class="mr-2 btn-save"
            @click="onCancelPayment()"
          >
            <v-icon v-if="isProcessing" name="sync" spin class="mr-2" />
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
      <FileViewer
        :show="showModalPreview"
        :file="file"
        :owner="file.owner"
        :isBusy="file.isLoading"
        @close="showModalPreview = false"
      />
    </template>
  </PageContent>
</template>

<script>
import { PaymentApi, ReportApi } from '../../../mixins/api';
import { startOfMonth, endOfMonth } from 'date-fns';
import { showNotification, formatNumber } from '../../../helpers/forms';
import FileViewer from '../../components/FileViewer';
import { PaymentStatuses, PaymentPermissions } from '../../../helpers/enum';
import Access from '../../../mixins/utils/Access';
import PageContent from "../../components/PageContainer/PageContent";
import { StudentColumn } from "../../components/ColumnDetails";

export default {
  mixins: [PaymentApi, ReportApi, Access],
  components: {
    FileViewer,
    PageContent,
    StudentColumn
  },
  props: {
    showAddButton: {
      type: Boolean,
      default: true,
    },
    showRowActionButton: {
      type: Boolean,
      default: true,
    },
    showPrintPreviewButton: {
      type: Boolean,
      default: true,
    },
  },
  PaymentPermissions,
  data() {
    return {
      isFilterVisible: true,
      showModalPreview: false,
      isLoading: false,
      showModalEntry: false,
      showModalConfirmation: false,
      isProcessing: false,
      entryMode: '',
      selectedPaymentId: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      tables: {
        payments: {
          isBusy: false,
          fields: [
            {
              key: 'student',
              label: 'Student',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'referenceNo',
              label: 'Reference No',
              tdClass: 'align-middle',
            },
            {
              key: 'paymentMode.name',
              label: 'Payment Mode',
              tdClass: 'align-middle',
            },
            {
              key: 'billing.billingNo',
              label: 'Billing No',
              tdClass: 'align-middle',
            },
            {
              key: 'datePaid',
              label: 'Date Paid',
              tdClass: 'align-middle',
            },
            {
              key: 'amount',
              label: 'Amount',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '50px' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '30px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        payment: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        payment: {
          criteria: null,
          dateFrom: null,
          dateTo: null,
        },
      },
    };
  },
  methods: {
    setCreate() {
      this.showModalEntry = true;
    },
    loadPayments() {
      const { payments } = this.tables;
       payments.isBusy = true;
      const { criteria, dateFrom, dateTo } = this.filters.payment;
      const {
        payment,
        payment: { perPage, page },
      } = this.paginations;
      const params = {
        paginate: true,
        perPage,
        page,
        criteria,
        dateFrom,
        dateTo,
        paymentStatusId: PaymentStatuses.APPROVED.id,
      };

      this.getPaymentList(params).then(({ data }) => {
        payments.items = data.data;
        payment.from = data.meta.from;
        payment.to = data.meta.to;
        payment.totalRows = data.meta.total;
        payments.isBusy = false;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    onCancelPayment() {
      this.isProcessing = true;
      this.deletePayment(this.selectedPaymentId).then(({ data }) => {
        this.isProcessing = false;
        showNotification(
          this,
          'success',
          'Payment has been cancelled successfully.'
        );
        this.showModalConfirmation = false;
        this.loadPayments();
      });
    },
    previewCollection() {
      this.file.type = null;
      this.file.src = null;
      this.file.notes = null;
      this.file.isLoading = true;
      this.file.owner = null;
      this.file.name = 'Collection Report';

      this.showModalPreview = true;
      const { dateFrom, dateTo, criteria } = this.filters.payment;
      const params = {
        dateFrom,
        dateTo,
        criteria,
        paymentStatusId: PaymentStatuses.APPROVED.id,
      };
      this.previewCollectionReport(params).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
      });
    },
  },
  created() {
    const {
      payment,
      payment: { dateFrom, dateTo },
    } = this.filters;

    payment.dateFrom = startOfMonth(new Date());
    payment.dateTo = endOfMonth(new Date());

    this.loadPayments();
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/_shared.scss';

.payment-list__main-container {
  width: 100%;
  height: 100%;
}

.search-filter-container {
  display: flex;
  align-items: center;
  width: 100%;

  .print-preview {
    margin-left: 10px;
  }

  .search-input {
    width: 250px;
  }

  .date-filter-cotainer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin: 0 10px;
      font-weight: bold;
    }

    .date-pickers {
      width: 200px;
    }
  }

  @include for-size(phone-only) {
    flex-direction: column;

    .date-filter-cotainer {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      span {
        margin: 10px 0;
      }

      .date-pickers {
        width: 100%;
      }
    }

    .search-input {
      width: 100%;
      margin-top: 10px;
    }

    .print-preview {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}
</style>
