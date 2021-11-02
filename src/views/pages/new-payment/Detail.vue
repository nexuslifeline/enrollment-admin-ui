<template>
  <Panel @onClose="$router.push({ name: 'NewPayment' })" :isBusy="isLoading" showNotes>
    <!-- <template v-slot:header>
      <b-badge
        v-if="$options.EvaluationStatuses.APPROVED.academicRecordStatuses.includes(academicRecordStatusId)"
        variant="success"
        class="ml-2">
        Approved
      </b-badge>
      <b-badge
        v-else-if="$options.EvaluationStatuses.REJECTED.academicRecordStatuses.includes(academicRecordStatusId)"
        variant="danger"
        class="ml-2">
        Rejected
      </b-badge>
      <b-badge
        v-else
        variant="warning"
        class="ml-2">
        Pending
      </b-badge>
    </template> -->
    <!-- <template v-slot:actions>
      <b-dropdown
        right
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
        boundary="window">
        <template v-slot:button-content>
          <BIconThreeDots />
        </template>
        <b-dropdown-item
          @click="onAcceptTransferCredit"
          v-if="isAccessible($options.EvaluationPermissions.ACCEPT_CREDITS.id) && showOptions">
          Accept Transfer Credit
        </b-dropdown-item>
        <b-dropdown-item @click="onApproveRequest" >
          Approve Request
        </b-dropdown-item>
        <b-dropdown-item @click="onRejectionRequest">
          Reject Request
        </b-dropdown-item>
      </b-dropdown>
    </template> -->
    <template v-slot:content>
      <SlidePanelNotes>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dolorem corrupti iure rem sit blanditiis eveniet neque eaque perspiciatis porro.
      </SlidePanelNotes>
      <div class="group__content">
        <template v-if="student">
          <h4 class="content-title">Student Profile</h4>
          <StudentView
            v-if="student"
            :data="student" />
        </template>
      </div>
      <SlidePanelNotes>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dolorem corrupti iure rem sit blanditiis eveniet neque eaque perspiciatis porro.
      </SlidePanelNotes>
      <div class="group__content">
        <h4 class="content-title">Payment Details</h4>
        <PaymentView :data="data"/>
        <h4 class="content-title">Payment Files</h4>
        <PaymentFiles :paymentId="paymentId" :owner="student"/>
        <h4 class="content-title">Payment Receipt Files</h4>
        <PaymentReceiptFiles :paymentId="paymentId" :owner="student"/>
      </div>
    </template>
  </Panel>
</template>

<script>
import { PaymentApi } from '../../../mixins/api'
import Panel from '../../components/SlidePanel/Panel'
import PanelNotes from '../../components/SlidePanel/PanelNotes'
import PaymentFiles from '../../components/PaymentFiles/List'
import PaymentReceiptFiles from '../../components/PaymentReceiptFiles/List'

export default {
  components: { Panel, PanelNotes, PaymentFiles, PaymentReceiptFiles },
  mixins: [ PaymentApi ],
  data() {
    return {
      data: {},
      isLoading: false
    }
  },
  created() {
    this.loadPayment()
  },
  methods: {
    loadPayment() {
      this.isLoading = true;
      this.getPayment(this.paymentId).then(({ data }) => {
        this.data = data;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
      });
    }
  },
  computed: {
    paymentId() {
      return this.$route.params.paymentId;
    },
    student() {
      return this.data?.student
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .tab__content {
    display: flex;
    flex-direction: column;
    margin: 30px 0;
    padding: 0;
  }

  .action__accept-credit {
    border: 0;
    outline: none;
    background: none;
    margin: 10px 0  25px 0;
    color: $blue;
    padding: 0;

    &:hover {
      color: $dark-blue;
    }
  }

  .approval__content {
    margin-left: -1px;
    width: 100%;
    position: relative;
  }

  .group__content {
    padding: 15px 25px;
  }

  .action__accept-credit {
    border: 0;
    outline: none;
    background: none;
    color: $blue;
    padding: 0;

    &:hover {
      color: $dark-blue;
    }
  }
</style>