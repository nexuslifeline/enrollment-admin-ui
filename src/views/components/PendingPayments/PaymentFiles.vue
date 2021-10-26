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

    <b-modal
      v-model="showPaymentReceiptFileModal"
      centered
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true">
      <div slot="modal-title">
        Payment Receipt File
      </div>
      <b-row>
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
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-left"
          @click="onDeletePaymentReceiptFile(selectedPaymentReceiptFileIndex)"
          variant="dark">
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
          variant="primary">
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
import { reset, validate } from '../../../helpers/forms';
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
      paymentReceiptFiles: [],
      selectedPaymentReceiptFileIndex: null,
      showPaymentReceiptFileModal: false
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
    setupPaymentReceiptActiveFileViewer(index) {
      this.lastActiveFile = this.paymentReceiptFiles[index];
      this.fileViewer.paymentReceiptFile.isActiveNavEnabled = true;
      this.fileViewer.paymentReceiptFile.activeNavCount = this.paymentReceiptFiles?.length;
      this.fileViewer.paymentReceiptFile.activeNavIndex = index;
    },
    previewPaymentReceiptFile(index) {
      this.setupPaymentReceiptActiveFileViewer(index);
      const selectedFile = this.paymentReceiptFiles[index];
      const { userable } = this.$store?.state?.user;
      this.file.type = null;
      this.file.src = null;
      this.file.name = selectedFile?.name;
      this.file.notes = selectedFile?.notes;
      this.file.isLoading = true;
      this.fileViewer.paymentReceiptFile.show = true;
      this.file.owner = userable;

      this.getPaymentReceiptFilePreview(this.paymentId, selectedFile.id).then((response) => {
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

      const selectedFile = this.paymentReceiptFiles[this.selectedPaymentReceiptFileIndex];
      paymentReceiptFile.isUpdating = true;
      selectedFile.isBusy = true;

      this.updatePaymentReceiptFile( paymentReceiptFile.fields,this.paymentId,paymentReceiptFile.fields.id).then(({ data }) => {
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
    onDeletePaymentReceiptFile(index) {
      const selectedFile = this.paymentReceiptFiles[index];
      const { paymentReceiptFile } = this.forms;
      paymentReceiptFile.isDeleting = true;
      selectedFile.isBusy = true;
      this.deletePaymentReceiptFile(this.paymentId, selectedFile.id)
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