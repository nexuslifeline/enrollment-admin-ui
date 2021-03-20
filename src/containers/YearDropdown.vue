<template>
  <div class="year-dropdown__menu-container">
    <button class="year-dropdown__menu" @click="isShown = !isShown">
      {{schoolYearName}}
      <BIconChevronUp v-if="isShown" class="ml-2" />
      <BIconChevronDown v-else class="ml-2" />
    </button>
    <div v-if="isShown" class="year-dropdown__items-container">
      <p class="year-dropdown__items-title">
        Select School Year
      </p>
      <div class="year-dropdown__items-search">
        <input type="text" placeholder="Search School Year" class="year-dropdown__search-filter" />
      </div>
      <div class="year-dropdown__items-list">
        <div
          v-for="item in options.schoolYears.items"
          :key="item.id"
          @click="onSchoolYearSelect(item)"
          class="year-dropdown__item"
          :class="{ active: item.id === $store.state.schoolYearId}">
          {{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>import { BIconChevronUp } from 'bootstrap-vue'

import { SchoolYearApi } from '../mixins/api';
export default {
  components: {
    BIconChevronUp,

  },
  mixins: [SchoolYearApi],
  data() {
    return {
      options: {
        schoolYears: {
          items: [],
        },
      },
      isShown: false
    };
  },
  computed: {
    schoolYearName() {
      const { schoolYearId } = this.$store.state;
      const item = this.options?.schoolYears?.items.find((v) => v.id === schoolYearId)
      return item?.name || 'No School Year';
    }
  },
  methods: {
    loadSchoolYearList() {
      const { schoolYears } = this.options;
      this.getSchoolYearList({ paginate: false }).then(({ data }) => {
        const activeSchoolYear = data.find((d) => d.isActive === 1);
        this.$store.state.schoolYearId = activeSchoolYear
          ? activeSchoolYear.id
          : null;
        schoolYears.items = data;
      });
    },
    onSchoolYearSelect({ id }) {
      this.$store.commit('SET_SCHOOL_YEAR_ID', id);
      this.isShown = false;
    }
  },
  created() {
    this.loadSchoolYearList();
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/scss/shared.scss';

.year-dropdown__menu-container {
  padding: 10px 30px;
  margin-left: auto;
  display: flex;
  align-items: center;
  position: relative;
}

.year-dropdown__menu {
  color: $white;
  cursor: pointer;
  border: 0;
  outline: 0;
  background: none;
}

.year-dropdown__items-container {
  position: absolute;
  right: 30px;
  top: 40px;
  background-color: #fff;
  border: 1px solid #dce6f8;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 6px 0 #e2e2e2;
  box-shadow: 0 3px 6px 0 #e2e2e2;
  min-width: 210px;
  z-index: 10;
  padding-bottom: 10px;
}

.year-dropdown__items-title {
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  margin-bottom: 7px;
  border-bottom: 1px solid $light-gray-10;
}

.year-dropdown__items-search {
  padding: 0 8px;
}

.year-dropdown__search-filter {
  width: 100%;
  background-color: $light-gray-100;
  border-radius: 3px;
  border: 0;
  padding: 5px 8px;
}

.year-dropdown__items-list {
  max-height: 130px;
  min-height: 70px;
  height: auto;
  overflow: auto;
  padding: 5px 10px;
  margin-top: 5px;
}

.year-dropdown__item {
  cursor: pointer;
  padding: 5px 10px;

  &:hover {
    background-color: $light-gray-100;
  }

  &.active {
    background-color: $light-gray-100;
  }
}

</style>
