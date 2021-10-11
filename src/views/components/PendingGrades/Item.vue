<template>
  <div class="pending-grades__item">
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
      <div class="pending-grades__content-actions">
        <template v-if="StudentGradeStatuses.SUBMITTED.id === data.studentGradeStatusId">
          <button
            v-b-tooltip
            title="Once accepted, the grades will be posted and will reflect to Academic Transcript(TOR) of the Student."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="onAcceptGrade">
            Accept
          </button>
        </template>
        <template v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === data.studentGradeStatusId">
          <button
            v-b-tooltip
            title="Once allowed, the teacher or instructor will be able to edit the Grades again."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="onAllowEditing">
            Allow
          </button>
        </template>
        <button
          v-b-tooltip
          title="Once rejected, it will be remove in the pending list and the teacher or instructor will be able to edit the Grades."
          class="pending-grades__btn pending-grades__btn-secondary"
          @click.stop="onReject">
          Reject
        </button>
      </div>
    </div>
    <div class="pending-grades__other-content">
      <span class="pending-grades__content-subheadline" v-if="StudentGradeStatuses.SUBMITTED.id === data.studentGradeStatusId">
        {{ $options.formatDistance(new Date(data.submittedDate), new Date(), { addSuffix: true }) }}
      </span>
      <span class="pending-grades__content-subheadline" v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === data.studentGradeStatusId">
        {{ $options.formatDistance(new Date(data.editRequestedDate), new Date(), { addSuffix: true }) }}
      </span>
      <AvatarGroup
        :data="data.students" />
    </div>
  </div>
</template>
<script>
import { StudentGradeStatuses } from '../../../helpers/enum';
import formatDistance from 'date-fns/formatDistance';
import { showNotification } from '../../../helpers/forms';
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
      isProcessing: false
    };
  },
  methods: {
    onAcceptGrade() {
      // POST /student-grades/:id/finalize
      const { id: studentGradeId } = this.data
      this.isProcessing = true
      this.finalizeStudentGrade(studentGradeId).then(({ data }) => {
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
      this.publishStudentGrade(studentGradeId).then(({ data }) => {
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
      this.rejectStudentGrade(studentGradeId).then(({ data }) => {
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
      return `${firstName && firstName.charAt(0) || ''}${lastName && lastName.charAt(0) || ''}`
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
    font-size: 12.5px;
    background: none;
    border-radius: 4px;
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
  }

  .pending-grades__btn-secondary {
    color: $dark-gray-100;

    &:hover {
      background-color: $light-gray-100;
    }
  }
</style>