import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    previewCollectionReport(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/collection-report`, {
        params: params,
        responseType: 'blob'
      });
    },
    previewStatementOfAccount(billingId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/statement-of-account/${billingId}`, {
        responseType: 'blob'
      });
    },
    previewStudentLedger(studentId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/student-ledger/${studentId}`, {
        params: params,
        responseType: 'blob'
      });
    },
    previewTranscriptRecord(transcriptRecorId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/transcript-record/${transcriptRecorId}`, {
        responseType: 'blob'
      });
    },
    previewEnrolledList(params, schoolYearId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/school-years/${schoolYearId}/enrolled`, {
        params: params,
        responseType: 'blob'
      });
    },
    previewAssessmentForm(academicRecordId) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/assessment-form/${academicRecordId}`, {
        responseType: 'blob'
      });
    }
  }
}
