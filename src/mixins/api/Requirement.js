import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getRequirementList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/requirements`, { params: params });
    },
    addRequirement(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/requirements`, data);
    },
    updateRequirement(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/requirements/${id}`, data);
    },
    deleteRequirement(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/requirements/${id}`);
    },
    updateCreateMultiple(schoolCategoryId, data) {
        return this.$authHttp.post(`${apiPrefix}/${apiVersion}/requirements/update-create-multiple/${schoolCategoryId}`, data);
    },
  }
}