import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getCourseList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/course`, { params: params });
    },
    getCourse(id) {
      return this.$http.get(`${apiPrefix}/${apiVersion}/course/${id}`);
    },
    addCourse(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/course`, data);
    },
    updateCourse(data, id) {
      return this.$http.put(`${apiPrefix}/${apiVersion}/course/${id}`, data);
    },
    getCoursesOfSchoolCategory(id, params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-categories/${id}` + `/courses`, { params: params });
    }
  }
}