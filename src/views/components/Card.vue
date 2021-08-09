<template>
  <div class="c-card">
    <div class="c-card__header">
      <vText :size="titleSize" flex="1" weight="bold">
        {{ title }}
      </vText>
      <slot name="header-action"></slot>
      <b-button v-if="showAction" @click="$emit('onAddNew')" type="button" variant="primary">
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
      <span v-if="isCompleted" class="c-card__completion-status">Completed!</span>
    </div>
    <div class="c-card__body" :class="{ noPadding: noPaddingBody }">
      <slot></slot>
    </div>
    <div v-if="hasFooter" class="c-card__footer">
      <slot name="footer"></slot>
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
    isCompleted: {
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
    noPaddingBody: {
      type: Boolean,
      default: false,
    },
    hasFooter: {
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
}

.c-card__body {
  padding: 20px;
  background-color: $white;
  padding-bottom: 35px;

  &.noPadding {
    padding: 0;
  }
}

.c-card__refresh-button {
  width: 100px;

  @include for-size(phone-only) {
    width: 100%;
    margin-top: 10px;
  }
}

.c-card__footer {
  background-color: $light-gray-50;
  border-top: 1px solid $light-gray-10;
  min-height: 60px;
  width: 100%;
  padding: 15px;
}

.c-card__completion-status {
  font-weight: 500;
  color: $green-10;
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: '\2713​';
    height: 30px;
    width: auto;
    width: 30px;
    margin-left: 10px;
    font-size: 16px;
    font-weight: 600;
    color: $white;
    background-color: $green-10;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    //position: absolute;
  }
}
</style>
