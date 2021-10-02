<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible }">
    <div v-if="filterVisible" class="c-side-filter__container">
      <div class="c-side-filter__container-header">
        <vText size="s" weight="bold">
          {{ filterTitle || 'Search and Filter' }}
        </vText>
      </div>
      <div class="c-side-filter__filter-body">
        <slot name="filters"></slot>
      </div>
    </div>
    <div class="content-list__container">
      <div class="c-side-filter__headline-container">
        <div class="c-side-filter__headline">
          <p class="c-side-filter__title">
            {{ title }}
          </p>
          <p class="c-side-filter__description">
            {{ description }}
          </p>
        </div>

        <!-- <FilterButton class="ml-auto" :isExpanded="filterVisible" @toggle="$emit('toggleFilter')" /> -->
        <div class="ml-auto">
          <!-- <RefreshButton @reload="$emit('refresh')" class="ml-1" /> -->
          <CreateButton
            v-if="createButtonVisible"
            :isBusy="isBusyCreating"
            @create="$emit('create')"
            class="ml-1"
          />
          <slot name="extra-buttons"></slot>
        </div>
      </div>
      <div class="content-list__actions">
        <slot name="actions"></slot>
      </div>
      <div class="content-list__body" :class="{ noPadding: noPaddingBody, noScroll: noScrollBody }">
        <slot name="content"></slot>
      </div>
    </div>
    <div class="action-bar__container" v-if="showBottomActions">
      <slot name="bottom-actions"></slot>
    </div>
  </div>
</template>
<script>
// import RefreshButton from './RefreshButton';
// import FilterButton from './FilterButton';
import CreateButton from './CreateButton';

export default {
  components: {
    // RefreshButton,
    // FilterButton,
    CreateButton
  },
  props: {
    isBusyCreating: {
      type: Boolean,
      default: false
    },
    filterVisible: {
      type: Boolean,
      default: true
    },
    createButtonVisible: {
      type: Boolean,
      default: true
    },
    filterTitle: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    showBottomActions: {
      type: Boolean,
      default: false
    },
    noPaddingBody: {
      type: Boolean,
      default: false
    },
    noScrollBody: {
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

.c-side-filter__headline-container {
  // border-bottom: 1px solid $light-gray-10;
  padding: 25px 12px 0 12px;
  width: 100%;
  // background-color: $white;
  display: flex;
  align-items: center;
  height: 45px;
  margin-bottom: 10px;
}

.content-list__body {
  padding: 10px 10px;

  &.noPadding {
    padding: 0;
  }

  &.noScroll {
    overflow: hidden;
  }
}

.content-list__actions {
  display: flex;
  flex-direction: row;
}

.c-side-filter__headline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.action-bar__container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  height: 60px;
  background-color: white;
  align-items: center;
  justify-content: flex-end;
}

.c-side-filter__title {
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  margin: 0;
}

.c-side-filter__description {
  font-size: 13px;
  color: $dark-gray;
  margin: 0;
}

</style>
