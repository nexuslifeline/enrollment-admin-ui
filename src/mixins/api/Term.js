import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getTermList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/terms`, { params: params });
    },
    getTerm(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/terms/${id}`);
    },
    addTerm(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/terms`, data);
    },
    updateTerm(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/terms/${id}`, data);
    },
    deleteTerm(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/terms/${id}`);
    },
    addOrUpdateMultipleTerm(data) {
        return this.$authHttp.post(`${apiPrefix}/${apiVersion}/terms/update-multiple`, data);
    },
    getStudentFeeTermsOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/terms`, { params: params });
    }
  }
}