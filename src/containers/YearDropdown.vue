<template>
  <div class="year-dropdown__menu-container">
    <button
      class="year-dropdown__menu"
      :class="{ inactive: !schoolYear.isActive }"
      @click.stop="isShown = !isShown">
      <span v-if="!isLoading">{{schoolYear.name || 'No School Year'}}</span>
      <BSpinner v-else small type="grow" />
      <BIconChevronUp v-if="isShown" class="ml-2" />
      <BIconChevronDown v-else class="ml-2" />
    </button>
    <div v-if="isShown" class="year-dropdown__items-container">
      <p class="year-dropdown__items-title">
        School Year
      </p>
      <div class="year-dropdown__items-search">
        <input
          v-model="search"
          type="text"
          placeholder="Search School Year"
          class="year-dropdown__search-filter"
          @click.stop="() => false"
        />
      </div>
      <div class="year-dropdown__items-list">
        <div
          v-for="item in visibleSchoolYearItems"
          :key="item.id"
          @click="onSchoolYearSelect(item)"
          class="year-dropdown__item"
          :class="{ active: item.id === $store.state.schoolYear.id}">
          {{item.name}}
          <span v-if="item.isActive" class="text-active">(Open)</span>
        </div>
      </div>
      <div class="year-dropdown__action-container">
        <button class="year-dropdown__action-open" @click.stop="onSchoolYearOpen">
          Open New School Year
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { SchoolYearApi } from '../mixins/api';
export default {
  mixins: [SchoolYearApi],
  data() {
    return {
      search: '',
      options: {
        schoolYears: {
          items: [],
        },
      },
      isShown: false,
      isLoading: false
    };
  },
  computed: {
    schoolYear() {
      const { id } = this.$store.state.schoolYear;
      return this.options?.schoolYears?.items.find((v) => v.id === id) || {};
    },
    visibleSchoolYearItems() {
      const { search, options: { schoolYears: { items } } } = this;
      return search
        ? items.filter(v => [v?.name, v?.description].join(' ').toLowerCase().includes(search))
        : items;
    }
  },
  methods: {
    loadSchoolYearList() {
      const { schoolYears } = this.options;
      this.isLoading = true;
      this.getSchoolYearList({ paginate: false }).then(({ data }) => {
        this.isLoading = false;
        const activeSchoolYear = data.find((d) => d.isActive === 1);
        this.$store.state.schoolYear = activeSchoolYear ?? null
        schoolYears.items = data;
      }).catch((error) => {
        this.isLoading = false;
      });
    },
    onSchoolYearSelect(schoolYear) {
      // this.$store.commit('SET_SCHOOL_YEAR_ID', schoolYear.id);
      this.$store.commit('SET_SCHOOL_YEAR', schoolYear);
      this.isShown = false;
    },
    hideSchoolYearDropdown() {
      this.isShown = false;
    },
    onSchoolYearOpen() {
      // create new school year with empty object data
      //alert('create(POST) school year here with empty object {} data. get the id in the response and redirect to the page');
      //const yearId = 1;
      const data = {}
      this.addSchoolYear(data).then(({ data }) => {
        this.$router.push({ path: `/maintenance/school-year/${data.id}/setup` });
      })
    }
  },
  created() {
    this.loadSchoolYearList();
  },
  mounted() {
    window.addEventListener('click', this.hideSchoolYearDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideSchoolYearDropdown);
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/scss/shared.scss';

.year-dropdown__menu-container {
  padding: 10px 20px;
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
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 15px;

  &:before {
    position: absolute;
    content: ' ';
    height: 8px;
    width: 8px;
    border-radius: 50%;
    border: 1px solid $green;
    left: 0;
    margin: 0 3px 0 0;
    background-color: $green;
  }

  &.inactive {
    &:before {
      background-color: $yellow;
      border-color: $yellow;
    }
  }
}

.year-dropdown__items-container {
  position: absolute;
  z-index: 100;
  right: 25px;
  top: 40px;
  background-color: #fff;
  border: 1px solid #dce6f8;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 6px 0 #e2e2e2;
  box-shadow: 0 3px 6px 0 #e2e2e2;
  min-width: 210px;
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
  padding: 3px 7px;
  margin-top: 5px;
}

.text-active {
  margin-left: 10px;
  font-size: 13px;
  padding: 0;
}

.year-dropdown__item {
  cursor: pointer;
  padding: 5px 10px 5px 25px;
  position: relative;
  display: flex;
  align-items: center;
  margin: 2px 0;

  &:hover {
    background-color: $light-gray-100;
  }

  &.active {
    background-color: $light-gray-100;

    &:before {
      position: absolute;
      content: ' ';
      height: 8px;
      width: 8px;
      border-radius: 50%;
      border: 1px solid $green;
      left: 10px;
      margin: 0 3px 0 0;
      background-color: $green;
    }
  }

  &.inactive {
    background-color: $light-gray-100;

    &:before {
      position: absolute;
      content: ' ';
      height: 8px;
      width: 8px;
      border-radius: 50%;
      border: 1px solid $yellow;
      left: 10px;
      margin: 0 3px 0 0;
      background-color: $yellow;
    }
  }
}

.year-dropdown__action-container {
  display: flex;
  flex-direction: row;
  padding: 2px 10px;
  margin-top: 10px;
}

.year-dropdown__action-open {
  width: 100%;
  height: 100%;
  min-height: 30px;
  background-color: $blue;
  color: $white;
  border: 0;
  border-radius: 3px;
  outline: none;
}

</style>
