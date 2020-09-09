import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPermissionGroupList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/permission-groups`, { params: params });
    },
  }
}