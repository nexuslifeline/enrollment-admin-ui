import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSchoolYearList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-years`, { params: params });
    },
    getSchoolYear(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-years/${id}`);
    },
    addSchoolYear(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/school-years`, data);
    },
    updateSchoolYear(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/school-years/${id}`, data);
    },
    deleteSchoolYear(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/school-years/${id}`);
    }
  }
}