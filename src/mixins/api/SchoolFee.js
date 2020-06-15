import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSchoolFeeList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-fees`, { params: params });
    },
    getSchoolFee(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-fees/${id}`);
    },
    addSchoolFee(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/school-fees`, data);
    },
    updateSchoolFee(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/school-fees/${id}`, data);
    },
    deleteSchoolFee(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/school-fees/${id}`);
    }
  }
}