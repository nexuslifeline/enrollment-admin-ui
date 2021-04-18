<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible }">
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
    <div class="content-list__container">
      <div class="c-side-filter__title">
        <vText size="xs" weight="bold" transform="uppercase" flex="1">
          {{ title }}
        </vText>
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
    <div class="action-bar__container" v-if="showBottomActions">
      <slot name="bottom-actions"></slot>
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
    },
    showBottomActions: {
      type: Boolean,
      default: false
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
  height: 36px;
}

.c-side-filter__content {
  height: 100%;
  padding: 15px 10px;
}

.c-page-content {
  position: relative;
  height: calc(100vh - 85px);

  &.filter-visible {
    .content-list__container {
      padding: 0;
      margin-left: 240px;
    }

    .row {
      margin: 0 !important;
    }

    .action-bar__container {
      width: calc(100% - 245px);
      margin-left: 240px;
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
  display: flex;
  height: 39px;
}

.content-list__body {
  padding: 10px 10px;
}

.content-list__actions {
  display: flex;
  flex-direction: row;
}



.action-bar__container {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  height: 60px;
  background-color: white;
  align-items: center;
  justify-content: flex-end;
}

</style>
