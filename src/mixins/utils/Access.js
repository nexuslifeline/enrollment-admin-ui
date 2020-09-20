import { UserGroups } from '../../helpers/enum';

export default {
  methods: {
    isAccessible(currentPermissionId) {
      if (!currentPermissionId) { // if no permission mapper provided, allow it for the meantime
        return true;
      }

      const { user } = this.$store.state;
      if (user?.userGroup.id === UserGroups.SUPER_USER.id) {
        return true; // Super User
      }

      const permissions = user?.userGroup?.permissions;
      const ids = Array.isArray(currentPermissionId)
        ? currentPermissionId
        : [currentPermissionId];

      if (!!permissions?.length) {
        return !!permissions?.some(v => ids.includes(v.id));
      }

      return false;
    }
  }
}