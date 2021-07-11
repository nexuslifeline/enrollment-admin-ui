import { UserGroups, SchoolCategories } from '../../helpers/enum';

export default {
  SchoolCategories,
  methods: {
    isAccessible(actionPermissionId) {
      if (!actionPermissionId) { // if no permission mapper provided, allow it for the meantime
        return true;
      }

      console.log('actionPermissionId', actionPermissionId)

      const { user } = this.$store.state;
      if (this.checkIfSuperUser()) {
        return true
      }

      const permissions = user?.userGroup?.permissions;
      const ids = Array.isArray(actionPermissionId)
        ? actionPermissionId
        : [actionPermissionId];

      if (!!permissions?.length) {
        return !!permissions?.some(v => ids.includes(v.id));
      }

      return false;
    },
    isAccessibleSchoolCategory(schoolCategoryId) {
      if (!schoolCategoryId) { // if no permission mapper provided, allow it for the meantime
        return true;
      }

      const { user } = this.$store.state;
      if (user?.userGroup.id === UserGroups.SUPER_USER.id) {
        return true; // Super User
      }

      const schoolCategories = user?.userGroup?.schoolCategories;
      const ids = Array.isArray(schoolCategoryId)
        ? schoolCategoryId
        : [schoolCategoryId];

      if (!!schoolCategories?.length) {
        return !!schoolCategories?.some(v => ids.includes(v.id));
      }

      return false;
    },
    checkIfSuperUser() {
      const { user } = this.$store.state;
      if (user?.userGroup?.id === UserGroups.SUPER_USER.id) {
        return true;
      }
      return false;
    },
    checkIfAllowedAll() {
      const { SchoolCategories } = this.$options;
      return this.isAccessibleSchoolCategory(SchoolCategories.PRE_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.PRIMARY_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.JUNIOR_HIGH_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.SENIOR_HIGH_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.COLLEGE.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.GRADUATE_SCHOOL.id) &&
      this.isAccessibleSchoolCategory(SchoolCategories.VOCATIONAL.id)
    },
    getDefaultSchoolCategory() {
      const { user } = this.$store.state;
      const schoolCategories = user?.userGroup?.schoolCategories;

      if (this.checkIfSuperUser()) {
        return SchoolCategories.PRE_SCHOOL;
      }

      if (!!schoolCategories?.length) {
        return schoolCategories[0];
      }
      return null;
    },
    checkIfHasSchoolCategoryAccess() {
      const { user } = this.$store.state;

      if (this.checkIfSuperUser()) {
        return true
      }

      const schoolCategories = user?.userGroup?.schoolCategories;
      if (!!schoolCategories?.length) {
        return true
      }

      return false;
    }
  },
}