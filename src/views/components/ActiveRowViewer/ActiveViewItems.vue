<template>
  <div class="active-view__detail-item-container">
    <slot></slot>
  </div>
</template>

<script>
  export default {

  }
</script>
<style lang="scss" scoped>
  .active-view__detail-item-container {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 30px;
  }
</style>