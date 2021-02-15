<template>
  <PageContent
    title="Payment Transactions"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadPaymentList"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.payment.criteria"
        debounce="500"
        @update="loadPaymentList()"
        type="text"
        placeholder="Search"
      />
      <v-select
        :options="paymentStatuses.values"
        :value="filters.payment.paymentStatusItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div>
        <!-- <b-row class="mb-2">
          <b-col md="8">
            <b-form-radio-group
              @input="loadPaymentList()"
              v-model="filters.payment.paymentStatusId"
            >
              <b-form-radio :value="null">Show All</b-form-radio>
              <b-form-radio
                v-for="status in paymentStatuses.values"
                :value="status.id"
                :key="status.id"
              >
                {{ status.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
          <b-col md="4">
            <b-form-input
              v-model="filters.payment.criteria"
              debounce="500"
              @update="loadPaymentList()"
              type="text"
              placeholder="Search"
            >
            </b-form-input>
          </b-col>
        </b-row> -->
        <!-- row button and search input -->
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.payments.fields"
          :items="tables.payments.items"
          :busy="tables.payments.isBusy"
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
              :callback="{ loadDetails: () => loadDetails(data) }"
            />
          </template>
          <template v-slot:cell(contact)="data">
            <ContactColumn :data="data.item.student" />
          </template>
          <template v-slot:cell(action)="row">
            <!-- <v-icon :name="row.detailsShowing ? 'caret-down' : 'caret-left'" @click="loadDetails(row)" /> -->
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click.prevent="loadDetails(row)">
                {{
                  row.item.paymentStatusId === paymentStatuses.APPROVED.id
                    ? 'View Details'
                    : 'Review Record'
                }}
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:cell(paymentStatusId)="data">
            <b-badge
              :variant="
                data.item.paymentStatusId === paymentStatuses.APPROVED.id
                  ? 'success'
                  : data.item.paymentStatusId === paymentStatuses.SUBMITTED.id
                  ? 'warning'
                  : 'danger'
              "
            >
              {{ paymentStatuses.getEnum(data.item.paymentStatusId).name }}
            </b-badge>
          </template>
          <template v-slot:row-details="data">
            <!-- <b-overlay :show="data.item.isLoading" rounded="sm">
              <b-card>
                <b-row class="justify-content-md-center">
                  <b-col md="8">
                    <div v-if="data.item.billing">
                      <b-row class="mb-2">
                        <b-col md="6">
                          Reference No. : <b>{{ data.item.referenceNo }}</b
                          ><br />
                          Billing No. : {{ data.item.billing.billingNo }}<br />
                          Due Date. : {{ data.item.billing.dueDate }}
                        </b-col>
                        <b-col md="6">
                          Paid Amount :
                          <b>{{ formatNumber(data.item.amount) }}</b
                          ><br />
                          Total Amount :
                          {{ formatNumber(data.item.billing.totalAmount)
                          }}<br />
                          Billing Type :
                          {{
                            data.item.billing.billingType
                              ? data.item.billing.billingType.name
                              : ''
                          }}
                        </b-col>
                      </b-row>
                      <b-table
                        class="mb-4"
                        hover
                        outlined
                        small
                        responsive
                        show-empty
                        :fields="tables.billingItems.fields"
                        :items="data.item.billingItems"
                        :busy="tables.billingItems.isBusy"
                      >
                        <template v-slot:cell(item)="row">
                          <span
                            v-if="
                              data.item.billing.billingTypeId ===
                                BillingTypes.INITIAL_FEE.id
                            "
                            >{{ row.item.item }}</span
                          >
                          <span v-else>{{
                            row.item.term
                              ? row.item.term.name
                              : row.item.schoolFee.name
                          }}</span>
                        </template>
                        <template v-slot:table-busy>
                          <div class="text-center my-2">
                            <v-icon name="spinner" spin class="mr-2" />
                            <strong>Loading...</strong>
                          </div>
                        </template>
                      </b-table>
                    </div>
                    <div v-if="data.item.files">
                      <h5>Files</h5>
                      <b-table
                        v-if="data.item.files"
                        hover
                        outlined
                        small
                        responsive
                        show-empty
                        :fields="tables.files.fields"
                        :items="data.item.files"
                        :busy="tables.files.isBusy"
                      >
                        <template v-slot:cell(action)="row">
                          <b-button
                            @click="previewFile(row, data)"
                            size="sm"
                            variant="secondary"
                          >
                            <v-icon name="search" />
                          </b-button>
                        </template>
                        <template v-slot:table-busy>
                          <div class="text-center my-2">
                            <v-icon name="spinner" spin class="mr-2" />
                            <strong>Loading...</strong>
                          </div>
                        </template>
                      </b-table>
                    </div>
                    <b-row
                      v-if="
                        data.item.paymentStatusId ===
                          paymentStatuses.SUBMITTED.id
                      "
                    >
                      <b-col md="12">
                        <b-button
                          v-if="
                            isAccessible(
                              $options.StudentPaymentPermissions.DISAPPROVAL.id
                            )
                          "
                          @click="setDisapproval(data)"
                          class="float-right my-2"
                          variant="outline-danger"
                          >Reject</b-button
                        >
                        <b-button
                          v-if="
                            isAccessible(
                              $options.StudentPaymentPermissions.APPROVAL.id
                            )
                          "
                          @click="setApproval(data)"
                          class="float-right my-2 mr-2"
                          variant="outline-primary"
                          >Approve</b-button
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
            </b-overlay> -->
            <ActiveRowViewer
              :isBusy="data.item.isLoading"
              backTitle="Go back to list"
              @onBack="data.toggleDetails()"
              :showOptions="
                isAccessible($options.StudentPaymentPermissions.APPROVAL.id) &&
                  data.item.paymentStatusId === paymentStatuses.SUBMITTED.id
              "
              :options="[
                {
                  label: 'Approve',
                  callback: () => setApproval(data),
                  isAllowed: isAccessible(
                    $options.StudentPaymentPermissions.APPROVAL.id
                  ),
                },
                {
                  label: 'Reject',
                  callback: () => setDisapproval(data),
                  isAllowed: isAccessible(
                    $options.StudentPaymentPermissions.DISAPPROVAL.id
                  ),
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
                        new Date(data.item.datePaid),
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
                      text: 'Payment Details',
                      target: 'header-payment-details',
                    },
                    {
                      text: 'Billing Details',
                      target: 'header-billing-details',
                    },
                    {
                      text: 'Attachments',
                      target: 'header-attachments',
                    },
                  ]"
                />
              </template>

              <template v-slot:content>
                <div>
                  <ActiveViewHeader
                    id="header-payment-details"
                    title="Review submitted Payment Details"
                    circleText="1"
                  />
                  <ActiveViewItems>
                    <ActiveViewItem label="Transaction No: ">
                      <p>
                        {{ data.item.transactionNo }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Paid Amount : ">
                      <b-badge variant="success">
                        {{ formatNumber(data.item.amount) }}
                      </b-badge>
                    </ActiveViewItem>
                    <ActiveViewItem label="Billing No: ">
                      <b-link
                        v-if="
                          data.item.billing.billingTypeId ===
                            BillingTypes.SOA.id
                        "
                        @click="previewSoa(data.item.billing)"
                      >
                        {{ data.item.billing.billingNo }}
                      </b-link>
                      <p>
                        {{ data.item.billing.billingNo }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Total Amount: ">
                      <p>
                        {{ formatNumber(data.item.billing.totalAmount) }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Due Date : ">
                      <p>
                        {{ data.item.billing.dueDate }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Billing Type : ">
                      <p>
                        {{
                          data.item.billing.billingType
                            ? data.item.billing.billingType.name
                            : ''
                        }}
                      </p>
                    </ActiveViewItem>
                  </ActiveViewItems>
                </div>
                <div>
                  <ActiveViewHeader
                    id="header-billing-details"
                    title="Billing Details"
                    circleText="2"
                  />
                  <b-table
                    class="mb-1 mt-4"
                    hover
                    outlined
                    small
                    responsive
                    show-empty
                    :fields="tables.billingItems.fields"
                    :items="data.item.billingItems"
                    :busy="tables.billingItems.isBusy"
                  >
                    <template v-slot:cell(item)="row">
                      <span
                        v-if="
                          data.item.billing.billingTypeId ===
                            BillingTypes.INITIAL_FEE.id
                        "
                        >{{ row.item.item }}</span
                      >
                      <span v-else>{{
                        row.item.term
                          ? row.item.term.name
                          : row.item.schoolFee.name
                      }}</span>
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                  </b-table>
                </div>
                <div class="mt-4">
                  <ActiveViewHeader
                    id="header-attachments"
                    title="Attachments"
                    circleText="3"
                  />
                  <AttachmentList
                    class="mt-2"
                    :items="data.item.files"
                    titleKey="name"
                    descriptionKey="notes"
                    @onAttachmentItemView="(file) => previewFile(file, data)"
                    @onAttachmentItemDownload="(file) => onDownloadFile(file)"
                  />
                </div>
              </template>
            </ActiveRowViewer>
          </template>
        </b-table>
        <b-row>
          <b-col md="6">
            Showing {{ paginations.payment.from }} to
            {{ paginations.payment.to }} of
            {{ paginations.payment.totalRows }} records.
          </b-col>
          <b-col md="6">
            <b-pagination
              class="c-pagination"
              v-model="paginations.payment.page"
              :total-rows="paginations.payment.totalRows"
              :per-page="paginations.payment.perPage"
              size="sm"
              align="end"
              @input="loadPaymentList()"
            />
          </b-col>
        </b-row>
      </div>
      <!-- Modal Preview -->
      <FileViewer
        :show="fileViewer.paymentFile.show"
        :file="file"
        :isBusy="file.isLoading"
        :owner="file.owner"
        @close="fileViewer.paymentFile.show = false"
        @onNavLeft="onFileNavLeft"
        @onNavRight="onFileNavRight"
        :navCount="fileViewer.paymentFile.activeNavCount"
        :navActiveIndex="fileViewer.paymentFile.activeNavIndex"
        :enableArrowNav="fileViewer.paymentFile.isActiveNavEnabled"
      />
      <FileViewer
        :show="fileViewer.paymentReceiptFile.show"
        :file="file"
        :isBusy="file.isLoading"
        :owner="file.owner"
        @close="fileViewer.paymentReceiptFile.show = false"
        @onNavLeft="onPaymentReceiptFileNavLeft"
        @onNavRight="onPaymentReceiptFileNavRight"
        :navCount="fileViewer.paymentReceiptFile.activeNavCount"
        :navActiveIndex="fileViewer.paymentReceiptFile.activeNavIndex"
        :enableArrowNav="fileViewer.paymentReceiptFile.isActiveNavEnabled"
      />
      <!-- Modal Preview -->
      <!-- Modal Approval Confirmation -->
      <b-modal
        v-model="showModalApproval"
        centered
        header-bg-variant="success"
        header-text-variant="light"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Finalize Approval
        </div>
        <!-- modal title -->
        <b-row class="mb-2">
          <!-- modal body -->
          <b-col md="12">
            <h5>
              Attach Official or Acknowledge Receipt
            </h5>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <div class="file-uploader-container">
              <FileUploader
                @onFileChange="onPaymentReceiptFileUpload"
                @onFileDrop="onPaymentReceiptFileUpload"
              />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <div class="file-item-container">
              <FileItem
                v-for="(item, index) of paymentReceiptFiles"
                :key="index"
                :title="item.name"
                :description="item.notes"
                :fileIndex="index"
                @onFileItemSelect="onPaymentReceiptFileItemSelect"
                @onFileItemRemove="onDeletePaymentReceiptFile"
                @onFileItemPreview="previewPaymentReceiptFile"
                :isBusy="item.isBusy"
              />
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="6">
            <b-form-group>
              <label class="required">
                Reference No
                <v-icon
                  name="info-circle"
                  class="icon-tooltip"
                  v-b-tooltip.hover="{
                    variant: 'info',
                    title:
                      'OR number of the receipt or any transaction number that can be use for tracking.',
                  }"
                />
              </label>
              <b-form-input
                v-model="forms.payment.fields.referenceNo"
                :state="forms.payment.states.referenceNo"
              />
              <b-form-invalid-feedback>
                {{ forms.payment.errors.referenceNo }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <label>Notes</label>
            <b-textarea v-model="forms.payment.fields.approvalNotes" rows="7" />
          </b-col>
        </b-row>
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button class="float-left" @click="showModalApproval = false">
            Cancel
          </b-button>
          <b-button
            @click="onApproval()"
            class="float-right"
            variant="outline-primary"
            :disabled="isProcessing"
          >
            <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
            Confirm
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
      <!-- Modal Approval Confirmation -->
      <!-- Modal Reject -->
      <b-modal
        v-model="showModalRejection"
        centered
        header-bg-variant="danger"
        header-text-variant="light"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Confirm Rejection
        </div>
        <!-- modal title -->
        <b-row>
          <!-- modal body -->
          <b-col md="12">
            <label>Reason</label>
            <b-textarea
              v-model="forms.payment.fields.disapprovalNotes"
              rows="7"
            />
          </b-col>
        </b-row>
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button class="float-left" @click="showModalRejection = false">
            Cancel
          </b-button>
          <b-button
            @click="onDisapproval()"
            class="float-right"
            variant="outline-primary"
            :disabled="isProcessing"
          >
            <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
            Confirm
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
      <!-- Modal Reject -->
      <b-modal
        v-model="showPaymentReceiptFileModal"
        centered
        header-bg-variant="success"
        header-text-variant="light"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Payment Receipt File
        </div>
        <!-- modal title -->
        <b-row>
          <!-- modal body -->
          <b-col md="12">
            <label>Notes</label>
            <b-textarea
              v-model="forms.paymentReceiptFile.fields.notes"
              :state="forms.paymentReceiptFile.states.notes"
              rows="7"
              debounce="500"
            />
            <b-form-invalid-feedback>
              {{ forms.paymentReceiptFile.errors.notes }}
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button
            class="float-left"
            @click="onDeletePaymentReceiptFile(selectedPaymentReceiptFileIndex)"
            variant="outline-danger"
          >
            <v-icon
              v-if="forms.paymentReceiptFile.isDeleting"
              name="sync"
              class="mr-2"
              spin
            />
            Delete
          </b-button>
          <b-button
            @click="onUpdatePaymentReceiptFile()"
            class="float-right"
            variant="outline-primary"
          >
            <v-icon
              v-if="forms.paymentReceiptFile.isUpdating"
              name="sync"
              class="mr-2"
              spin
            />
            Update
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
      <FileViewer
        :show="fileViewer.show"
        :file="file"
        :owner="file.owner"
        :isBusy="file.isLoading"
        @close="fileViewer.show = false"
      />
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
const paymentFields = {
  referenceNo: null,
  approvalNotes: null,
  disapprovalNotes: null,
};

const paymentReceiptFileFields = {
  id: null,
  studentId: null,
  notes: null,
};
import {
  PaymentApi,
  PaymentFileApi,
  BillingApi,
  PaymentReceiptFileApi,
  ReportApi,
} from '../../mixins/api';
import {
  PaymentStatuses,
  StudentPaymentPermissions,
  BillingTypes,
} from '../../helpers/enum';
import {
  showNotification,
  formatNumber,
  clearFields,
  reset,
  validate,
} from '../../helpers/forms';
import Tables from '../../helpers/tables';
import FileUploader from '../components/FileUploader';
import FileItem from '../components/FileItem';
import { copyValue } from '../../helpers/extractor';
import FileViewer from '../components/FileViewer';
import Access from '../../mixins/utils/Access';
import { format } from 'date-fns';
import Card from '../components/Card';
import { StudentColumn, ContactColumn } from '../components/ColumnDetails';

import ActiveRowViewer from '../components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewHeader from '../components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from '../components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from '../components/ActiveRowViewer/ActiveViewItem';
import ActiveViewLinks from '../components/ActiveRowViewer/ActiveViewLinks';
import AttachmentList from '../components/Attachment/AttachmentList';
import AvatarMaker from '../components/AvatarMaker';
import PageContent from "../components/PageContainer/PageContent";

export default {
  name: 'Payment',
  mixins: [
    PaymentApi,
    PaymentFileApi,
    BillingApi,
    PaymentReceiptFileApi,
    ReportApi,
    Tables,
    Access,
  ],
  components: {
    FileUploader,
    FileItem,
    FileViewer,
    Card,
    StudentColumn,
    ContactColumn,
    ActiveRowViewer,
    ActiveViewHeader,
    AttachmentList,
    ActiveViewItems,
    ActiveViewItem,
    ActiveViewLinks,
    AvatarMaker,
    PageContent
  },
  format,
  StudentPaymentPermissions,
  data() {
    return {
      isFilterVisible: true,
      fileViewer: {
        paymentFile: {
          isActiveNavEnabled: false,
          activeNavCount: 0,
          activeNavIndex: 0,
          show: false,
        },
        paymentReceiptFile: {
          isActiveNavEnabled: false,
          activeNavCount: 0,
          activeNavIndex: 0,
          show: false,
        },
      },
      showModalPreview: false,
      showModalApproval: false,
      showModalRejection: false,
      isLoading: false,
      paymentStatuses: PaymentStatuses,
      BillingTypes: BillingTypes,
      formatNumber: formatNumber,
      showPaymentReceiptFileModal: false,
      paymentReceiptFiles: [],
      selectedPaymentReceiptFileIndex: null,
      lastActivePayment: null,
      lastActiveFile: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      forms: {
        payment: {
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields },
        },
        paymentReceiptFile: {
          isUpdating: false,
          isDeleting: false,
          fields: { ...paymentReceiptFileFields },
          states: { ...paymentReceiptFileFields },
          errors: { ...paymentReceiptFileFields },
        },
      },
      tables: {
        payments: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Student',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              // formatter: (value, key, item) => {
              //   item.student.middleName = item.student.middleName ? item.student.middleName : ''
              //   item.student.name = item.student.firstName + ' ' + item.student.middleName + ' ' + item.student.lastName
              //   return item.student.name
              // }
            },
            {
              key: 'contact',
              label: 'Contact',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
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
            // {
            // 	key: "referenceNo",
            // 	label: "Ref No.",
            // 	tdClass: "align-middle",
            // 	thStyle: { width: "12%"}
            // },
            // {
            // 	key: "paymentMode.name",
            // 	label: "Payment Mode",
            // 	tdClass: "align-middle",
            //   thStyle: { width: "18%"}
            // },
            {
              key: 'amount',
              label: 'Amount',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '10%' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            // {
            // 	key: "submittedDate",
            // 	label: "Submitted",
            //   tdClass: "align-middle text-center",
            //   thClass: "text-center",
            //   thStyle: { width: "10%"},
            //   formatter: (value, key, item) => {
            //     if(!value)
            //     return ''

            //     return format(new Date(value), 'MM/dd/yyyy')
            //   }
            // },
            {
              key: 'paymentStatusId',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
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
        billingItems: {
          isBusy: false,
          fields: [
            {
              key: 'item',
              label: 'Item',
              tdClass: 'align-middle',
            },
            {
              key: 'amount',
              label: 'Amount',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: 'auto' },
              formatter: (value) => {
                return formatNumber(value);
              },
            },
          ],
          items: [],
        },
        files: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Filename',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'notes',
              label: 'Notes',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '35px' },
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
          paymentStatusId: PaymentStatuses.SUBMITTED.id,
          paymentStatusItem: PaymentStatuses.SUBMITTED,
        },
      },
      isProcessing: false,
      row: [],
    };
  },
  created() {
    this.loadPaymentList();
  },
  methods: {
    loadPaymentList() {
      const { payments } = this.tables;
      const {
        payment,
        payment: { perPage, page },
      } = this.paginations;
      const { paymentStatusId, criteria } = this.filters.payment;
      const orderBy = 'submitted_date';
      const sort = 'DESC';
      payments.isBusy = true;
      let params = {
        paginate: true,
        perPage,
        page,
        paymentStatusId,
        orderBy,
        sort,
        criteria,
      };

      this.getPaymentList(params).then(({ data }) => {
        payments.items = data.data;
        payment.from = data.meta.from;
        payment.to = data.meta.to;
        payment.totalRows = data.meta.total;
        payments.isBusy = false;
      });
    },
    setApproval(row) {
      clearFields(this.forms.payment);
      reset(this.forms.payment);
      const params = { paginate: false };
      this.row = row.item;
      this.getPaymentReceiptFiles(row.item.id, params).then(({ data }) => {
        this.paymentReceiptFiles = data;
        this.showModalApproval = true;
      });
    },
    onApproval() {
      this.isProcessing = true;
      const { id } = this.row;
      const { approvalNotes, referenceNo } = this.forms.payment.fields;
      const data = {
        id,
        approvalNotes,
        referenceNo,
        paymentStatusId: PaymentStatuses.APPROVED.id,
      };
      this.updatePayment(data, id)
        .then(({ data }) => {
          this.row.paymentStatusId = PaymentStatuses.APPROVED.id;
          this.isProcessing = false;
          this.showModalApproval = false;
          this.loadPaymentList();
          showNotification(this, 'success', 'Approved Successfully.');
          this.$store.state.approvalCount.payment--;
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          this.isProcessing = false;
          validate(this.forms.payment, errors);
        });
    },
    setDisapproval(row) {
      clearFields(this.forms.payment);
      this.row = row.item;
      this.showModalRejection = true;
    },
    onDisapproval() {
      this.isProcessing = true;
      const { id } = this.row;
      const { disapprovalNotes } = this.forms.payment.fields;
      const data = {
        disapprovalNotes,
        paymentStatusId: PaymentStatuses.REJECTED.id,
      };

      this.updatePayment(data, id)
        .then(({ data }) => {
          this.row.paymentStatusId = PaymentStatuses.REJECTED.id;
          this.isProcessing = false;
          this.showModalRejection = false;
          this.loadPaymentList();
          showNotification(this, 'success', 'Rejected Successfully.');
        })
        .catch((error) => {
          this.isProcessing = false;
        });
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        this.$set(row.item, 'isLoading', true);
        const { billingId, id } = row.item;
        const params = { paginate: false };
        this.getBilling(billingId)
          .then(({ data }) => {
            this.$set(row.item, 'billing', data);
            this.getBillingItemsOfBilling(billingId).then(({ data }) => {
              this.$set(row.item, 'billingItems', data);
            });
            this.getPaymentFileList(id, params)
              .then(({ data }) => {
                this.$set(row.item, 'files', data);
                row.item.isLoading = false;
              })
              .catch((error) => {
                row.item.isLoading = false;
              });
          })
          .catch((error) => {
            row.item.isLoading = false;
          });
      }
      row.toggleDetails();
    },
    setupActiveFileViewer(row, data) {
      this.lastActivePayment = data;
      this.lastActiveFile = row;
      this.fileViewer.paymentFile.isActiveNavEnabled =
        data?.item?.files?.length > 1;
      this.fileViewer.paymentFile.activeNavCount = data?.item?.files?.length;
      this.fileViewer.paymentFile.activeNavIndex = row.index;
    },
    previewFile(row, data) {
      this.setupActiveFileViewer(row, data);
      const { paymentId, id, name, notes } = row.item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.fileViewer.paymentFile.show = true;
      this.file.owner = data.item.student;
      this.file.isLoading = true;
      this.getPaymentFilePreview(paymentId, id).then((response) => {
        this.file.type = response.headers.contentType;
        this.file.isLoading = false;
        const file = new Blob([response.data], {
          type: response.headers.contentType,
        });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    onPaymentReceiptFileUpload(file) {
      const formData = new FormData();
      const { paymentReceiptFiles } = this.forms;

      formData.append('file', file);
      formData.append('studentId', this.row.student.id);

      this.paymentReceiptFiles.push({
        id: null,
        name: null,
        notes: null,
        isBusy: true,
      });
      const paymentReceiptFile = this.paymentReceiptFiles[
        this.paymentReceiptFiles.length - 1
      ];
      const { isBusy, ...paymentReceiptKeys } = paymentReceiptFile;
      this.addPaymentReceiptFile(formData, this.row.id)
        .then(({ data }) => {
          copyValue(data, paymentReceiptFile, Object.keys(paymentReceiptKeys));
          paymentReceiptFile.isBusy = false;
        })
        .catch((error) => {
          this.paymentReceiptFiles.splice(
            this.paymentReceiptFiles.length - 1,
            1
          );
        });
    },
    onDeletePaymentReceiptFile(index) {
      const selectedFile = this.paymentReceiptFiles[index];
      const { paymentReceiptFile } = this.forms;
      paymentReceiptFile.isDeleting = true;
      selectedFile.isBusy = true;
      this.deletePaymentReceiptFile(this.row.id, selectedFile.id)
        .then(() => {
          paymentReceiptFile.isDeleting = false;
          this.showPaymentReceiptFileModal = false;
          this.paymentReceiptFiles.splice(index, 1);
        })
        .catch((error) => {
          paymentReceiptFile.isDeleting = false;
          selectedFile.isBusy = false;
        });
    },
    onPaymentReceiptFileItemSelect(idx) {
      const { paymentReceiptFile } = this.forms;
      reset(paymentReceiptFile);
      this.selectedPaymentReceiptFileIndex = idx;

      paymentReceiptFile.fields.id = this.paymentReceiptFiles[idx].id;
      paymentReceiptFile.fields.notes = this.paymentReceiptFiles[idx].notes;

      this.showPaymentReceiptFileModal = true;
    },
    onUpdatePaymentReceiptFile() {
      const { paymentReceiptFile } = this.forms;

      const selectedFile = this.paymentReceiptFiles[
        this.selectedPaymentReceiptFileIndex
      ];
      paymentReceiptFile.isUpdating = true;
      selectedFile.isBusy = true;

      this.updatePaymentReceiptFile(
        paymentReceiptFile.fields,
        this.row.id,
        paymentReceiptFile.fields.id
      )
        .then(({ data }) => {
          selectedFile.notes = data.notes;
          paymentReceiptFile.isUpdating = false;
          this.showPaymentReceiptFileModal = false;
          selectedFile.isBusy = false;
        })
        .catch((error) => {
          const { errors } = error.response.data;
          validate(paymentReceiptFile, errors);
          paymentReceiptFile.isUpdating = false;
          selectedFile.isBusy = false;
        });
    },
    setupPaymentReceiptActiveFileViewer(index) {
      this.lastActiveFile = this.paymentReceiptFiles[index];
      this.fileViewer.paymentReceiptFile.isActiveNavEnabled = true;
      this.fileViewer.paymentReceiptFile.activeNavCount = this.paymentReceiptFiles?.length;
      this.fileViewer.paymentReceiptFile.activeNavIndex = index;
    },
    previewPaymentReceiptFile(index) {
      this.setupPaymentReceiptActiveFileViewer(index);
      const selectedFile = this.paymentReceiptFiles[index];
      const { student } = this.row;
      const { userable } = this.$store?.state?.user;
      this.file.type = null;
      this.file.src = null;
      this.file.name = selectedFile?.name;
      this.file.notes = selectedFile?.notes;
      this.file.isLoading = true;
      this.fileViewer.paymentReceiptFile.show = true;
      this.file.owner = userable;

      this.getPaymentReceiptFilePreview(this.row.id, selectedFile.id).then(
        (response) => {
          this.file.type = response.headers.contentType;
          const file = new Blob([response.data], {
            type: response.headers.contentType,
          });
          const reader = new FileReader();

          reader.onload = (e) => (this.file.src = e.target.result);
          reader.readAsDataURL(file);
          this.file.isLoading = false;
        }
      );
    },
    getCurrentFiles() {
      const { index: studentIdx } = this.lastActivePayment;
      const { files } = this.tables?.payments?.items[studentIdx];
      return files;
    },
    getCurrentFileIndex() {
      const { index } = this.lastActiveFile;
      return index;
    },
    onFileNavLeft() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isFirst = currentIdx === 0;
      currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem, this.lastActivePayment);
    },
    onFileNavRight() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isLast = currentIdx === files.length - 1;
      currentIdx = isLast ? 0 : currentIdx + 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem, this.lastActivePayment);
    },
    onPaymentReceiptFileNavLeft() {
      const files = this.paymentReceiptFiles;
      let currentIdx = this.paymentReceiptFiles.indexOf(this.lastActiveFile);
      const isFirst = currentIdx === 0;
      currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewPaymentReceiptFile(currentIdx);
    },
    onPaymentReceiptFileNavRight() {
      const files = this.paymentReceiptFiles;
      let currentIdx = this.paymentReceiptFiles.indexOf(this.lastActiveFile);
      const isLast = currentIdx === files.length - 1;
      currentIdx = isLast ? 0 : currentIdx + 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewPaymentReceiptFile(currentIdx);
    },
    onDownloadFile(row) {
      const { paymentId, id, name, notes } = row.item;
      this.getPaymentFilePreview(paymentId, id).then((response) => {
        const file = new Blob([response.data], {
          type: response.headers.contentType,
        });

        var fileURL = window.URL.createObjectURL(file);
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', name);
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
    previewSoa(billing) {
      const { id, billingTypeId } = billing;
      if (billingTypeId === this.BillingTypes.SOA.id) {
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
      }
    },
    onStatusFilterChange(item) {
      const { payment } = this.filters;
      payment.paymentStatusId = item?.id || 0;
      payment.paymentStatusItem = item;
      this.loadPaymentList();
    },
  },
};
</script>
<style scoped lang="scss">
.file-uploader-container {
  width: 100%;
  height: 150px;
  margin: 20px 0 20px 0;
}

.file-item-container {
  width: 100%;
  height: auto;
}
</style>
