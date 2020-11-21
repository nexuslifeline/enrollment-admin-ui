import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getTranscriptRecordList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records`, { params: params });
    },
    getTranscriptRecord(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records/${id}`);
    },
  }
}