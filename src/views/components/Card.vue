<template>
  <div class="c-card">
    <div class="c-card__header">
      <vText :size="titleSize" flex="1" weight="bold">
        {{ title }}
      </vText>
      <b-button v-if="showAction" type="button" variant="primary">
        {{ actionLabel }}
      </b-button>
      <b-dropdown
        v-if="showRefresh"
        right
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
      >
        <template v-slot:button-content>
          <v-icon name="ellipsis-v" />
        </template>
        <b-dropdown-item @click="$emit('onRefresh')">
          <v-icon name="sync" />
          Refresh
        </b-dropdown-item>
      </b-dropdown>
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
    showAction: {
      type: Boolean,
      default: false,
    },
    actionLabel: {
      type: [String],
      default: 'Create New'
    },
    titleSize: {
      type: [String],
      default: 'xl'
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
  //box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  width: 100%;
  background-color: $white;
}

.c-card__header {
  border-bottom: 1px solid $brand-border-color;
  padding: 0 15px;
  height: 58px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @include for-size(phone-only) {
    flex-direction: column;
  }
}

.c-card__body {
  padding: 20px;
  background-color: $white;
  padding-bottom: 50px;
}

.c-card__refresh-button {
  width: 100px;

  @include for-size(phone-only) {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
