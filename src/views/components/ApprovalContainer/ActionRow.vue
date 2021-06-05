<template>
  <div class="approval-view__actions">
    <b-button
      variant="dark"
      class="approval-view__back"
      @click="$emit('onNext')"
      :disabled="isBackDisabled">
      <v-icon name="spinner" spin v-if="isBackBusy" />
      Back
    </b-button>
    <b-button
      variant="primary"
      class="approval-view__next"
      @click="$emit('onNext')"
      :disabled="isNextDisabled">
      <v-icon name="spinner" spin v-if="isNextBusy" />
      Next
    </b-button>
  </div>
</template>

<script>
  export default {
    props: {
      isBackBusy: {
        type: Boolean
      },
      isNextBusy: {
        type: Boolean
      },
      isNextDisabled: {
        type: Boolean,
        default: false
      },
      isBackDisabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .approval-view__next {
    margin-left: auto;
    min-width: 130px;
  }

  .approval-view__back {
    min-width: 110px;
  }

  .approval-view__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 60px;
    background-color: $white;
    border-top: 1px solid $brand-border-color;
    display: flex;
    align-items: center;
    padding: 10px;
  }
</style>