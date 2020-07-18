import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getEvaluationFileList(evaluationId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files`, { params: params });
    },
    getEvaluationFilePreview(evaluationId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/evaluations/${evaluationId}/files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}