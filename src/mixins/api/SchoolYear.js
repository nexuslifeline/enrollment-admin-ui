import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSchoolYearList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-years`, { params: params });
    }
  }
}