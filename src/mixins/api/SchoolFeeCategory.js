import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSchoolFeeCategoryList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-fee-categories`, { params: params });
    },
    getSchoolFeeCategory(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-fee-categories/${id}`);
    },
    addSchoolFeeCategory(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/school-fee-categories`, data);
    },
    updateSchoolFeeCategory(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/school-fee-categories/${id}`, data);
    },
    deleteSchoolFeeCategory(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/school-fee-categories/${id}`);
    }
  }
}