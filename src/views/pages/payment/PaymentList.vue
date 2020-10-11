<template>
  <div class="c-page-content">
    <div class="page-content__title-container">
      <h4 class="page-content__title">Payment List</h4>
    </div>
    <b-row>
      <b-col md=12>
        <b-row>
          <b-col md=8>
            <!-- todo: set button permisson -->
            <b-button
              variant="primary"
              :to="`/finance/payment/add`">
              <v-icon name="plus-circle" /> ADD NEW PAYMENT
            </b-button>
          </b-col>
          <b-col md=4>
            <!-- v-model="filters.schoolFee.criteria" -->
            <b-form-input
              type="text"
              placeholder="Search"
              debounce="500"
              v-model="filters.payment.criteria"
              @update="loadPayments()">
            </b-form-input>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col md=12>
        <b-table
          small hover outlined show-empty
          :fields="tables.payments.fields"
          :busy="tables.payments.isBusy"
          :items="tables.payments.items">
          <!-- :filter="filters.schoolFee.criteria> -->
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon
                name="spinner"
                spin
                class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(student)="data">
            <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                  :src="avatar(data.item)" />
              </template>
              <span>{{ data.item.student.name }}</span><br>
              <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ data.item.student.address ? data.item.student.currentAddress ? data.item.student.currentAddress :  data.item.student.address.currentCompleteAddress : '' }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              right variant="link"
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="selectedPaymentId = row.item.id, showModalConfirmation = true"
                :disabled="showModalConfirmation">
                Cancel Payment
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <b-row>
          <b-col md=6>
            Showing {{ paginations.payment.from }} to {{ paginations.payment.to }} of {{ paginations.payment.totalRows }} records.
            </b-col>
          <b-col md=6>
            <b-pagination
              v-model="paginations.payment.page"
              :total-rows="paginations.payment.totalRows"
              :per-page="paginations.payment.perPage"
              size="sm"
              align="end"
              @input="loadPayments()"/>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Cancel Payment
      </div>
      Are you sure you want to cancel this Payment ?
      <div slot="modal-footer">
        <b-button
          :disabled="isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onCancelPayment()">
          <v-icon
            v-if="isProcessing"
            name="sync"
            spin
            class="mr-2"/>
          Yes
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation=false">
          No
        </b-button>
      </div>
    </b-modal>
    <!-- <b-modal v-model="showModalEntry"
      size="lg"
      :noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
      <div slot="modal-title"> 
					Payment - {{ entryMode }}
			</div> 
      <b-overlay :show="forms.payment.isLoading" rounded="sm">
        <div class="payment-entry__body">
          <div class="payment-entry__left-pane">
            <h5>STUDENT DETAILS</h5>
            <b-form-group
              label="Student No">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Student">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Address">
              <b-form-textarea rows="2"/>
            </b-form-group>
            <h5>PAYMENT DETAILS</h5>
            <b-form-group
              label="Student No">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Student No">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Student No">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Student No">
              <b-form-input/>
            </b-form-group>
            <b-form-group
              label="Address">
              <b-form-textarea rows="2"/>
            </b-form-group>
          </div>
          <div class="payment-entry__right-pane">

          </div>
        </div>
      </b-overlay>
      <div slot="modal-footer" class="w-100">
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.payment.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onSchoolFeeEntry()">
          <v-icon
            v-if="forms.payment.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div>
    </b-modal> -->
  </div>
</template>

<script>

import { StudentApi, PaymentApi } from "../../../mixins/api"
import { format } from 'date-fns'
import { showNotification, formatNumber } from '../../../helpers/forms'

export default {
  mixins: [ PaymentApi ],
  data() {
    return {
      isLoading: false,
      showModalEntry: false,
      showModalConfirmation: false,
      isProcessing: false,
      entryMode: "",
      selectedPaymentId: null,
      tables: {
        payments: {
          fields: [
            {
							key: "student",
							label: "Student",
							tdClass: "align-middle",
							thStyle: {width: "28%"}
            },
            {
							key: "referenceNo",
							label: "Reference No",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
            },
            {
							key: "paymentMode.name",
							label: "Payment Mode",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
            },
            {
							key: "billing.billingNo",
							label: "Billing No",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
            },
            {
							key: "datePaid",
							label: "Date Paid",
							tdClass: "align-middle",
							thStyle: {width: "10%"}
            },
            {
							key: "amount",
							label: "Amount",
              tdClass: "align-middle text-right",
              thClass: "text-right",
              thStyle: {width: "15%"},
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
              key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
            }
          ],
          items: []
        }
      },
      paginations: {
				payment: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        payment: {
          criteria: null
        }
      }
    }
  },
  methods: {
    setCreate() {
      this.showModalEntry = true
    },
    loadPayments() {
      const { payments } = this.tables
      const { criteria } = this.filters.payment
      const { payment, payment: { perPage, page } } = this.paginations
      const params = { paginate: true, perPage, page, criteria }

      payments.isBusy = true

      this.getPaymentList(params).then(({ data }) => {
        payments.items = data.data
        payment.from = data.meta.from
        payment.to = data.meta.to
        payment.totalRows = data.meta.total
        payments.isBusy = false
      })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    onCancelPayment(){
      this.isProcessing = true
      this.deletePayment(this.selectedPaymentId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, "success", "Payment has been cancelled successfully.")
        this.showModalConfirmation = false
        this.loadPayments();
      })
    },
  },
  created() {
    this.loadPayments();
  },
}
</script>

<style lang="scss">
  .payment-list__main-container {
    width: 100%;
    height: 100%;
  }

</style>