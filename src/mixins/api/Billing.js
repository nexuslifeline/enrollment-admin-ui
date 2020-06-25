import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getBillingList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/billings`, { params: params });
    },
    getBilling(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/billings/${id}`);
    },
    addBilling(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/billings`, data);
    },
    updateBilling(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/billings/${id}`, data);
    },
    deleteBilling(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/billings/${id}`);
    }
  }
}