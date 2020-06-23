<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
          <b-row class="mb-2"> <!-- row button and search input -->
            <b-col md="8">
              <b-form-radio-group @input="loadPayments()" v-model="filters.payment.billingStatusId">
                <b-form-radio :value="null">Show All</b-form-radio>
                <b-form-radio 
                  v-for="status in billingStatuses.values" 
                  :value="status.id" 
                  :key="status.id">
                {{ status.name }}
                </b-form-radio>
              </b-form-radio-group>
            </b-col>

            <b-col md="4">
              <b-form-input
                v-model="filters.payment.criteria"
                debounce="500"
                @update="loadPayments()"
                type="text" 
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row> <!-- row button and search input -->
          <b-table 
            details-td-class="table-secondary"
            hover outlined small show-empty
            :fields="tables.payments.fields"
            :items="tables.payments.items"
            :busy="tables.payments.isBusy">
            <template v-slot:cell(action)="row">
              <v-icon name="caret-down" @click="loadDetails(row)" />
            </template>
            <template v-slot:row-details="data">
              <b-overlay :show="isLoading" rounded="sm">
                <b-card>
                  <b-row class="justify-content-md-center">
                    <b-col md=8>
                      <div v-if="data.item.billing">
                        <h5>{{ data.item.billing.student.name }}</h5>
                        <b-row class="mb-2">
                          <b-col md=6>
                            Billing No. : {{ data.item.billing.billingNo }}<br>
                            Due Date. : {{ data.item.billing.dueDate }}
                          </b-col>
                          <b-col md=6>
                            Total Amount : {{ data.item.billing.totalAmount }}<br>
                            Billing Type : {{ data.item.billing.billingType.name }}
                          </b-col>
                        </b-row>
                        <b-table
                          class="mb-4"
                          hover outlined small responsive show-empty
                          :fields="tables.billingItems.fields"
                          :items="data.item.billing.billingItems"
                          :busy="tables.billingItems.isBusy">
                        </b-table>
                      </div>
                      <div v-if="data.item.files">
                        <h5>Files</h5>
                        <b-table
                          v-if="data.item.files"
                          hover outlined small responsive show-empty
                          :fields="tables.files.fields"
                          :items="data.item.files"
                          :busy="tables.files.isBusy">
                          <template v-slot:cell(action)="row">
                            <b-button 
                              @click="previewFile(row)" 
                              size="sm" variant="secondary">
                              <v-icon
                                name="search" />
                            </b-button>
                          </template>
                        </b-table>
                      </div>
                      <b-button
                        @click="setApproval(data)"
                        class="float-right my-2" 
                        variant="outline-primary">Approve</b-button>
                    </b-col>
                  </b-row>
                </b-card>
              </b-overlay>
            </template>
          </b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.payment.from}} to {{paginations.payment.to}} of {{paginations.payment.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.payment.page"
                :total-rows="paginations.payment.totalRows"
                :per-page="paginations.payment.perPage"
                size="sm"
                align="end"
                @input="loadPayments()"
              />
            </b-col>
          </b-row>
				</b-card>
      </b-col>
    </b-row>
    <!-- Modal Preview -->
    <b-modal 
			v-model="showModalPreview"
			size="xl"
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Preview
			</div> <!-- modal title -->
			<b-row class="justify-content-md-center"> <!-- modal body -->
				<b-col md=12>
          <div v-if="file.src">
            <center>
              <b-img
                fluid 
                v-if="file.type.substr(0, file.type.indexOf('/')) == 'image'" 
                :src="file.src" />
              <b-embed
                v-else
                type="iframe"
                aspect="16by9"
                allowfullscreen
                :src="file.src"
              ></b-embed>
            </center>
          </div>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-right"
          variant="outline-danger"
          @click="showModalPreview=false">
          Close
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- Modal Preview -->
		<!-- Modal Approval Confirmation -->
		<b-modal 
			v-model="showModalConfirmation"
			centered
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Payment Approval
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					Are you sure you want to approve this payment?
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalConfirmation=false">
          Cancel
        </b-button>
				<b-button 
          @click="onApproval()"
          class="float-right" 
          variant="outline-primary">
          <v-icon
            v-if="isProcessing"
            name="sync"
            class="mr-2"
            spin
          />
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval Confirmation -->
	</div> <!-- main container -->
</template>
<script>
import { PaymentApi, PaymentFileApi, BillingApi } from "../../mixins/api"
import { BillingStatuses } from "../../helpers/enum"
import { showNotification, formatNumber } from "../../helpers/forms"
import Tables from "../../helpers/tables"

export default {
	name: "Payment",
	mixins: [PaymentApi, PaymentFileApi, BillingApi, Tables],
	data() {
		return {
      showModalPreview: false,
			showModalConfirmation: false,
      showModalRejection: false,
      showModalSubjects: false,
			isLoading: false,
      billingStatuses: BillingStatuses,
      file: {
        type: null,
        src: null
      },
			tables: {
				payments: {
					isBusy: false,
					fields: [
            {
							key: "datePaid",
							label: "Date Paid",
							tdClass: "align-middle",
              thStyle: { width: "15%"}
						},
						{
							key: "referenceNo",
							label: "Ref No.",
							tdClass: "align-middle",
							thStyle: { width: "30%"}
            },
            {
							key: "paymentMode.name",
							label: "Payment Mode",
							tdClass: "align-middle",
              thStyle: { width: "30%"}
						},
						{
							key: "amount",
							label: "Amount",
              tdClass: "align-middle text-right",
              thClass: "text-right",
              thStyle: { width: "auto"},
              formatter: (value) => {
                return formatNumber(value)
              }
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle text-center",
							thStyle: { width: "40px"}
						},
					],
					items: []
        },
        billingItems: {
					isBusy: false,
					fields: [
            {
							key: "item",
							label: "Item",
							tdClass: "align-middle"
						},
						{
              key: "amount",
              label: "Amount",
              tdClass: "align-middle text-right",
              thClass: "text-right",
							thStyle: { width: "auto" }
            }
          ],
					items: []
				},
        files: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Filename",
							tdClass: "align-middle"
						},
						{
              key: "action",
              label: "",
							tdClass: "align-middle",
							thStyle: { width: "35px" }
            }
          ],
					items: []
				},
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
					criteria: null,
					billingStatusId: null
        }
      },
      isProcessing: false,
      row: []
		}
	},
	created(){
    this.loadPaymentList()
	},
	methods: {
    loadPaymentList() {
      const { payments } = this.tables
      const { payment, payment: { perPage, page } } = this.paginations
      const { billingStatusId, criteria } = this.filters.payment
      payments.isBusy = true
			let params = { 
				paginate: true, 
        perPage, 
        page, 
        billingStatusId,
        criteria }
      
      this.getPaymentList(params)
        .then(({ data }) => {
          payments.items = data.data
          payment.from = data.meta.from
					payment.to = data.meta.to
					payment.totalRows = data.meta.total
          payments.isBusy = false
        })
    },
    setApproval(row) {
      this.showModalConfirmation = true
    },
    onApproval() {
      
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        this.isLoading = true
        const { billingId, id } = row.item
        const params = { paginate: false }
        this.getBilling(billingId)
          .then(({ data }) => {
            this.$set(row.item, 'billing', data)
            this.getPaymentFileList(id, params)
              .then(({ data }) => {
                this.$set(row.item, 'files', data)
                this.isLoading = false
              })
          })
      }
      row.toggleDetails()
    },
    previewFile(row) {
      const { paymentId, id } = row.item
      this.file.type = null
      this.file.src = null
      this.getPaymentFilePreview(paymentId, id)
        .then(response => {
          this.file.type = response.headers.contentType
          const file = new Blob([response.data], { type: response.headers.contentType })
          const reader = new FileReader();
          
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
          this.showModalPreview = true
        })
    },
    
  },
}
</script>