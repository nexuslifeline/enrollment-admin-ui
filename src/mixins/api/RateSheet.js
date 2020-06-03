import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getRateSheetList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/rate-sheets`, { params: params });
    },
    getRateSheet(id){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/rate-sheets/${id}`);
    },
    addRateSheet(data){
        return this.$authHttp.post(`${apiPrefix}/${apiVersion}/rate-sheets`, data);
    },
    updateRateSheet(id, data){
        return this.$authHttp.put(`${apiPrefix}/${apiVersion}/rate-sheets/${id}`, data);
    }
  }
}