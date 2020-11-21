import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSubjectsOfTranscriptRecord(transcriptRecordId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records/${transcriptRecordId}/subjects`, { params: params });
    },
  }
}