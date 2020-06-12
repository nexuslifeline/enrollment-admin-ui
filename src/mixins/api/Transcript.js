import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getSubjectsOfTranscript(transcriptId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcripts/${transcriptId}/subjects`, { params: params });
    },
  }
}