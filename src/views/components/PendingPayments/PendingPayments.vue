<template>
  <div class="pending-grades__container">
    <div class="pending-grades__header">
      <span class="pending-grades__headline">
        <template v-if="hasSelected">
          <button class="pending-grades__action-back" @click="selected = null">
            <BIconChevronLeft />
          </button>
          Transaction No: {{ selected.transactionNo }}
        </template>
        <template v-else>
          Pending Payments for approval
        </template>
      </span>
    </div>
    <div
      v-show="!hasSelected"
      class="pending-grades__body"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isBusy"
      :infinite-scroll-distance="10">
      <template v-for="(item, idx) in data">
        <Request :key="idx" :data="item" @onRemoveItem="onRemoveItem" @onSelect="onSelectRequest" />
      </template>
      <div v-if="isBusy" class="loader__container">
        <BSpinner scale="1.2" />
      </div>
    </div>
    <div v-if="hasSelected" class="pending-grades__body">
      <PaymentView :paymentId="selected.id" />
    </div>
  </div>
</template>
<script>
import { PaymentApi, StudentGradeApi } from '../../../mixins/api';
import Request from './Item';
import PaymentView from './PaymentView';
import { PaymentStatuses } from '../../../helpers/enum'
export default {
  mixins: [StudentGradeApi,PaymentApi],
  components: {
    Request,
    PaymentView
  },
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      PaymentStatuses,
      isBusy: false,
      hasMore: true,
      nextPage: 1,
      data: [],
      perPage: 15,
      currentPage: 1,
      selected: null
    }
  },
  created() {

  },
  methods: {
    onSelectRequest(item) {
      this.selected = item
    },
    loadMore() {
      if (!this.hasMore) return;
      this.isBusy = true;

      const params = {
        paginate: true,
        page: this.currentPage,
        perPage: this.perPage,
        paymentStatusId: this.PaymentStatuses.PENDING.id,
      }
      this.getPaymentList(params).then(({ data }) => {
        this.data.push(...data.data)
        this.isBusy = false;
        this.hasMore = this.currentPage !== data.meta.lastPage;
        this.currentPage += 1
        this.$emit('update:count', data.meta.total);
      });
    },
    onRemoveItem(paymentId) {
      const index = this.data.findIndex(sg => sg.id === paymentId)
      this.data.splice(index, 1)
      this.$emit('update:count', this.count - 1);
      this.$emit('onApproveRejectItem')
      this.selected = null
    }
  },
  computed: {
    hasSelected() {
      return !!this.selected;
    },
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .pending-grades__container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .pending-grades__header {
    height: 40px;
    border-bottom: 1px solid $light-gray-10;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    box-shadow: 0 0.25rem 0.25rem $light-gray-100, inset 0 -1px 5px $light-gray-100;
  }

  .pending-grades__headline {
    font-size: 15px;
    font-weight: 500;
    color: $blue;
  }

  .pending-grades__body {
    flex: 1;
    overflow: auto;
    padding: 5px 12px;
  }

  .loader__container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .pending-grades__action-back {
    border: 0;
    outline: none;
    background: none;
    margin: 0;
    border-radius: 5px;
    padding: 3px;
    margin-right: 5px;

    &:hover {
      background-color: $light-gray-100;
    }
  }
</style>