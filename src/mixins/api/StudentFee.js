import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    updateStudentFee(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/student-fees/` + id, data)
    },
  }
}
