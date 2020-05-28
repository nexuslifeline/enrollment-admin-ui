import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSemesterList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/semesters`, { params: params });
    },
    getSemester(id) {
      return this.$http.get(`${apiPrefix}/${apiVersion}/semesters/${id}`);
    },
    addSemester(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/semesters`, data);
    },
    updateSemester(data, id) {
      return this.$http.put(`${apiPrefix}/${apiVersion}/semesters/${id}`, data);
    }
  }
}