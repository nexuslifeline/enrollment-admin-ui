import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getOrganizationSetting(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/organization-settings/${id}`);
    },
    updateOrganizationSetting(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/organization-settings/${id}`, data);
    },
    saveLogo(data, id){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/organization-settings/${id}/logos`, data)
    },
    deleteLogo(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/organization-settings/${id}/logos`)
    },
  }
}