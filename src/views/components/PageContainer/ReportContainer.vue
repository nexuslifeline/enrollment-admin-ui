<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible }">
    <div class="content-list__container">
      <div class="c-side-filter__title">
        {{ title }}
        <FilterButton class="ml-auto" :isExpanded="filterVisible" @toggle="$emit('toggleFilter')" />
        <RefreshButton @reload="$emit('refresh')" class="ml-1" />
      </div>
      <div class="content-list__actions">
        <slot name="actions"></slot>
      </div>
      <div class="content-list__body">
        <div v-if="filterVisible" class="c-side-filter__container">
          <div class="c-side-filter__container-header">
            <vText size="xs" weight="bold" transform="uppercase">
              Filter
            </vText>
          </div>
          <div class="c-side-filter__filter-body">
            <slot name="filters"></slot>
          </div>
        </div>
        <div class="c-page-content__report-area">
          <b-overlay v-if="isBusy" :show="true" />
          <template v-if="!isBusy">
            <slot name="content"></slot>
          </template>
          <p v-if="showPlaceholder">No Preview</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RefreshButton from './RefreshButton';
import FilterButton from './FilterButton';

export default {
  components: {
    RefreshButton,
    FilterButton
  },
  props: {
    filterVisible: {
      type: Boolean,
      default: true
    },
    isBusy: {
      type: Boolean,
      default: false
    },
    showPlaceholder: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.c-side-filter__container {
  height: 100%;
  border-right: 1px solid $light-gray-10;
  width: 300px;
  background-color: $white;
  z-index: 2;
}

.c-side-filter__container-header {
  border-bottom: 1px solid $light-gray-10;
  padding: 7px 10px;
}

.c-side-filter__content {
  height: 100%;
  padding: 15px 10px;
}

.c-page-content {
  height: calc(100% - 36px);

  &.filter-visible {
    .content-list__container {
      padding: 0;
      margin-left: 0;
    }

    .row {
      margin: 0 !important;
    }
  }
}

.c-side-filter__filter-body {
  padding: 15px 10px;
}

.c-side-filter__title {
  border-bottom: 1px solid $light-gray-10;
  padding: 8px 10px;
  width: 100%;
  background-color: $white;
  font-weight: 500;
  font-size: 13px;
  height: 36px;
  display: flex;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  color: $dark-gray-500;
}

.content-list__body {
  padding: 0;
  display: flex;
  flex-direction: row;
  height: 100%;
}

.content-list__actions {
  display: flex;
  flex-direction: row;
}

.c-page-content__report-area {
  background-color: $dark-gray-500;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $light-gray-10;
}

.content-list__container {
  height: 100%;
}

</style>
