import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAcademicRecordList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records`, { params: params });
    },
    getAcademicRecord(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${id}`);
    },
    getSubjectsOfAcademicRecord(academicRecordId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/subjects`, { params: params });
    },
    getStudentFeeOfAcademicRecord(academicRecordId){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/student-fees`);
    },
    updateAcademicRecord(data, academicRecordId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}`, data)
    },
    patchAcademicRecord(data, academicRecordId) {
      return this.$authHttp.patch(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}`, data)
    },
    getApprovalCount(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/approval-count`, { params: params })
    },
    getGradesOfAcademicRecords(subjectId, sectionId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/subjects/${subjectId}/sections/${sectionId}`, { params: params });
    },
    getAcademicRecordSubjects(id, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${id}/subjects`, { params: params });
    },
    syncAcademicRecordSubjects(data, id) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/academic-records/${id}/subjects`, data);
    },
    updateAcademicRecordSubject(id, subjectId, data) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/academic-records/${id}/subjects/${subjectId}`, data);
    },
    quickEnroll(studentId, data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students/${studentId}/quick-enroll`, data)
    },
    approveEnlistment(academicRecordId, data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/approve-enlistment`, data)
    },
    rejectEnlistment(academicRecordId, data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/reject-enlistment`, data)
    },
  }
}
