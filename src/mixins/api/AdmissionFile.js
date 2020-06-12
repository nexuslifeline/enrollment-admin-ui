import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAdmissionFileList(admissionId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/admissions/${admissionId}/files`, { params: params });
    },
    getAdmissionFilePreview(admissionId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/admissions/${admissionId}/files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}