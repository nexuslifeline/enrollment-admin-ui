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
         <Request :key="idx" />
      </template>
      <div v-if="isBusy" class="loader__container">
        <BSpinner scale="1.2" />
      </div>
    </div>
  </div>
</template>
<script>
import Request from './Item';
export default {
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
      isBusy: false,
      hasMore: true,
      nextPage: 1,
      data: []
    }
  },
  created() {
    this.$emit('update:count', 10);
  },
  methods: {
    loadMore() {
      if (!this.hasMore) return;
      // GET /student-grades
      // with SUBMITTED and REQUEST EDIT status
      // as workaround to make sure the container will have a scroll, set 15 perPage in the request. seems the current package doesnt support this yet
      console.log('loadMore')
      this.isBusy = true;

      setTimeout(() => {
        this.data = Array.from({ length: this.nextPage * 15 });
        this.nextPage = this.nextPage + 1;
        this.hasMore = this.nextPage <= 7;
        this.isBusy = false;
      }, 500);
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