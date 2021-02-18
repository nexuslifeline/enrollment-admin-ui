<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible }">
    <div v-if="filterVisible" class="c-side-filter__container">
      <div class="c-side-filter__container-header">
        <span>
          Filter
        </span>
      </div>
      <div class="c-side-filter__filter-body">
        <slot name="filters"></slot>
      </div>
    </div>
    <div class="content-list__container">
      <div class="c-side-filter__title">
        {{ title }}
        <FilterButton class="ml-auto" :isExpanded="filterVisible" @toggle="$emit('toggleFilter')" />
        <RefreshButton @reload="$emit('refresh')" class="ml-1" />
        <CreateButton @create="$emit('create')" class="ml-1" v-if="createButtonVisible"/>
        <slot name="extra-buttons"></slot>
      </div>
      <div class="content-list__actions">
        <slot name="actions"></slot>
      </div>
      <div class="content-list__body">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import RefreshButton from './RefreshButton';
import FilterButton from './FilterButton';
import CreateButton from './CreateButton';

export default {
  components: {
    RefreshButton,
    FilterButton,
    CreateButton
  },
  props: {
    filterVisible: {
      type: Boolean,
      default: true
    },
    createButtonVisible: {
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
  position: fixed;
  top: 85px;
  left: 0;
  width: 240px;
  background-color: $white;
  z-index: 2;
}

.c-side-filter__container-header {
  border-bottom: 1px solid $light-gray-10;
  padding: 7px 10px;
  font-weight: 500;
  height: 36px;
  text-transform: uppercase;
  font-size: 13px;
  color: $dark-gray-500;
}

.c-side-filter__content {
  height: 100%;
  padding: 15px 10px;
}

.c-page-content {
  &.filter-visible {
    .content-list__container {
      padding: 0;
      margin-left: 240px;
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
  display: flex;
  height: 39px;
  text-transform: uppercase;
  color: $dark-gray-500;
}

.content-list__body {
  padding: 10px 10px;
}

.content-list__actions {
  display: flex;
  flex-direction: row;
}

</style>
