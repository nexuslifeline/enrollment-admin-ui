import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getEWalletAccountList(params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/e-wallet-accounts`, { params: params });
    },
    getEWalletAccount(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/e-wallet-accounts/${id}`);
    },
    addEWalletAccount(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/e-wallet-accounts`, data);
    },
    updateEWalletAccount(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/e-wallet-accounts/${id}`, data);
    },
    deleteEWalletAccount(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/e-wallet-accounts/${id}`);
    }
  }
}