<template>
  <div>
    <FileUploader
      @onFileChange="onPaymentReceiptFileUpload"
      @onFileDrop="onPaymentReceiptFileUpload"
      class="uploader"
    />

    <FileItem
      v-for="(item, index) in paymentReceiptFiles"
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
</template>

<script>
const paymentReceiptFileFields = {
  id: null,
  studentId: null,
  notes: null,
};
import FileUploader from '../FileUploader'
import FileItem from '../FileItem'
import { PaymentReceiptFileApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
export default {
  components: { FileUploader, FileItem },
  mixins: [ PaymentReceiptFileApi ],
  props: {
    paymentId: {
      type: [Number, String]
    },
    studentId: {
      type: [Number,String]
    },
    isConfirmingFinalize: {
      type: [Boolean],
      default: false
    },
  },
  data() {
    return {
      forms: {
        paymentReceiptFile: {
          isUpdating: false,
          isDeleting: false,
          fields: { ...paymentReceiptFileFields },
          states: { ...paymentReceiptFileFields },
          errors: { ...paymentReceiptFileFields },
        },
      },
      paymentReceiptFiles: []
    }
  },
  methods: {
    loadReceiptFiles(){
      const { paymentId } = this
      const params = { paginate: false }
      this.getPaymentReceiptFiles(paymentId, params).then(({ data }) => {
        this.paymentReceiptFiles = data
      })
    },
    onPaymentReceiptFileUpload(file) {
      const formData = new FormData();
      const { paymentId, studentId } = this

      formData.append('file', file);
      formData.append('studentId', studentId);
      const { paymentReceiptFiles } = this
      paymentReceiptFiles.push({
        id: null,
        name: null,
        notes: null,
        isBusy: true,
      });
      const receiptFile = paymentReceiptFiles[
        paymentReceiptFiles.length - 1
      ];
      const { isBusy, ...paymentReceiptKeys } = receiptFile;

      this.addPaymentReceiptFile(formData, paymentId).then(({ data }) => {
        copyValue(data, receiptFile, Object.keys(paymentReceiptKeys));
        receiptFile.isBusy = false;
      })
      .catch((error) => {
        paymentReceiptFiles.splice(paymentReceiptFiles.length - 1, 1);
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
    onDeletePaymentReceiptFile() {

    },
    previewPaymentReceiptFile() {

    }
  },
  watch: {
    isConfirmingFinalize: {
      immediate: true,
      handler() {
        if(this.isConfirmingFinalize) {
           this.loadReceiptFiles();
        }
      }
    },
  }
}
</script>

<style lang="scss">
  .uploader {
    height: 180px;
    margin-bottom: 10px;
    padding: 20px;

    .file-uploader {
      height: 60%!important;
      width: 60%!important;
    }
  }
</style>