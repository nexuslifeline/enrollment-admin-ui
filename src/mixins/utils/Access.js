export default {
  methods: {
    isAccessible(currentPermissionId) {
      const { user } = this.$store.state;
      //if (user?.userGroup === 1) return true; // Super User

      const permissions = user?.userGroup?.permissions;
      if (!!permissions?.length) {
        return !!permissions?.some(v => v.id === currentPermissionId);
      }

      return false;
    }
  }
}