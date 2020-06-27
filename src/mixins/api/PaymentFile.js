import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getPaymentFileList(paymentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments/${paymentId}/files`, { params: params });
    },
    getPaymentFilePreview(paymentId, fileId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/payments/${paymentId}/files/${fileId}/preview`, {
        responseType: 'blob'
      });
    }
  }
}