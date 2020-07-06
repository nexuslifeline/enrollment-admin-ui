import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getCurriculumList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/curriculums`, { params: params });
    },
    getCurriculum(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/curriculums/${id}`);
    },
    addCurriculum(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/curriculums`, data);
    },
    updateCurriculum(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/curriculums/${id}`, data);
    },
    deleteCurriculum(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/curriculums/${id}`);
    }
  }
}