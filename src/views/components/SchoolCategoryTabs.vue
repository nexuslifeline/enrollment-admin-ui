<template>
  <b-tabs class="c-tab-pills" pills>
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
  </b-tabs>
</template>
<script>
import { SchoolCategories } from '../../helpers/enum'
import { UserGroups } from '../../helpers/enum';
import Access from '../../mixins/utils/Access'
export default {
  props: {
    showAll: false
  },
  mixins: [ Access ],
  data() {
    return {
      schoolCategories: SchoolCategories,
      activeSchoolCategoryId: null
    }
  },
  created() {
    if (!this.checkIfSuperUser() && !this.checkIfAllowedAll()) {
      const { user } = this.$store.state
      const schoolCategories = user?.userGroup?.schoolCategories;
      this.activeSchoolCategoryId = schoolCategories[0]?.id
    }
    this.$emit('loadSchoolCategoryId', this.activeSchoolCategoryId)
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
    }
  }
}
</script>