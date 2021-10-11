<template>
  <div class="pending-grades__item" @click="$emit('onSelect', data)">
    <div class="item__overlay"  v-if="isProcessing" >
      <BSpinner />
    </div>
    <AvatarMaker
      :avatarId="10"
      :size="43"
      :text="personnelInitials"
      :borderSize="3"
    />
    <div class="pending-grades__content">
      <span class="pending-grades__content-headline">
        {{ data.personnel && data.personnel.name || ''}}
      </span>
      <span class="pending-grades__content-subheadline">
        <template v-if="StudentGradeStatuses.SUBMITTED.id === data.studentGradeStatusId">
          Submitted Grades from {{ sectionName }} / {{ subjectName }} for review.
        </template>
        <template v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === data.studentGradeStatusId">
          Requesting to edit Grades from {{ sectionName }} / {{ subjectName }}.
        </template>
      </span>

      <template v-if="isConfirmingFinalize || isConfirmingAllow || isConfirmingReject" >
        <div class="pending-grades__confirmation-container">
          <b-form-textarea rows="2" placeholder="You may add a notes or description" :style="{ fontSize: '12px' }" />
        </div>
        <div class="pending-grades__content-actions">
          <template v-if="isConfirmingFinalize">
            <button
              v-b-tooltip
              title="Once accepted, the grades will be posted and will reflect to Academic Transcript(TOR) of the Student."
              class="pending-grades__btn pending-grades__btn-primary active"
              @click.stop="onAcceptGrade">
              Confirm Accept
            </button>
          </template>
          <template v-else-if="isConfirmingAllow">
            <button
              v-b-tooltip
              title="Once allowed, the teacher or instructor will be able to edit the Grades again."
              class="pending-grades__btn pending-grades__btn-primary active"
              @click.stop="onAllowEditing">
              Confirm Allow
            </button>
          </template>
          <template v-else-if="isConfirmingReject">
            <button
              v-b-tooltip
              title="Once rejected, it will be remove in the pending list and the teacher or instructor will be able to edit the Grades."
              class="pending-grades__btn pending-grades__btn-secondary active"
              @click.stop="isConfirmingReject">
              Confirm Reject
            </button>
          </template>
          <button
            v-b-tooltip
            class="pending-grades__btn pending-grades__btn-secondary"
            @click.stop="isConfirmingFinalize = false, isConfirmingAllow = false, isConfirmingReject = false">
            Cancel
          </button>
        </div>
      </template>
      <div v-else class="pending-grades__content-actions">
        <template v-if="StudentGradeStatuses.SUBMITTED.id === data.studentGradeStatusId">
          <button
            v-b-tooltip
            title="Once accepted, the grades will be posted and will reflect to Academic Transcript(TOR) of the Student."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="isConfirmingFinalize = true">
            Accept
          </button>
        </template>
        <template v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === data.studentGradeStatusId">
          <button
            v-b-tooltip
            title="Once allowed, the teacher or instructor will be able to edit the Grades again."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="isConfirmingAllow = true">
            Allow
          </button>
        </template>
        <button
          v-b-tooltip
          title="Once rejected, it will be remove in the pending list and the teacher or instructor will be able to edit the Grades."
          class="pending-grades__btn pending-grades__btn-secondary"
          @click.stop="isConfirmingReject = true">
          Reject
        </button>
      </div>
    </div>
    <div class="pending-grades__other-content">
      <span class="pending-grades__content-subheadline" v-if="StudentGradeStatuses.SUBMITTED.id === data.studentGradeStatusId">
        {{ $options.formatDistance(new Date(data.submittedDate), new Date(), { addSuffix: false }) }}
      </span>
      <span class="pending-grades__content-subheadline" v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === data.studentGradeStatusId">
        {{ $options.formatDistance(new Date(data.editRequestedDate), new Date(), { addSuffix: false }) }}
      </span>
      <AvatarGroup
        :data="data.students"
      />
    </div>
    <div class="pending-grades__other-actions">
      <button class="pending-grades__action-view">
        <BIconChevronRight />
      </button>
    </div>
  </div>
</template>
<script>
import { StudentGradeStatuses } from '../../../helpers/enum';
import formatDistance from 'date-fns/formatDistance';
import { validate } from '../../../helpers/forms';
import { StudentGradeApi } from '../../../mixins/api';
export default {
  formatDistance,
  mixins: [StudentGradeApi],
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      StudentGradeStatuses,
      isProcessing: false,
      isConfirmingFinalize: false,
      isConfirmingAllow: false,
      isConfirmingReject: false
    };
  },
  methods: {
    onAcceptGrade() {
      // POST /student-grades/:id/finalize
      const { id: studentGradeId } = this.data
      this.isProcessing = true
      this.finalizeStudentGrade(studentGradeId).then(() => {
        this.$emit('onRemoveItem', studentGradeId)
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(null, errors, this)
        this.isProcessing = false
      });
    },
    onAllowEditing() {
      // POST /student-grades/:id/publish -> to allow instructor edit the grade again
      const { id: studentGradeId } = this.data
      this.isProcessing = true
      this.publishStudentGrade(studentGradeId).then(() => {
        this.$emit('onRemoveItem', studentGradeId)
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(null, errors, this)
        this.isProcessing = false
      });
    },
    onReject() {
      // POST /student-grades/:id/reject
      const { id: studentGradeId } = this.data
      this.isProcessing = true
      this.rejectStudentGrade(studentGradeId).then(() => {
        this.$emit('onRemoveItem', studentGradeId)
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(null, errors, this)
        this.isProcessing = false
      });
    }
  },
  computed: {
    personnelInitials() {
      const { firstName, lastName } = this.data.personnel
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    },
    subjectName() {
      const { subject } = this.data
      return subject ? `${subject.description}(${subject.name})` : ''
    },
    sectionName() {
      const { section } = this.data
      return section?.name || ''
    }
  }
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