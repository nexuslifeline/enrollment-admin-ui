import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getStudentGradeList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-grades`, { params: params });
    },
    getStudentGradePersonnelList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-grades/personnels/list`, { params: params });
    },
    getStudentGrade(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-grades/${id}`);
    },
    addStudentGrade(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/student-grades`, data);
    },
    updateStudentGrade(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/student-grades/${id}`, data);
    },
    batchUpdateStudentGrade(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/student-grades/batch-update`, data);
    },
    deleteStudentGrade(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/student-grades/${id}`);
    },
    acceptStudentGrade(personnelId, sectionId, subjectId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/student-grades/${personnelId}/${sectionId}/${subjectId}`);
    }
  }
}