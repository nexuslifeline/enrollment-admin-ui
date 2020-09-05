import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getEvaluationFileList(evaluationId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files`, { params: params });
    },
    addEvaluationFile(data, evaluationId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files`, data)
    },
    updateEvaluationFile(data, evaluationId, fileId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files/${fileId}`, data)
    },
    deleteEvaluationFile(evaluationId, fileId) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files/${fileId}`)
    },
    getEvaluationFilePreview(evaluationId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}