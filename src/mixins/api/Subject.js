import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSubjectList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/subjects`, { params: params });
    },
    updateSubjectsOfLevel(levelId, data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/levels/${levelId}/subjects`, data);
    },
  }
}