import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getTranscriptList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcripts`, { params: params });
    },
    getSubjectsOfTranscript(transcriptId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcripts/${transcriptId}/subjects`, { params: params });
    },
    getStudentFeeOfTranscript(transcriptId){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcripts/${transcriptId}/student-fees`);
    },
    updateTranscript(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/transcripts/` + id, data)
    },
  }
}