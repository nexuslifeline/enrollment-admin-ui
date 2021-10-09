<template>
  <div class="pending-grades__item">
    <AvatarMaker
      :avatarId="10"
      :size="43"
      :text="`PR`"
      :borderSize="3"
    />
    <div class="pending-grades__content">
      <span class="pending-grades__content-headline">
        Paul Christian Rueda
      </span>
      <span class="pending-grades__content-subheadline">
        <template v-if="StudentGradeStatuses.SUBMITTED.id === 3">
          Submitted Grades from BSIT-1A for review.
        </template>
        <template v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === 4">
          Requesting to edit Grades from BSIT-1A.
        </template>
      </span>
      <div class="pending-grades__content-actions">
        <template v-if="StudentGradeStatuses.SUBMITTED.id === 3">
          <button
            v-b-tooltip
            title="Once accepted, the grades will be posted and will reflect to Academic Transcript(TOR) of the Student."
            class="pending-grades__btn pending-grades__btn-primary"
            @click.stop="onAcceptGrade">
            Accept
          </button>
        </template>
        <template v-else-if="StudentGradeStatuses.REQUEST_EDIT.id === 4">
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
      <span class="pending-grades__content-subheadline">
        {{ $options.formatDistance(new Date('2021-10-05'), new Date(), { addSuffix: true }) }}
      </span>
      <AvatarGroup
        :data="[
          { id: 1, name: 'Gelyn Joy Rueda' },
          { id: 2, name: 'Kaezer Paul Rueda' },
          { id: 3, name: 'Elizabeth Rueda' },
          { id: 4, name: 'Jennifer Rueda' },
          { id: 5, name: 'Irene Rueda' },
          { id: 6, name: 'Paulino Rueda' }
        ]" />
    </div>
  </div>
</template>
<script>
import { StudentGradeStatuses } from '../../../helpers/enum';
import formatDistance from 'date-fns/formatDistance';
export default {
  formatDistance,
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      StudentGradeStatuses
    };
  },
  methods: {
    onAcceptGrade() {
      // POST /student-grades/:id/finalize
    },
    onAllowEditing() {
      // POST /student-grades/:id/publish -> to allow instructor edit the grade again
    },
    onReject() {
      // POST /student-grades/:id/reject
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