<template>
  <div class="container">
    <h4 class="grade-view__title">
      Payment
    </h4>
    <InlineItem label="Name: ">
      <div class="inline-contents">
        <AvatarMaker
          :avatarId="1"
          :size="33"
          :text="personnelInitials"
          :borderSize="3"
          class="m-auto"
          :src="photo"
        />
        <span class="ml-1">{{ student && student.name || '' }}</span>
      </div>
    </InlineItem>
    <InlineItem label="Student No: ">
       {{ student && student.studentNo || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Address: ">
      {{ student && student.currentAddress || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Transaction No: ">
      {{ payment && payment.transactionNo || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Reference No: ">
      {{ payment && payment.referenceNo || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Payment Type: ">
      {{ paymentMode && paymentMode.name || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Billing No: ">
      {{ billing && billing.billingNo || 'Not Registered' }}
    </InlineItem>
    <InlineItem label="Notes: ">
      {{ payment && payment.notes || '' }}
    </InlineItem>
    <br />
    <div>
      <h4 class="grade-view__title">
        Billing Details
      </h4>
      <BillingItems :billingId="payment.billingId"/>
    </div>
    <br />
    <div>
      <h4 class="grade-view__title">
        Payment Files
      </h4>
      <PaymentFiles :paymentId="paymentId" :owner="student"/>
      <!-- <AttachmentList
        class="mt-2"
        :items="payment.files"
        titleKey="name"
        descriptionKey="notes"
        @onAttachmentItemView="(file) => previewFile(file)"
        @onAttachmentItemDownload="(file) => onDownloadFile(file)"
      />
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
      /> -->
    </div>
    <br />
  </div>
</template>
<script>
import { validate } from '../../../helpers/forms';
import { PaymentApi, PaymentFileApi } from '../../../mixins/api';
import BillingItems from './BillingItems';
import AttachmentList from '../Attachment/AttachmentList';
import { getFilePath } from '../../../helpers/utils';
import PaymentFiles from '../../components/PaymentFiles/List'

export default {
  getFilePath,
  props: {
    paymentId: {
      type: [String, Number]
    }
  },
  mixins: [PaymentApi,PaymentFileApi],
  components: {
    BillingItems,
    AttachmentList,
    PaymentFiles
  },
  data() {
    return {
      payment: {},
      lastActiveFile: null,
      fileViewer: {
        paymentFile: {
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
    }
  },
  created() {
    // GET /student-grades/:id
    this.getPayment(this.paymentId).then(({ data }) => {
      this.payment = data
    }).catch((error) => {
      const errors = error.response.data.errors
      validate(null, errors, this)
    });
  },
  methods: {
    setupActiveFileViewer(row) {
      this.lastActiveFile = row.item;
      this.fileViewer.paymentFile.isActiveNavEnabled =
        this.payment?.files?.length > 1;
      this.fileViewer.paymentFile.activeNavCount = this.payment?.files?.length;
      this.fileViewer.paymentFile.activeNavIndex = row.index;
    },
    previewFile(row) {

      this.setupActiveFileViewer(row);
      const { paymentId, id, name, notes } = row.item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.fileViewer.paymentFile.show = true;
      this.file.owner = this.student
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
    onFileNavLeft() {
      const files = this.payment.files
      const { activeNavIndex } = this.fileViewer.paymentFile
      let currentIdx = activeNavIndex
      const isFirst = currentIdx === 0;
      currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem);
    },
    onFileNavRight() {
      const files = this.payment.files
      const { activeNavIndex } = this.fileViewer.paymentFile
      let currentIdx = activeNavIndex
      const isLast = currentIdx === files.length - 1;
      currentIdx = isLast ? 0 : currentIdx + 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem);
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
  },
  computed: {
    student() {
      return this.payment?.student || {}
    },
    personnelInitials() {
      const { firstName, lastName } = this.student
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    },
    photo() {
      const { photo } = this.student
      if(!photo) {
        return ''
      }
      return this.$options.getFilePath(photo.hashName)
    },
    paymentMode() {
      return this.payment?.paymentMode || null
    },
    billing() {
      return this.payment?.billing || null
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .container {
    padding: 20px;
    width: 100%;
    height: 100%;
  }

  .inline-contents {
    display: flex;
    align-items: center;
  }

  .grade-view__title {
    font-size: 18px;
    margin-bottom: 15px;
  }
</style>