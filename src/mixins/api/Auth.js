import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    login(data) {
      return this.$http.post(`${apiPrefix}/${apiVersion}/personnel/login`, data);
    }
  }
}