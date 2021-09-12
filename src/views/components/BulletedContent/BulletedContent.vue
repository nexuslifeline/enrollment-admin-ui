<template>
  <div class="bulleted-items text-muted">
    <template v-for="(item, idx) in items">
      <span v-if="!!item" :key="idx" class="bulleted-item">
        {{ item }}
      </span>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: [Array]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .bulleted-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    // color: $gray;
    font-size: 13.7px;

    .bulleted-item {
      &:not(:last-child) {
        &::after {
          content: '\25CF';
          margin: 0 5px 0 3px;
          color: $gray;
        }
      }
    }
  }
</style>