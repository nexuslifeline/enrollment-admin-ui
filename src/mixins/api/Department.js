import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getDepartmentList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/departments`, { params: params });
    },
    getDepartment(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/departments/${id}`);
    },
    addDepartment(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/departments`, data);
    },
    updateDepartment(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/departments/${id}`, data);
    },
    deleteDepartment(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/departments/${id}`);
    }
  }
}