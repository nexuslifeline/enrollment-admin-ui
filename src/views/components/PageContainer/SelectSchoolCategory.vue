<template>
  <div class="select-container">
    <v-select
      :options="options"
      :value="schoolCategory"
      @input="$emit('input', schoolCategory)"
      :label="label"
      :placeholder="placeholder"
      class="mt-2"
      :selectable="option => checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
      :clearable="checkIfAllowedAll"
    />
  </div>
</template>

<script>
import { SchoolCategories, UserGroups } from "../../../helpers/enum";
import Access from "../../../mixins/utils/Access";
export default {
  SchoolCategories,
  props: {
    // selected: {
    //   type: Object
    // },
    placeholder: {
      type: String
    },
    label: {
      type: String
    },
    options: {
      type: Array
    },
  },
  mixins: [ Access ],
  data() {
    return {
      selectedCat: null
    }
  },
  methods: {
  },
  created() {
    const { user } = this.$store.state
    const schoolCategories = user?.userGroup?.schoolCategories;
    this.schoolCategory = schoolCategories[0]
    // this.$emit('input',this.selectedCat)
  },
  computed: {
    checkIfAllowedAll() {
      return this.isAccessibleSchoolCategory(this.$options.SchoolCategories.PRE_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.PRIMARY_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.JUNIOR_HIGH_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.SENIOR_HIGH_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.COLLEGE.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.GRADUATE_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(this.$options.SchoolCategories.VOCATIONAL.id)
    },
    schoolCategory: {
      get: function () {
        return this.selectedCat
      },
      // setter
      set: function (newValue) {
        this.selectedCat = newValue;
      }
    }
  }
}
</script>

<style lang="scss">
  .select-container {
    width: 100%;
  }
</style>