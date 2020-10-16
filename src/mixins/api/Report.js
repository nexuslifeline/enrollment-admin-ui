import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    previewCollectionReport(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/collection-report`, {
        params: params,
        responseType: 'blob'
      });
    }
  }
}