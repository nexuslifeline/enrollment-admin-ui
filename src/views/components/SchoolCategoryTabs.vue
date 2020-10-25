<template>
  <div>
    <!-- <b-tabs class="c-tab-pills" pills>
      <b-tab
        v-if="showAll && (checkIfSuperUser() || checkIfAllowedAll())"
        @click="$emit('clickAll')"
        active
        title="All Category" />
      <b-tab v-for="schoolCategory in schoolCategories.values"
        v-if="isAccessibleSchoolCategory(schoolCategory.id)"
        :key="schoolCategory.id"
        :title="schoolCategory.name"
        :active="activeSchoolCategoryId === schoolCategory.id"
        @click="$emit('click', schoolCategory.id)"/>
    </b-tabs> -->
    <ul class="school-category__tab-pills">
      <li class="school-category__tab-pill-item"
        v-if="showAll && (checkIfSuperUser() || checkIfAllowedAll())"
        :class="{ active: activeSchoolCategoryId === 0 }"
        @click="$emit('clickAll'), activeSchoolCategoryId = 0">
        All Category
      </li>
      <template
        v-for="(schoolCategory, idx) in schoolCategories.values"
        v-if="idx < tabLimit && isAccessibleSchoolCategory(schoolCategory.id)">
        <li :key="schoolCategory.id"
          @click="$emit('click', schoolCategory.id), activeSchoolCategoryId = schoolCategory.id"
          :class="{ active: activeSchoolCategoryId === schoolCategory.id }"
          class="school-category__tab-pill-item">
          {{ schoolCategory.name }}
        </li>
      </template>
      <template v-if="!!moreCategories.length">
        <li @click.stop="openMore = !openMore"
        class="school-category__tab-pill-item school-category__tab-pill-item-more"
          :class="{ active: isMoreActive }">
          {{
            isMoreActive
              ? (moreCategories.find(v => v.id === activeSchoolCategoryId) || {}).name
              : 'More'
          }}
          <BIconCaretUpFill v-if="openMore" scale=".8" class="ml-2" />
          <BIconCaretDownFill v-else scale=".8" class="ml-2" />
          <div v-if="openMore" class="school-category__more-items-container">
            <ul class="school-category__more-items">
              <li class="school-category__more-item"
                v-for="sub in moreCategories"
                @click.stop="$emit('click', sub.id), activeSchoolCategoryId = sub.id, openMore = false">
                {{ sub.name }}
              </li>
            </ul>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
  import { SchoolCategories } from '../../helpers/enum'
  import { UserGroups } from '../../helpers/enum';
  import { createLimiter } from '../../helpers/utils';
  import Access from '../../mixins/utils/Access'

  export default {
    createLimiter,
    props: {
      showAll: false
    },
    mixins: [ Access ],
    data() {
      return {
        schoolCategories: SchoolCategories,
        activeSchoolCategoryId: 0,
        tabLimit: 8,
        openMore: false
      }
    },
    computed: {
      moreCategories() {
        return this.schoolCategories.values.filter(
          (v, idx) => idx >= this.tabLimit
        );
      },
      isMoreActive() {
        return !!this.moreCategories.find(v => v.id === this.activeSchoolCategoryId);
      }
    },
    created() {
      if ((!this.checkIfSuperUser() && !this.checkIfAllowedAll()) || !this.showAll) {
        const { user } = this.$store.state
        const schoolCategories = user?.userGroup?.schoolCategories;
        this.activeSchoolCategoryId = schoolCategories[0]?.id
      }

      if (this.checkIfSuperUser() && !this.showAll) {
        this.activeSchoolCategoryId = SchoolCategories.PRE_SCHOOL.id
      }
      this.$emit('loadSchoolCategoryId', this.activeSchoolCategoryId)
    },
    mounted() {
      this.calculateNavLimit();
      window.addEventListener('resize', this.calculateNavLimit)
      window.addEventListener('click', this.hideDropdownItems)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calculateNavLimit)
      window.removeEventListener('click', this.hideDropdownItems)
    },
    methods: {
      checkIfAllowedAll() {
        return this.isAccessibleSchoolCategory(SchoolCategories.PRE_SCHOOL.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.PRIMARY_SCHOOL.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.JUNIOR_HIGH_SCHOOL.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.SENIOR_HIGH_SCHOOL.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.COLLEGE.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.GRADUATE_SCHOOL.id) &&
        this.isAccessibleSchoolCategory(SchoolCategories.VOCATIONAL.id)
      },
      calculateNavLimit() {
        this.tabLimit = this.getTabLimit();
      },
      getTabLimit() {
        return this.$options.createLimiter([8, 7, 5, 4, 3, 2, 1, 1]);
      },
      hideDropdownItems() {
        this.openMore = false;
      },
    }
  }
</script>
<style scoped lang="scss">
     @import "../../assets/scss/shared.scss";

   .school-category__tab-pills {
     list-style: none;
     display: flex;
     flex-wrap: wrap;
     margin: 0;
     padding: 0;
     margin-bottom: 25px;
   }

   .school-category__tab-pill-item {
     margin-right: 7px;
     padding: 0 13px;
     color: $brand-primary;

     @include for-size(tablet-landscape-down) {
       margin-right: 3px;
     }

     &.active {
       background-color: $brand-primary;
       color: $white;
       border-radius: 5px;
     }

     &:hover {
       cursor: pointer;
     }
   }

   .school-category__tab-pill-item-more {
     position: relative;
   }

   .school-category__more-items-container {
     position: absolute;
     border: 1px solid $brand-border-color;
     left: 10px;
     z-index: 2;
     top: 30px;

     @include for-size(tablet-portrait-down) {
       right: 0;
       left: auto;
     }
   }

   .school-category__more-items {
     list-style: none;
     margin: 0;
     padding: 10px 0;
     min-width: 180px;
     background-color: $white;
   }

   .school-category__more-item {
     padding: 5px 15px;
     border-bottom: 1px solid $brand-border-color;
     color: $brand-primary;

     &:last-child {
       border: 0;
     }
   }
</style>