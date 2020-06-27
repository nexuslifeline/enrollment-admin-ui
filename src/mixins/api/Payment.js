import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPaymentList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments`, { params: params });
    },
    getPayment(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments/${id}`);
    },
    addPayment(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/payments`, data);
    },
    updatePayment(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/payments/${id}`, data);
    },
    deletePayment(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/payments/${id}`);
    }
  }
}