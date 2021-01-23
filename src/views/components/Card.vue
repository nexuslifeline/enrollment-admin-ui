<template>
  <div class="c-card">
    <div class="c-card__header">
      <h4 class="c-card__header-title">
        {{ title }}
      </h4>
      <b-button
        class="c-card__refresh-button"
        v-if="showRefresh"
        variant="primary"
        @click="$emit('onRefresh')"
      >
        <v-icon name="sync" />
        Refresh</b-button
      >
    </div>
    <div class="c-card__body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: [String],
    },
    showRefresh: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.c-card {
  border: 1px solid $brand-border-color;
  padding: 0;
  border-radius: 3px;
  margin-bottom: 30px;
}

.c-card__header {
  border-bottom: 1px solid $brand-border-color;
  padding: 15px;
  display: flex;

  @include for-size(phone-only) {
    flex-direction: column;
  }
}

.c-card__body {
  padding: 20px;
}

.c-card__header-title {
  margin: 0;
  font-size: 21px;
  flex: 1;
}

.c-card__refresh-button {
  width: 100px;

  @include for-size(phone-only) {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
