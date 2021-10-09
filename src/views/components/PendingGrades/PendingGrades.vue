<template>
  <div class="pending-grades__container">
    <div class="pending-grades__header">
      <span class="pending-grades__headline">
        Pending Grades for Review
      </span>
    </div>
    <div class="pending-grades__body">
      <template v-for="(item, idx) in Array.from({ length: 10 })">
         <Request :key="idx" />
      </template>
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
  created() {
    // GET /student-grades
    // with SUBMITTED and REQUEST EDIT status

    this.$emit('update:count', 10);
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
</style>