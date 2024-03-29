<template>
  <div class="pending-grades__container">
    <div class="pending-grades__header">
      <span class="pending-grades__headline">
        <template v-if="hasSelected">
          <button class="pending-grades__action-back" @click="selected = null">
            <BIconChevronLeft />
          </button>
          {{ `${section && section.name || 'N/A' } / ${subject && subject.description || 'N/A' }` }}
        </template>
        <template v-else>
          Pending Grades for Review
        </template>
      </span>
    </div>
    <div
      v-show="count > 0 && !hasSelected"
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
    <div v-if="count > 0 && hasSelected" class="pending-grades__body">
      <GradeView :gradeId="selected.id" />
    </div>
    <template v-if="count === 0">
     <div class="empty__container">
        <img src="img/mailbox.svg" class="image__empty-requests" />
        <h6>No Pending Requests</h6>
     </div>
    </template>
  </div>
</template>
<script>
import { StudentGradeApi } from '../../../mixins/api';
import Request from './Item';
import GradeView from './GradeView';
import { StudentGradeStatuses } from '../../../helpers/enum'
export default {
  mixins: [StudentGradeApi],
  components: {
    Request,
    GradeView
  },
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      StudentGradeStatuses,
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
        studentGradeStatusId: [this.StudentGradeStatuses.SUBMITTED.id, this.StudentGradeStatuses.REQUEST_EDIT.id],
      }
      this.getStudentGradeList(params).then(({ data }) => {
        this.data.push(...data.data)
        this.isBusy = false;
        this.hasMore = this.currentPage !== data.meta.lastPage;
        this.currentPage += 1
        this.$emit('update:count', data.meta.total);
      });
    },
    onRemoveItem(studentGradeId) {
      const index = this.data.findIndex(sg => sg.id === studentGradeId)
      this.data.splice(index, 1)
      this.$emit('update:count', this.count - 1);
      this.selected = null
    }
  },
  computed: {
    hasSelected() {
      return !!this.selected;
    },
    section() {
      return this.selected?.section || null
    },
    subject() {
      return this.selected?.subject || null
    }
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

  .image__empty-requests {
    height: auto;
    width: 100%;
  }

  .empty__container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
</style>