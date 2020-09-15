import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPeraPadalaAccountList(params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/pera-padala-accounts`, { params: params });
    },
    getPeraPadalaAccount(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/pera-padala-accounts/${id}`);
    },
    addPeraPadalaAccount(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/pera-padala-accounts`, data);
    },
    updatePeraPadalaAccount(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/pera-padala-accounts/${id}`, data);
    },
    deletePeraPadalaAccount(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/pera-padala-accounts/${id}`);
    }
  }
}