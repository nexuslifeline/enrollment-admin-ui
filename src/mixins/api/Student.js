import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    registerStudent(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/register`, data);
    },
    getStudentList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students`, { params: params })
    },
    getStudent(studentId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}`)
    },
    addStudent(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students`, data)
    },
    updateStudent(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/students/` + id, data)
    },
    patchStudent(data, id) {
      return this.$authHttp.patch(`${apiPrefix}/${apiVersion}/students/` + id, data)
    },
    deleteStudent(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/students/` + id)
    },
    getStudentInfo(){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/studentinfo`)
    },
    updateStudentInfo(child, data, id){
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/studentinfo/` + child + `/` + id, data)
    },
    savePhoto(data, id){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students/${id}/photos`, data)
    },
    deletePhoto(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/students/${id}/photos`)
    },
    getEvaluationsOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/evaluations`, { params: params });
    },
    getAcademicRecordsOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/academic-records`, { params: params });
    },
    getStudentFeesOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/student-fees`, { params: params });
    },
    getBillingsOfStudent(studentId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/open-billings`);
    },
    manualRegisterStudent(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students/manual-registration`, data);
    },
    addStudentUser(data, studentId){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students/${studentId}/user`, data);
    },
    getStudentRequirements(studentId, schoolCategoryId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/school-categories/${schoolCategoryId}/requirements`, { params: params });
    },
    updateStudentRequirement(studentId, schoolCategoryId, requirementId, data){
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/students/${studentId}/school-categories/${schoolCategoryId}/requirements/${requirementId}`, data)
    },
    getStudentsOfSubjetOfSection(params, sectionId, subjectId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/sections/${sectionId}/subjects/${subjectId}/students`, { params: params });
    }
  }
}
