import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getCourseList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/courses`, { params: params });
    },
    getCourse(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/courses/${id}`);
    },
    addCourse(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/courses`, data);
    },
    updateCourse(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/courses/${id}`, data);
    },
    deleteCourse(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/courses/${id}`);
    }
  }
}