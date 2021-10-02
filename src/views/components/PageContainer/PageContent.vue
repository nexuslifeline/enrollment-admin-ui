<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible, shrink: shrink }">
    <div v-if="filterVisible" class="c-side-filter__container">
      <div class="c-side-filter__container-header">
        <span v-if="!shrink" class="c-side-filter__panel-title">
          {{ filterTitle || 'Search and Filters' }}
        </span>
        <button class="action__toggle-panel" @click="shrink = !shrink">
          <BIconChevronDoubleRight v-if="shrink" scale=".85" />
          <BIconChevronDoubleLeft v-else scale=".85" />
        </button>
      </div>
      <div v-if="!shrink" class="c-side-filter__filter-body">
        <slot name="filters"></slot>
      </div>
    </div>
    <div class="content-list__container">
      <div class="c-side-filter__headline-container">
        <div class="c-side-filter__headline">
          <div class="c-side-filter__title">
            {{ title }}
            <template v-if="badges && badges.length > 0">
              <b-badge v-for="(badge, idx) in badges" :key="idx" :variant="badge.variant || 'secondary'" class="ml-2">
                {{ badge.text }}
              </b-badge>
            </template>
          </div>
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
  data() {
    return {
      shrink: false
    };
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
    },
    badges: {
      type: Array,
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
  display: flex;
  flex-direction: row;
  // box-shadow: 0 0.25rem 0.25rem $light-gray-100, inset 0 -1px 5px $light-gray-100;
}

.c-side-filter__content {
  height: 100%;
  padding: 15px 10px;
}

.c-page-content {
  position: relative;
  height: calc(100vh - 85px);

  &.shrink {
    .c-side-filter__container {
      width: 50px;
    }

    .content-list__container {
      margin-left: 50px !important;
    }

    .action__toggle-panel {
      background: none;
      margin: 0 auto;

      &:hover {
        background-color: $light-gray-10;
      }
    }
  }

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
  padding: 20px 12px 0 12px;
  width: 100%;
  // background-color: $white;
  display: flex;
  align-items: center;
  // height: 45px;
  margin-bottom: 6px;
  // overflow: hidden;
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
  font-size: 17px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  align-items: center;
  margin: 0;
}

.c-side-filter__description {
  font-size: 13px;
  color: $dark-gray;
  margin: 0;
}

.action__toggle-panel {
  border: 0;
  outline: none;
  background-color: $light-gray-100;
  padding: 5px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-weight: 500;

  &:hover {
    background-color: $light-gray-10;
  }
}

.c-side-filter__panel-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

</style>
