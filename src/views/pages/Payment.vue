<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
          <b-row class="mb-2"> <!-- row button and search input -->
            <b-col md="8">
              <b-form-radio-group @input="loadPaymentList()" v-model="filters.payment.paymentStatusId">
                <b-form-radio :value="null">Show All</b-form-radio>
                <b-form-radio 
                  v-for="status in paymentStatuses.values"
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
                @update="loadPaymentList()"
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
            <template v-slot:cell(name)="data">
              <b-media>
                <template v-slot:aside>
                  <b-avatar 
                    rounded 
                    blank 
                    size="64" 
                    :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                    :src="avatar(data.item.student)" />
                </template>
                <span>{{ data.item.student.name }}</span><br>
                <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
                <small>Address : {{ data.item.student.address ? 
                  data.item.student.address.currentCompleteAddress : "" }}
                </small>
              </b-media>
            </template>
            <template v-slot:cell(contact)="data">
              Email : {{ data.item.student.email }} <br>
              <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
              <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
            </template>
            <template v-slot:cell(action)="row">
              <v-icon :name="row.detailsShowing ? 'caret-down' : 'caret-left'" @click="loadDetails(row)" />
            </template>
            <template v-slot:cell(paymentStatusId)="data">
              <b-badge
                :variant="data.item.paymentStatusId === paymentStatuses.APPROVED.id
                  ? 'primary' 
                  : data.item.paymentStatusId === paymentStatuses.SUBMITTED.id ? 'warning' : 'danger'">
                {{ paymentStatuses.getEnum(data.item.paymentStatusId).name }}
              </b-badge>
            </template>
            <template v-slot:row-details="data">
              <b-overlay :show="data.item.isLoading" rounded="sm">
                <b-card>
                  <b-row class="justify-content-md-center">
                    <b-col md=8>
                      <div v-if="data.item.billing">
                        <h5>{{ data.item.billing.student.firstName }} {{ data.item.billing.student.middleName ? data.item.billing.student.middleName : '' }} {{ data.item.billing.student.lastName }}</h5>
                        <b-row class="mb-2">
                          <b-col md=6>
                            Reference No. : <b>{{ data.item.referenceNo }}</b><br>
                            Billing No. : {{ data.item.billing.billingNo }}<br>
                            Due Date. : {{ data.item.billing.dueDate }}
                          </b-col>
                          <b-col md=6>
                            Paid Amount : <b>{{ formatNumber(data.item.amount) }}</b><br>
                            Total Amount : {{ formatNumber(data.item.billing.totalAmount) }}<br>
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
                      <b-row v-if="data.item.paymentStatusId === paymentStatuses.SUBMITTED.id">
                        <b-col md=12>
                          <b-button
                            @click="setDisapproval(data)"
                            class="float-right my-2" 
                            variant="outline-danger">Reject</b-button>
                          <b-button
                            @click="setApproval(data)"
                            class="float-right my-2 mr-2" 
                            variant="outline-primary">Approve</b-button>
                        </b-col>
                      </b-row>
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
			v-model="showModalApproval"
			centered
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Finalize Approval
			</div> <!-- modal title -->
      <b-row> <!-- modal body -->
				<b-col md=12>
					<label>Notes</label>
					<b-textarea 
            v-model="forms.payment.fields.approvalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalApproval=false">
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
    <!-- Modal Reject --> 
		<b-modal 
			v-model="showModalRejection"
			centered
			header-bg-variant="danger"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Confirm Rejection
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Reason</label>
					<b-textarea
            v-model="forms.payment.fields.disapprovalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-left" 
          @click="showModalRejection=false">
          Cancel
        </b-button>
				<b-button 
          @click="onDisapproval()"
          class="float-right" variant="outline-primary">
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <div v-if="showModalPreview" class="preview__modal-description">
      <div class="mx-auto">
        Filename : {{ file.name }}<br>
        Notes : {{ file.notes }}
      </div>
    </div>
		<!-- Modal Reject -->
	</div> <!-- main container -->
</template>
<script>

const paymentFields = {
  approvalNotes: null,
  disapprovalNotes: null
}

import { PaymentApi, PaymentFileApi, BillingApi } from "../../mixins/api"
import { PaymentStatuses } from "../../helpers/enum"
import { showNotification, formatNumber, clearFields } from "../../helpers/forms"
import Tables from "../../helpers/tables"

export default {
	name: "Payment",
	mixins: [PaymentApi, PaymentFileApi, BillingApi, Tables],
	data() {
		return {
      showModalPreview: false,
			showModalApproval: false,
      showModalRejection: false,
			isLoading: false,
      paymentStatuses: PaymentStatuses,
      formatNumber: formatNumber,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null
      },
      forms: {
        payment: {
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields }
        }
      },
			tables: {
				payments: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Student",
							tdClass: "align-middle",
              thStyle: { width: "20%"},
              formatter: (value, key, item) => {
                item.student.middleName = item.student.middleName ? item.student.middleName : ''
                item.student.name = item.student.firstName + ' ' + item.student.middleName + ' ' + item.student.lastName
                return item.student.name
              }
            },
            {
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "15%" },
							
						},
            {
							key: "datePaid",
							label: "Date Paid",
							tdClass: "align-middle",
              thStyle: { width: "10%"}
						},
						{
							key: "referenceNo",
							label: "Ref No.",
							tdClass: "align-middle",
							thStyle: { width: "15%"}
            },
            {
							key: "paymentMode.name",
							label: "Payment Mode",
							tdClass: "align-middle",
              thStyle: { width: "20%"}
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
							key: "paymentStatusId",
							label: "Status",
              tdClass: "align-middle text-center",
              thClass: "text-center",
              thStyle: { width: "10%"}
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
              thStyle: { width: "auto" },
              formatter: (value) => {
                return formatNumber(value)
              }
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
							tdClass: "align-middle",
              thStyle: { width: "40%" }
						},
            {
							key: "notes",
							label: "Notes",
							tdClass: "align-middle",
              thStyle: { width: "auto" }
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
					paymentStatusId: null
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
      const { paymentStatusId, criteria } = this.filters.payment
      payments.isBusy = true
			let params = { 
				paginate: true, 
        perPage, 
        page, 
        paymentStatusId,
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
      clearFields(this.forms.payment)
      this.showModalApproval = true
      this.row = row.item
    },
    onApproval() {
      const { id } = this.row
      const { approvalNotes } = this.forms.payment.fields
      const data = {
        approvalNotes,
        paymentStatusId: PaymentStatuses.APPROVED.id
      }
      this.isProcessing = true
      this.updatePayment(data, id)
        .then(({ data }) => {
          this.row.paymentStatusId = PaymentStatuses.APPROVED.id
          this.isProcessing = false
          this.showModalApproval = false
          showNotification(this, "success", "Approved Successfully.")
        }).catch((error) => {
          console.log(error)
          this.isProcessing = false;
        });
    },
    setDisapproval(row){
      clearFields(this.forms.payment)
      this.row = row.item
      this.showModalRejection = true
    },
    onDisapproval() {
      const { id } = this.row
      const { disapprovalNotes } = this.forms.payment.fields
      const data = {
        disapprovalNotes,
        paymentStatusId: PaymentStatuses.REJECTED.id
      }

      this.isProcessing = true
      this.updatePayment(data, id)
        .then(({ data }) => {
          this.row.paymentStatusId = PaymentStatuses.REJECTED.id
          this.isProcessing = false
          this.showModalRejection = false
          showNotification(this, "success", "Rejected Successfully.")
        }).catch((error) => {
          console.log(error)
          this.isProcessing = false;
        });
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        this.$set(row.item, 'isLoading', true)
        const { billingId, id } = row.item
        const params = { paginate: false }
        this.getBilling(billingId)
          .then(({ data }) => {
            this.$set(row.item, 'billing', data)
            this.getPaymentFileList(id, params)
              .then(({ data }) => {
                this.$set(row.item, 'files', data)
                row.item.isLoading = false
              }).catch((error) => {
                console.log(error)
                row.item.isLoading = false
              });
          }).catch((error) => {
            console.log(error)
            row.item.isLoading = false
          });
      }
      row.toggleDetails()
    },
    previewFile(row) {
      const { paymentId, id, name, notes } = row.item
      this.file.type = null
      this.file.src = null
      this.file.name = name
      this.file.notes = notes
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
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    
  },
}
</script>
<style scoped lang="scss">
 .preview__modal-description {
    z-index: 5000;
    position: fixed;
    height: 50px;
    background-color: white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 30px;
  }
</style>