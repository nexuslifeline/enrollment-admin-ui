import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    registerStudent(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/register`, data);
    },
    getStudentList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students`, { params: params })
    },
    getStudent(id) {

    },
    addStudent(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/students`, data)
    },
    updateStudent(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/students/` + id, data)
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
    getTranscriptsOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/transcripts`, { params: params });
    },
    getStudentFeesOfStudent(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/students/${studentId}/student-fees`, { params: params });
    },
  }
}
