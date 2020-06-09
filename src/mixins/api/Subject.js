import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSubjectList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/subjects`, { params: params });
    },
    getStudent(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/subjects/${id}`);
    },
    addSubject(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/subjects`, data);
    },
    updateSubject(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/subjects/` + id, data)
    },
    deleteSubject(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/subjects/` + id)
    },
  }
}
