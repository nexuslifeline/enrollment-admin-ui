import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getGradeSymbolList(params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/grade-symbols`, { params: params });
    },
    getGradeSymbol(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/grade-symbols/${id}`);
    },
    addGradeSymbol(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/grade-symbols`, data);
    },
    updateGradeSymbol(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/grade-symbols/${id}`, data);
    },
    deleteGradeSymbol(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/grade-symbols/${id}`);
    }
  }
}