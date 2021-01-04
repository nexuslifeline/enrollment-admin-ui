import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getDocumentTypeList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/document-types`, { params: params });
    },
    getDocumentType(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/document-types/${id}`);
    },
    addDocumentType(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/document-types`, data);
    },
    updateDocumentType(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/document-types/${id}`, data);
    },
    deleteDocumentType(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/document-types/${id}`);
    }
  }
}