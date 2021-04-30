import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getGradingPeriodList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/grading-periods`, { params: params });
    },
    getGradingPeriod(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/grading-periods/${id}`);
    },
    addGradingPeriod(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/grading-periods`, data);
    },
    updateGradingPeriod(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/grading-periods/${id}`, data);
    },
    deleteGradingPeriod(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/grading-periods/${id}`);
    },
    addOrUpdateMultipleGradingPeriod(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/grading-periods/update-multiple`, data);
    },
  }
}
