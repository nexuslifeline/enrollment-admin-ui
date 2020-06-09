import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getLevelList(params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/levels`, { params: params });
    },
    getCoursesOfLevelList(levelId, params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/levels/${levelId}/courses`, { params: params });
    },
    getSubjectsOfLevelList(levelId, params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/levels/${levelId}/subjects`, { params: params });
    },
    updateSubjectsOfLevel(levelId, data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/levels/${levelId}/subjects`, data);
    },
  }
}