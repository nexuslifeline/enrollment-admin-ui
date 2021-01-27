import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getGeneralSetting(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/general-settings/${id}`);
    },
    updateGeneralSetting(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/general-settings/${id}`, data);
    },
  }
}