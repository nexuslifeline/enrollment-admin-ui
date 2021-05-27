import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getTranscriptRecordList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records`, { params });
    },
    getTranscriptRecord(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records/${id}`);
    },
    updateTranscriptRecord(id, data) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/transcript-records/${id}`, data)
    },
    patchTranscriptRecord(id, data) {
      return this.$authHttp.patch(`${apiPrefix}/${apiVersion}/transcript-records/${id}`, data)
    },
    getSubjectsOfTranscriptRecord(transcriptRecordId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records/${transcriptRecordId}/subjects`, { params });
    },
    getTranscriptRecordLevels(id, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-records/${id}/levels`, { params });
    },
    activeFirstOrCreateTranscriptRecord(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/transcript-records/create-active`, data);
    },
  }
}
