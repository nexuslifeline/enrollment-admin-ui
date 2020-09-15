import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getBankAccountList(params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/bank-accounts`, { params: params });
    },
    getBankAccount(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/bank-accounts/${id}`);
    },
    addBankAccount(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/bank-accounts`, data);
    },
    updateBankAccount(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/bank-accounts/${id}`, data);
    },
    deleteBankAccount(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/bank-accounts/${id}`);
    }
  }
}