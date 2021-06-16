import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getEvaluationList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations`, { params: params });
    },
    getSubjectsOfEvaluation(evaluationId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/subjects`, { params: params });
    },
    updateEvaluation(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/evaluations/` + id, data);
    },
    getEvaluation(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${id}`);
    },
    approveEvaluation(data, id) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/evaluations/${id}/approve`, data);
    },
    rejectEvaluation(data, id) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/evaluations/${id}/reject`, data);
    },
  }
}