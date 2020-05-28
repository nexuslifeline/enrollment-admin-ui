import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getCourseList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/courses`, { params: params });
    },
    getCourse(id) {
      return this.$http.get(`${apiPrefix}/${apiVersion}/courses/${id}`);
    },
    addCourse(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/courses`, data);
    },
    updateCourse(data, id) {
      return this.$http.put(`${apiPrefix}/${apiVersion}/courses/${id}`, data);
    }
  }
}