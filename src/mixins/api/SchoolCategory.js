import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSchoolCategoryList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-categories`, { params: params });
    },
    getSchoolCategory(id) {
      return this.$http.get(`${apiPrefix}/${apiVersion}/school-categories/${id}`);
    },
    addSchoolCategory(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/school-categories`, data);
    },
    updateSchoolCategory(data, id) {
      return this.$http.put(`${apiPrefix}/${apiVersion}/school-categories/${id}`, data);
    },
    getLevelsOfSchoolCategoryList(schoolCategoryId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-categories/${schoolCategoryId}/levels`, { params: params })
    },
    getCoursesOfSchoolCategoryList(schoolCategoryId, params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-categories/${schoolCategoryId}/courses`, { params: params });
    },
  }
}