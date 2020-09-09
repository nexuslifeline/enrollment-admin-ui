import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPersonnelList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels`, { params: params });
    },
    getPersonnel(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/personnels/${id}`);
    },
    addPersonnel(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels`, data);
    },
    updatePersonnel(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/personnels/` + id, data)
    },
    deletePersonnel(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/` + id)
    },
    savePhoto(data, id){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/personnels/${id}/photos`, data)
    },
    deletePhoto(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/personnels/${id}/photos`)
    }
  }
}
