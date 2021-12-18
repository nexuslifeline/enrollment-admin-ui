<template>
  <Panel @onClose="$router.push({ name: 'NewPayment' })" :isBusy="isLoading" showNotes>
    <template v-slot:header>
      <span class="title"> Payment Details </span>
    </template>
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

  .title {
    font-size: 12pt;
    margin-left: 10px;
    font-weight: bold;
  }
</style>