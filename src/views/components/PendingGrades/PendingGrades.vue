<template>
  <div class="pending-grades__container">
    <div class="pending-grades__header">
      <span class="pending-grades__headline">
        Pending Grades for Review
      </span>
    </div>
    <div
      class="pending-grades__body"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isBusy"
      :infinite-scroll-distance="10">
      <template v-for="(item, idx) in data">
        <Request :key="idx" :data="item" @onRemoveItem="onRemoveItem"/>
      </template>
      <div v-if="isBusy" class="loader__container">
        <BSpinner scale="1.2" />
      </div>
    </div>
  </div>
</template>
<script>
import { StudentGradeApi } from '../../../mixins/api';
import Request from './Item';
import { StudentGradeStatuses } from '../../../helpers/enum'
export default {
  mixins: [StudentGradeApi],
  components: {
    Request
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
    }
  },
  created() {

  },
  methods: {
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
    min-height: 35px;
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
</style>