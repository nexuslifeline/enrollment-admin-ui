<template>
  <v-select
    :options="options"
    :filterable="false"
    :label="label"
    @open="onOpen"
    @close="onClose"
    @search="debounceSearch"
    :value="value"
    @input="onInputSelect"
    :reduce="reduce"
    :placeholder="placeholder"
  >
    <template slot="selected-option" slot-scope="data">
      <slot name="selected-option" v-bind="data"></slot>
    </template>
    <template slot="option" slot-scope="data">
      <slot name="option" v-bind="data"></slot>
    </template>
    <template #list-footer>
      <li ref="load" v-if="hasNextPage" class="loader__container">
        <slot name="loader"></slot>
      </li>
    </template>
  </v-select>
</template>
<script>
import debounce from 'lodash/debounce';

export default {
  props: {
    fetchData: {
      type: [Function],
    },
    value: {
      type: [Object],
    },
    label: {
      type: [String],
      default: 'name',
    },
    placeholder: {
      type: [String]
    },
    searchable: {
      type: [Boolean],
      default: true
    },
    selectable: {
      type: [Function],
      default: option => true
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    reduce: {
      type: [Function],
      default: option => option,
    },
  },
  data() {
    return {
      options: [],
      hasNextPage: true,
      searchQuery: null,
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.infiniteScroll);
  },
  methods: {
    onInputSelect(v) {
      this.$emit('input', v);
      // this.$emit('update:value', v);
    },
    async loadMore(params, clearResults = false) {
      const { data } = await this.fetchData(params);
      this.currentPage = data?.meta?.currentPage;
      this.hasNextPage = data?.meta?.currentPage < data?.meta?.lastPage;
      this.options = clearResults
        ? data?.data || []
        : [...this.options, ...(data?.data || [])];
    },
    debounceSearch: debounce(function(v) {
      this.searchOption(v);
    }, 400),
    searchOption(q) {
      this.searchQuery = q;
      //change search to criteria
      this.loadMore({ page: 1, criteria: q }, true);
    },
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        const params = {
          page: this.currentPage + 1,
          ...(this.searchQuery && { criteria: this.searchQuery }),
        };
        await this.loadMore(params);
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.loader__container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>
