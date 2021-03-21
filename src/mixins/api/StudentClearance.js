import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getStudentClearanceList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-clearances`, { params: params });
    },
    getStudentClearance(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-clearances/${id}`);
    },
    addStudentClearance(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/student-clearances`, data);
    },
    updateStudentClearance(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/student-clearances/${id}`, data);
    },
    deleteStudentClearance(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/student-clearances/${id}`);
    },
    batchCreateStudentClearance(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/student-clearances/batch-store`, data);
    },
    getSignatoryList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/signatories`, { params: params });
    },
    batchUpdateSignatories(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/signatories/update`, data);
    }
  }
}