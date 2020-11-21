import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getStudentFileList(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/files`, { params: params });
    },
    addStudentFile(data, studentId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students/${studentId}/files`, data)
    },
    updateStudentFile(data, studentId, fileId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/students/${studentId}/files/${fileId}`, data)
    },
    deleteStudentFile(studentId, fileId) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/students/${studentId}/files/${fileId}`)
    },
    getStudentFilePreview(studentId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}