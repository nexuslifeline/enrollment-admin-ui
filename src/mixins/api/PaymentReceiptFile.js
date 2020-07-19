import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPaymentReceiptFiles(paymentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments/${paymentId}/payment-receipt-files`, { params: params })
    },
    addPaymentReceiptFile(data, paymentId) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/payments/${paymentId}/payment-receipt-files`, data)
    },
    updatePaymentReceiptFile(data, paymentId, fileId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/payments/${paymentId}/payment-receipt-files/${fileId}`, data)
    },
    deletePaymentReceiptFile(paymentId, fileId) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/payments/${paymentId}/payment-receipt-files/${fileId}`)
    },
    getPaymentReceiptFilePreview(paymentId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments/${paymentId}/payment-receipt-files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}