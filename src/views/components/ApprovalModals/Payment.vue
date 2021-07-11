<template>
  <div>
    <b-modal
      :visible="isShown"
      size="md"
      title="Approve Payment"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      bodyClass="modal-body__container"
      @hidden="$emit('update:isShown', false)"
      :centered="true">
      <div class="modal-field-container overflow-visible">
        <div class="files-container">

        <FileUploader
          @onFileChange="onPaymentReceiptFileUpload"
          @onFileDrop="onPaymentReceiptFileUpload"
          class="uploader"
        />

        <FileItem
          v-for="(item, index) of receiptFiles"
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

        <b-form-group
          :state="forms.payment.states.referenceNo"
          :invalid-feedback="forms.payment.errors.referenceNo">
            <label class="required"> Reference No
              <v-icon
                name="info-circle"
                class="icon-tooltip"
                v-b-tooltip.hover="{
                  variant: 'info',
                  title:
                    'OR number of the receipt or any transaction number that can be use for tracking.',
                }"
              /></label>
            <b-form-input
              v-model="forms.payment.fields.referenceNo" />
        </b-form-group>

        <b-form-group
          :state="forms.payment.states.approvalNotes"
          :invalid-feedback="forms.payment.errors.approvalNotes">
            <label> Notes</label>
            <b-textarea
              v-model="forms.payment.fields.approvalNotes"
              rows="7" />
        </b-form-group>
      </div>
      <template v-slot:modal-footer>
        <FooterAction
          confirmText="Confirm Approval"
          @onConfirm="onApprovePayment"
          @onCancel="$emit('onCancel')"
          :isConfirmBusy="forms.payment.isProcessing"
        />
      </template>
    </b-modal>

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
    </b-modal>

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
  </div>
</template>
<script>
import { reset, showNotification, validate } from '../../../helpers/forms';
import FooterAction from '../ModalFooter/ActionBar';
import { PaymentApi, PaymentReceiptFileApi } from '../../../mixins/api';
import FileUploader from '../FileUploader'
import FileItem from '../FileItem'
import { copyValue } from '../../../helpers/extractor';

const paymentFields = {
  referenceNo: null,
  approvalNotes: null
}

const paymentReceiptFileFields = {
  id: null,
  studentId: null,
  notes: null,
};

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    paymentId: {
      type: [Number, String]
    },
    studentId: {
      type: [Number, String]
    }
  },
  mixins: [ PaymentApi, PaymentReceiptFileApi ],
  components: {
    FooterAction,
    FileUploader,
    FileItem
  },
  data() {
    return {
      forms: {
        payment: {
          isProcessing: false,
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields }
        },
        paymentReceiptFile: {
          isUpdating: false,
          isDeleting: false,
          fields: { ...paymentReceiptFileFields },
          states: { ...paymentReceiptFileFields },
          errors: { ...paymentReceiptFileFields },
        },
      },
      fileViewer: {
        paymentReceiptFile: {
          isActiveNavEnabled: false,
          activeNavCount: 0,
          activeNavIndex: 0,
          show: false,
        },
      },
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      receiptFiles: [],
      selectedPaymentReceiptFileIndex: null,
      showPaymentReceiptFileModal: false
    }
  },
  created() {
    this.loadPaymentReceiptFiles()
  },
  methods: {
    onApprovePayment() {
      const { payment, payment: { fields } } = this.forms
      payment.isProcessing = true

      reset(payment)
      this.approvePayment({...fields}, this.paymentId).then(({ data }) => {
          payment.isProcessing = false
          showNotification(this, 'success', 'Payment has been approved.')
          this.$emit('update: isShown', false)
          this.$emit('onApproved')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(payment, errors, this)
        payment.isProcessing = false
      });
    },
    loadPaymentReceiptFiles() {
      const params = { paginate: false}
      this.getPaymentReceiptFiles(this.paymentId, params).then(({ data }) => {
        this.receiptFiles = data
      })
    },
    onPaymentReceiptFileUpload(file) {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('studentId', this.studentId);

      this.receiptFiles.push({
        id: null,
        name: null,
        notes: null,
        isBusy: true,
      });
      const receiptFile = this.receiptFiles[
        this.receiptFiles.length - 1
      ];
      const { isBusy, ...paymentReceiptKeys } = receiptFile;

      this.addPaymentReceiptFile(formData, this.paymentId).then(({ data }) => {
        copyValue(data, receiptFile, Object.keys(paymentReceiptKeys));
        receiptFile.isBusy = false;
      })
      .catch((error) => {
        this.receiptFiles.splice(this.receiptFiles.length - 1, 1);
      });
    },
    onDeletePaymentReceiptFile(index) {
      const selectedFile = this.receiptFiles[index];
      const { paymentReceiptFile } = this.forms;
      paymentReceiptFile.isDeleting = true;
      selectedFile.isBusy = true;
      this.deletePaymentReceiptFile(this.paymentId, selectedFile.id)
        .then(() => {
          paymentReceiptFile.isDeleting = false;
          this.showPaymentReceiptFileModal = false;
          this.receiptFiles.splice(index, 1);
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

      paymentReceiptFile.fields.id = this.receiptFiles[idx].id;
      paymentReceiptFile.fields.notes = this.receiptFiles[idx].notes;

      this.showPaymentReceiptFileModal = true;
    },
    setupPaymentReceiptActiveFileViewer(index) {
      this.lastActiveFile = this.receiptFiles[index];
      this.fileViewer.paymentReceiptFile.isActiveNavEnabled = true;
      this.fileViewer.paymentReceiptFile.activeNavCount = this.receiptFiles?.length;
      this.fileViewer.paymentReceiptFile.activeNavIndex = index;
    },
    previewPaymentReceiptFile(index) {
      this.setupPaymentReceiptActiveFileViewer(index);
      const selectedFile = this.receiptFiles[index];
      const { userable } = this.$store?.state?.user;
      this.file.type = null;
      this.file.src = null;
      this.file.name = selectedFile?.name;
      this.file.notes = selectedFile?.notes;
      this.file.isLoading = true;
      this.fileViewer.paymentReceiptFile.show = true;
      this.file.owner = userable;

      this.getPaymentReceiptFilePreview(this.paymentId, selectedFile.id).then(
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
    onUpdatePaymentReceiptFile() {
      const { paymentReceiptFile } = this.forms;

      const selectedFile = this.receiptFiles[
        this.selectedPaymentReceiptFileIndex
      ];
      paymentReceiptFile.isUpdating = true;
      selectedFile.isBusy = true;

      this.updatePaymentReceiptFile(
        paymentReceiptFile.fields,
        this.paymentId,
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
          validate(paymentReceiptFile, errors, this);
          paymentReceiptFile.isUpdating = false;
          selectedFile.isBusy = false;
        });
    },
    onPaymentReceiptFileNavLeft() {
      const files = this.receiptFiles;
      let currentIdx = this.receiptFiles.indexOf(this.lastActiveFile);
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
      const files = this.receiptFiles;
      let currentIdx = this.receiptFiles.indexOf(this.lastActiveFile);
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
  },
};
</script>
<style lang="scss" scoped>
  .uploader {
    height: 200px;
    margin-bottom: 20px;
  }
</style>
