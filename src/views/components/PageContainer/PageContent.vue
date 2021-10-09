<template>
  <div class="c-page-content" :class="{ 'filter-visible': filterVisible, shrink: shrink }">
    <div v-if="filterVisible" class="c-side-filter__container">
      <div class="c-side-filter__container-header">
        <span v-if="!shrink" class="c-side-filter__panel-title">
          {{ filterTitle || 'Search and Filters' }}
        </span>
        <button
          class="action__toggle-panel"
          @click="shrink = !shrink">
          <BIconChevronDoubleRight v-if="shrink" scale=".85" />
          <BIconChevronDoubleLeft v-else scale=".85" />
        </button>
      </div>
      <div v-show="!shrink" class="c-side-filter__filter-body">
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
        <button class="list__sub-action" @click="shrink = !shrink">
          <BIconFunnel scale=".9" />
          <span class="list__sub-action-label">
            Filters
          </span>
        </button>
        <button class="list__sub-action" @click="$emit('onRefresh')">
          <BIconArrowRepeat scale=".9" />
          <span class="list__sub-action-label">
            Refresh
          </span>
        </button>
        <button class="list__sub-action" @click="onPrint">
          <BIconPrinter scale=".9" />
          <span class="list__sub-action-label">
            Print
          </span>
        </button>
        <button class="list__sub-action" @click="onDownload">
          <BIconDownload scale=".9" />
          <span class="list__sub-action-label">
            Download
          </span>
        </button>
        <div class="list__fill-bar">

        </div>
        <slot name="actions"></slot>
      </div>
      <div class="content-list__body" :class="{ noPadding: noPaddingBody, noScroll: noScrollBody }">
        <slot name="content"></slot>
      </div>
      <div class="action-bar__container" v-if="showBottomActions">
        <div class="bottom-action__fill-bar">
          <div class="pagination__details" v-if="showPagination">
            <div>
              <span v-if="pageTotal > 0">
                Showing {{ pageFrom }} to
                {{ pageTo }} of
                {{ pageTotal }} records.
              </span>
              <span v-else>
                No record(s) found.
              </span>
              <span v-if="!!searchKeyword" class="list__search-description">
                Search Keyword: <b>{{ searchKeyword }}</b>
              </span>
            </div>
            <div class="ml-auto" v-if="pageTotal > 0">
              <b-pagination
                class="c-pagination"
                :value="currentPage"
                :total-rows="pageTotal"
                :per-page="perPage"
                size="sm"
                align="end"
                @input="onPageChange"
              />
            </div>
          </div>
        </div>
        <slot name="bottom-actions" />
      </div>
    </div>
    <RightPanel v-if="hasPanel" :notificationCount="panelNotificationCount">
      <template slot="panel-content">
        <slot name="panel-content" />
      </template>
    </RightPanel>
  </div>
</template>
<script>
// import RefreshButton from './RefreshButton';
import RightPanel from './RightPanel';
import CreateButton from './CreateButton';

export default {
  components: {
    // RefreshButton,
    // FilterButton,
    CreateButton,
    RightPanel
  },
  data() {
    return {
      shrink: true
    };
  },
  props: {
    pageFrom: {
      type: Number
    },
    pageTo: {
      type: Number
    },
    pageTotal: {
      type: Number
    },
    currentPage: {
      type: Number
    },
    perPage: {
      type: Number
    },
    showPagination: {
      type: Boolean,
      default: true
    },
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
    searchKeyword: {
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
      default: true
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
    },
    hasPanel: {
      type: Boolean,
      default: false
    },
    panelNotificationCount: {
      type: Number,
      default: 0
    },
  },
  methods: {
    onPrint() {
      this.$emit('onPrint');
      alert('Feature not yet available!');
    },
    onDownload() {
      this.$emit('onDownload');
      alert('Feature not yet available!');
    },
    onPageChange(page) {
      this.$emit('update:currentPage', page);
      this.$emit('onPageChange', page);
    }
  }
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
  transition: all .5s;
}

.c-side-filter__container-header {
  border-bottom: 1px solid $light-gray-10;
  padding: 7px 10px;
  height: 36px;
  display: flex;
  flex-direction: row;
  // box-shadow: 0 0.25rem 0.25rem $light-gray-100, inset 0 -1px 5px $light-gray-100;
}

.content-list__container {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all .5s;
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
      background-color: $light-gray-100;
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

    // .action-bar__container {
    //   width: calc(100% - 245px);
    //   margin-left: 240px;
    // }
  }
}

.c-side-filter__filter-body {
  padding: 15px 10px;
}

.c-side-filter__headline-container {
  border-bottom: 1px solid $light-gray-10;
  padding: 14px 10px 9px 10px;
  width: 100%;
  background-color: $white;
  display: flex;
  align-items: center;
  // height: 45px;
  // margin-bottom: 6px;
  // overflow: hidden;
}

.content-list__body {
  flex: 1;
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
  height: 25px;
  width: 100%;
  padding: 2px 0;
  // background-color: $light-gray-100;
  border-bottom: 1px solid $light-gray-10;
  background-color: $light-gray-50;
  box-shadow: 0 0.25rem 0.25rem $light-gray-100, inset 0 -1px 5px $light-gray-100;
}

.c-side-filter__headline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.action-bar__container {
  display: flex;
  height: 35px;
  background-color: $light-gray-50;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid $light-gray-10;
  position: sticky;
  bottom: 0;
  width: 100%;
}

.bottom-action__fill-bar {
  flex: 1;
  padding: 2px 12px;
}

.c-side-filter__title {
  font-size: 17px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  align-items: center;
  margin: 0;
  color: $blue;
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

.list__sub-action {
  background: none;
  border: 0;
  outline: none;
  min-width: 95px;
  border-right: 1px solid $light-gray-10;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @include for-size(phone-only) {
    min-width: none;
    flex: 1;

    .list__sub-action-label {
      display: none;
    }
  }
}

.list__sub-action-label {
  font-size: 11px;
  font-weight: 500;
  margin-left: 5px;
  color: $dark-gray-100;

  &:hover {
    color: $dark-gray;
  }
}

.list__fill-bar {
  flex: 1;
  font-size: 12.5px;
  padding: 2px 12px;
  display: flex;
  border-right: 1px solid $light-gray-10;
}

.list__search-description {
  margin-left: 12px;
}

.pagination__details {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  font-size: 13.5px;
}
</style>
