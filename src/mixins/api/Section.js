import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSectionList(params){
        return this.$authHttp.get(`${apiPrefix}/${apiVersion}/sections`, { params: params });
    },
    getSection(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/sections/${id}`);
    },
    addSection(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/sections`, data);
    },
    updateSection(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/sections/${id}`, data);
    },
    deleteSection(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/sections/${id}`);
    },
    getSectionScheduledSubjectsWithStatus(params, sectionId){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/sections/${sectionId}/my-scheduled-subjects`, { params: params });
    },
  }
}