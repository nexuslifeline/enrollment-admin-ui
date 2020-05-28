import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSubjectList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/subjects`, { params: params })
    },
    getSubject(id) {

    },
    addSubject(data) {

    },
    updateSubject(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/subjects/` + id, data)
    },
    
  }
}