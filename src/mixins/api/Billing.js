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
    },
    batchSoaBilling(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/billings/batch-soa`, data);
    },
    getBillingItemsOfBilling(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/billings/${id}/billing-items`);
    },
    batchOtherBilling(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/billings/batch-other-billing`, data);
    },
    postPayment(data, id) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/billings/${id}/post-payment`, data);
    },
    cancelPayments(id) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/billings/${id}/cancel-payments`);
    }
  }
}