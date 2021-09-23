import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPersonnelList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels`, { params: params });
    },
    getPersonnel(personnelId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels/${personnelId}`);
    },
    addPersonnel(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels`, data);
    },
    updatePersonnel(data, personnelId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/personnels/${personnelId}`, data)
    },
    deletePersonnel(personnelId){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/${personnelId}`)
    },
    savePhoto(data, personnelId){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/photos`, data)
    },
    deletePhoto(personnelId){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/photos`)
    },
    getSectionsOfPersonnel(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/me/sections`, { params: params });
    },
    getPersonnelEducationList(params, personnelId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/education`, { params: params });
    },
    addPersonnelEducation(data, personnelId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/education`, data);
    },
    updatePersonnelEducation(data, personnelId, educationId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/education/${educationId}`, data)
    },
    deletePersonnelEducation(personnelId, educationId){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/education/${educationId}`)
    },
    getPersonnelEmploymentList(params, personnelId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/employment`, { params: params });
    },
    addPersonnelEmployment(data, personnelId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/employment`, data);
    },
    updatePersonnelEmployment(data, personnelId, educationId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/employment/${educationId}`, data)
    },
    deletePersonnelEmployment(personnelId, educationId){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/employment/${educationId}`)
    },
    addPersonnelUser(data, personnelId){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/user`, data);
    },
    getStudentsOfPersonnel(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/me/students`, { params: params });
    },
    getPersonnelSubjects(params, personnelId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels/${personnelId}/subjects`, { params: params });
    }
  }
}
