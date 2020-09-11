import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getUserGroupList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/user-groups`, { params: params });
    },
    getUserGroup(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/user-groups/${id}`);
    },
    addUserGroup(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/user-groups`, data);
    },
    updateUserGroup(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/user-groups/` + id, data)
    },
    deleteUserGroup(id){
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/user-groups/` + id)
    },
    getPermissionsOfUserGroup(userGroupId, params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/user-groups/${userGroupId}/permissions`, { params: params })
    },
    storePermissionsOfUserGroup(userGroupId, data){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/user-groups/${userGroupId}/permissions`, data)
    },
    getSchoolCategoriesOfUserGroup(userGroupId, params){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/user-groups/${userGroupId}/school-categories`, { params: params })
    },
    storeSchoolCategoriesOfUserGroup(userGroupId, data){
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/user-groups/${userGroupId}/school-categories`, data)
    },
  }
}
