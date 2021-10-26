<template>
  <div class="pending-grades__item" >
    <div class="item__overlay"  v-if="isProcessing" >
      <BSpinner />
    </div>
    <AvatarMaker
      :avatarId="10"
      :size="43"
      :text="studentInitials"
      :borderSize="3"
      :src="photo"/>
    <div class="pending-grades__content">
      <span class="pending-grades__content-headline">
        {{ student && student.name  || ''}}
      </span>
      <span class="pending-grades__content-subheadline">
        Submitted payment waiting for review and approval.
        <div class="mt-1">
          <b-badge variant="secondary" class="mr-2">{{ data.transactionNo }}</b-badge>
          <b-badge variant="primary" class="mr-2">{{ data.paymentMode && data.paymentMode.name || 'N/A' }}</b-badge>
          <b-badge variant="success">{{ data.amount }}</b-badge>
        </div>
      </span>

      <template v-if="isConfirmingFinalize || isConfirmingReject" >
        <div class="pending-grades__confirmation-container">
          <template v-if="isConfirmingFinalize">
            <PaymentFiles :paymentId="data.id" :studentId="data.student.id" :isConfirmingFinalize="isConfirmingFinalize"/>
            <b-form-group
              :state="forms.payment.states.referenceNo"
              :invalid-feedback="forms.payment.errors.referenceNo">
              <b-form-input
                placeholder="Reference no of the payment."
                :style="{ fontSize: '12px' }"
                v-model="forms.payment.fields.referenceNo"
              />
            </b-form-group>
            <b-form-group
              :state="forms.payment.states.approvalNotes"
              :invalid-feedback="forms.payment.errors.approvalNotes">
              <b-form-textarea
                rows="2"
                placeholder="You may add a notes or description"
                :style="{ fontSize: '12px' }"
                v-model="forms.payment.fields.approvalNotes"
              />
            </b-form-group>
          </template>
          <template v-else>
            <b-form-group
              :state="forms.payment.states.disapprovalNotes"
              :invalid-feedback="forms.payment.errors.disapprovalNotes">
              <b-form-textarea
                rows="2"
                placeholder="You may add a notes or description"
                :style="{ fontSize: '12px' }"
                v-model="forms.payment.fields.disapprovalNotes"
              />
            </b-form-group>
          </template>
        </div>
        <div class="pending-grades__content-actions">
          <template v-if="isConfirmingFinalize">
            <button
              v-b-tooltip
              title="Once accepted, the payment will be posted.."
              class="pending-grades__btn pending-grades__btn-primary active"
              @click.stop="onApprove">
              Confirm Approved
            </button>
          </template>
          <template v-else-if="isConfirmingReject">
            <button
              v-b-tooltip
              title="Once rejected, it will be remove in the pending list."
              class="pending-grades__btn pending-grades__btn-secondary active"
              @click.stop="onReject">
              Confirm Reject
            </button>
          </template>
          <button
            v-b-tooltip
            class="pending-grades__btn pending-grades__btn-secondary"
            @click.stop="isConfirmingFinalize = false, isConfirmingReject = false">
            Cancel
          </button>
        </div>
      </template>
      <div v-else class="pending-grades__content-actions">
        <template>
          <button
            v-b-tooltip
            title="Once approved, the grades will be posted."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="isConfirmingFinalize = true">
            Approved
          </button>
        </template>
        <button
          v-b-tooltip
          title="Once rejected, it will be remove in the pending list."
          class="pending-grades__btn pending-grades__btn-secondary"
          @click.stop="isConfirmingReject = true">
          Reject
        </button>
      </div>
    </div>
    <div class="pending-grades__other-content">
      <span class="pending-grades__content-subheadline">
        {{ $options.formatDistance(new Date(data.datePaid), new Date(), { addSuffix: false }) }}
      </span>
    </div>
    <div class="pending-grades__other-actions" @click="$emit('onSelect', data)">
      <button class="pending-grades__action-view">
        <BIconChevronRight />
      </button>
    </div>
  </div>
</template>
<script>
import { PaymentStatuses } from '../../../helpers/enum';
import formatDistance from 'date-fns/formatDistance';
import { clearFields, reset, validate } from '../../../helpers/forms';
import { PaymentApi } from '../../../mixins/api';
import { getFilePath } from '../../../helpers/utils'
import PaymentFiles from './PaymentFiles'

const paymentFields = {
  approvalNotes: null,
  disapprovalNotes: null,
  referenceNo: null
}

export default {
  formatDistance,
  getFilePath,
  mixins: [ PaymentApi ],
  components: { PaymentFiles },
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      PaymentStatuses,
      isProcessing: false,
      isConfirmingFinalize: false,
      isConfirmingReject: false,
      forms: {
        payment: {
          fields: { ...paymentFields },
          states: { ...paymentFields },
          errors: { ...paymentFields }
        }
      }
    }
  },
  methods: {
    onApprove() {
      // POST /student-grades/:id/finalize
      const { id: paymentId } = this.data
      const { payment, payment: { fields: { approvalNotes, referenceNo }} } = this.forms
      this.isProcessing = true
      reset(payment)
      this.approvePayment({ approvalNotes, referenceNo }, paymentId).then(() => {
        this.isProcessing = false
        this.$emit('onRemoveItem', paymentId)
        this.isConfirmingFinalize  = false
        clearFields(payment.fields)
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(payment, errors, this)
        this.isProcessing = false
      });
    },
    onReject() {
      // POST /student-grades/:id/reject
      const { id: paymentId } = this.data
      const { payment, payment: { fields: { disapprovalNotes }} } = this.forms
      this.isProcessing = true
      reset(payment)
      this.rejectPayment({ disapprovalNotes }, paymentId).then(() => {
        this.$emit('onRemoveItem', paymentId)
        this.isProcessing = false
        clearFields(payment.fields)
        this.isConfirmingReject= false
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(payment, errors, this)
        this.isProcessing = false
      });
    },
  },
  computed: {
    student() {
      return this.data?.student || null
    },
    studentInitials() {
      const { firstName, lastName } = this.data.student
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    },
    photo() {
      const { photo } = this.data.student
      if(!photo) {
        return ''
      }
      return this.$options.getFilePath(photo.hashName)
    }
  },
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .pending-grades__item {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 6px 5px;
    border-bottom: 1px solid $light-gray-100;
    position: relative;
    cursor: pointer;

    &:hover {
      .pending-grades__action-view {
        background-color: $light-blue-20;
        color: $blue;
      }
    }
  }

  .item__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.7;
    background-color: whitesmoke;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pending-grades__content {
    flex: 1;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
  }

  .pending-grades__content-headline {
    font-weight: 500;
  }

  .pending-grades__content-subheadline {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: $dark-gray-200;
  }


  .pending-grades__other-content {
    display: flex;
    flex-direction: column;
  }

  .pending-grades__content-actions {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }

  .pending-grades__btn {
    border: 0;
    outline: none;
    font-size: 12px;
    background: none;
    border-radius: 3px;
    font-weight: 500;

    & ~ .pending-grades__btn {
      margin-left: 15px;
    }
  }

  .pending-grades__btn-primary {
    color: $blue;

    &:hover {
      background-color: $light-blue-20;
    }

    &.active {
      background-color: $blue;
      color: $white;
    }
  }

  .pending-grades__btn-secondary {
    color: $dark-gray-100;

    &:hover {
      background-color: $light-gray-100;
    }

    &.active {
      background-color: $light-gray-100;
      color: $dark-gray-300;
    }
  }

  .pending-grades__confirmation-container {
    margin: 10px 0;
  }

  .pending-grades__other-actions {
    min-height: 100%;
    display: flex;
    align-items: center;
    margin-left: 18px;
  }

  .pending-grades__action-view {
    background: none;
    outline: none;
    border: 0;
    border-radius: 5px;
    padding: 3px;
    color: $black;

    &:hover {
      background-color: $light-blue-20;
      color: $blue;
    }
  }
</style>