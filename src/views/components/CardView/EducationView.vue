<template>
  <div>
    <ApprovalItem label="Student Number">
      <p>
        {{ 'test' }}
      </p>
    </ApprovalItem>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: [Object]
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
