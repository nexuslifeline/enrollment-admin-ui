import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getFees(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-fees`, { params: params });
    }
  }
}