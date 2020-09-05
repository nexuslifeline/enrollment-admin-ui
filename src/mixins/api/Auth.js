import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    login(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/personnel/login`, data);
    },
    getAuthenticatedUser(){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/me`);
    },
    revokeAuthentication() {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/logout`);
    }
  }
}